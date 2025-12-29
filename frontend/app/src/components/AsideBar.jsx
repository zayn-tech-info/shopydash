import { X } from "lucide-react";
import { navigation } from "../constants";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import useChatStore from "../store/chatStore";
import { useEffect } from "react";

export function AsideBar({ isMenuOpened, handleClick }) {
  const location = useLocation();
  const { authUser } = useAuthStore();
  const { conversations, fetchConversations } = useChatStore();

  useEffect(() => {
    if (authUser) {
      fetchConversations();
    }
  }, [authUser, fetchConversations]);

  const unreadMessageCount = conversations.reduce((acc, conv) => {
    const count = conv.unreadCounts?.[authUser?._id] || 0;
    return acc + count;
  }, 0);

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
            const active =
              location.pathname === nav.href ||
              (location.pathname === "/" && nav.href === "/home");
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
                    <div className="relative">
                      <Icon
                        className={`w-8 h-8 ${
                          active ? "text-primary-3" : "text-white"
                        }`}
                        aria-hidden="true"
                      />
                      {nav.text === "Messages" && unreadMessageCount > 0 && (
                        <span
                          className={`absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 ${
                            active ? "border-white" : "border-primary-3"
                          }`}
                        >
                          {unreadMessageCount > 99 ? "99+" : unreadMessageCount}
                        </span>
                      )}
                    </div>
                  ) : null}
                  <span className="font-medium text-3xl">{nav.text}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
