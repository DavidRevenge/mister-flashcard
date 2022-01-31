<?php

$src = $_GET['src'];

$b64image = base64_encode(file_get_contents($src));

//Print out the contents.
echo $b64image;
