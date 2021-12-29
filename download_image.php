
<?php 

    $url = $_GET['url']; echo $_GET['imgName'];
    $img = 'img/'.$_GET['imgName'].'.jpg';
    file_put_contents($img, file_get_contents($url));
?>
