<?php

require_once (dirname(__FILE__) . '/../rand_index.php');

$c1 = array();
$c2 = array();
foreach (file('php://stdin', FILE_IGNORE_NEW_LINES) as $l) {
    list ($k1, $k2) = explode(',', $l);
    $c1[] = $k1;
    $c2[] = $k2;
}

$ri = calc_rand_index($c1, $c2);
$ari = calc_adjusted_rand_index($c1, $c2);

echo "$ri,$ari";
