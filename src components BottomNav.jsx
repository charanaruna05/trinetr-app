import { useApp } from "../context/AppContext"

const TABS = [
  { id:"home",      emoji:"🏠", label:"HOME"   },
  { id:"signal",    emoji:"📡", label:"SIGNAL" },
  { id:"chart",     emoji:"📈", label:"CHART"  },
  { id:"watchlist", emoji:"⭐", label:"LIST"   },
  { id:"admin",     emoji:"⚙️", label:"ADMIN"  },
]

export default function BottomNav({ accent = "#ff9800" }) {
  const { currentPage, navigate } = useApp()
  return (
    <nav style={{
      position:"fixed", bottom:0, left:0, width:"100%", height:65,
      background:"#000", borderTop:"2px solid "+accent,
      display:"grid", gridTemplateColumns:"repeat(5,1fr)", zIndex:1000,
    }}>
      {TABS.map(t => (
        <div key={t.id} onClick={() => navigate(t.id)} style={{
          display:"flex", flexDirection:"column", alignItems:"center",
          justifyContent:"center", cursor:"pointer", userSelect:"none",
          color: currentPage===t.id ? accent : "#555",
          fontSize:9, fontWeight:700, transition:"color 0.2s",
        }}>
          <span style={{ fontSize:20, marginBottom:3 }}>{t.emoji}</span>
          {t.label}
        </div>
      ))}
    </nav>
  )
}
