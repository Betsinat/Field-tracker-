const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    clientReportId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Broken Water Point',
        'Damaged Equipment',
        'Service Interruption',
        'Safety Concern',
        'Maintenance Requirement',
      ],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Draft', 'Submitted', 'Assigned', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Draft',
    },
    reportedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Report || mongoose.model('Report', reportSchema);
