import { Home, LayoutDashboardIcon, ShoppingCart, User } from "lucide-react";

// Keep icon as a component, not a pre-created element, so we can pass className/size/color when rendering
export const navigation = [
  {
    id: 1,
    text: "Home",
    href: "/home",
    icon: Home,
  },
  {
    id: 2,
    text: "Sell",
    href: "/sell",
    icon: ShoppingCart,
  },
  {
    id: 3,
    text: "My Products",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    id: 4,
    text: "Profile",
    href: "/profile",
    icon: User,
  },
];
