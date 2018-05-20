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
var totalYear = 0,
    initYear = 0;
var singleHeight = 40;
var singleWidth;
var $yearAll = $("#year-area-view");
var $barAll = $("#all-bar-view");
var $lineDay = $("#all-line-view");
var $yearScroll = $(".year-scrollbar");
var $monthScroll = $(".month-scrollbar");

function getData() {
    var data;
    layer.msg("加载中...", {
        icon: 16,
        shade: 0.1,
        time: 2000
    });
    $.getJSON(API_PATH + 'typhoon/total',
        function (result) {
            layer.close();
            data = result;
            totalYear = result.length;
            initYear = result[0].year;
            console.log(initYear, totalYear);
            initTable();
            drawYearBar(data);
            addYearBarInfo(data);
            CenterArea();
            drawDayFrequence('all');
        }
    );
}

getData();

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

    //针对所有的图标
    $('.chart-container').delegate('path[class="area"]','click',function(){
        console.log("path",$(this).length);
        var text = $(this).attr("title");
        console.log(text);
        getTyphoonDetail(false, text);
    });
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
    });
    $(".icon").not(".icon-menu").click(function () {
        if($(this).parent().parent().hasClass("toggle-btn")){
            $(this).parent().addClass("active");
            $(this).parent().siblings().removeClass("active");
            return;
        }
    });
    $(".dropdown-toggle").click(function () {
        if($(this).parent().hasClass("open")){

        }else {

        }
    });
    $(".dropdown-menu").find(".li-right").click(function () {
        if($(this).parent().hasClass("active")){
            $(this).parent().removeClass("active");

         }
        else {
            $(this).parent().addClass("active");
        }
    });

    $(".icon-map").click(function () {
        $(".table-view").hide();
        $(".map-control-container").show();

    });
    $(".icon-table").click(function () {
        $(".table-view").show();
        $(".map-control-container").hide();

    });
    $("#chart-control").find(".icon").not("#removeNameTyphoon").mousedown(function () {
        $(this).addClass("active");
    }).mouseup(function () {
        $(this).removeClass("active");
    });

    $('#removeNameTyphoon').click(function () {
        // clear selection
        // if($(this).hasClass("active")){
        //     $(".removedTyphoon").attr("fill","rgba(255, 68, 114, 0.58)");
        // }
        // else{
        //     $(".removedTyphoon").attr("fill","rgba(255, 255, 255, 0.58)");
        // }
        $("#single-area-view").html('');
        drawDayFrequence('all');
    });

    $('.map-control-container').find(".icon").click(function () {
        console.log("if active:",$(this).parent().hasClass("active") );
        if($(this).parent().hasClass("active") ){
            $(this).parent().removeClass("active");
            $(".map-control-box").hide();
            return;
        }
        else{
            $('.map-control-container').find(".active").removeClass("active");
            $(this).parent().addClass("active");
        }

        var toggle_class = $(this).attr("class").split('-')[1];
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
                openThisBox();
                // TODO: radar image
                break;
            case "path":
                $box = openThisBox(toggle_class);
                $box.addClass("box-add-height");
                break;
            case "contactChina":
                $box = openThisBox(toggle_class);
                $box.addClass("box-add-height");
                break;
            case "playPath":
                openThisBox(toggle_class);
                break;
            case "removeName":
                // TODO: make it useful
                removeAllTypoon();
                break;
            case "screenShot":
                screenShot();
                // TODO: make it useful
                break;
            case "share":
                share();
                // TODO: make it useful
                break;
            case "download":
                download();
                // TODO: make it useful
                break;
            default:
                openThisBox()

        }

        
    })


}));


$(".tiny-div").hover(function () {
    $(this).addClass("hover-deep");
    var _row = $(this).attr("row"),
        _col = $(this).attr("col");
    $(this).siblings().addClass("hover");
    $(".tiny-div[row='"+_row+"']").addClass("hover");
    $(".tiny-div[col='"+_col+"']").addClass("hover");

}).mouseout(function () {
    $(this).removeClass("hover-deep");
    var _row = $(this).attr("row"),
        _col = $(this).attr("col");
    $(this).siblings().removeClass("hover");
    $(".tiny-div[row='"+_row+"']").removeClass("hover");
    $(".tiny-div[col='"+_col+"']").removeClass("hover")
})


