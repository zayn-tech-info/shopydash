import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Home } from "./pages/Home";
import VendorDashboard from "./pages/VendorDashboard";
import NotFound from "./pages/NotFound";
import { Header } from "./components/Header";
import { useEffect } from "react";
import { Footer } from "./components/Footer";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useCartStore } from "./store/cartStore";
import useChatStore from "./store/chatStore";
import { useNotificationStore } from "./store/notificationStore";
import toast from "react-hot-toast";
import { BottomNav } from "./components/BottomNav";
import { AppSkeleton } from "./components/skeletons/AppSkeleton";
import CreateVendorProfile from "./pages/CreateVendorProfile";
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
import MessagesPage from "./pages/Messages.jsx";
import PricingPage from "./pages/PricingPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderList from "./pages/OrderList";
import SettingsPage from "./pages/SettingsPage";
import NotificationsPage from "./pages/NotificationsPage";

import { VerifyEmail } from "./pages/VerifyEmail";

const App = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const { getCart } = useCartStore();
  const location = useLocation();

  const { connectSocket, disconnectSocket, socket } = useChatStore();
  const { addNotification, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authUser?._id) {
      connectSocket(authUser._id);
      fetchNotifications();
    }
    return () => {
      if (authUser) disconnectSocket();
    };
  }, [authUser, connectSocket, disconnectSocket, fetchNotifications]);

  useEffect(() => {
    if (socket) {
      socket.on("order:new", (data) => {
        addNotification(data.notification);
        toast(
          (t) => (
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">New Order! 🎉</h3>
                <p className="text-sm text-gray-600">{data.summary}</p>
              </div>
            </div>
          ),
          { duration: 5000, icon: "📦" }
        );
        // Play notification sound if desired
        const audio = new Audio("/assets/notification.mp3"); // Ensure this file exists or skip
        audio.play().catch((e) => console.log("Audio play failed", e));
      });

      return () => {
        socket.off("order:new");
      };
    }
  }, [socket, addNotification]);

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
    <div
      className={
        location.pathname === "/messages"
          ? "flex flex-col h-[100dvh] overflow-hidden"
          : ""
      }
    >
      <Header />
      <div
        className={`relative mx-auto ${
          location.pathname === "/messages"
            ? "w-full max-w-full px-0 pb-0 flex-1 overflow-hidden bg-n-1"
            : "max-w-7xl px-2 sm:px-6 md:px-10 lg:px-8 pb-40"
        }`}
      >
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
            path="/login"
            element={!authUser ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <Signup /> : <Navigate to="/" />}
          />
          <Route
            path="/verify-email"
            element={!authUser ? <VerifyEmail /> : <Navigate to="/" />}
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
          {/* <Route
            path="/vendor/settings/bank"
            element={<VendorBankSettings />}
          /> */}
          <Route path="/vendor/add" element={<VendorProductUpload />} />
          <Route path="/feeds" element={<Feeds />} />
          <Route path="/search" element={<SearchProducts />} />
          <Route path="/p/:username" element={<ProfileDispatcher />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order/confirmation" element={<OrderConfirmation />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route
            path="/settings"
            element={authUser ? <SettingsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/pricing"
            element={
              authUser?.role === "client" ? (
                <Navigate to="/" />
              ) : (
                <PricingPage />
              )
            }
          />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/notifications"
            element={
              authUser ? <NotificationsPage /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
      {location.pathname !== "/messages" &&
      location.pathname !== "/login" &&
      location.pathname !== "/signup" &&
      location.pathname !== "/verify-email" ? (
        <Footer />
      ) : (
        ""
      )}
      {authUser && location.pathname !== "/messages" ? <BottomNav /> : ""}
      {authUser && location.pathname !== "/messages" && (
        <VendorFloatingButton />
      )}
      <Toaster />
    </div>
  );
};

export default App;
