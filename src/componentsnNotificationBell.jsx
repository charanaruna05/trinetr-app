import { useState } from "react"
import { useApp } from "../context/AppContext"

const TYPE_STYLE = {
  BUY:   { emoji:"🟢", color:"#00c853" },
  SELL:  { emoji:"🔴", color:"#ff3d00" },
  ALERT: { emoji:"⚠️", color:"#ff9800" },
  INFO:  { emoji:"ℹ️", color:"#2196f3" },
}

export default function NotificationBell({ color="#ff9800" }) {
  const { unreadCount, notifications, markAllRead, clearNotifications } = useApp()
  const [open, setOpen] = useState(false)

  function toggle() {
    setOpen(o => !o)
    if (!open) markAllRead()
  }

  return (
    <>
      <div onClick={toggle} style={{ position:"relative", cursor:"pointer", padding:"4px 8px" }}>
        <span style={{ fontSize:22 }}>🔔</span>
        {unreadCount > 0 && (
          <span style={{
            position:"absolute", top:0, right:0,
            background:"#ff3d00", color:"#fff", fontSize:8, fontWeight:900,
            width:16, height:16, borderRadius:"50%",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{
            position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:3000,
          }} />
          <div style={{
            position:"fixed", top:0, right:0, width:"85%", maxWidth:340, height:"100vh",
            background:"#0c0c0c", borderLeft:"2px solid "+color, zIndex:3001,
            display:"flex", flexDirection:"column",
            animation:"slideIn 0.25s ease",
          }}>
            <style>{"@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}"}</style>
            <div style={{
              padding:"15px 12px", borderBottom:"1px solid "+color,
              display:"flex", justifyContent:"space-between", alignItems:"center",
            }}>
              <span style={{ color, fontWeight:900, fontSize:14 }}>🔔 NOTIFICATIONS</span>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={clearNotifications} style={{
                  background:"#1f1f1f", color:"#888", border:"none",
                  padding:"4px 8px", fontSize:10, cursor:"pointer",
                }}>CLEAR</button>
                <button onClick={() => setOpen(false)} style={{
                  background:color, color:"#000", border:"none",
                  padding:"4px 10px", fontSize:10, fontWeight:900, cursor:"pointer",
                }}>✕</button>
              </div>
            </div>
            <div style={{ flex:1, overflowY:"auto" }}>
              {notifications.length === 0
                ? <div style={{ textAlign:"center", color:"#555", marginTop:60, fontSize:13 }}>कोई notification नहीं</div>
                : notifications.map(n => {
                    const s = TYPE_STYLE[n.type] || TYPE_STYLE.INFO
                    return (
                      <div key={n.id} style={{
                        padding:"10px 12px", borderBottom:"1px solid #1a1a1a",
                        display:"flex", gap:10,
                      }}>
                        <span style={{ fontSize:18 }}>{s.emoji}</span>
                        <div>
                          <div style={{ fontSize:12, fontWeight:700, color:s.color }}>{n.title}</div>
                          <div style={{ fontSize:10, color:"#888", marginTop:2 }}>{n.message}</div>
                          <div style={{ fontSize:9, color:"#444", marginTop:2 }}>{n.time}</div>
                        </div>
                      </div>
                    )
                  })
              }
            </div>
          </div>
        </>
      )}
    </>
  )
}
