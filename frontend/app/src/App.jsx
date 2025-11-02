import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Home } from "./pages/Home";
import VendorDashboard from "./pages/VendorDashboard";
import VendorProfile from "./pages/VendorProfileClean";
import { Header } from "./components/Header";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { useEffect, useState } from "react";
import { Footer } from "./components/Footer";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import VendorProfileClean from "./pages/VendorProfileClean";
import { BottomNav } from "./components/BottomNav";

const App = () => {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <button
          type="button"
          className="flex items-center gap-3 bg-primary-3 text-white px-4 py-2 rounded"
          disabled
        >
          <svg
            className="h-5 w-5 animate-spin"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Loading…
        </button>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="relative max-w-7xl mx-auto px-2 sm:px-6 md:px-10 lg:px-8 pb-20">
        <Routes>
          <Route
            path="/"
            element={authUser ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/home"
            element={authUser ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="login"
            element={!authUser ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <Signup /> : <Navigate to="/" />}
          />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/:storeUsername" element={<VendorProfileClean />} />
        </Routes>
      </div>
      <Footer />
      <BottomNav />
      <Toaster />
    </div>
  );
};

export default App;
