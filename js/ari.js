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
    var n = combination2(c1.length);
    var oo = d3.sum(countValues2d(c1, c2).values().map(sumOfCombination2));
    var c1o = sumOfCombination2(countValues(c1));
    var c2o = sumOfCombination2(countValues(c2));

    return f(n, oo, c1o, c2o);
}

function countValues(c) {
    return d3.nest()
        .key(function (e) { return e; }).sortKeys(d3.ascending)
        .rollup(function (v) { return v.length; })
        .map(c, d3.map);
}

function countValues2d(c1, c2) {
    return d3.nest()
        .key(function (e) { return e[0]; }).sortKeys(d3.ascending)
        .key(function (e) { return e[1]; }).sortKeys(d3.ascending)
        .rollup(function (v) { return v.length; })
        .map(d3.zip(c1, c2), d3.map);
}

function combination2(n) {
    return n * (n - 1) / 2;
}

function sumOfCombination2(m) {
    return d3.sum(m.values(), combination2);
}
