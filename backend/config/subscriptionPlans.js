module.exports = {
  boost: {
    name: "Vendly Boost",
    slug: "vendly-boost",
    price: 750,
    limits: {
      productsPerPost: 6,
      postPerDay: 5,
    },
    features: {
      priorityFeed: true,
      boostedBadge: true,
      increasedImpressions: true,
      priorityLocationSearch: true,
    },
  },
  pro: {
    name: "Vendly Pro",
    slug: "vendly-pro",
    price: 1500,
    limits: {
      productsPerPost: 8,
      postPerDay: 5,
    },
    features: {
      priorityFeed: true,
      boostedBadge: true,
      increasedImpressions: true,
      priorityLocationSearch: true,
      customBranding: false,
      performanceInsights: true,
      pinPost: true,
    },
  },
  max: {
    name: "Vendly Max",
    slug: "vendly-max",
    price: 3000,
    limits: {
      productsPerPost: 10,
      postPerDay: 20,
    },
    features: {
      priorityFeed: true,
      boostedBadge: true,
      increasedImpressions: true,
      priorityLocationSearch: true,
      customBranding: true,
      performanceInsights: true,
      pinPost: true,
      advancedAnalytics: true,
      prioritySupport: true,
      postScheduling: true,
      verifiedBadge: true,
      profileSuggestion: true,
    },
  },
};
