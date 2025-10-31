import Logo from "../assets/images/vendora_logo.png";
import { navigation } from "../constants";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function Header() {
  const { authUser } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 bg-n-1/90 backdrop-blur shadow-md">
      <div className="container flex items-center justify-between">
        <Link to="/">
          <img src={Logo} alt="Vendora Logo" width={130} height={70} />
        </Link>

        <div className="flex items-center space-x-5">
          <Link className={`${authUser ? "hidden" : "block"}`} to="/login">
            <button className="px-5 py-2 rounded-md font-medium hover:bg-primary-2 transition-colors duration-500 text-n-1 bg-primary-3 md:hidden">
              Login
            </button>
          </Link>
          {/* <button
            type="button"
            className="md:hidden text-n-9 cursor-pointer"
            aria-label="Open menu"
            onClick={handleClick}
          >
            <Menu size={28} />
          </button> */}
        </div>

        <nav className="hidden md:flex items-center space-x-5 text-base">
          <ul className="flex items-center gap-10 mr-10">
            {navigation.map((nav) => {
              const to = nav.href === "/home" ? "/" : nav.href;
              const Icon = nav.icon;
              return (
                <li key={nav.id}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 transition-colors ${
                        isActive
                          ? "text-primary-3 font-medium"
                          : "text-n-6 hover:text-primary-3"
                      }`
                    }
                    end
                  >
                    {Icon ? <Icon size={16} /> : null}
                    {nav.text}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          <Link className={`${authUser ? "hidden" : "block"}`} to="/login">
            <button className="px-5 py-1 rounded-md font-medium hover:bg-primary-2 transition-colors duration-500 text-n-1 bg-primary-3">
              Login
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
