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
        else {
            if($(this).parent().hasClass("active") ){
                $(this).parent().removeClass("active");
                $(".map-control-box").hide()
            }else{
                $(this).parent().addClass("active");
                $(this).parent().siblings().removeClass("active");
                $(".map-control-box").show()
            }
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

}));
var $yearAll = $("#year-area-view");
var divWidth = $yearAll.width(),
    divheight = $yearAll.height()
var totalYear = 30;
for(var row=0;row<=totalYear;row++){
    $yearAll.append("<td>");
    for(var col=0;col<12;col++){
        $yearAll.append("<tl row='"+row+"' col='"+col+"' class='tiny-div' ></tl>")
    }
    $yearAll.append("</td>");
}
$(".tiny-div").css({
    "width":divWidth/12 - 1,
    "height":30
}).hover(function () {
    $(this).addClass("hover");
    var _row = $(this).attr("row"),
        _col = $(this).attr("col");
    $(this).siblings().addClass("hover");
}).mouseout(function () {
    $(this).removeClass("hover");
    var _row = $(this).attr("row"),
        _col = $(this).attr("col");
    $(this).siblings().removeClass("hover");
    console.log($(this).attr("row"),$(".tiny-class[row='"+_row+"']").attr("row"))
})