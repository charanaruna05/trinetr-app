import { AppProvider, useApp } from "./context/AppContext"
import Home      from "./pages/Home"
import Signal    from "./pages/Signal"
import Chart     from "./pages/Chart"
import Watchlist from "./pages/Watchlist"
import Admin     from "./pages/Admin"

function Router() {
  const { currentPage } = useApp()
  switch (currentPage) {
    case "home":      return <Home />
    case "signal":    return <Signal />
    case "chart":     return <Chart />
    case "watchlist": return <Watchlist />
    case "admin":     return <Admin />
    default:          return <Home />
  }
}

export default function App() {
  return <AppProvider><Router /></AppProvider>
}
