import { useState, useEffect } from "react"
import { useApp } from "../context/AppContext"
import { fetchPnL } from "../services/apiService"
import BottomNav from "../components/BottomNav"
import NotificationBell from "../components/NotificationBell"

const CONTROL_ITEMS = [
  { id:"home",      icon:"🏠", label:"HOME SETTINGS"   },
  { id:"signal",    icon:"📡", label:"SIGNAL DATA"      },
  { id:"watchlist", icon:"📋", label:"WATCHLIST DATA"   },
  { id:"chart",     icon:"📊", label:"CHART LINKS"      },
]

export default function Admin() {
  const { user, navigate } = useApp()
  const [isDark,    setIsDark]    = useState(true)
  const [activeTab, setActiveTab] = useState("1DAY")
  const [pnl,       setPnl]       = useState(null)
  const [editItem,  setEditItem]  = useState(null)
  const [editVal,   setEditVal]   = useState("")
  const [saved,     setSaved]     = useState(false)

  useEffect(() => {
    fetchPnL(activeTab).then(setPnl)
  }, [activeTab])

  function handleSave() {
    if (!editVal.trim()) return
    setSaved(true)
    setTimeout(() => { setSaved(false); setEditItem(null); setEditVal("") }, 1200)
  }

  const bg  = isDark ? "#000" : "#fff"
  const tc  = isDark ? "#fff" : "#000"
  const cBg = isDark ? "#111" : "#f8f9fa"

  return (
    <div style={{ background:bg, color:tc, minHeight:"100vh", fontFamily:"sans-serif", padding:12, paddingBottom:80, transition:"background 0.3s" }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <span style={{ color:"#ffcf00", fontWeight:900, fontSize:15 }}>⚙️ ADMIN PANEL</span>
        <NotificationBell color="#ffcf00" />
      </div>

      {/* Profile Card */}
      <div style={{ background:cBg, border:"1px solid #ffcf00", padding:15, display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          <span style={{ fontWeight:800, color:"#ffcf00", fontSize:"1rem" }}>ID: {user.id}</span>
          <span style={{ fontSize:"0.75rem", opacity:0.8, color:tc }}>📞 {user.phone}</span>
          <span style={{ fontSize:"0.75rem", opacity:0.8, color:tc }}>📧 {user.email}</span>
        </div>
        <button onClick={() => setIsDark(d => !d)} style={{ background:"#ffcf00", color:"#000", border:"none", padding:"8px 12px", cursor:"pointer", fontWeight:800, fontSize:"0.7rem" }}>
          {isDark ? "☀️ LIGHT" : "🌙 DARK"}
        </button>
      </div>

      {/* P&L Card */}
      <div style={{ background:cBg, border:"1px solid #ffcf00", padding:15, marginBottom:12 }}>
        <div style={{ display:"flex", gap:5, marginBottom:12 }}>
          {["1DAY","1WEEK","1MONTH"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex:1, padding:10, fontSize:"0.7rem",
              background: activeTab===tab ? "#ffcf00" : "#222",
              border:"none", color: activeTab===tab ? "#000" : "#ffcf00",
              cursor:"pointer", fontWeight:800,
            }}>{tab.replace("1","1 ")}</button>
          ))}
        </div>
        {pnl && (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:5 }}>
              <span style={{ fontSize:"0.9rem", fontWeight:700, color:tc }}>NET P&L:</span>
              <span style={{ color:"#00ff41", fontWeight:900, fontSize:"1.2rem" }}>{pnl.pnl}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.8rem", opacity:0.8, marginTop:8, color:tc }}>
              <span>Trades: {pnl.trades}</span>
              <span style={{ color:"#00ff41" }}>Accuracy: {pnl.accuracy}</span>
            </div>
          </>
        )}
      </div>

      {/* Control Grid */}
      <div style={{ border:"1px solid #ffcf00" }}>
        {CONTROL_ITEMS.map((item, i) => (
          <div key={item.id} style={{
            background:cBg, padding:15, display:"flex", justifyContent:"space-between", alignItems:"center",
            borderBottom: i < CONTROL_ITEMS.length-1 ? "1px solid #333" : "none",
          }}>
            <div style={{ fontSize:"0.85rem", fontWeight:700, color:tc }}>{item.icon} {item.label}</div>
            <button onClick={() => setEditItem(item.label)} style={{
              background:"#0056b3", color:"#fff", border:"none", cursor:"pointer",
              fontSize:"0.75rem", fontWeight:800, width:100, height:35,
            }}>CHANGE</button>
          </div>
        ))}
      </div>

      <button onClick={() => navigate("home")} style={{ width:"100%", height:50, background:"#8b0000", color:"#fff", border:"none", marginTop:15, fontWeight:900, fontSize:"1rem", cursor:"pointer" }}>
        🚪 LOGOUT (निकास)
      </button>

      {/* Edit Modal */}
      {editItem && (
        <>
          <div onClick={() => setEditItem(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:3000 }} />
          <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:cBg, border:"2px solid #ffcf00", padding:20, width:"90%", maxWidth:400, zIndex:3001 }}>
            <h3 style={{ color:"#ffcf00", marginBottom:15 }}>✏️ {editItem}</h3>
            <textarea value={editVal} onChange={e => setEditVal(e.target.value)} placeholder="नया value डालें..." rows={4}
              style={{ width:"100%", background: isDark?"#000":"#fff", color:tc, border:"1px solid #ffcf00", padding:10, fontSize:14, resize:"none", fontFamily:"sans-serif" }} />
            <div style={{ display:"flex", gap:10, marginTop:12 }}>
              <button onClick={handleSave} style={{ flex:1, padding:12, background: saved?"#00c853":"#ffcf00", color:"#000", border:"none", fontWeight:900, cursor:"pointer", fontSize:14 }}>
                {saved ? "✅ SAVED!" : "SAVE"}
              </button>
              <button onClick={() => setEditItem(null)} style={{ flex:1, padding:12, background:"#8b0000", color:"#fff", border:"none", fontWeight:900, cursor:"pointer", fontSize:14 }}>CANCEL</button>
            </div>
          </div>
        </>
      )}

      <BottomNav accent="#ffcf00" />
    </div>
  )
}
