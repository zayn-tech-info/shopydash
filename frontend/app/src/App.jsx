import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Home } from "./pages/Home";
import VendorDashboard from "./pages/VendorDashboard";
import VendorProfile from "./pages/VendorProfile";
import NotFound from "./pages/NotFound";
import { Header } from "./components/Header";
import { useEffect, useState, useCallback } from "react";
import { Footer } from "./components/Footer";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useCartStore } from "./store/cartStore";
import { BottomNav } from "./components/BottomNav";
import { AppSkeleton } from "./components/skeletons/AppSkeleton";
import CreateVendorProfile from "./pages/CreateVendorProfile";
import ClientProfile from "./pages/ClientProfile";
import CreateClientProfile from "./pages/CreateClientProfile";
import { CompleteProfileLanding } from "./pages/CompleteProfileLanding";
import CompleteProfile from "./pages/CompleteProfile";
import CompleteRegistration from "./pages/CompleteRegistration";
import ProfileDispatcher from "./pages/ProfileDispatcher";
import VendorProductUpload from "./pages/VendorProductUpload";
import { VendorFloatingButton } from "./components/VendorFloatingButton";
import Feeds from "./pages/Feeds";
import CartPage from "./pages/CartPage";
import SearchProducts from "./pages/SearchProducts";

const App = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const { getCart } = useCartStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authUser) {
      getCart();
    }
  }, [authUser, getCart]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);

  if (isCheckingAuth) {
    return <AppSkeleton />;
  }

  return (
    <div>
      <Header />
      <div className="relative max-w-7xl mx-auto px-2 sm:px-6 md:px-10 lg:px-8 pb-20">
        <Routes>
          <Route
            path="/"
            element={
              authUser && !authUser.profileComplete ? (
                <Navigate to="/complete-user-registration" />
              ) : (
                <Home />
              )
            }
          />
          <Route
            path="/home"
            element={
              authUser && !authUser.profileComplete ? (
                <Navigate to="/complete-user-registration" />
              ) : (
                <Home />
              )
            }
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
            path="/create-vendor-profile"
            element={
              authUser ? <CreateVendorProfile /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/create-client-profile"
            element={
              authUser ? <CreateClientProfile /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/complete-profile"
            element={authUser ? <CompleteProfile /> : <Navigate to="/login" />}
          />
          <Route
            path="/complete-profile-landing"
            element={
              authUser ? <CompleteProfileLanding /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/complete-user-registration"
            element={
              authUser ? <CompleteRegistration /> : <Navigate to="/login" />
            }
          />
          <Route path="/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/add" element={<VendorProductUpload />} />
          <Route path="/feeds" element={<Feeds />} />
          <Route path="/search" element={<SearchProducts />} />
          <Route path="/p/:username" element={<ProfileDispatcher />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {authUser ? <Footer /> : ""}
      {authUser ? <BottomNav /> : ""}
      <VendorFloatingButton />
      <Toaster />
    </div>
  );
};

export default App;
