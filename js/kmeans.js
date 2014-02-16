function kmeans(data, k) {

    function initializeCentroids(data, k) {
	var index = data.map(function (v, i) { return i; });
	return d3.shuffle(index).slice(0, k).map(function (i) { return data[i]; });
    }

    function assignClusters(data, centroids) {
	return data.map(function (d) { return nearestCentroidIndex(d, centroids); });
    }

    function nearestCentroidIndex(coord, centroids) {
	return argmin(centroids.map(function (c) { return vectorDistance(c, coord); }));
    }

    function updateCentroids(data, clusters) {
	var centroids = new Array(d3.max(clusters) + 1);
	var hash = d3.zip(data, clusters).map(function (v) { return { cluster: v[1], data: v[0] }; });
	var dataByCluster = d3.nest()
		.key(function (h) { return h.cluster; })
		.entries(hash);
	dataByCluster.forEach(function (h) {
	    var data = h.values.map(function (v) { return v.data; });
	    centroids[h.key] = vectorDivScalar(vectorSum(data), data.length);
	});

	return centroids;
    }

    function vectorDistance(a, b) {
	return Math.sqrt(
	    d3.zip(a, b).reduce(function (acc, v) { return acc + Math.pow(v[0] - v[1], 2); }, 0));
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

    var clusters = data.map(function (v) { return Math.floor(Math.random() * k); });
    var centroids = initializeCentroids(data, k);

    var next = null;
    while ((next = assignClusters(data, centroids)).toString() != clusters.toString()) {
	clusters = next;
	centroids = updateCentroids(data, clusters);
    }

    return clusters;
}
