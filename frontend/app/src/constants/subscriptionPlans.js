export const SUBSCRIPTION_PLANS = {
  boost: {
    name: "Vendly Boost",
    slug: "vendly-boost",
    price: 750,
    limits: {
      productsPerPost: 6,
      postPerDay: 5,
    },
    features: [
      "Posts appear higher on students' feeds",
      '"Boosted Vendor" badge on profile',
      "2x more impressions from buyers",
      "Priority in location-based search results",
    ],
    highlight: false,
  },
  pro: {
    name: "Vendly Pro",
    slug: "vendly-pro",
    price: 1500,
    limits: {
      productsPerPost: 8,
      postPerDay: 5,
    },
    features: [
      "All in Vendly Boost",
      "Custom storefront banner & brand colors",
      "Ability to upload more product photos per item limit (10)",
      "Product performance insights (views, saves, clicks)",
      "Option to pin one post to the top of their store",
    ],
    highlight: true,
  },
  max: {
    name: "Vendly Max",
    slug: "vendly-max",
    price: 3000,
    limits: {
      productsPerPost: 10,
      postPerDay: 20,
    },
    features: [
      "All in Vendly Pro",
      "Higher product upload limit ( 20 )",
      "Advanced analytics Dashboards",
      "Priority Support",
      "Post scheduling",
      "Vendor Verification Badge",
      "Your profile will be suggested to all users",
    ],
    highlight: false,
  },
};
