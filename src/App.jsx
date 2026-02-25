import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import AdminLogin from './pages/AdminLogin'
import About from './pages/About'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import ShippingReturns from './pages/ShippingReturns'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Checkout from './pages/Checkout'
import Admin from './pages/Admin'

import ChatBot from './components/common/ChatBot'
import { ToastProvider } from './context/ToastContext'
import { ThemeProvider } from './context/ThemeContext'

// Layout wrapper to conditionally render header/footer if needed
const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup' || location.pathname.startsWith('/admin');

  return (
    <div className="app-container">
      {!isAuthRoute && <Navbar />}
      <main style={{ flex: 1 }}>
        {children}
      </main>
      {!isAuthRoute && <Footer />}
      {!isAuthRoute && <ChatBot />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping" element={<ShippingReturns />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
