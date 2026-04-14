import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { fetchLivePrices, fetchSignals } from "../services/apiService"
import { requestNotificationPermission, sendNotification } from "../services/notificationService"

const AppContext = createContext(null)
export function useApp() { return useContext(AppContext) }

export function AppProvider({ children }) {
  const [currentPage, setCurrentPage] = useState("home")
  const [pageParams,  setPageParams]  = useState({})

  function navigate(page, params = {}) {
    setCurrentPage(page)
    setPageParams(params)
  }

  const [prices, setPrices] = useState({
    nifty:     { val: "24,520", change: "+0.42%", up: true  },
    sensex:    { val: "81,230", change: "+0.38%", up: true  },
    bankNifty: { val: "52,100", change: "-0.12%", up: false },
    gold:      { val: "72,450", change: "+0.21%", up: true  },
    crude:     { val: "6,450",  change: "-0.85%", up: false },
  })

  const [signals,       setSignals]       = useState([])
  const [notifications, setNotifications] = useState([])
  const [unreadCount,   setUnreadCount]   = useState(0)

  function addNotification(notif) {
    const n = { id: Date.now(), time: new Date().toLocaleTimeString("hi-IN"), read: false, ...notif }
    setNotifications(prev => [n, ...prev].slice(0, 50))
    setUnreadCount(c => c + 1)
    sendNotification(notif.title, notif.message)
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  function clearNotifications() {
    setNotifications([])
    setUnreadCount(0)
  }

  const [user] = useState({
    id: "CLIENT001", name: "Trishul User",
    phone: "+91 98XXX XXXXX", email: "client@trishul.com", plan: "PRO MASTER",
  })

  const refreshData = useCallback(async () => {
    try {
      const [newPrices, newSignals] = await Promise.all([fetchLivePrices(), fetchSignals()])
      setPrices(newPrices)
      setSignals(newSignals)
    } catch (err) {
      console.log("API Error:", err.message)
    }
  }, [])

  useEffect(() => {
    requestNotificationPermission()
    refreshData()
    const t = setInterval(refreshData, 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <AppContext.Provider value={{
      currentPage, pageParams, navigate,
      prices, signals, user,
      notifications, unreadCount,
      addNotification, markAllRead, clearNotifications, refreshData,
    }}>
      {children}
    </AppContext.Provider>
  )
}
