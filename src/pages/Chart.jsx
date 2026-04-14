import { useState, useEffect, useRef, useCallback } from "react"
import { useApp } from "../context/AppContext"
import BottomNav from "../components/BottomNav"
import NotificationBell from "../components/NotificationBell"

const ZOOM_STEPS = [80,60,44,30,20,12]
const TF_VOL = { "1m":.004,"5m":.006,"10m":.008,"15m":.011,"1h":.014,"1D":.019 }
const BASE_PRICE = 2845.60

function genCandles(n, base, vol) {
  let p = base
  return Array.from({length:n}, () => {
    const o=p, mv=(Math.random()-.47)*vol*o, c=o+mv, wk=Math.random()*vol*.5*o
    p=c
    return {o, h:Math.max(o,c)+wk, l:Math.min(o,c)-wk*.6, c}
  })
}

function calcEMA(data, p) {
  const k=2/(p+1); let e=data[0].c
  return data.map(d => { e=d.c*k+e*(1-k); return e })
}

function calcRSI(data, p=14) {
  let g=0,l=0
  for(let i=1;i<=p;i++){const d=data[i].c-data[i-1].c; d>0?g+=d:l-=d}
  let ag=g/p,al=l/p
  for(let i=p+1;i<data.length;i++){const d=data[i].c-data[i-1].c;ag=(ag*(p-1)+Math.max(d,0))/p;al=(al*(p-1)+Math.max(-d,0))/p}
  return al===0?100:100-100/(1+ag/al)
}

function calcVWAP(data) {
  let ct=0,cv=0
  return data.map(c=>{const v=Math.abs(c.c-c.o)*500+800;ct+=((c.h+c.l+c.c)/3)*v;cv+=v;return ct/cv})
}

const INDS = [
  {id:"rsi",  name:"RSI",   calc:d=>{const v=calcRSI(d);    return{v,sig:v>60?"BUY":v<40?"SELL":"NTRL"}}, fmt:v=>v.toFixed(0)},
  {id:"ema9", name:"EMA9",  calc:d=>{const v=calcEMA(d,9)[d.length-1],l=d[d.length-1].c; return{v,sig:l>v?"BUY":l<v?"SELL":"NTRL"}}, fmt:v=>v.toFixed(0)},
  {id:"ema20",name:"EMA20", calc:d=>{const v=calcEMA(d,20)[d.length-1],l=d[d.length-1].c;return{v,sig:l>v?"BUY":l<v?"SELL":"NTRL"}}, fmt:v=>v.toFixed(0)},
  {id:"vwap", name:"VWAP",  calc:d=>{const v=calcVWAP(d)[d.length-1],l=d[d.length-1].c; return{v,sig:l>v?"BUY":l<v?"SELL":"NTRL"}}, fmt:v=>v.toFixed(0)},
  {id:"bull", name:"BULL",  calc:d=>{const e9=calcEMA(d,9)[d.length-1],e20=calcEMA(d,20)[d.length-1];const v=e9>e20?75:35;return{v,sig:e9>e20?"BUY":"SELL"}},fmt:v=>v+"%"},
  {id:"bear", name:"BEAR",  calc:d=>{const e9=calcEMA(d,9)[d.length-1],e20=calcEMA(d,20)[d.length-1];const v=e9<e20?70:30;return{v,sig:e9<e20?"SELL":"BUY"}},fmt:v=>v+"%"},
  {id:"sig",  name:"SIGNAL",calc:d=>{const r=calcRSI(d),e9=calcEMA(d,9)[d.length-1],e20=calcEMA(d,20)[d.length-1];const v=r;return{v,sig:r>55&&e9>e20?"BUY":r<45&&e9<e20?"SELL":"NTRL"}},fmt:v=>v.toFixed(0)},
  {id:"str",  name:"STRENGTH",calc:d=>{const r=calcRSI(d);return{v:r,sig:r>60?"BUY":r<40?"SELL":"NTRL"}},fmt:v=>v.toFixed(0)+"%"},
]

