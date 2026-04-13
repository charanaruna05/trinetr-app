const USE_DUMMY = true  // false करो = Real Angel One API

export async function fetchLivePrices() {
  if (USE_DUMMY) return dummyPrices()
  // Angel One API यहाँ लगाओ
}

export async function fetchSignals() {
  if (USE_DUMMY) return dummySignals()
  // Angel One API यहाँ लगाओ
}

export async function fetchWatchlist() {
  if (USE_DUMMY) return dummyWatchlist()
}

export async function fetchPnL(period) {
  if (USE_DUMMY) return dummyPnL(period)
}

function dummyPrices() {
  return {
    nifty:     { val: "24,520", change: "+0.42%", up: true  },
    sensex:    { val: "81,230", change: "+0.38%", up: true  },
    bankNifty: { val: "52,100", change: "-0.12%", up: false },
    gold:      { val: "72,450", change: "+0.21%", up: true  },
    crude:     { val: "6,450",  change: "-0.85%", up: false },
  }
}

function dummySignals() {
  return [
    { id:1,  name:"RELIANCE",    price:"2985",  signal:"STRONG BUY",  score:"92", scanner:"BRAHMASTRA", trend:"up"   },
    { id:2,  name:"NIFTY 50",    price:"24520", signal:"BUY",         score:"78", scanner:"INDEX",      trend:"up"   },
    { id:3,  name:"HDFC BANK",   price:"1440",  signal:"STRONG BUY",  score:"88", scanner:"SUDARSHAN",  trend:"up"   },
    { id:4,  name:"CRUDE OIL",   price:"6450",  signal:"SELL",        score:"25", scanner:"ALL-IN-ONE", trend:"down" },
    { id:5,  name:"TCS",         price:"3840",  signal:"BUY",         score:"71", scanner:"TRISHUL",    trend:"up"   },
    { id:6,  name:"WIPRO",       price:"480",   signal:"SELL",        score:"30", scanner:"SUDARSHAN",  trend:"down" },
    { id:7,  name:"GOLD",        price:"72100", signal:"BUY",         score:"70", scanner:"TRISHUL",    trend:"up"   },
    { id:8,  name:"NATURAL GAS", price:"215",   signal:"STRONG BUY",  score:"95", scanner:"ALL-IN-ONE", trend:"up"   },
    { id:9,  name:"BANK NIFTY",  price:"52100", signal:"BUY",         score:"75", scanner:"INDEX",      trend:"up"   },
    { id:10, name:"TATA MOTORS", price:"945",   signal:"BUY",         score:"65", scanner:"BRAHMASTRA", trend:"up"   },
  ]
}

function dummyWatchlist() {
  const names = ["RELIANCE","TCS","HDFC BANK","INFY","SBI","ITC","WIPRO","MARUTI"]
  const scans = ["Brahmastra","Trishul","Sudarshan","All-in-One","Index","Scalp"]
  return Array.from({ length: 30 }, (_, i) => ({
    id: i+1, name: names[i % names.length],
    price: (2450 + i*10).toFixed(2), sector: "IT",
    scanner: scans[i % scans.length], isBuy: i%2===0,
    score: 95-i, entry: String(2440+i), target1: String(2480+i),
    target2: String(2520+i), sl: String(2420+i),
  }))
}

function dummyPnL(period) {
  const d = {
    "1DAY":   { pnl:"+₹12,450",    trades:14,  accuracy:"78%", isProfit:true },
    "1WEEK":  { pnl:"+₹58,200",    trades:62,  accuracy:"74%", isProfit:true },
    "1MONTH": { pnl:"+₹2,10,500",  trades:240, accuracy:"71%", isProfit:true },
  }
  return d[period] || d["1DAY"]
}
