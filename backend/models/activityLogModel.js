const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    nullable: true,
    default: null,
  },
  message: String,
  requestMethod: String,
  requestUrl: String,
  requestOrigin: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);