function IndBox({name,value,sig}) {
  const s = sig==="BUY"?{bg:"#0d2b18",bc:"#1e5c30",nc:"#6effa0",sb:"#1a5c30",sc:"#2ecc71"}
           :sig==="SELL"?{bg:"#2b0d0d",bc:"#5c1e1e",nc:"#ff8877",sb:"#5c1a1a",sc:"#e74c3c"}
           :{bg:"#2b1e06",bc:"#5c3e10",nc:"#ffc060",sb:"#5c3a0a",sc:"#f39c12"}
  return (
    <div style={{ background:s.bg, border:"1px solid "+s.bc, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"3px 2px", height:44, gap:1 }}>
      <div style={{ fontSize:7.5, fontWeight:900, letterSpacing:.8, opacity:.75, color:s.nc }}>{name}</div>
      <div style={{ fontSize:10, fontWeight:900, color:"#fff", fontFamily:"monospace" }}>{value}</div>
      <div style={{ fontSize:7, fontWeight:900, letterSpacing:.8, padding:"1px 4px", background:s.sb, color:s.sc }}>{sig}</div>
    </div>
  )
}

export default function Chart() {
  const [candles,   setCandles]   = useState(() => genCandles(90, BASE_PRICE, 0.008))
  const [zoomLevel, setZoomLevel] = useState(1)
  const [activeTF,  setActiveTF]  = useState("10m")
  const [indVals,   setIndVals]   = useState([])
  const [svgSize,   setSvgSize]   = useState({w:375,h:220})
  const wrapRef = useRef(null)

  const updateInds = useCallback((data) => {
    setIndVals(INDS.map(ind => {
      try {
        const {v,sig} = ind.calc(data)
        return { id:ind.id, name:ind.name, value: typeof v==="string"?v:ind.fmt(v), sig }
      } catch { return {id:ind.id, name:ind.name, value:"—", sig:"NTRL"} }
    }))
  }, [])

  useEffect(() => {
    updateInds(candles)
    const obs = new ResizeObserver(e => {
      const {width,height} = e[0].contentRect
      if(width>0&&height>0) setSvgSize({w:Math.floor(width),h:Math.floor(height)})
    })
    if(wrapRef.current) { obs.observe(wrapRef.current); const r=wrapRef.current.getBoundingClientRect(); if(r.width>0)setSvgSize({w:Math.floor(r.width),h:Math.floor(r.height)}) }
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setCandles(prev => {
        const last=prev[prev.length-1],o=last.c,mv=(Math.random()-.47)*.004*o,c=o+mv,wk=Math.random()*.002*o
        const next={o,h:Math.max(o,c)+wk,l:Math.min(o,c)-wk*.6,c}
        const upd=[...prev.slice(prev.length>130?1:0),next]
        updateInds(upd)
        return upd
      })
    }, 3000)
    return () => clearInterval(t)
  }, [updateInds])

  function changeTF(tf) {
    setActiveTF(tf); const nc=genCandles(90,BASE_PRICE,TF_VOL[tf]||.008)
    setCandles(nc); setZoomLevel(1); updateInds(nc)
  }

  const lastC=candles[candles.length-1]?.c||0, prevC=candles[candles.length-2]?.c||lastC
  const pct=((lastC-prevC)/prevC*100).toFixed(2), isUp=lastC>=prevC
  const priceCol = isUp?"#2ecc71":"#e74c3c"
  const vn=ZOOM_STEPS[Math.min(zoomLevel-1,ZOOM_STEPS.length-1)]
  const si=Math.max(0,candles.length-vn), vis=candles.slice(si)
  const e9=calcEMA(candles,9).slice(si), e20=calcEMA(candles,20).slice(si)
  const fusion=e9.map((v,i)=>v*.6+e20[i]*.4), vwap=calcVWAP(candles).slice(si)

  const {w,h}=svgSize, PAD={t:8,r:56,b:16,l:4}
  const cW=w-PAD.l-PAD.r, cH=h-PAD.t-PAD.b
  const allV=vis.flatMap(c=>[c.h,c.l])
  const minV=Math.min(...allV)*.9993, maxV=Math.max(...allV)*1.0007, rng=maxV-minV
  const sy=v=>PAD.t+cH-((v-minV)/rng)*cH
  const sx=i=>PAD.l+(i+.5)*(cW/vis.length)
  const cw=Math.max(2,cW/vis.length-1.3)
  const pp=arr=>arr.map((v,i)=>`${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join(" ")
  const pv=(2890+2780+2845)/3, r1=2*pv-2780, s1=2*pv-2890, buf=35

  return (
    <div style={{ background:"#0b0e1a", color:"#dde6f8", height:"100vh", display:"flex", flexDirection:"column", fontFamily:"'Courier New',monospace", overflow:"hidden", maxWidth:480, margin:"0 auto" }}>

      {/* Header */}
      <div style={{ background:"#0d1121", borderBottom:"1px solid #1a2340", padding:"5px 10px 4px", flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ color:"#f0bc2e", fontSize:14, fontWeight:900, letterSpacing:2 }}>RELIANCE</span>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div>
              <div style={{ fontSize:17, fontWeight:900, color:priceCol, textAlign:"right" }}>{lastC.toFixed(2)}</div>
              <div style={{ fontSize:9, color:priceCol, textAlign:"right" }}>{isUp?"▲ +":"▼ "}{pct}%</div>
            </div>
            <NotificationBell color="#f0bc2e" />
          </div>
        </div>
        <div style={{ display:"flex", gap:10, marginTop:2, fontSize:7.5 }}>
          <div style={{ display:"flex", alignItems:"center", gap:3 }}>
            <div style={{ width:14, height:2, background:"#c8901e" }} />
            <span style={{ color:"#c8901e" }}>EMA Fusion</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:3 }}>
            <div style={{ width:14, borderTop:"2px dashed #b0c8ff", height:0 }} />
            <span style={{ color:"#b0c8ff" }}>VWAP</span>
          </div>
        </div>
      </div>

      {/* Timeframes */}
      <div style={{ display:"flex", gap:3, padding:"4px 8px", background:"#0b0e1a", borderBottom:"1px solid #1a2340", flexShrink:0 }}>
        {Object.keys(TF_VOL).map(tf => (
          <button key={tf} onClick={() => changeTF(tf)} style={{
            background: activeTF===tf?"#f0bc2e":"#111827",
            color: activeTF===tf?"#0b0e1a":"#4a5a78",
            border:`1px solid ${activeTF===tf?"#f0bc2e":"#1a2340"}`,
            padding:"2px 8px", fontSize:9, fontFamily:"'Courier New',monospace",
            fontWeight:700, cursor:"pointer",
          }}>{tf}</button>
        ))}
      </div>

      {/* Chart */}
      <div ref={wrapRef} style={{ flex:1, background:"#0b0e1a", overflow:"hidden", minHeight:0 }}>
        <svg viewBox={`0 0 ${w} ${h}`} style={{ width:"100%", height:"100%" }}>
          {[0,1,2,3,4].map(i=>{const v=minV+(rng*i)/4;return(<g key={i}>
            <line x1={PAD.l} y1={sy(v)} x2={PAD.l+cW} y2={sy(v)} stroke="#1a2840" strokeWidth=".5" strokeDasharray="4,5" opacity=".7"/>
            <text x={PAD.l+cW+3} y={sy(v)+3} fill="#3a4a68" fontSize="6.5" fontFamily="monospace">{v.toFixed(0)}</text>
          </g>)})}
          {[[r1+buf,r1-buf,"rgba(192,57,43,.2)","#e74c3c",`R1 ${r1.toFixed(0)}`,  "#ff8877"],
            [s1+buf,s1-buf,"rgba(39,174,96,.18)","#27ae60",`S1 ${s1.toFixed(0)}`, "#6effa0"]].map(([top,bot,fill,bdr,lbl,lcol],idx)=>{
            const zt=Math.min(top,maxV),zb=Math.max(bot,minV); if(zt<minV||zb>maxV)return null
            const y1=sy(zt),hh=Math.max(3,sy(zb)-y1)
            return(<g key={idx}><rect x={PAD.l} y={y1} width={cW} height={hh} fill={fill}/><rect x={PAD.l} y={y1} width={2} height={hh} fill={bdr}/><text x={PAD.l+cW+4} y={y1+hh/2+3} fill={lcol} fontSize="6" fontFamily="monospace" fontWeight="bold">{lbl}</text></g>)
          })}
          <polyline points={pp(vwap)} fill="none" stroke="#b0c8ff" strokeWidth="1" strokeDasharray="3,3" opacity=".7"/>
          <polyline points={pp(fusion)} fill="none" stroke="#c8901e" strokeWidth="2.2" strokeLinejoin="round" opacity=".97"/>
          {vis.map((c,i)=>{const up=c.c>=c.o,col=up?"#27ae60":"#c0392b",colB=up?"#2ecc71":"#e74c3c",bt=sy(Math.max(c.o,c.c)),bh=Math.max(1,Math.abs(sy(c.o)-sy(c.c))),x=sx(i)
            return(<g key={i}><line x1={x} y1={sy(c.h)} x2={x} y2={sy(c.l)} stroke={col} strokeWidth=".75"/><rect x={x-cw/2} y={bt} width={cw} height={bh} fill={colB}/></g>)})}
          <line x1={PAD.l} y1={sy(lastC)} x2={PAD.l+cW} y2={sy(lastC)} stroke="#f0bc2e" strokeWidth=".55" strokeDasharray="4,3" opacity=".65"/>
          <rect x={PAD.l+cW} y={sy(lastC)-6} width={55} height={12} fill="#f0bc2e"/>
          <text x={PAD.l+cW+28} y={sy(lastC)+3} fill="#0b0e1a" fontSize="7" fontFamily="monospace" fontWeight="900" textAnchor="middle">{lastC.toFixed(2)}</text>
        </svg>
      </div>

      {/* Zoom */}
      <div style={{ display:"flex", alignItems:"center", gap:6, background:"#0d1121", borderTop:"1px solid #1a2340", padding:"3px 10px", flexShrink:0 }}>
        <span style={{ color:"#4a5a78", fontSize:8, flex:1 }}>ZOOM {zoomLevel}× — {vis.length} candles</span>
        <button onClick={() => setZoomLevel(z=>Math.max(1,Math.min(ZOOM_STEPS.length,z-1)))} style={{ width:24,height:24,border:"1px solid #4a1e1e",background:"#111827",fontSize:15,fontWeight:900,cursor:"pointer",color:"#e74c3c",display:"flex",alignItems:"center",justifyContent:"center" }}>−</button>
        <button onClick={() => setZoomLevel(z=>Math.max(1,Math.min(ZOOM_STEPS.length,z+1)))} style={{ width:24,height:24,border:"1px solid #1e4a30",background:"#111827",fontSize:15,fontWeight:900,cursor:"pointer",color:"#2ecc71",display:"flex",alignItems:"center",justifyContent:"center" }}>+</button>
      </div>

      {/* Indicators */}
      <div style={{ background:"#0d1121", borderTop:"1px solid #1a2340", padding:"4px 5px 5px", flexShrink:0 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:3 }}>
          {indVals.map(ind => <IndBox key={ind.id} name={ind.name} value={ind.value} sig={ind.sig} />)}
        </div>
      </div>

      <BottomNav accent="#f0bc2e" />
    </div>
  )
}
