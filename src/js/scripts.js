/**
 * Created by Zhang on 2017/5/31.
 */
var one_year = [];
var each_typhoon = [];
var each_typhoon_onGraph = {
    date:"",
    group:"",
    size:""
};
var each_typhoon_timeStamp = {
    date:"",
    grade:""

};

var flag = 1;

($(function () {
    $("#check").change(function () {
        console.log(flag);
        if (flag === 1) {
            flag = -1;
            $("#year-area-view").html("");
            CenterArea();


        }else{
            flag = 1;
            $("#year-area-view").html("");
            example();
        }

    });
    // 点击事件
    $("input[type='button']").on("click",getData);
    //针对所有的图标
    $('.chart-container').delegate('path[class="area"]','click',function(){
        console.log("path",$(this).length);
        var text = $(this).attr("title");
        layer.msg(text);
    })
}));

simpleChart();