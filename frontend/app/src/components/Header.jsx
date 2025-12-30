import Logo from "../assets/images/vendora_logo.png";
import { navigation } from "../constants";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import useChatStore from "../store/chatStore";
import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";

export function Header() {
  const { authUser } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const { conversations, fetchConversations } = useChatStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (authUser) {
      fetchConversations();
    }
  }, [authUser, fetchConversations]);

  const unreadMessageCount = conversations.reduce((acc, conv) => {
    const count = conv.unreadCounts?.[authUser?._id] || 0;
    return acc + count;
  }, 0);

  const renderNav = (nav, role) => {
    if (nav === "Pricing" && role === "client") {
      return null;
    }
    if (nav === "Messages") return null;

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
    <header className="sticky top-0 z-50 bg-n-1 md:bg-n-1/90 md:backdrop-blur-sm shadow-md">
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
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary-3 rounded-full min-w-[1.25rem] h-5">
                  {cartCount}
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
              if (nav.text === "Cart") return null;

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
                    {Icon ? (
                      <div className="relative">
                        <Icon size={16} />
                        {nav.text === "Messages" && unreadMessageCount > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                            {unreadMessageCount > 99
                              ? "99+"
                              : unreadMessageCount}
                          </span>
                        )}
                      </div>
                    ) : null}
                    {nav.text}
                  </NavLink>
                </li>
              );
            })}
            {}
          </ul>

          <Link to="/cart" className="relative group mr-5">
            <div className="p-2 rounded-full hover:bg-n-2/50 transition-colors">
              <ShoppingCart
                size={24}
                className="text-n-6 group-hover:text-primary-3 transition-colors"
              />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary-3 rounded-full min-w-[1.25rem] h-5">
                  {cartCount}
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
