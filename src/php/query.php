<?php
/**
 * Created by PhpStorm.
 * User: 64538
 * Date: 2017/5/31
 * Time: 16:48
 */
include_once("connect.php");
if($_REQUEST['draw'] === 'yearFrequence'){
    $sql = "SELECT year,count(*) count FROM TYPHOON.headers GROUP BY year";
    $result = mysqli_query($conn,$sql);
    if($result){
        $i = 0;
        $year = [];
        $count = [];
        $length = mysqli_num_rows($result);
        while($row = mysqli_fetch_array($result)){
            $year[$i] = $row['year'];
            $count[$i] = $row['count'];
            $i ++;
        }
        $response['year'] = $year;
        $response['count'] = $count;
        $response['length'] = $length;
    }
}
echo json_encode($response);