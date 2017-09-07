<?php
/**
 * Created by PhpStorm.
 * User: 64538
 * Date: 2017/8/8
 * Time: 15:35
 */

$i=0;
$url = $_REQUEST["url"];
$queryEachYear = $_REQUEST["queryYear"];
$year = $_REQUEST["year"];
$res= '';
if($queryEachYear){
//        header("Content-Type:text/html;charset=utf-8");
//    $ch = curl_init();
//    $url = $url."&year=".$year;
//    curl_setopt($ch, CURLOPT_URL, $url);
//    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//    curl_setopt($ch, CURLOPT_HEADER, 0);
//    $res = curl_exec($ch);
    $dir =  $url;
    $res = file_get_contents($dir);
    $output = json_decode($res, true);

//    curl_close($ch);
}
echo json_encode($output);
