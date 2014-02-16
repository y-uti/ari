window.addEventListener('load', function () {

    var width = 600;
    var height = 600;

    function createSvg(root) {
	return root.select(".svg-placeholder").append("svg")
	    .attr("width", width)
	    .attr("height", height);
    }
    var svg1 = createSvg(d3.select(".left"));
    var svg2 = createSvg(d3.select(".right"));

    function lightColor(i, k) {
	return d3.hsl(360 * i / k, 1, 0.75);
    }

    function darkColor(i, k) {
	return d3.hsl(360 * i / k, 0.125, 0.5);
    }

    function ModelObject(data, k) {
	this.data = data;
	this.k = k;
	this.clusters = kmeans(this.data, this.k);
    }

    ModelObject.prototype.clustering = function (k) {
	this.k = k;
	this.clusters = kmeans(this.data, this.k);
    };

    function ClusterController(view, model, randIndexController) {
	this.view = view;
	this.model = model;
	this.randIndexController = randIndexController;
    }

    ClusterController.prototype.clustering = function () {
	this.model.clustering(this.getK());
	this.resetView();
	this.randIndexController.update();
    };

    ClusterController.prototype.getK = function () {
	return this.view.select(".k-selector").node().value;
    };

    ClusterController.prototype.hilight = function (i) {
	this.view.select(".pref_" + i).attr("fill", lightColor(this.model.clusters[i], this.getK()));
    };

    ClusterController.prototype.resetView = function () {
	for (var i = 0; i < this.model.clusters.length; i++) {
	    this.view.select(".pref_" + i).attr("fill", darkColor(this.model.clusters[i], this.getK()));
	}
    };

    function RandIndexController(view, model1, model2) {
	this.view = view;
	this.model1 = model1;
	this.model2 = model2;
    }

    RandIndexController.prototype.update = function () {
	var randIndex = calcRandIndex(this.model1.clusters, this.model2.clusters);
	var adjustedRandIndex = calcAdjustedRandIndex(this.model1.clusters, this.model2.clusters);
	this.view.text("RI = " + randIndex + ", ARI = " + adjustedRandIndex);
    };

    d3.json("japan.json", function (error, o) {

	var features = topojson.feature(o, o.objects.japan).features;
	var location = features.map(function (v) { var p = v.properties; return [p.lng, p.lat]; });

	var l = new ModelObject(location, 2);
	var r = new ModelObject(location, 2);

	var randIndexController = new RandIndexController(d3.select(".rand-index-placeholder"), l, r);

	var lClusterController = new ClusterController(d3.select(".left"), l, randIndexController);
	var rClusterController = new ClusterController(d3.select(".right"), r, randIndexController);

	function clustering(c) {
	    c.clustering();
	}
	lClusterController.view.select(".clustering").on("click", function () { clustering(lClusterController); });
	rClusterController.view.select(".clustering").on("click", function () { clustering(rClusterController); });

	function getDisagree(c) {
	    return d3.range(l.clusters.length).filter(function (i) {
		return (l.clusters[c] == l.clusters[i]) != (r.clusters[c] == r.clusters[i]);
	    });
	}

	function focus(_, i) {
	    getDisagree(i).concat(i).forEach(function (j) {
		lClusterController.hilight(j);
		rClusterController.hilight(j);
	    });
	}

	function resetView() {
	    lClusterController.resetView();
	    rClusterController.resetView();
	}

	function createPath() {
	    var projection = d3.geo.mercator()
		    .center([137, 35.2])
		    .scale(1200)
		    .translate([300, 300]);
	    return d3.geo.path().projection(projection);
	}
	var path = createPath();

	function buildSvg(svg, c, n) {
	    svg.selectAll(".japan")
		.data(features)
		.enter()
		.append("path")
		.attr("class", function (d, i) { return "pref_" + i; })
		.attr("stroke", "black")
		.attr("stroke-width", "0.5")
		.on("mouseover", focus)
		.on("mouseout", resetView)
		.attr("d", path);
	}
	buildSvg(svg1, lClusterController, 1);
	buildSvg(svg2, rClusterController, 2);

	resetView();
	randIndexController.update();

    });

}, false);
