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
    $(".icon-menu").click(function () {
        var navBar = $("nav");
        if($(navBar).hasClass("nav-close")){
            $(this).parent().addClass("active");
            $(navBar).removeClass("nav-close").addClass("nav-open");
        }
        else {
            $(this).parent().removeClass("active");
            $(navBar).removeClass("nav-open").addClass("nav-close");
        }
    })
    $(".icon").not(".icon-menu").click(function () {
        if($(this).parent().parent().hasClass("toggle-btn")){
            $(this).parent().addClass("active");
            $(this).parent().siblings().removeClass("active");
            return;
        }
    })
    $(".icon-map").click(function () {
        $(".table-view").hide();
        $(".map-control-container").show()

    })
    $(".icon-table").click(function () {
        $(".table-view").show();
        $(".map-control-container").hide()

    })
    
    //地图控件
    $('.map-control-container').find(".icon").click(function () {

    })
    $(".icon-layer").click(function () {
        $(".map-control-box").hide()
        $("#map-layer-box").show()
    })
    $(".icon-playPath").click(function () {
        $(".map-control-box").hide()
        $("#map-play-box").show()
    })
    $(".icon-contactChina").click(function () {
        $(".map-control-box").hide()
        $("#map-china-box").show()
    })

}));
var $yearAll = $("#year-area-view");
var $barAll = $("#all-bar-view");
var divWidth = $yearAll.width(),
    divheight = $yearAll.height()
var totalYear = 30;
for(var row=0;row<=totalYear;row++){
    var tableRow = "<tr>";

    for(var col=0;col<12;col++){
        tableRow += "<td row='"+row+"' col='"+col+"' class='tiny-div' >"+row+","+col+"</td>"

    }
    tableRow += "</tr>";
    var tableRow_right ="<tr><td row='"+row+"'  class='tiny-div' >"+row+"</td></tr>"
    $yearAll.children("table").append(tableRow)
    $barAll.children("table").append(tableRow_right)

}
var singleWidth = divWidth/12 - 0.5;
$(".tiny-div").css({
    "width":singleWidth,
    "height":60,
    "color":"#fff"
}).hover(function () {
    $(this).addClass("hover");
    var _row = $(this).attr("row"),
        _col = $(this).attr("col");
    $(this).siblings().addClass("hover");
    $barAll.find("td[row='"+_row+"']").addClass("hover");
    $("td[col='"+_col+"']").addClass("hover")
}).mouseout(function () {
    $(this).removeClass("hover");
    var _row = $(this).attr("row"),
        _col = $(this).attr("col");
    $(this).siblings().removeClass("hover");
    $barAll.find("td[row='"+_row+"']").removeClass("hover");
    $("td[col='"+_col+"']").removeClass("hover")
})