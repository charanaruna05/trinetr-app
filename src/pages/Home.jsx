import { useState } from "react"
import { useApp } from "../context/AppContext"
import BottomNav from "../components/BottomNav"
import NotificationBell from "../components/NotificationBell"

const SECTORS = [
  "REALTY","BANKING","IT","AUTO","FINANCE","CHEMICAL",
  "POWER","INFRA","TELECOM","CEMENT","CONSUMER","FMCG",
  "ENERGY","MEDIA","PSU BANK","PHARMA","OIL&GAS","METAL",
]

const SECTOR_DATA = {
  BANKING:{ buy:8, sell:2, trend:"Bullish", stocks:["HDFC BANK","ICICI","SBI","KOTAK"] },
  IT:     { buy:5, sell:3, trend:"Neutral",  stocks:["TCS","INFY","WIPRO","HCL"] },
  AUTO:   { buy:6, sell:1, trend:"Bullish",  stocks:["MARUTI","TATA MOTORS","BAJAJ AUTO"] },
  PHARMA: { buy:7, sell:2, trend:"Bullish",  stocks:["SUNPHARMA","CIPLA","DR REDDY"] },
}

const ENTRY_CALLS = [
  { symbol:"NIFTY",    ent:"23778", tg1:"24254", tg2:"24967", sl:"23650" },
  { symbol:"RELIANCE", ent:"2377",  tg1:"2425",  tg2:"2496",  sl:"2354"  },
]

