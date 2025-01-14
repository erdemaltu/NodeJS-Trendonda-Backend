const mongoose = require('mongoose');

const AdminLogSchema = new mongoose.Schema({
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  action_type: { type: String, required: true, enum: ['create', 'update', 'delete'] },
  target_type: { type: String, required: true },
  target_id: { type: mongoose.Schema.Types.ObjectId },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AdminLog', AdminLogSchema);