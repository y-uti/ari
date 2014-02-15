window.addEventListener('load', function () {

    var width = 600;
    var height = 600;

    var svg1 = d3.select(".left").select(".svg-placeholder").append("svg")
	    .attr("width", width)
	    .attr("height", height);
    var svg2 = d3.select(".right").select(".svg-placeholder").append("svg")
	    .attr("width", width)
	    .attr("height", height);

    d3.json("japan.json", function (error, o) {

	function createPath() {
	    var projection = d3.geo.mercator()
		    .center([137, 35.2])
		    .scale(1200)
		    .translate([300, 300]);
	    return d3.geo.path().projection(projection);
	}

	var path = createPath();

	var features = topojson.feature(o, o.objects.japan).features;

	var location = features.map(function (v) { var p = v.properties; return [p.lng, p.lat]; });
	var clusters1 = kmeans(location, K1());
	var clusters2 = kmeans(location, K2());
	var ri = calcRandIndex(clusters1, clusters2);
	var ari = calcAdjustedRandIndex(clusters1, clusters2);
	document.getElementById("ri").innerHTML = "RI = " + ri + ", ARI = " + ari;

	function clusterLeft() {
	    clusters1 = kmeans(location, K1());
	    darker(0, 0);
	    var ri = calcRandIndex(clusters1, clusters2);
	    var ari = calcAdjustedRandIndex(clusters1, clusters2);
	    document.getElementById("ri").innerHTML = "RI = " + ri + ", ARI = " + ari;
	}

	d3.select("#left-cluster").on("click", clusterLeft);

	function clusterRight() {
	    var k = d3.select("#right-k").node().value;
	    clusters2 = kmeans(location, K2());
	    darker(0, 0);
	    var ri = calcRandIndex(clusters1, clusters2);
	    var ari = calcAdjustedRandIndex(clusters1, clusters2);
	    document.getElementById("ri").innerHTML = "RI = " + ri + ", ARI = " + ari;
	}

	d3.select("#right-cluster").on("click", clusterRight);

	function getDisagree(c) {
	    var result = [];
	    for (var i = 0; i < clusters1.length; ++i) {
		var c1 = clusters1[c];
		var i1 = clusters1[i];
		var c2 = clusters2[c];
		var i2 = clusters2[i];
		if ((i1 == c1) != (i2 == c2)) {
		    result.push(i);
		}
	    }
	    return result;
	}

	function K1() {
	    return d3.select("#left-k").node().value;
	}

	function K2() {
	    return d3.select("#right-k").node().value;
	}

	function lightColor(i, k) {
	    return d3.hsl(360 * i / k, 1, 0.75);
	}

	function darkColor(i, k) {
	    return d3.hsl(360 * i / k, 0.125, 0.5);
	}

	function brighter(d, i) {
	    brighter2(i);
	    disagree = getDisagree(i);
	    for (var j = 0; j < disagree.length; ++j) {
		brighter2(disagree[j]);
	    }
	}

	function brighter2(i) {
	    d3.select(".pref1_" + i).attr("fill", lightColor(clusters1[i], K1()));
	    d3.select(".pref2_" + i).attr("fill", lightColor(clusters2[i], K2()));
	}

	function darker(d, i) {
	    for (var j = 0; j < clusters1.length; ++j) {
		d3.select(".pref1_" + j).attr("fill", darkColor(clusters1[j], K1()));
		d3.select(".pref2_" + j).attr("fill", darkColor(clusters2[j], K2()));
	    }
	}

	svg1.selectAll(".japan")
	    .data(features)
	    .enter()
	    .append("path")
	    .attr("class", function(d, i) { return "pref1_" + i; })
	    .attr("stroke", "black")
	    .attr("stroke-width", "0.5")
	    .attr("fill", function(d, i) { return darkColor(clusters1[i], K1()); })
	    .on("mouseover", brighter)
	    .on("mouseout", darker)
	    .attr("d", path);

	svg2.selectAll(".japan")
	    .data(features)
	    .enter()
	    .append("path")
	    .attr("class", function(d, i) { return "pref2_" + i; })
	    .attr("stroke", "black")
	    .attr("stroke-width", "0.5")
	    .attr("fill", function(d, i) { return darkColor(clusters2[i], K2()); })
	    .on("mouseover", brighter)
	    .on("mouseout", darker)
	    .attr("d", path);

    });

}, false);
