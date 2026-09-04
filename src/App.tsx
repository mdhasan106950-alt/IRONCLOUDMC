import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, ScrollRestoration } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout Components
import { AnnouncementBanner } from './components/layout/AnnouncementBanner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { StorePage } from './pages/StorePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { GameModesPage } from './pages/GameModesPage';
import { AboutPage } from './pages/AboutPage';
import { TeamPage } from './pages/TeamPage';
import { PartnershipPage } from './pages/PartnershipPage';
import { RulesPage } from './pages/RulesPage';
import { SupportPage } from './pages/SupportPage';
import { ReportsPage } from './pages/ReportsPage';
import { LoginPage } from './pages/LoginPage';
import { PlayerProfilePage } from './pages/PlayerProfilePage';
import { PlayerDirectoryPage } from './pages/PlayerDirectoryPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminCMS } from './pages/admin/AdminCMS';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
});

// Main Site Shell Layout
const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0612] text-slate-200 font-sans selection:bg-purple-600 selection:text-white relative overflow-x-hidden">
      {/* Immersive UI Atmospheric Background Grid & Ambient Glows */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: 'radial-gradient(#3B0063 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="fixed top-[-10%] left-[-10%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] bg-purple-900/20 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] bg-emerald-900/10 blur-[130px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <AnnouncementBanner />
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Public Website Routes with standard Navbar & Footer */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="store" element={<StorePage />} />
                <Route path="store/:category" element={<StorePage />} />
                <Route path="store/products/:slug" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="order-confirmation/:id" element={<OrderConfirmationPage />} />
                <Route path="game-modes" element={<GameModesPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="team" element={<TeamPage />} />
                <Route path="partnership" element={<PartnershipPage />} />
                <Route path="rules" element={<RulesPage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="players" element={<PlayerDirectoryPage />} />
                <Route path="players/:username" element={<PlayerProfilePage />} />
                <Route path="profile" element={<PlayerProfilePage />} />
                <Route path="profile/orders" element={<PlayerProfilePage />} />
              </Route>

              {/* Dedicated Admin Panel Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="cms" element={<AdminCMS />} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<MainLayout />}>
                <Route index element={<HomePage />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
