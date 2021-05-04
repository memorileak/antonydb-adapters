class SearchResponseAdapter {
  adapt(response) {
    return {
      aggregation: this.getAggregationFromResponse(response),
      results: this.getResultsFromResponse(response),
      total: this.getTotalFromResponse(response),
    };
  }

  getAggregationFromResponse(response) {
    try {
      return response.aggregation;
    } catch (err) {
      console.error(err);
      return {};
    }
  }

  getResultsFromResponse(response) {
    try {
      return response.result.hits.map((hit) => ({
        ...hit._source,
        _id: hit._source.Id,
        highlight: hit.highlight,
      }));
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  getTotalFromResponse(response) {
    try {
      return response.result.total.value;
    } catch (err) {
      console.error(err);
      return 0;
    }
  }
}

const searchResponseAdapter = new SearchResponseAdapter();
module.exports = {searchResponseAdapter};
