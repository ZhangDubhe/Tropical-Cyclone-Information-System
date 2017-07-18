<?php
$host="139.224.8.209";
$db_user="zht";
$db_pass="dubhe19960115zht";
$db_name="typhoon";
$timezone="Asia/Shanghai";

$conn = mysqli_connect($host,$db_user,$db_pass,$db_name);
if (!$conn) {
    die('Could not connect: ' . mysqli_connect_error());
}
mysqli_query($conn, "SET names utf8mb4");

header("Content-Type: text/html; charset=utf-8");
date_default_timezone_set($timezone);

