const ActivityLog = require("../models/activityLog.model");

/**
 * Log an admin activity for audit trail
 * @param {string} actorId - Admin user ID
 * @param {string} action - Action type enum value
 * @param {string} targetType - Target entity type
 * @param {string} targetId - Target entity ID
 * @param {string} details - Human-readable description
 * @param {string} ipAddress - Request IP address
 */
const logActivity = async (
  actorId,
  action,
  targetType,
  targetId,
  details,
  ipAddress
) => {
  try {
    await ActivityLog.create({
      actor: actorId,
      action,
      targetType,
      targetId: String(targetId),
      details,
      ipAddress,
    });
  } catch (err) {
    // Don't let logging failures break the main operation
    console.error("Activity log error:", err.message);
  }
};

module.exports = logActivity;
