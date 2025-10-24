import { Menu, X } from "lucide-react";
import Logo from "../assets/vendora_logo.png";
import { navigation } from "../constant";
import { Button } from "./Button";
import { useState } from "react";
import { enablePageScroll, disablePageScroll } from "scroll-lock";

export function Navbar() {
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  function toggleNavigation() {
    if (isMenuOpened) {
      enablePageScroll();
      setIsMenuOpened(false);
    } else {
      disablePageScroll();
      setIsMenuOpened(true);
    }
  }

  function handleClick() {
    if (!isMenuOpened) return;

    enablePageScroll();
    setIsMenuOpened(false);
  }

  return (
    <div>
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img className="w-28 h-16" src={Logo} alt="" />
          </div>
          <nav className="hidden md:flex items-center">
            <ul className="flex items-center gap-8">
              {navigation.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="text-n-6 hover:text-n-4 transition-colors font-medium uppercase text-sm "
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:flex items-center gap-4 hidden">
            <button className="px-4 py-2 text-n-6 font-medium hover:text-n-4 uppercase text-sm">
              Sign In
            </button>
            <Button className="uppercase font-medium text-sm">
              Get started
            </Button>
          </div>
          <Menu
            onClick={toggleNavigation}
            className="text-n-9 w-10 h-10 md:hidden cursor-pointer"
            aria-label={isMenuOpened ? "Close menu" : "Open menu"}
          />
        </div>

        {isMenuOpened && (
          <div
            className="fixed inset-0 z-[50] bg-primary-3 text-n-1 md:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="flex flex-col gap-2 p-6 mt-6"
              onClick={(e) => e.stopPropagation()}
            >
              {navigation &&
                navigation.map((item) => (
                  <a
                    href={item.href}
                    key={item.id}
                    onClick={handleClick}
                    className="px-4 py-3 text-2xl uppercase last:un"
                  >
                    {item.text}
                  </a>
                ))}
            </div>

            <div className="absolute top-4 right-4" onClick={handleClick}>
              <X size={40} />
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
