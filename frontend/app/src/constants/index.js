import {
  Beef,
  BookOpen,
  Headset,
  Home,
  LayoutDashboardIcon,
  Shirt,
  ShoppingCart,
  User,
  Palette,
  Sparkles,
  PenTool,
  Gem,
} from "lucide-react";

import {
  armorCardSlotIphoneCaseImg,
  aongaHighStreetPrintRetroImg,
  appleCollectionImg,
  beanBagsBigWImg,
  betterHomesGardensBazaarImg,
  caseCompatibleSamsungGalaxyImg,
  cottonHeadNeckArabScarfImg,
} from "../utils";

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
    text: "Dashboard",
    href: "vendor/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    id: 4,
    text: "Profile",
    href: "/profile",
    icon: User,
  },
];

export const categories = [
  {
    id: 1,
    text: "Gadgets",
    icon: Headset,
  },
  {
    id: 2,
    text: "Clothing",
    icon: Shirt,
  },
  {
    id: 3,
    text: "Books",
    icon: BookOpen,
  },
  {
    id: 4,
    text: "Food",
    icon: Beef,
  },
  {
    id: 5,
    text: "Cosmetics",
    icon: Sparkles,
  },
  {
    id: 6,
    text: "Art & Design",
    icon: Palette,
  },
  {
    id: 7,
    text: "Stationery",
    icon: PenTool,
  },
  {
    id: 8,
    text: "Accessories",
    icon: Gem,
  },
];

export const VendorsPost = [
  {
    id: "post-1",
    vendorName: "Amina's Crafts",
    vendorAvatar: null,
    location: "Adenike",
    postedAt: "2h",
    caption: "New handmade arrivals today—limited pieces!",
    products: [
      {
        id: "p-1",
        name: "Handmade Tote Bag",
        image:
          // "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800&auto=format&fit=crop",
          aongaHighStreetPrintRetroImg,
        price: 22.5,
        rating: 4.7,
      },
      {
        id: "p-1b",
        name: "Beaded Bracelet",
        image:
          // "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
          armorCardSlotIphoneCaseImg,
        price: 7.5,
        rating: 4.4,
      },
      {
        id: "p-1c",
        name: "Macrame Keychain",
        image:
          // "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=800&auto=format&fit=crop",
          appleCollectionImg,
        price: 4.0,
        rating: 4.2,
      },
      {
        id: "p-1d",
        name: "Woven Pouch",
        image:
          // "https://images.unsplash.com/photo-1610436070184-217dc72f66f6?q=80&w=800&auto=format&fit=crop",
          beanBagsBigWImg,
        price: 9.0,
        rating: 4.5,
      },
    ],
  },
  {
    id: "post-2",
    vendorName: "Green Valley Farm",
    vendorAvatar: null,
    location: "Under G",
    postedAt: "4h",
    caption: "Fresh picks from this morning's harvest!",
    products: [
      {
        id: "p-2",
        name: "Strawberries",
        image:
          // "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=800&auto=format&fit=crop",
          betterHomesGardensBazaarImg,
        price: 5.0,
        rating: 4.5,
      },
      {
        id: "p-2b",
        name: "Spinach",
        image:
          // "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
          caseCompatibleSamsungGalaxyImg,
        price: 3.2,
        rating: 4.3,
      },
      {
        id: "p-2c",
        name: "Tomatoes",
        image:
          // "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=800&auto=format&fit=crop",
          cottonHeadNeckArabScarfImg,
        price: 4.1,
        rating: 4.6,
      },
      {
        id: "p-2b",
        name: "Spinach",
        image:
          // "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
          caseCompatibleSamsungGalaxyImg,
        price: 3.2,
        rating: 4.3,
      },
      {
        id: "p-2c",
        name: "Tomatoes",
        image:
          // "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=800&auto=format&fit=crop",
          cottonHeadNeckArabScarfImg,
        price: 4.1,
        rating: 4.6,
      },
    ],
  },
];

export const schools = [
  "Ladoke Akintola University of Technology (LAUTECH), Ogbomoso",
  "University of Lagos",
  "University of Ibadan",
  "Ahmadu Bello University, Zaria",
  "Obafemi Awolowo University, Ile-Ife",
  "University of Nigeria, Nsukka",
  "Bayero University, Kano",
  "University of Benin",
  "University of Ilorin",
  "Federal University of Technology, Akure (FUTA)",
  "Federal University of Technology, Minna (FUTMINNA)",
  "Covenant University, Ota",
  "Lagos State University, Ojo (LASU)",
  "Rivers State University, Port Harcourt",
  "Adekunle Ajasin University, Akungba-Akoko",
];

export const preferredCategories = [
  "Food & Snacks",
  "Clothing & Fashion",
  "Shoes & Bags",
  "Electronics & Gadgets",
  "Phone Accessories",
  "Beauty & Personal Care",
  "Health & Wellness",
  "Groceries",
  "Home & Kitchen",
  "Stationery & School Supplies",
  "Services (Haircut, Laundry, Repairs)",
  "Sports & Fitness",
  "Art & Crafts",
  "Books & Study Materials",
  "Others",
];
