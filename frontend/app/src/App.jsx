import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Home } from "./pages/Home";
import { Header } from "./components/Header";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { useEffect, useState } from "react";
import { Footer } from "./components/Footer";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";

const App = () => {
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const { checkAuth, authUser } = useAuthStore();

  function toggleNavigation() {
    if (isMenuOpened) {
      setIsMenuOpened(false);
      enablePageScroll();
    } else {
      setIsMenuOpened(true);
      disablePageScroll();
    }
  }

  function handleClick() {
    toggleNavigation();
  }

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);

  return (
    <div>
      <Header handleClick={handleClick} />
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
        </Routes>
      </div>
      <Footer />

      <Toaster />
    </div>
  );
};

export default App;
