<?php

$_POST = json_decode(file_get_contents('php://input'), true);
$index = $_POST['index'];
$vote = $_POST['vote'];

$path = __DIR__ . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'characters.json';
$data = json_decode(file_get_contents($path), true)['data'];

if (0 < $vote) {
    $data[$index]['votes']['positive'] += $vote;
}
else if (0 > $vote) {
    $data[$index]['votes']['negative'] += $vote;
}

file_put_contents($path, json_encode(['data' => $data]));
