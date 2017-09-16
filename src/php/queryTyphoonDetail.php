<?php
/**
 * Created by PhpStorm.
 * User: 64538
 * Date: 2017/9/1
 * Time: 16:57
 */

$url = $_REQUEST["url"];
$queryId = $_REQUEST["queryId"];
$res= '';
if($queryId){
//        header("Content-Type:text/html;charset=utf-8");
/*    $ch = curl_init();
    $url = $url."&sno=".$queryId;
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    $res = curl_exec($ch);
*/
    $dir =  $url;
    $res = file_get_contents($dir);


//        $result["res"][$year]= $res;

//        $result["year"][$year]= $year;
//    curl_close($ch);
}
echo $res;