export default function Home() {
  const { prices, user, navigate } = useApp()
  const [sheet, setSheet] = useState({ open:false, title:"", content:null })

  function openSector(name) {
    const d = SECTOR_DATA[name] || { buy:5, sell:2, trend:"Neutral", stocks:[] }
    setSheet({
      open:true, title: name + " SECTOR",
      content: (
        <div>
          <div style={{ display:"flex", gap:20, marginBottom:12, fontSize:14 }}>
            <span>🟢 BUY: <b style={{color:"#2ecc71"}}>{d.buy}</b></span>
            <span>🔴 SELL: <b style={{color:"#e74c3c"}}>{d.sell}</b></span>
            <span>📈 Trend: <b style={{color:"#ffff00"}}>{d.trend}</b></span>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {d.stocks.map(s => (
              <span key={s} style={{
                background:"#1a2340", border:"1px solid #ffff0040",
                padding:"3px 8px", fontSize:11, color:"#ffff00",
              }}>{s}</span>
            ))}
          </div>
        </div>
      )
    })
  }

  function openProfile() {
    setSheet({
      open:true, title:"USER PROFILE",
      content: (
        <div style={{ display:"flex", flexDirection:"column", gap:10, fontSize:14 }}>
          <div>👤 <b>ID:</b> {user.id}</div>
          <div>📞 <b>Phone:</b> {user.phone}</div>
          <div>📧 <b>Email:</b> {user.email}</div>
          <div>⭐ <b>Plan:</b> {user.plan}</div>
        </div>
      )
    })
  }

  return (
    <div style={{ background:"#030712", color:"#fff", height:"100vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      {/* News Ticker */}
      <div style={{ height:32, background:"#000", borderBottom:"1.5px solid #ffff00", display:"flex", alignItems:"center", overflow:"hidden", flexShrink:0 }}>
        <div style={{ display:"inline-block", animation:"marquee 28s linear infinite", whiteSpace:"nowrap", fontSize:11, color:"#ffff00", fontWeight:"bold" }}>
          🔱 TRINETR LIVE: NIFTY {prices.nifty?.val} | SENSEX {prices.sensex?.val} | GOLD {prices.gold?.val} | SECTOR ROTATION ACTIVE 🔱
          &nbsp;&nbsp;&nbsp;&nbsp;🔱 TRINETR LIVE: NIFTY {prices.nifty?.val} | SENSEX {prices.sensex?.val} | GOLD {prices.gold?.val} | SECTOR ROTATION ACTIVE 🔱
        </div>
        <style>{"@keyframes marquee{0%{transform:translateX(100vw)}100%{transform:translateX(-100%)}}"}</style>
      </div>

      {/* Header */}
      <header style={{ height:45, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 12px", flexShrink:0 }}>
        <div style={{ border:"1.5px solid #ffff00", padding:"4px 20px", fontSize:15, fontWeight:900, color:"#ffff00", letterSpacing:3 }}>
          🔱 TRINETR 🔱
        </div>
        <NotificationBell color="#ffff00" />
      </header>

      {/* Top Stats */}
      <div style={{ height:65, display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:5, padding:"5px 10px", flexShrink:0 }}>
        {[
          { label:"NIFTY 50",   val: prices.nifty?.val,     up: prices.nifty?.up     },
          { label:"SENSEX",     val: prices.sensex?.val,    up: prices.sensex?.up    },
          { label:"GOLD",       val: prices.gold?.val,      up: prices.gold?.up      },
          { label:"BANK NIFTY", val: prices.bankNifty?.val, up: prices.bankNifty?.up },
        ].map(s => (
          <div key={s.label} onClick={s.label==="PROFILE" ? openProfile : undefined} style={{
            background:"#0c1122", border:"1.2px solid #ffff00",
            display:"flex", flexDirection:"column", justifyContent:"center", textAlign:"center",
          }}>
            <span style={{ fontSize:7, color:"#8a9fd8", fontWeight:"bold" }}>{s.label}</span>
            <span style={{ fontSize:10, fontWeight:"bold", color: s.up ? "#2ecc71" : "#e74c3c" }}>{s.val}</span>
          </div>
        ))}
      </div>

      {/* Entry Desk */}
      <div style={{ height:90, padding:"0 10px", marginTop:5, flexShrink:0 }}>
        <div style={{ background:"#0a0f1c", border:"1.2px solid #ffff00", height:"100%", padding:5, display:"flex", flexDirection:"column", justifyContent:"space-around" }}>
          {ENTRY_CALLS.map(c => (
            <div key={c.symbol} style={{ display:"flex", gap:4, alignItems:"center" }}>
              <div style={{ border:"1px solid #ffff00", color:"#ffff00", fontSize:8, padding:"3px 2px", minWidth:60, textAlign:"center", fontWeight:"bold" }}>{c.symbol}</div>
              {[{l:"ENT",c:c.ent},{l:"TG1",c:c.tg1},{l:"TG2",c:c.tg2},{l:"SL TRL",c:c.sl}].map(chip => (
                <div key={chip.l} style={{ background:"#0f1428", border:"1px solid #ffff0020", flex:1, textAlign:"center", padding:"2px 0" }}>
                  <span style={{ fontSize:6, color:"#8a9fd8", display:"block" }}>{chip.l}</span>
                  <span style={{ fontSize:8, fontWeight:"bold", color:"#ffff00" }}>{chip.c}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Sector Grid */}
      <div style={{ flex:1, padding:"5px 10px 75px 10px", minHeight:0 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gridTemplateRows:"repeat(6,1fr)", gap:4, height:"96%" }}>
          {SECTORS.map(name => (
            <div key={name} onClick={() => openSector(name)} style={{
              border:"1.2px solid #ffff00", display:"flex", flexDirection:"column",
              justifyContent:"center", alignItems:"center", background:"#0c1122", cursor:"pointer",
            }}>
              <span style={{ fontSize:8, fontWeight:900, color:"#fff", textTransform:"uppercase" }}>{name}</span>
              <div style={{ fontSize:8, marginTop:1 }}>
                <span style={{color:"#2ecc71"}}>▲5</span> <span style={{color:"#e74c3c"}}>▼2</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Sheet */}
      <div style={{
        position:"fixed", bottom: sheet.open ? 0 : "-55%", left:0, width:"100%", height:"50%",
        background:"#0f172a", borderTop:"4px solid #ffff00",
        transition:"bottom 0.3s ease", zIndex:2000, padding:20, borderRadius:"20px 20px 0 0",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h3 style={{ color:"#ffff00", fontSize:16 }}>{sheet.title}</h3>
          <button onClick={() => setSheet(s=>({...s,open:false}))} style={{
            background:"#ffff00", border:"none", padding:"5px 15px", fontWeight:"bold", cursor:"pointer",
          }}>CLOSE</button>
        </div>
        <div style={{ marginTop:20, color:"#ccc" }}>{sheet.content}</div>
      </div>
      {sheet.open && <div onClick={() => setSheet(s=>({...s,open:false}))} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1999 }} />}

      <BottomNav accent="#ffff00" />
    </div>
  )
}
