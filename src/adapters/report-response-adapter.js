class ReportResponseAdapter {
  adapt(response) {
    return this.getReportDataFromResonse(response);
  }

  getReportDataFromResonse(response) {
    return response.hits[0]._source;
  }
}

const reportResponseAdapter = new ReportResponseAdapter();
module.exports = {reportResponseAdapter};
