import { useState } from "react"
import { useApp } from "../context/AppContext"
import BottomNav from "../components/BottomNav"
import NotificationBell from "../components/NotificationBell"

const SCANNER_GROUPS = {
  "STOCK SECURE":   { icon:"fa-shield-alt",   label:"⚡ METER"   },
  "INDEX METER":    { icon:"fa-chart-line",    label:"📈 METER"   },
  "BRAHMASTRA":     { icon:"fa-bolt",          label:"🔱 SCANNER" },
  "SUDARSHAN":      { icon:"fa-dharmachakra",  label:"🦚 SCANNER" },
  "TRISHUL":        { icon:"fa-eye",           label:"🗡️ SCANNER" },
  "ALL-IN-ONE":     { icon:"fa-truck-monster", label:"🚐 SCANNER" },
  "INDEX SCAN":     { icon:"fa-chart-bar",     label:"📊 SCANNER" },
  "SCALE STRATEGY": { icon:"fa-ruler-combined",label:"📏 PREMIUM" },
}

export default function Signal() {
  const { signals } = useApp()
  const [selected, setSelected] = useState(null)

  const groupedSignals = {}
  signals.forEach(s => {
    const grp = s.scanner || "ALL-IN-ONE"
    if (!groupedSignals[grp]) groupedSignals[grp] = []
    groupedSignals[grp].push(s)
  })

  const detailData  = selected ? (groupedSignals[selected] || []) : []
  const buyCount    = detailData.filter(s => s.trend === "up").length
  const sellCount   = detailData.filter(s => s.trend === "down").length

  return (
    <div style={{ background:"#000", color:"#fff", height:"100vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <header style={{ padding:"12px 15px", textAlign:"center", borderBottom:"1px solid #1f1f1f", background:"#000", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <span style={{ fontSize:16, color:"#ff9800", fontWeight:900, letterSpacing:1.5 }}>🔱 TRISHUL PRO</span>
        <NotificationBell color="#ff9800" />
      </header>

      {!selected ? (
        <div style={{ flex:1, display:"grid", gridTemplateRows:"repeat(3,1fr)", gap:8, padding:10, paddingBottom:75 }}>
          {[0,1,2].map(row => (
            <div key={row} style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
              {Object.entries(SCANNER_GROUPS).slice(row*3, row*3+3).map(([name, cfg]) => (
                <div key={name} onClick={() => setSelected(name)} style={{
                  background:"#0c0c0c", border:"1px solid #1f1f1f",
                  display:"flex", flexDirection:"column", justifyContent:"center",
                  alignItems:"center", textAlign:"center", cursor:"pointer", padding:4,
                }}>
                  <i className={"fas " + cfg.icon} style={{ fontSize:22, color:"#ff9800", marginBottom:5 }} />
                  <span style={{ fontSize:7, color:"#ff9800", fontWeight:800, marginBottom:2 }}>{cfg.label}</span>
                  <b style={{ fontSize:11, color:"#fff" }}>{name}</b>
                  <span style={{ fontSize:8, color:"#555", marginTop:2 }}>
                    {(groupedSignals[name]||[]).length} signals
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <>
          <div style={{ background:"#111", margin:10, padding:15, border:"1px solid #ff9800", textAlign:"center", flexShrink:0 }}>
            <h2 style={{ textTransform:"uppercase", color:"#ff9800", fontSize:16 }}>{selected}</h2>
            <div style={{ display:"flex", justifyContent:"space-around", paddingTop:10, borderTop:"1px solid #222", marginTop:8 }}>
              <div><small>🟢 BUY</small><b style={{color:"#00c853",display:"block"}}>{buyCount}</b></div>
              <div style={{ width:1, height:25, background:"#333" }} />
              <div><small>🔴 SELL</small><b style={{color:"#ff3d00",display:"block"}}>{sellCount}</b></div>
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"0 10px 80px" }}>
            {detailData.length === 0 && <div style={{ textAlign:"center", color:"#555", marginTop:40 }}>कोई signal नहीं</div>}
            {detailData.map(item => (
              <div key={item.id} style={{ display:"grid", gridTemplateColumns:"1.2fr 1px 1fr 1px 1.2fr", background:"#0c0c0c", border:"1px solid #1f1f1f", marginBottom:8, height:65, alignItems:"center" }}>
                <div style={{ textAlign:"center", padding:5 }}>
                  <span style={{ fontSize:12, fontWeight:"bold", color:"#fff", display:"block" }}>{item.name}</span>
                  <small style={{ fontSize:7, color:"#ff9800" }}>{item.scanner}</small>
                </div>
                <div style={{ height:40, background:"#1f1f1f" }} />
                <div style={{ textAlign:"center" }}>
                  <span style={{ fontSize:13, fontWeight:800, color: item.trend==="up" ? "#00c853":"#ff3d00" }}>₹{item.price}</span>
                </div>
                <div style={{ height:40, background:"#1f1f1f" }} />
                <div style={{ textAlign:"center", padding:5 }}>
                  <span style={{ fontSize:9, padding:"4px 8px", color:"#fff", fontWeight:900, background: item.trend==="up"?"#00c853":"#ff3d00", display:"inline-block" }}>{item.signal}</span>
                  <div style={{ fontSize:9, marginTop:3, color:"#888" }}>STR: <b>{item.score}%</b></div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setSelected(null)} style={{
            background:"#ff9800", color:"#000", border:"none", padding:18,
            fontWeight:900, position:"fixed", bottom:65, width:"100%", zIndex:100, cursor:"pointer", fontSize:14,
          }}>◀ BACK TO DASHBOARD</button>
        </>
      )}
      <BottomNav accent="#ff9800" />
    </div>
  )
}
