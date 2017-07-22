<?php
/**
 * Created by PhpStorm.
 * User: ZhangDubhe
 * Date: 2017/7/17
 * Time: 23:20
 */
// 更改年月日格式
function changeDayFormat($img_array){
    $new_array = [];
    for($i = 0;$i<=count($img_array);$i++){
        $text = $img_array[$i];
        if(strlen($text) !== 12){
            $new_array[$i] = $text;
            continue;
        }
        $year = substr($text,0,4);
        $month = substr($text,4,2);
        $day = substr($text,6,2);
        $hour = substr($text,8,2);
        $min = substr($text,10,2);
        $new_array[$i] = $year."-".$month."-".$day;
    }
    return $new_array;
}
// 更改年月日时分格式
function changeImgName( $img_array){
    $new_array = [];
    for($i = 0;$i<=count($img_array);$i++){
        $text = substr($img_array[$i],0,strrpos($img_array[$i],'.'));
        if(strlen($text) !== 12){
            $new_array[$i] = $text;
            continue;
        }
        $year = substr($text,0,4);
        $month = substr($text,4,2);
        $day = substr($text,6,2);
        $hour = substr($text,8,2);
        $min = substr($text,10,2);
        $new_array[$i] = $year."-".$month."-".$day." ".$hour.":".$min;
    }

    return $new_array;
}
// 读取目录下所有列表（文件、文件夹）
function read_all_dir ( $dir )
{
    $result = [];
    $i = 0;
// 打开目录，然后读取其内容
    if (is_dir($dir)){
        if ($dh = opendir($dir)){
            while (($file = readdir($dh)) !== false){
                if($file == '..' || $file == '.' || (strpos($file,'@'))){
                    continue;
                }
                $result[$i] = $file;
                $i++;
            }
            closedir($dh);
        }
        else{
            $result = 'false';
        }
    };
    return $result;
}
// 根据一级菜单查询条目
$type = $_REQUEST['type'];
if(isset($type)){
    if($type == 'report-typhoon' || $type == 'report-typhoonPath'){
        $dir =  "../data/typhoon/path";
        $response['typhoonId'] = read_all_dir($dir);
        $response['type'] = 'typhoon';
        $response['queryType'] = 'typhoon_path_';

    }
    else if($type == 'report-typhoonIntensity'){
        $dir =  "../data/typhoon/intensity";
        $response['typhoonId'] = read_all_dir($dir);
        $response['type'] = 'typhoon';
        $response['queryType'] = 'typhoon_intensity_';
    }
    else if($type == 'report-sea' || $type == 'report-seaEnvi'){
        $dir =  "../data/sea/environment";
        $response['dayList'] = read_all_dir($dir);
        $response['type'] = 'sea';
        $response['queryType'] = 'sea_environment_';
    }
    else if($type == 'report-seaFlow'){
        $dir =  "../data/sea/seaflow";
        $response['dayList'] = read_all_dir($dir);
        $response['type'] = 'sea';
        $response['queryType'] = 'sea_seaflow_';
    }
    $response['length'] = count(read_all_dir($dir));
    echo json_encode($response);
}
// 根据二级菜单查询图片列表及地址
//file:imgFile,time:selectPeriod,id:typhoodId
//response:length,imgPath,imgName
$file = $_REQUEST['file'];
$id = $_REQUEST['id'];
$time = $_REQUEST['time'];
if(isset($file)){
    if($id!=''){
        $dir =  "../data/typhoon/".$file."/".$id;
        $result = [];
        $i = 0;
// 打开目录，然后读取其内容
        if (is_dir($dir)){
            if ($dh = opendir($dir)){
                while (($file = readdir($dh)) !== false){
                    if($file == '..' || $file == '.'){
                        continue;
                    }
                    $result[$i] = $file;
                    $i++;
                }
                closedir($dh);
            }
            else{
                $result = 'false';
            }
        }
        $response['imgPath'] = $result;
        $response['imgName'] = changeImgName($result);
        $length = $i;

    }
    else{
        $dir =  "../data/sea/".$file."/".$time;
        $imgList = read_all_dir($dir);
        $response['imgPath'] = $imgList;
        $response['imgName'] = changeImgName($imgList);
        //  判断多个时间条件？
        $length = count(read_all_dir($dir));
    }
    $response['dir'] = $dir.'/';
    $response['length'] = count(read_all_dir($dir));

    echo json_encode($response);
}

$dir = "../img/icon/";

$resp['img'] = read_all_dir($dir);
echo json_encode($resp);