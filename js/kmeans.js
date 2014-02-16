function kmeans(data, k) {

    function initializeCentroids(data, k) {
        return d3.permute(data, d3.shuffle(d3.range(data.length))).slice(0, k);
    }

    function assignClusters(data, centroids) {
        return data.map(function (d) { return nearestCentroidIndex(d, centroids); });
    }

    function nearestCentroidIndex(coord, centroids) {
        return argmin(centroids.map(function (c) { return vectorDistance(c, coord); }));
    }

    function updateCentroids(data, clusters) {
        var h = d3.zip(data, clusters).map(function (v) { return { cluster: v[1], data: v[0] }; });
        return d3.nest()
            .key(function (e) { return e.cluster; }).sortKeys(d3.ascending)
            .entries(h)
            .map(function (e) { return e.values.map(function (v) { return v.data; }); })
            .map(function (e) { return vectorMean(e); });
    }

    function vectorDistance(a, b) {
        return Math.sqrt(d3.sum(d3.zip(a, b), function (v) { return Math.pow(v[0] - v[1], 2); }));
    }

    function vectorMean(v) {
        return vectorDivScalar(vectorSum(v), v.length);
    }

    function vectorSum(v) {
        return v.reduce(vectorAdd, v[0].map(function () { return 0; }));
    }

    function vectorAdd(a, b) {
        return d3.zip(a, b).map(function (v) { return v[0] + v[1]; });
    }

    function vectorDivScalar(v, n) {
        return v.map(function (vi) { return vi / n; });
    }

    function argmin(array) {
        return array.indexOf(Math.min.apply(null, array));
    }

    function areEqual(c1, c2) {
        return c1.length == c2.length && d3.zip(c1, c2).every(function (v) { return v[0] == v[1]; });
    }

    var centroids = initializeCentroids(data, k);
    var clusters = [];
    var next = [];
    while (! areEqual(next = assignClusters(data, centroids), clusters)) {
        clusters = next;
        centroids = updateCentroids(data, clusters);
    }

    return clusters;
}
