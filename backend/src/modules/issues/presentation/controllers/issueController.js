const Report = require('../../infrastructure/models/Report');

const validStatuses = new Set([
  'Draft',
  'Submitted',
  'Assigned',
  'In Progress',
  'Resolved',
  'Rejected',
]);

const allowedTransitions = {
  Draft: ['Submitted'],
  Submitted: ['Assigned'],
  Assigned: ['In Progress'],
  'In Progress': ['Resolved', 'Rejected'],
  Resolved: [],
  Rejected: [],
};

const failedResult = (clientReportId, reason) => ({
  clientReportId,
  result: 'Failed',
  reason,
});

const getFailureReason = (error) => {
  if (error.name === 'ValidationError') {
    return error.message;
  }

  if (error.code === 11000) {
    return 'A report with this clientReportId already exists. Retry synchronization.';
  }

  return 'An unexpected server error prevented synchronization.';
};

const syncReports = async (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({
      message: 'Request body must be an array of reports.',
    });
  }

  try {
    const results = [];

    for (const report of req.body) {
      const clientReportId =
        report && typeof report.clientReportId === 'string'
          ? report.clientReportId
          : null;

      if (!report || typeof report !== 'object' || Array.isArray(report)) {
        results.push(failedResult(clientReportId, 'Each report must be an object.'));
        continue;
      }

      if (typeof report.clientReportId !== 'string' || !report.clientReportId.trim()) {
        results.push(
          failedResult(clientReportId, 'clientReportId is required and must be a non-empty string.')
        );
        continue;
      }

      try {
        const existingReport = await Report.findOne({
          clientReportId: report.clientReportId,
        });

        if (!existingReport) {
          await Report.create({
            clientReportId: report.clientReportId,
            category: report.category,
            description: report.description,
            location: report.location,
            priority: report.priority,
            status: report.status,
            reportedAt: report.reportedAt,
          });

          results.push({
            clientReportId: report.clientReportId,
            result: 'Synchronized',
          });
          continue;
        }

        if (typeof report.status !== 'string' || !report.status.trim()) {
          results.push(
            failedResult(
              report.clientReportId,
              'status is required when synchronizing an existing report.'
            )
          );
          continue;
        }

        if (!validStatuses.has(report.status)) {
          results.push(
            failedResult(report.clientReportId, `Invalid status "${report.status}".`)
          );
          continue;
        }

        if (report.status === existingReport.status) {
          results.push({
            clientReportId: report.clientReportId,
            result: 'Synchronized',
          });
          continue;
        }

        if (!allowedTransitions[existingReport.status]?.includes(report.status)) {
          results.push(
            failedResult(
              report.clientReportId,
              `Invalid status transition from "${existingReport.status}" to "${report.status}".`
            )
          );
          continue;
        }

        const updatedReport = await Report.findOneAndUpdate(
          {
            clientReportId: report.clientReportId,
            status: existingReport.status,
          },
          { $set: { status: report.status } },
          { new: true, runValidators: true }
        );

        if (!updatedReport) {
          results.push(
            failedResult(
              report.clientReportId,
              'The report status changed during synchronization. Retry the update.'
            )
          );
          continue;
        }

        results.push({
          clientReportId: report.clientReportId,
          result: 'Synchronized',
        });
      } catch (error) {
        if (error.name !== 'ValidationError' && error.code !== 11000) {
          console.error('Report synchronization failed:', error);
        }

        results.push(failedResult(report.clientReportId, getFailureReason(error)));
      }
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error('Batch report synchronization failed:', error);
    return res.status(500).json({
      message: 'Failed to synchronize reports.',
    });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ reportedAt: -1 });
    return res.status(200).json(reports);
  } catch (error) {
    console.error('Failed to fetch reports:', error);
    return res.status(500).json({
      message: 'Failed to fetch reports.',
    });
  }
};

module.exports = {
  syncReports,
  getReports,
};
