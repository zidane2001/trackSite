import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { App } from './App';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { UserLayout } from './layouts/UserLayout';
import { HomePage } from './pages/HomePage';
import { TrackingPage } from './pages/TrackingPage';
import { QuotePage } from './pages/QuotePage';
import { ContactPage } from './pages/ContactPage';
import { AnimatePresence } from 'framer-motion';
function AnimatedRoutes() {
  const location = useLocation();
  return <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="tracking" element={<TrackingPage />} />
          <Route path="quote" element={<QuotePage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </AnimatePresence>;
}
export function AppRouter() {
  return <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>;
}