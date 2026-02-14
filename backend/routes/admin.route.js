const express = require("express");
const router = express.Router();

// Controllers
const { getStats } = require("../controllers/admin/dashboard.controller");
const {
  getVendors,
  getVendorDetail,
  updateVendorStatus,
  updateVendorKyc,
  updateVendorSubscription,
} = require("../controllers/admin/vendorManagement.controller");
const {
  getOrders,
  getOrderDetail,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/admin/orderManagement.controller");
const {
  getUsers,
  getUserDetail,
  toggleBanUser,
  changeUserRole,
} = require("../controllers/admin/userManagement.controller");
const {
  getSubscriptions,
  getSubscriptionStats,
  activateSubscription,
  cancelSubscription,
} = require("../controllers/admin/subscriptionManagement.controller");
const {
  getTransactions,
  getTransactionStats,
  getTransactionDetail,
} = require("../controllers/admin/paymentManagement.controller");
const {
  getSignupAnalytics,
  getOrderAnalytics,
  getTopVendors,
  getRevenueAnalytics,
} = require("../controllers/admin/analytics.controller");
const { getActivityLogs } = require("../controllers/admin/activityLog.controller");

// ─── Dashboard ──────────────────────────────────────────
router.get("/stats", getStats);

// ─── Vendor Management ──────────────────────────────────
router.get("/vendors", getVendors);
router.get("/vendors/:id", getVendorDetail);
router.patch("/vendors/:id/status", updateVendorStatus);
router.patch("/vendors/:id/kyc", updateVendorKyc);
router.patch("/vendors/:id/subscription", updateVendorSubscription);

// ─── Order Management ───────────────────────────────────
router.get("/orders", getOrders);
router.get("/orders/:id", getOrderDetail);
router.patch("/orders/:id/status", updateOrderStatus);
router.patch("/orders/:id/cancel", cancelOrder);

// ─── User Management ────────────────────────────────────
router.get("/users", getUsers);
router.get("/users/:id", getUserDetail);
router.patch("/users/:id/ban", toggleBanUser);
router.patch("/users/:id/role", changeUserRole);

// ─── Subscription Management ────────────────────────────
router.get("/subscriptions", getSubscriptions);
router.get("/subscriptions/stats", getSubscriptionStats);
router.patch("/subscriptions/:id/activate", activateSubscription);
router.patch("/subscriptions/:id/cancel", cancelSubscription);

// ─── Payment / Transaction ──────────────────────────────
router.get("/transactions", getTransactions);
router.get("/transactions/stats", getTransactionStats);
router.get("/transactions/:id", getTransactionDetail);

// ─── Analytics ──────────────────────────────────────────
router.get("/analytics/signups", getSignupAnalytics);
router.get("/analytics/orders", getOrderAnalytics);
router.get("/analytics/top-vendors", getTopVendors);
router.get("/analytics/revenue", getRevenueAnalytics);

// ─── Activity Logs ──────────────────────────────────────
router.get("/activity-logs", getActivityLogs);

module.exports = router;
