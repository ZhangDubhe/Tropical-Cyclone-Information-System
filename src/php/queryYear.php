<?php
/**
 * Created by PhpStorm.
 * User: 64538
 * Date: 2017/8/8
 * Time: 14:20
 */
/*$i=0;
for($year = 1981;$year<2011;$year++){
    $i = $i+1;
    $url = $_REQUEST["url"];
    $queryYear = $_REQUEST["queryYear"];
    $res= '';
    if($queryYear){
//        header("Content-Type:text/html;charset=utf-8");
        $ch = curl_init();
        $url = $url."&year=".$year;
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $res = curl_exec($ch);
//        $result["res"][$year]= $res;
        $result["count"][$year]= count(json_decode($res, true));
//        $result["year"][$year]= $year;
        curl_close($ch);
    }
}*/
$result = "{\"count\":{\"1981\":24,\"1982\":24,\"1983\":22,\"1984\":21,\"1985\":25,\"1986\":30,\"1987\":22,\"1988\":27,\"1989\":33,\"1990\":29,\"1991\":29,\"1992\":31,\"1993\":28,\"1994\":37,\"1995\":23,\"1996\":25,\"1997\":24,\"1998\":12,\"1999\":17,\"2000\":22,\"2001\":24,\"2002\":26,\"2003\":21,\"2004\":29,\"2005\":22,\"2006\":24,\"2007\":25,\"2008\":22,\"2009\":22,\"2010\":14},\"totalYear\":30}";
echo $result;
