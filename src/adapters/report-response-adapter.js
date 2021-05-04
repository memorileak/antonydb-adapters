class ReportResponseAdapter {
  adapt(response) {
    return this.getReportDataFromResonse(response);
  }

  getReportDataFromResonse(response) {
    try {
      return response.hits[0]._source;
    } catch (err) {
      console.error(err);
      return {};
    }
  }
}

const reportResponseAdapter = new ReportResponseAdapter();
module.exports = {reportResponseAdapter};