function initTable() {
    for(var row=0;row < totalYear;row++){

        var tableRow = "<tr>";
        var tableCol_down = "<tr>"
        var monthColBar = ""
        for(var col=0;col<12;col++){
            if(col == 0){
                tableRow += "<td row='"+row+"' col='"+col+"' class='tiny-div' ><p style='position:relative;    left: -40px;top: 10px;color:#d0d0d0'>"+(initYear+row)+"</p></td>"
            }
            else{
                tableRow += "<td row='"+row+"' col='"+col+"' class='tiny-div' ></td>"
            }

            tableCol_down += "<td  col='"+col+"' class='tiny-div' ></td>";
            monthColBar += "<div  col='" +col+"' class='tiny-div' ></div>";
        }
        tableRow += "</tr>";
        tableCol_down += "</tr>"
        var tableRow_right ="<tr><td row='"+row+"'  class='tiny-div' ></td></tr>"
        var yearRowBar = "<div row='"+row+"' class='tiny-div'></div>"
        $yearAll.children("table").append(tableRow)
        $barAll.children("table").append(tableRow_right)
        $yearScroll.append(yearRowBar)
    }
    $monthScroll.append(monthColBar)
    $lineDay.children("table").append(tableCol_down)

    var divWidth = $yearAll.width(),
        padding_left = 50,
        divWidth = divWidth - padding_left,
        divheight = $yearAll.height(),
        singleBarHeight = divheight/totalYear;
    singleWidth = divWidth/12 ;
    $("#year-area-view").find(".tiny-div").css({
        "width":singleWidth,
        "height":singleHeight
    })
    $("#all-bar-view").find(".tiny-div").css({
        "height":singleHeight
    })

    $("#all-line-view").find(".tiny-div").css({
        "width":singleWidth
    })
    $("#year-area-view").find(".svg-container").css({
        "height":(singleHeight-2)*totalYear + singleHeight
    })
    $("#all-bar-view").find(".svg-container").css({
        "height":(singleHeight-2)*totalYear + singleHeight
    })

    $yearScroll.find(".tiny-div").css({
        "height":singleBarHeight
    })
    $monthScroll.find(".tiny-div").css({
        "width":singleWidth
    })
}


function initMonthSpan(){
    var $monSpan = $(".month-span-container")
    for(var m =0;m<12;m++){
        $monSpan.append("<span class='month-span'>"+(m+1)+"月</span>")
    }
}

function openThisBox(toggleClass) {
    $(".map-control-box").hide()
    if(toggleClass === null){return}
    $("#map-"+toggleClass+"-box").show()
    return $("#map-"+toggleClass+"-box")
}
function zoomToOrigin() {
    setTimeout(layer.msg("恢复原有比例"),2000)
}
function clearPath() {
    removeAllTypoon;
    setTimeout(layer.msg("清除路径"),2000);
}
function screenShot() {
    var downloadMime = 'image/octet-stream';
    function getDataURL(canvas, type) {
        return canvas.toDataURL('png');
    }
    function saveFile(strData) {
        document.location.href = strData;
    }
    function fixType(type) {
        type = type.toLowerCase().replace(/jpg/i, 'jpeg');
        var r = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + r;
    }
    function saveAs(uri, filename) {
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
            link.href = uri;
            link.download = filename;

            //Firefox requires the link to be in the body
            document.body.appendChild(link);

            //simulate click
            link.click();

            //remove the link when done
            document.body.removeChild(link);
        } else {
            window.open(uri);
        }
    }
    html2canvas(document.querySelector("body")).then(canvas => {
        document.body.appendChild(canvas);
        var type = 'png';
        type = fixType(type);
        var strData = getDataURL(canvas, type);
        saveAs(strData.replace(type, downloadMime), 'screenshoot.png');
    });
}

function share() {
    
}
function download() {

}

function resizeActive() {
    location.reload();
}

function hoverYear(nowYear) {
    var yearIndex = nowYear - initYear;
    $(".tiny-div[row='"+ yearIndex  +"']").addClass("hover");
}