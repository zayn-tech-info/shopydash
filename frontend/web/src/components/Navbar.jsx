import { Menu, X } from "lucide-react";
import Logo from "../assets/images/shopydash_logo.png";
import { navigation } from "../constant";
import { Button } from "./Button";
import { useState } from "react";
import { enablePageScroll, disablePageScroll } from "scroll-lock";
import { Link } from "react-router-dom";

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
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isMenuOpened
            ? "bg-white"
            : "bg-white/80 backdrop-blur-md border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-2"
              onClick={() => window.scrollTo(0, 0)}
            >
              <img
                className="w-auto h-10 object-contain"
                src={Logo}
                alt="Shopydash Logo"
              />
              <span className="font-sora font-bold text-xl tracking-tight text-n-8 hidden sm:block">
                Shopydash
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center">
            <ul className="flex items-center gap-10">
              {navigation.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="text-n-6 hover:text-orange-600 transition-colors font-medium text-sm tracking-wide"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:flex items-center gap-4 hidden">
            <a
              href="https://app.shopydash.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 text-n-6 hover:text-orange-600 font-medium transition-colors duration-200 text-sm"
            >
              Sign Up
            </a>
            <a
              href="https://app.shopydash.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-n-8 text-white rounded-full hover:bg-orange-500 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-bold text-sm"
            >
              Get Started
            </a>
          </div>
          <button
            onClick={toggleNavigation}
            className="md:hidden p-2 text-n-8 focus:outline-none"
            aria-label={isMenuOpened ? "Close menu" : "Open menu"}
          >
            {isMenuOpened ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpened && (
          <div
            className="fixed inset-0 top-20 z-40 bg-white"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="flex flex-col gap-4 p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {navigation &&
                navigation.map((item) => (
                  <a
                    href={item.href}
                    key={item.id}
                    onClick={handleClick}
                    className="text-2xl font-bold text-n-8 py-2 border-b border-gray-100"
                  >
                    {item.text}
                  </a>
                ))}
              <div className="flex flex-col gap-4 mt-8">
                <a
                  href="https://app.shopydash.com/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 text-center text-lg  text-black font-medium border border-n-8 rounded-xl"
                >
                  Sign Up
                </a>
                <a
                  href="https://app.shopydash.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 text-center text-lg font-bold bg-n-8 text-white rounded-xl shadow-lg"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
