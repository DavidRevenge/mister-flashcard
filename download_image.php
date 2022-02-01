
<?php

$url = $_GET['url'];
echo $_GET['imgName'];
$img = 'img/' . $_GET['imgName'] . '.jpg';

/** Empty img folder */
$files = glob('img/download/*'); // get all file names
foreach ($files as $file) { // iterate files
    if (is_file($file)) {
        unlink($file); // delete file
    }
}

file_put_contents($img, file_get_contents($url));
?>
