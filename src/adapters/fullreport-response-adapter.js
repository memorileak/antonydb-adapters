class FullreportResponseAdapter {
  adapt(response) {
    return this.getReportDataFromResponse(response);
  }

  getReportDataFromResponse(response) {
    try {
      const reportData = response.hits[0]._source;
      this.forceEntryAvToBeString(reportData);
      return reportData;
    } catch (err) {
      console.error(err);
      return {};
    }
  }

  forceEntryAvToBeString(reportData) {
    reportData.risks = reportData.risks || [];
    reportData.risks.forEach((risk) => {
      risk.entries = risk.entries || [];
      risk.entries.forEach((entry) => {
        if (Array.isArray(entry.av)) {
          entry.av = entry.av.join(', ');
        }
      });
    });
  }
}

const fullreportResponseAdapter = new FullreportResponseAdapter();
module.exports = {fullreportResponseAdapter};
