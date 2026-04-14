// 📁 src/services/apiService.js
// ✅ API Service — Angel One connect होने पर USE_DUMMY = false करो
// USE_DUMMY = true  → Demo data (default)
// USE_DUMMY = false → Real Angel One API

import { NIFTY100, getWatchlistDummy } from "../data/nifty100"

const USE_DUMMY = true  // ← Angel One API key डालने के बाद false करो

// ── ANGEL ONE CONFIG ────────────────────────────────
const ANGEL = {
  API_KEY:   import.meta.env.VITE_ANGEL_API_KEY   || "",
  CLIENT_ID: import.meta.env.VITE_ANGEL_CLIENT_ID || "",
  PASSWORD:  import.meta.env.VITE_ANGEL_PASSWORD  || "",
}
const BASE = "https://apiconnect.angelbroking.com"
let JWT_TOKEN = ""

// ── LOGIN ───────────────────────────────────────────
export async function angelLogin(totp) {
  try {
    const res = await fetch(`${BASE}/rest/auth/angelbroking/user/v1/loginByPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-UserType": "USER",
        "X-SourceID": "WEB",
        "X-PrivateKey": ANGEL.API_KEY,
      },
      body: JSON.stringify({
        clientcode: ANGEL.CLIENT_ID,
        password:   ANGEL.PASSWORD,
        totp,
      }),
    })
    const data = await res.json()
    if (data.status && data.data) {
      JWT_TOKEN = data.data.jwtToken
      return { success: true }
    }
    return { success: false, error: data.message }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// ── LIVE PRICES ─────────────────────────────────────
export async function fetchLivePrices() {
  if (USE_DUMMY) return dummyPrices()
  try {
    const res = await fetch(`${BASE}/rest/secure/angelbroking/market/v1/quote/`, {
      method: "POST",
      headers: { "Content-Type":"application/json", "Authorization":"Bearer "+JWT_TOKEN, "X-PrivateKey":ANGEL.API_KEY },
      body: JSON.stringify({ mode:"LTP", fetObjList:{ NSE:["26000","26009","1333","2885"] } })
    })
    const d = await res.json()
    return d.data
  } catch { return dummyPrices() }
}

// ── SIGNALS ─────────────────────────────────────────
export async function fetchSignals() {
  if (USE_DUMMY) return dummySignals()
  return []
}

// ── WATCHLIST ────────────────────────────────────────
export async function fetchWatchlist() {
  if (USE_DUMMY) return getWatchlistDummy()  // ← Nifty 100 से real data
  return []
}

// ── PnL ─────────────────────────────────────────────
export async function fetchPnL(period) {
  if (USE_DUMMY) return dummyPnL(period)
  return dummyPnL(period)
}

// ── DUMMY DATA ───────────────────────────────────────
function dummyPrices() {
  return {
    nifty:     { val:"24,520", change:"+0.42%", up:true  },
    sensex:    { val:"81,230", change:"+0.38%", up:true  },
    bankNifty: { val:"52,100", change:"-0.12%", up:false },
    gold:      { val:"72,450", change:"+0.21%", up:true  },
    crude:     { val:"6,450",  change:"-0.85%", up:false },
  }
}

function dummySignals() {
  // Nifty 100 से real stock names use करो
  const picks = ["RELIANCE","HDFCBANK","TCS","INFY","ICICIBANK","SBIN","AXISBANK","BHARTIARTL","WIPRO","TATASTEEL"]
  const prices= ["2985","1440","3840","1594","1125","815","1032","1580","480","145"]
  const sigs  = ["STRONG BUY","BUY","BUY","STRONG BUY","SELL","BUY","SELL","BUY","SELL","BUY"]
  const scans = ["BRAHMASTRA","SUDARSHAN","TRISHUL","BRAHMASTRA","ALL-IN-ONE","INDEX","SUDARSHAN","TRISHUL","ALL-IN-ONE","INDEX"]
  return picks.map((sym, i) => ({
    id:      i + 1,
    name:    sym,
    price:   prices[i],
    signal:  sigs[i],
    score:   String(95 - i * 5),
    scanner: scans[i],
    trend:   sigs[i].includes("BUY") ? "up" : "down",
  }))
}

function dummyPnL(period) {
  const d = {
    "1DAY":   { pnl:"+₹12,450",   trades:14,  accuracy:"78%" },
    "1WEEK":  { pnl:"+₹58,200",   trades:62,  accuracy:"74%" },
    "1MONTH": { pnl:"+₹2,10,500", trades:240, accuracy:"71%" },
  }
  return d[period] || d["1DAY"]
}
