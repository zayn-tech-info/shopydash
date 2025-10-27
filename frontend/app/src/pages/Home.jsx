import { AsideBar } from "../components/AsideBar";
import { Header } from "../components/Header";
import { useState } from "react";
import { disablePageScroll, enablePageScroll } from "scroll-lock";

export function Home() {
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
    <>
      <Header handleClick={handleClick} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AsideBar isMenuOpened={isMenuOpened} handleClick={handleClick} />
      </div>
    </>
  );
}
