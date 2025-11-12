import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Home } from "./pages/Home";
import VendorDashboard from "./pages/VendorDashboard";
import VendorProfile from "./pages/VendorProfile";
import NotFound from "./pages/NotFound";
import { Header } from "./components/Header";
import { useEffect, useState } from "react";
import { Footer } from "./components/Footer";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { BottomNav } from "./components/BottomNav";
import { Loader } from "./components/Loader";
import CreateVendorProfile from "./pages/CreateVendorProfile";
import ClientProfile from "./pages/ClientProfile";

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
    return <Loader children="loading" />;
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
          <Route
            path="/createvendorprofile"
            element={
              authUser ? <CreateVendorProfile /> : <Navigate to="/login" />
            }
          />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="store/:storeUsername" element={<VendorProfile />} />
          <Route
            path={
              authUser && authUser.role === "vendor"
                ? "/vendor/profile"
                : "/profile"
            }
            element={
              authUser && authUser.role === "vendor" ? (
                <VendorProfile />
              ) : (
                <ClientProfile />
              )
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {authUser ? <Footer /> : ""}
      {authUser ? <BottomNav /> : ""}
      <Toaster />
    </div>
  );
};

export default App;
