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
        console.log("if active:",$(this).parent().hasClass("active") )

        if($(this).parent().hasClass("active") ){
            $(this).parent().removeClass("active");
            $(".map-control-box").hide()
            return
        }
        else{
            $('.map-control-container').find(".active").removeClass("active");
            $(this).parent().addClass("active");
        }

        console.log($(this).attr("class") )
        var toggle_class = $(this).attr("class").split('-')[1]
        switch (toggle_class){
            case "earth":
                zoomToOrigin();
                $('.map-control-container').find(".icon").removeClass("active");
                break;
            case "layer":
                openThisBox(toggle_class);
                break;
            case "rainDrop":
                openThisBox(toggle_class);
                break;
            case "wind":
                openThisBox(toggle_class);
                break;
            case "satellite":
                openThisBox();
                // TODO: satellite image
                break;
            case "radar":
                openThisBox()
                // TODO: radar image
                break;
            case "path":
                openThisBox(toggle_class);
                break;
            case "contactChina":
                openThisBox(toggle_class);
                break;
            case "playPath":
                openThisBox(toggle_class);
                break;
            case "removeName":
                clearPath()
                // TODO: make it useful
                break;
            case "screenShot":
                screenShot()
                // TODO: make it useful
                break;
            case "share":
                share()
                // TODO: make it useful
                break;
            case "download":
                download()
                // TODO: make it useful
                break;
            default:
                openThisBox()

        }

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
var $monSpan = $(".month-span-container")
for(var m =0;m<12;m++){
    $monSpan.append("<span class='month-span'>"+(m+1)+"月</span>")
}

function openThisBox(toggleClass) {
    $(".map-control-box").hide()
    if(toggleClass === null){return}
    $("#map-"+toggleClass+"-box").show()
}
function zoomToOrigin() {
    setTimeout(layer.msg("恢复原有比例"),2000)
}
function clearPath() {
    setTimeout(layer.msg("清除路径"),2000)
}
function screenShot() {
    
}
function share() {
    
}
function download() {

}