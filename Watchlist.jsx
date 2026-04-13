import { useState, useEffect } from "react"
import { useApp } from "../context/AppContext"
import { fetchWatchlist } from "../services/apiService"
import BottomNav from "../components/BottomNav"
import NotificationBell from "../components/NotificationBell"

export default function Watchlist() {
  const { navigate } = useApp()
  const [stocks, setStocks] = useState([])
  const [popup,  setPopup]  = useState({ open:false, title:"", content:null })

  useEffect(() => {
    fetchWatchlist().then(setStocks)
  }, [])

  function openStock(s) {
    setPopup({ open:true, title: s.name, content: (
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
        {[{l:"Entry",v:s.entry,c:"#fff"},{l:"Target 1",v:s.target1,c:"#00FF00"},{l:"Target 2",v:s.target2,c:"#00FF00"},{l:"SL",v:s.sl,c:"#FF3131"},{l:"TSL",v:String(Number(s.sl)+15),c:"#fff"},{l:"Exit",v:"---",c:"#fff"}].map(item => (
          <div key={item.l} style={{ background:"#1a1a1a", padding:8, border:"1px solid #FFD700", textAlign:"center", fontSize:11 }}>
            {item.l}<span style={{ display:"block", fontWeight:"bold", fontSize:14, marginTop:4, color:item.c }}>{item.v}</span>
          </div>
        ))}
      </div>
    )})
  }

  function openSector(sec) {
    setPopup({ open:true, title: sec+" Info", content: (
      <div style={{ color:"#ccc", lineHeight:2 }}>
        <p>🟢 BUY Stocks: 5</p><p>🔴 SELL Stocks: 2</p><p>Sector Trend: Bullish</p>
      </div>
    )})
  }

  function openScanner(scan) {
    setPopup({ open:true, title: scan+" Logic", content: (
      <div style={{ color:"#ccc", lineHeight:2 }}>
        <p>• Logic: {scan} Parameter Trigger</p>
        <p>• EMA/RSI Crossover Observed</p>
      </div>
    )})
  }

  const scanMap = { Brahmastra:"BMS", Trishul:"TS", Sudarshan:"SS", "All-in-One":"AiO", Index:"IND", Scalp:"SCP" }

  return (
    <div style={{ background:"#000", color:"#fff", height:"100vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ background:"#111", color:"#FFD700", textAlign:"center", padding:"12px 0", fontSize:16, fontWeight:800, letterSpacing:1.5, borderBottom:"1px solid #FFD700", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"space-between", paddingLeft:12, paddingRight:12 }}>
        🔱 TRINETR WATCHLIST
        <NotificationBell color="#FFD700" />
      </div>
      <div style={{ flex:1, overflowY:"auto", paddingBottom:65 }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11, tableLayout:"fixed" }}>
          <thead>
            <tr>
              {["SR","STOCK","PRICE","SEC","SCAN","SIG","SCR"].map(h => (
                <th key={h} style={{ background:"#1a1a1a", color:"#FFD700", padding:"10px 2px", border:"1px solid #1f1f1f", position:"sticky", top:0, zIndex:5, fontWeight:800, textAlign:"center" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stocks.map(s => (
              <tr key={s.id}>
                <td style={td}>{s.id}</td>
                <td style={{...td, color:"#FFD700", fontWeight:"bold", cursor:"pointer"}} onClick={() => openStock(s)}>{s.name}</td>
                <td style={td}>{s.price}</td>
                <td style={{...td, cursor:"pointer"}} onClick={() => openSector(s.sector)}>{s.sector}</td>
                <td style={{...td, cursor:"pointer"}} onClick={() => openScanner(s.scanner)}>{scanMap[s.scanner]||s.scanner}</td>
                <td style={{...td, color: s.isBuy?"#00FF00":"#FF3131", fontWeight:"bold"}}>{s.isBuy?"BUY":"SELL"}</td>
                <td style={td}>{s.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup */}
      <div style={{
        position:"fixed", top: popup.open ? 0 : "-55%", left:0, width:"100%", height:"45%",
        background:"#0d0d0d", borderBottom:"3.5px solid #FFD700",
        transition:"top 0.4s ease", zIndex:2000, padding:15, overflow:"hidden",
      }}>
        <span onClick={() => setPopup(p=>({...p,open:false}))} style={{ float:"right", color:"#FF3131", fontWeight:"bold", cursor:"pointer", padding:5 }}>बंद करें ✖</span>
        <h3 style={{ color:"#FFD700", fontSize:18, marginTop:0 }}>{popup.title}</h3>
        <div style={{ marginTop:10 }}>{popup.content}</div>
      </div>

      <BottomNav accent="#FFD700" />
    </div>
  )
}

const td = { padding:"12px 2px", border:"1px solid #1f1f1f", textAlign:"center", color:"#fff" }
