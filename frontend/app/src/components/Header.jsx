import Logo from "../assets/images/vendora_logo.png";
import { navigation } from "../constants";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";

export function Header() {
  const { authUser } = useAuthStore();

  useEffect(() => {
    const loadUser = async () => {
      console.log(authUser);
    };
    loadUser();
  }, [authUser]);

  const renderNav = (nav, role) => {
    if (!role) {
      if (nav === "Dashboard" || nav === "Profile") {
        return null;
      }
    }
    if (nav === "Dashboard" && role !== "vendor") {
      return null;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-n-1/90 backdrop-blur shadow-md">
      <div className="container flex items-center justify-between">
        <Link to="/">
          <img src={Logo} alt="Vendora Logo" width={130} height={70} />
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative group md:hidden">
            <div className="p-2 rounded-full hover:bg-n-2/50 transition-colors">
              <ShoppingCart
                size={24}
                className="text-n-6 group-hover:text-primary-3 transition-colors"
              />
              {useCartStore((state) => state.cart).length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary-3 rounded-full min-w-[1.25rem] h-5">
                  {useCartStore((state) =>
                    state.cart.reduce((acc, item) => acc + item.quantity, 0)
                  )}
                </span>
              )}
            </div>
          </Link>

          <Link className={`${authUser ? "hidden" : "block"}`} to="/login">
            <button className="px-5 py-2 rounded-md font-medium hover:bg-primary-2 transition-colors duration-500 text-n-1 bg-primary-3 md:hidden">
              Login
            </button>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-5 text-base">
          <ul className="flex items-center gap-10 mr-10">
            {navigation.map((nav) => {
              let to = nav.href === "/home" ? "/" : nav.href;

              if (authUser && nav.href === "/profile") {
                to = `/p/${authUser.username}`;
              }
              const navResult = renderNav(nav.text, authUser?.role);
              if (navResult === null) return null;

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
            {/*             <li>
              <NavLink
                to={
                  authUser && authUser.role === "vendor"
                    ? "/vendor/profile"
                    : "/profile"
                }
                className={({ isActive }) =>
                  `flex items-center gap-2 transition-colors ${
                    isActive
                      ? "text-primary-3 font-medium"
                      : "text-n-6 hover:text-primary-3"
                  }`
                }
                end
              >
                {<User size={16} />}
                Profile
              </NavLink>
            </li> */}
          </ul>

          <Link to="/cart" className="relative group mr-5">
            <div className="p-2 rounded-full hover:bg-n-2/50 transition-colors">
              <ShoppingCart
                size={24}
                className="text-n-6 group-hover:text-primary-3 transition-colors"
              />
              {useCartStore((state) => state.cart).length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary-3 rounded-full min-w-[1.25rem] h-5">
                  {useCartStore((state) =>
                    state.cart.reduce((acc, item) => acc + item.quantity, 0)
                  )}
                </span>
              )}
            </div>
          </Link>

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
