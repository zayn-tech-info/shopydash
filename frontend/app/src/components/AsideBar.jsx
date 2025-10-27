import { X } from "lucide-react";
import { navigation } from "../constants";
import { Link, useLocation } from "react-router-dom";

export function AsideBar({ isMenuOpened, handleClick }) {
  const location = useLocation();

  return (
    <div
      className={`fixed top-0 right-0 h-screen w-2/3 md:w-64 bg-primary-3 shadow-2xl py-16 px-2 z-50 transform transition-transform duration-300 ${
        isMenuOpened ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <nav className="text-white" aria-label="Sidebar">
        <div onClick={handleClick} className="absolute top-3 right-2">
          <X className="w-10 h-10 cursor-pointer" />
        </div>
        <div className="mt-3">
          {navigation.map((nav) => {
            const Icon = nav.icon;
            const active = location.pathname === nav.href;
            return (
              <Link
                key={nav.id}
                to={nav.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-xl block w-full px-6 py-3 mb-5 transition-colors ${
                  active
                    ? "bg-white text-primary-3 shadow-sm"
                    : "hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-7">
                  {Icon ? (
                    <Icon
                      className={`w-5 h-5 ${
                        active ? "text-primary-3" : "text-white"
                      }`}
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="font-medium">{nav.text}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
