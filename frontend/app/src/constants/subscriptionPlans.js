export const SUBSCRIPTION_PLANS = {
  boost: {
    name: "Shopydash Boost",
    slug: "shopydash-boost",
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
    name: "Shopydash Pro",
    slug: "shopydash-pro",
    price: 1500,
    limits: {
      productsPerPost: 8,
      postPerDay: 5,
    },
    features: [
      "All in Shopydash Boost",
      "Custom storefront banner & brand colors",
      "Ability to upload more product photos per item limit (10)",
      "Product performance insights (views, saves, clicks)",
      "Option to pin one post to the top of their store",
    ],
    highlight: true,
  },
  max: {
    name: "Shopydash Max",
    slug: "shopydash-max",
    price: 3000,
    limits: {
      productsPerPost: 10,
      postPerDay: 20,
    },
    features: [
      "All in Shopydash Pro",
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
