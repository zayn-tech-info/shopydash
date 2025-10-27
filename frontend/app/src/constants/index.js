import { Beef, BookOpen, Headset, Home, LayoutDashboardIcon, Shirt, ShoppingCart, User } from "lucide-react";

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

export const  categories = [
  {
    id: 1,
    text: "Gadgets",
    icon: Headset
  },
  {
    id: 2,
    text: "Clothing",
    icon: Shirt 
  },
  {
    id: 3,
    text: "Books",
    icon: BookOpen
  },
  {
    id: 4,
    text: "Food",
    icon: Beef
  },
]