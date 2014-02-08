<?php

function calc_rand_index(array $c1, array $c2)
{
    $table = build_contingency_table($c1, $c2);

    $n = combination2(count($c1));
    $oo = sum_of_combination2($table);
    $ox = sum_of_combination2(array_count_values($c1)) - $oo;
    $xo = sum_of_combination2(array_count_values($c2)) - $oo;
    $xx = $n - $oo - $ox - $xo;

    return ($oo + $xx) / $n;
}

function calc_adjusted_rand_index(array $c1, array $c2)
{
    $table = build_contingency_table($c1, $c2);

    $n = combination2(count($c1));
    $oo = sum_of_combination2($table);
    $c1o = sum_of_combination2(array_count_values($c1));
    $c2o = sum_of_combination2(array_count_values($c2));

    return ($oo * $n - $c1o * $c2o) / (($c1o + $c2o) * $n / 2 - $c1o * $c2o);
}

function build_contingency_table(array $c1, array $c2)
{
    $k1 = array_unique($c1);
    $k2 = array_unique($c2);
    $t = build_2d_array($k1, $k2, 0);
    array_map(function ($k1, $k2) use (&$t) { ++$t[$k1][$k2]; }, $c1, $c2);

    return $t;
}

function build_2d_array(array $k1, array $k2, $val)
{
    return array_fill_keys($k1, array_fill_keys($k2, $val));
}

function combination2($n)
{
    return $n * ($n - 1) / 2;
}

function sum_of_combination2(array $a)
{
    $acc = 0;
    array_walk_recursive(
        $a, function ($n) use (&$acc) { $acc += combination2($n); });

    return $acc;
}
