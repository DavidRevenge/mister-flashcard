
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


if ($_GET['createStickers'] === "true") {

    addWatermark($img, 'img/star-icon.png', '_star');
    addWatermark($img, 'img/calendar-icon.png', '_calendar');

    addCalendarWatermark('img/numbers/1.png', '_1');
    addCalendarWatermark('img/numbers/2.png', '_2');
    addCalendarWatermark('img/numbers/3.png', '_3');
    addCalendarWatermark('img/numbers/4.png', '_4');
    addCalendarWatermark('img/numbers/5.png', '_5');
    addCalendarWatermark('img/numbers/6.png', '_6');
    addCalendarWatermark('img/numbers/7.png', '_7');
    addCalendarWatermark('img/numbers/8.png', '_8');
    addCalendarWatermark('img/numbers/9.png', '_9');
    addWatermark_10();
    addWatermark_11();
    addWatermark_12();
}


function addWatermark_10() {

    global $img;
    global $ext;
    global $downloadFolder;

    addWatermark($img, 'img/numbers/0.png', '_10');
    addWatermark($downloadFolder . $_GET['imgName'] . '_10' . $ext, 'img/numbers/1.png', '_10', 300);
    addWatermark($downloadFolder . $_GET['imgName'] . '_10' . $ext, 'img/calendar-icon.png', '_10', 600);
}
function addWatermark_11() {

    global $img;
    global $ext;
    global $downloadFolder;

    addWatermark($img, 'img/numbers/1.png', '_11');
    addWatermark($downloadFolder . $_GET['imgName'] . '_11' . $ext, 'img/numbers/1.png', '_11', 300);
    addWatermark($downloadFolder . $_GET['imgName'] . '_11' . $ext, 'img/calendar-icon.png', '_11', 600);
}
function addWatermark_12() {

    global $img;
    global $ext;
    global $downloadFolder;

    addWatermark($img, 'img/numbers/2.png', '_12');
    addWatermark($downloadFolder . $_GET['imgName'] . '_12' . $ext, 'img/numbers/1.png', '_12', 300);
    addWatermark($downloadFolder . $_GET['imgName'] . '_12' . $ext, 'img/calendar-icon.png', '_12', 600);
}

function addCalendarWatermark($url, $suffix) {

    global $img;
    global $ext;
    global $downloadFolder;

    addWatermark($img, $url, $suffix);
    addWatermark($downloadFolder . $_GET['imgName'] . $suffix . $ext, 'img/calendar-icon.png', $suffix, 300);
}

function addWatermark($url, $icon, $suffix = '', $margin_right_extra = 0)
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
    imagecopy($im, $stamp, imagesx($im) - $sx - $marge_right - $margin_right_extra, 0 + $marge_bottom, 0, 0, imagesx($stamp), imagesy($stamp));


// Output and free memory
    // header('Content-type: image/png');
     imagejpeg($im, $downloadFolder . $_GET['imgName'].$suffix.$ext);
}