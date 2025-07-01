import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Layout } from "./components/Layout"
import { Home } from "./pages/Home"
import { Services } from "./pages/Services"
import { Barbers } from "./pages/Barbers"
import { Bookings } from "./pages/Bookings"
import { Booking } from "./pages/Booking"
import CustomerDashboard from "./pages/CustomerDashboard"
import BarberDashboard from "./pages/BarberDashboard"
import "./i18n"

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Dashboard routes */}
            <Route path="/customer-dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/barber-dashboard" element={<ProtectedRoute><BarberDashboard /></ProtectedRoute>} />
            
            {/* Layout-based routes */}
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Home />} />
              <Route path="services" element={<Services />} />
              <Route path="barbers" element={<Barbers />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="booking" element={<Booking />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App