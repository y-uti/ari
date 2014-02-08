<?php

function kmeans($data, $k)
{
    $clusters = false;
    $centroids = initialize_centroids($data, $k);

    while (($next = assign_clusters($data, $centroids)) !== $clusters) {
        $clusters = $next;
        $centroids = update_centroids($data, $clusters);
    }

    return $clusters;
}

function initialize_centroids($data, $k)
{
    shuffle($data);
    return array_slice($data, 0, $k);
}

function assign_clusters($data, $centroids)
{
    $clusters = array_map(
        function ($d) use ($centroids) {
            return nearest_centroid_index($d, $centroids); },
        $data);

    return $clusters;
}

function nearest_centroid_index($d, $centroids)
{
    $distances = array_map(
        function ($c) use ($d) { return vector_distance($c, $d); },
        $centroids);

    return argmin($distances);
}

function update_centroids($data, $clusters)
{
    $centroids = array_map(
        'vector_mean', split_data_by_cluster($data, $clusters));

    return $centroids;
}

function split_data_by_cluster($data, $clusters)
{
    $result = array_fill_keys(range(0, max($clusters)), array());
    array_map(
        function ($d, $c) use (&$result) { $result[$c][] = $d; },
        $data,
        $clusters);

    return $result;
}

function vector_distance($a, $b)
{
    return sqrt(array_sum(array_map(
        function ($ai, $bi) { return pow($ai - $bi, 2); }, $a, $b)));
}

function vector_add($a, $b)
{
    return array_map(function ($ai, $bi) { return $ai + $bi; }, $a, $b);
}

function vector_div_scalar($v, $n)
{
    return array_map(function ($vi) use ($n) { return $vi / $n; }, $v);
}

function vector_mean($vectors)
{
    if (($n = count($vectors)) > 0) {
        $initial = array_shift($vectors);
        return vector_div_scalar(
            array_reduce($vectors, 'vector_add', $initial), $n);
    }

    return false;
}

function argmin($array)
{
    return array_search(min($array), $array);
}
