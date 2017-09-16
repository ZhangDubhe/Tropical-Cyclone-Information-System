<?php
/**
 * Created by PhpStorm.
 * User: 64538
 * Date: 2017/9/10
 * Time: 1:16
 */
$url = $_REQUEST["url"];
$queryYear = $_REQUEST["queryYear"];
$year = $_REQUEST["year"];
$res= '';
if($queryYear) {
    $res = file_get_contents($url);
    echo json_encode($res);
}