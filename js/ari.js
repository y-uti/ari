function calcRandIndex(c1, c2) {
    return calculate(c1, c2, function (n, oo, c1o, c2o) {
	return (n + 2 * oo - c1o - c2o) / n;
    });
}

function calcAdjustedRandIndex(c1, c2) {
    return calculate(c1, c2, function (n, oo, c1o, c2o) {
	return (oo * n - c1o * c2o) / ((c1o + c2o) * n / 2 - c1o * c2o);
    });
}

function calculate(c1, c2, f) {
    var table = buildContingencyTable(c1, c2);
    var n = combination2(c1.length);
    var oo = d3.sum(d3.merge(table).map(combination2));
    var c1o = d3.sum(countValues(c1).map(combination2));
    var c2o = d3.sum(countValues(c2).map(combination2));

    return f(n, oo, c1o, c2o);
}

function buildContingencyTable(c1, c2) {
    var table = buildMatrix(d3.max(c1) + 1, d3.max(c2) + 1);
    d3.zip(c1, c2).forEach(function (v) { table[v[0]][v[1]]++; });

    return table;
}

function buildMatrix(r, c) {
    return d3.range(r).map(function () { return d3.range(c).map(function () { return 0; }); });
}

function countValues(c) {
    var result = d3.range(d3.max(c) + 1).map(function () { return 0; });
    c.forEach(function (i) { result[i]++; });

    return result;
}

function combination2(n) {
    return n * (n - 1) / 2;
}
