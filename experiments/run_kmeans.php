<?php

require (dirname(__FILE__) . '/../kmeans.php');

if ($argc < 3) {
    fprintf(STDERR, "Usage: php $argv[0] csvfile k [trials]\n");
    exit;
}

$file = $argv[1];
$k = $argv[2];
$trials = isset($argv[3]) ? $argv[3] : 10;

$data = array_map(
    function ($l) { return array_slice(explode(',', $l), 1); },
    file($file, FILE_IGNORE_NEW_LINES));

$clusters = array_fill(0, count($data), array_fill(0, count($trials), 0));
for ($i = 0; $i < $trials; ++$i) {
    array_walk(
        kmeans($data, $k),
        function ($c, $n) use ($i, &$clusters) { $clusters[$n][$i] = $c + 1; });
}

array_walk($clusters, function ($l) { fputcsv(STDOUT, $l); });
