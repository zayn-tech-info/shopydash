module.exports = {
  free: {
    name: "Free",
    slug: "free",
    price: 0,
    limits: {
      productsPerPost: 4,
    },
    features: {
      priorityFeed: false,
      badge: null,
      analytics: ["views"],
      messaging: false,
      featuredProducts: false,
      homepageSpotlight: false,
    },
  },
  boost: {
    name: "Shopydash Boost",
    slug: "shopydash-boost",
    price: 750,
    limits: {
      productsPerPost: 50,
    },
    features: {
      priorityFeed: true,
      badge: "Boosted Vendor",
      increasedImpressions: true,
      priorityLocationSearch: true,
      analytics: ["views", "messages_initiated"],
      messaging: false,
      featuredProducts: false,
      homepageSpotlight: false,
    },
  },
  pro: {
    name: "Shopydash Pro",
    slug: "shopydash-pro",
    price: 1500,
    limits: {
      productsPerPost: 50,
    },
    features: {
      priorityFeed: true,
      badge: "Orange",
      analytics: ["views", "saves", "clicks"],
      messaging: true,
      featuredProducts: true,
      homepageSpotlight: false,
      customBranding: true,
      pinPost: true,
    },
  },
  max: {
    name: "Shopydash Max",
    slug: "shopydash-max",
    price: 3000,
    limits: {
      productsPerPost: 50,
    },
    features: {
      priorityFeed: true,
      badge: "Verification Badge",
      analytics: ["views", "saves", "messages", "conversion"],
      messaging: true,
      featuredProducts: true,
      homepageSpotlight: true,
      advancedAnalytics: true,
      prioritySupport: true,
      postScheduling: true,
      profileSuggestion: true,
    },
  },
};
