<?php
/**
 * Created by PhpStorm.
 * User: 64538
 * Date: 2017/9/5
 * Time: 23:22
 */
$url = "http%3A%2F%2Fwww.readearth.com/publictyphoon/PatrolHandler.ashx/provider%3DReadearth.PublicSrviceGIS.BLL.TyphoonBLL%26assembly%3DReadearth.PublicSrviceGIS.BLL%26method%3DGetTyhoonByYear&queryYear=true&year=";
$initYear = 1981;
for ($i=0;$i<30;$i++){
    $ch = curl_init();
    $year = $initYear + $i;
    $newUrl = $url."&year=".$year;
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    $res = curl_exec($ch);
    $output = json_decode($res, true);
//        $result["res"][$year]= $res;

//        $result["year"][$year]= $year;
    curl_close($ch);
    $fileName = $year.".txt";
    $myFile = fopen($fileName, "w");
    fwrite($myFile, $res);
    echo $year;
}