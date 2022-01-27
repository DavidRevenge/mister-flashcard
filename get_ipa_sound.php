<?php

xdebug_break();

$url = empty($_GET['url']) ? 'language' : $_GET['url'];

$url = urlencode($url); /**/

if (isset($_GET['otherWebsite'])) { 
    //The URL with parameters / query string.
    $url = 'https://www.oxfordlearnersdictionaries.com/definition/english/'.$url;

} else {

    $url = 'https://en.wiktionary.org/'.$url;
}



$curl_handle = curl_init();
curl_setopt($curl_handle, CURLOPT_URL, $url);
curl_setopt($curl_handle, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($curl_handle, CURLOPT_CONNECTTIMEOUT, 2);
curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curl_handle, CURLOPT_USERAGENT, 'github_com_DavidRevenge_mister-flashcard');
$query = curl_exec($curl_handle);
curl_close($curl_handle);

//Print out the contents.
echo $query;
