//
// kmeans.js
//

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
	var centroids = [];
	var count = [];
	for (var i = 0; i < data.length; i++) {
	    var c = clusters[i];
	    if (!centroids[c]) {
		centroids[c] = [0, 0];
		count[c] = 0;
	    }
	    centroids[c] = vectorAdd(centroids[c], data[i]);
	    count[c]++;
	}
	return centroids.map(function (c, i) { return vectorDivScalar(c, count[i]); });
    }

    function vectorDistance(a, b) {
	var acc = 0;
	for (var i = 0; i < a.length; i++) {
	    acc += Math.pow(a[i] - b[i], 2);
	}
	return Math.sqrt(acc);
    }

    function vectorAdd(a, b) {
	var result = [];
	for (var i = 0; i < a.length; i++) {
	    result[i] = a[i] + b[i];
	}
	return result;
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
