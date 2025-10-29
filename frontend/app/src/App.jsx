import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Header } from "./components/Header";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { useState } from "react";
import { Footer } from "./components/Footer";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";

const App = () => {
  const [isMenuOpened, setIsMenuOpened] = useState(false);

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

  return (
    <div>
      <Header handleClick={handleClick} />
      <div className="relative max-w-7xl mx-auto px-2 sm:px-6 md:px-10 lg:px-8 pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
