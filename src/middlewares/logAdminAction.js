const AdminLog = require('../models/AdminLog');

function logAdminAction(actionType, targetType) {
  return async (req, res, next) => {
    try {
      if (!req.admin || !req.admin._id) {
        return res.status(400).json({ message: 'Admin bilgisi eksik!' });
      }

      const log = new AdminLog({
        admin_id: req.admin._id,
        action_type: actionType,
        target_type: targetType,
        target_id: req.params.id || req.body.id || null,
      });

      await log.save();
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = logAdminAction;
