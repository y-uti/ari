<?php

require_once str_replace('_test', '', __FILE__);

$c1 = array(1, 1, 1, 2, 2, 3, 3, 3);
$c2 = array(3, 3, 3, 1, 1, 2, 2, 2);

echo "RI = " . calc_rand_index($c1, $c2) . "\n";
echo "ARI = " . calc_adjusted_rand_index($c1, $c2) . "\n";

$c1 = array(1, 1, 1, 1, 1, 1, 1, 1);
$c2 = array(1, 2, 3, 4, 5, 6, 7, 8);

echo "RI = " . calc_rand_index($c1, $c2) . "\n";
echo "ARI = " . calc_adjusted_rand_index($c1, $c2) . "\n";

$c1 = array_map(function() { return rand() % 10; }, range(1, 1000));
$c2 = array_map(function() { return rand() % 10; }, range(1, 1000));

echo "RI = " . calc_rand_index($c1, $c2) . "\n";
echo "ARI = " . calc_adjusted_rand_index($c1, $c2) . "\n";
