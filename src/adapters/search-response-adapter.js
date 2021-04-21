class SearchResponseAdapter {
  adapt(response) {
    return {
      aggregation: this.getAggregationFromResponse(response),
      results: this.getResultsFromResponse(response),
      total: this.getTotalFromResponse(response),
    };
  }

  getAggregationFromResponse(response) {
    return response.aggregation;
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
    return response.result.total.value;
  }
}

const searchResponseAdapter = new SearchResponseAdapter();
module.exports = {searchResponseAdapter};
