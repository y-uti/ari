<?php

require_once str_replace('_test', '', __FILE__);

function generate_data($mx, $my, $n)
{
    return array_map(
        function () use ($mx, $my) { return array(
            $mx + lcg_value() - 0.5, $my + lcg_value() - 0.5); },
        range(1, $n));
}

$data = array_merge(
    generate_data(0.0, 0.0, 100),
    generate_data(1.0, 0.0, 100),
    generate_data(0.5, 1.0, 100)
);
shuffle($data);

$clusters = kmeans($data, 3);

print_r(vector_mean($data));
print_r(update_centroids($data, $clusters));
