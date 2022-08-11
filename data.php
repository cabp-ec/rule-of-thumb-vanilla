<?php

header('Content-Type: application/json');
$path = __DIR__ . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'characters.json';
echo file_get_contents($path);
