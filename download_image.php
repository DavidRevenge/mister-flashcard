
<?php

$downloadFolder = 'img/download/';

$url = $_GET['url'];
echo $_GET['imgName'];
$ext = '.jpg';
$img = $downloadFolder . $_GET['imgName'] . $ext;

/** Empty img folder */
$files = glob($downloadFolder . '*'); // get all file names
foreach ($files as $file) { // iterate files
    if (is_file($file)) {
        unlink($file); // delete file
    }
}

file_put_contents($img, file_get_contents($url));

addWatermark($img, 'img/star-icon.png', '_star');
addWatermark($img, 'img/calendar-icon.png', '_calendar');
addWatermark($img, 'img/numbers/1.png', '_1');
addWatermark($img, 'img/numbers/2.png', '_2');
addWatermark($img, 'img/numbers/3.png', '_3');
addWatermark($img, 'img/numbers/4.png', '_4');
addWatermark($img, 'img/numbers/5.png', '_5');
addWatermark($img, 'img/numbers/6.png', '_6');
addWatermark($img, 'img/numbers/7.png', '_7');
addWatermark($img, 'img/numbers/8.png', '_8');
addWatermark($img, 'img/numbers/9.png', '_9');

//addWatermark();



function addWatermark($url, $icon, $prefix = '')
{
    global $ext;
    global $downloadFolder;
    // Load the stamp and the photo to apply the watermark to
    $stamp = imagecreatefrompng($icon);
    $im = imagecreatefromjpeg($url);

// Set the margins for the stamp and get the height/width of the stamp image
    $marge_right = 10;
    $marge_bottom = 10;
    $sx = imagesx($stamp);
    $sy = imagesy($stamp);

// Copy the stamp image onto our photo using the margin offsets and the photo
    // width to calculate positioning of the stamp.
    imagecopy($im, $stamp, imagesx($im) - $sx - $marge_right, 0 + $marge_bottom, 0, 0, imagesx($stamp), imagesy($stamp));


// Output and free memory
    // header('Content-type: image/png');
     imagejpeg($im, $downloadFolder . $_GET['imgName'].$prefix.$ext);
}