import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Header } from "./components/Header";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { useState } from "react";

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
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
