const {objUtil} = require('../utils/obj-util.js');

class ReportResponseAdapter {
  adapt(response) {
    return this.getReportDataFromResponse(response);
  }

  getReportDataFromResponse(response) {
    try {
      const reportData = response.hits[0]._source;
      this.forceOsUsersToBeString(reportData);
      this.highlightMalwareRisks(reportData);
      this.sortRisksByHighlight(reportData);
      this.forceEntryAvToBeList(reportData);
      return reportData;
    } catch (err) {
      console.error(err);
      return {};
    }
  }

  forceOsUsersToBeString(reportData) {
    const users = objUtil.path(['os', 'users'])(reportData) || [];
    reportData.os.users = Array.isArray(users)
      ? users.join(', ')
      : users;
  }

  highlightMalwareRisks(reportData) {
    reportData.risks = reportData.risks || [];
    reportData.risks.forEach((risk) => {
      risk.highlight = (risk.name === 'Mã độc');
    });
  }

  sortRisksByHighlight(reportData) {
    reportData.risks = reportData.risks || [];
    reportData.risks.sort((a, b) => b.highlight - a.highlight);
  }

  forceEntryAvToBeList(reportData) {
    reportData.risks = reportData.risks || [];
    reportData.risks.forEach((risk) => {
      risk.entries = risk.entries || [];
      risk.entries.forEach((entry) => {
        if (typeof entry.av === 'string') {
          entry.av = entry.av.split('|').filter((av) => av);
        }
      });
    });
  }
}

const reportResponseAdapter = new ReportResponseAdapter();
module.exports = {reportResponseAdapter};
