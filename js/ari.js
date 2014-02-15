
function calcRandIndex(c1, c2) {
    var table = buildContingencyTable(c1, c2);
    var n = combination2(c1.length);
    var oo = 0;
    for (var r = 0; r < table.length; r++) {
	for (var c = 0; c < table[r].length; c++) {
	    oo += combination2(table[r][c]);
	}
    }
    var c1c = countValues(c1).map(combination2);
    var ox = -oo;
    for (var i = 0; i < c1c.length; i++) {
	ox += c1c[i];
    }
    var xo = -oo;
    var c2c = countValues(c2).map(combination2);
    for (var i = 0; i < c2c.length; i++) {
	xo += c2c[i];
    }
    var xx = n - oo - ox - xo;

    return (oo + xx) / n;
}

function calcAdjustedRandIndex(c1, c2) {
    var table = buildContingencyTable(c1, c2);
    var n = combination2(c1.length);
    var oo = 0;
    for (var r = 0; r < table.length; r++) {
	for (var c = 0; c < table[r].length; c++) {
	    oo += combination2(table[r][c]);
	}
    }
    var c1o = 0;
    var c1c = countValues(c1).map(combination2);
    for (var i = 0; i < c1c.length; i++) {
	c1o += c1c[i];
    }
    var c2o = 0;
    var c2c = countValues(c2).map(combination2);
    for (var i = 0; i < c2c.length; i++) {
	c2o += c2c[i];
    }

    return (oo * n - c1o * c2o) / ((c1o + c2o) * n / 2 - c1o * c2o);
}

function buildContingencyTable(c1, c2) {
    var rows = Math.max.apply(null, c1) + 1;
    var cols = Math.max.apply(null, c2) + 1;
    var table = new Array(rows);
    for (var r = 0; r < table.length; r++) {
	table[r] = new Array(cols);
	for (var c = 0; c < table[r].length; c++) {
	    table[r][c] = 0;
	}
    }
    for (var d = 0; d < c1.length; d++) {
	table[c1[d]][c2[d]]++;
    }
    return table;
}

function countValues(c) {
    var table = new Array(Math.max.apply(null, c) + 1);
    for (var i = 0; i < table.length; i++) {
	table[i] = 0;
    }
    for (var i = 0; i < c.length; i++) {
	table[c[i]]++;
    }
    return table;
}

function combination2(n) {
    return n * (n - 1) / 2;
}