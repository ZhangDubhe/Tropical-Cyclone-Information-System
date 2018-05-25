var lastTypoonSelectArry = new Array();
var counthide = 1;
var basePath, baseLayer, labelLayer, currfeauterLayer = L.featureGroup(),
    $lastNav, deDalutLn = L.latLng(30, 123),
    popDiv = L.popup(),
    islandLayer;
$(function () {
    $.ajaxSetup({
        type: "POST",
        cache: false,
        error: function (msg) {
            alert("抱歉，系统异常！");
        }
    });
    /*  var ss = L.control.coordinates({
            decimals: 4,
            decimalSeperator: ",",
            labelTemplateLat: "纬度: {y}",
            labelTemplateLng: "经度: {x}",
            enableUserInput: false
        }).addTo(map);
        $("#bgmap").hover(function(){
                $("#bgmaplist").css("display","block");
            },function(){
                $("#bgmaplist").css("display","none");
            })*/
    loadTyphoon();
});

//台风加载
function loadTyphoon() {
    map.setView([20, 136], 5);
    popDiv = L.popup();
    $("#container").load("Typoon.aspx #tycontainer", function (html) {
        hide();
        drawWarningLine();
        initSelectTypoonYear();
    });
}

function zoomToOrigin() {
    map.setView([30, 123], 2);
    setTimeout(function () {
        layer.msg("恢复原有比例")
    }, 1000);
}

function showOrHiddenLegend($selector) {
    $selector.click(function () {
        if ($(this).hasClass("oppi")) {
            $(this).removeClass("oppi");
            $("#moreinfo1").addClass("currtynav");
            switchTyphoonnav3($("#ybnav span"));
            $(this).parent().next().slideDown();
        } else {
            $(this).addClass("oppi");
            switchTyphoonnav3($("#ybnav span"));
            if (counthide == 1) {
                $(this).parent().next().hide();
            } else {
                $(this).parent().next().slideUp();
            }
        }
    });
}

function showOrHiddenLegend1($selector) {
    $selector.click(function () {
        if ($(this).hasClass("currtynav")) {
            $("#ybnav i").addClass("oppi");
            $("#ybnav i").parent().next().slideUp();
        } else {
            $("#ybnav i").removeClass("oppi");
            $("#ybnav i").parent().next().slideDown();
        }
    });
}

//栏目隐藏
function bottuToggle() {
    $(".conzoom").toggle(function () {
        $(this).addClass("conzoomrig");
        if (counthide == 1) {
            $(this).nextAll().hide();
        } else {
            $(this).nextAll().fadeOut();
        }
        $(this).parent().addClass("bordernone");
    }, function () {
        $(this).removeClass("conzoomrig");
        $(this).nextAll().fadeIn();
        $(this).parent().removeClass("bordernone");
    });
}

function initSelectTypoonYear() {
    $("#yearcon").change(function () {
        var url = getUrl("Readearth.PublicSrviceGIS.BLL.TyphoonBLL", "Readearth.PublicSrviceGIS.BLL", "GetTyhoonByYear");
        var year = $(this).val();
        $.ajax({
            url: url,
            data: {
                year: year
            },
            dataType: 'json',
            success: function (jsonArray) {
                var $con = $("#historyTypoon");
                $con.find("tr:gt(0)").remove();
                $("#historyTypoonDetail").find("tr:gt(0)").remove();
                var html = "";
                for (var i = 0; i < jsonArray.length; i++) {
                    html += '<tr><td><input type="checkbox" /></td><td>' + jsonArray[i].typhoonnumber + '</td><td>' + jsonArray[i].name + '</td><td>' + jsonArray[i].ename + '</td></tr>';
                }
                $con.append(html);
                initTyphoonSelectCommon(false, $con);
            }
        });
    });
}


//台风列表鼠标移动效果
function hoverTr(tipbool, json, i, $selector) {
    $selector.hover(function () {
        $(this).addClass("trhover");
        if (tipbool) {
            var length = json.length;
            var currArray = json[length - 1 - i];
            var html = getTyphoonPoupeText(currArray);
            console.log("hover:", currArray);
            $("#currentTyphoonNum").text(currArray.typhoonnumber);
            $("#currentTyphoonIntensity").text(changeIntensity(currArray.intensity));
            $("#currentTyphoonWindspeed").text(currArray.windspeed);
            $("#currentTyphoonPressure").text(currArray.airpressure);
            $("#currentTyphoonHappenedAt").text(currArray.happenedat.replace(/T/g, " ").replace(/:00$/g, "").replace(/^\d+-/g, " "));
            popDiv.setLatLng([currArray.latitude, currArray.longitude]).setContent(html).openOn(map);
        }
    }, function () {
        $(this).removeClass("trhover");
        if (tipbool) {
            map.closePopup(popDiv);
        }
    });
}


//台风具体列表交互
//iscurr 是否当前台风
//tipbool 是否需要鼠标移动上去提示
//json 当前台风信息
function initeSelctTr(iscurr, tipbool, json, $selector) {
    $selector.find("tr:gt(0)").each(function (i) {
        hoverTr(tipbool, json, i, $(this));
        if (iscurr && tipbool) {
            $(this).click(function () {
                $(this).addClass("currselectty").siblings().removeClass("currselectty");
                // showTypoonYB(i, json);
                // showDistance(i, json);
            });
        }
    });
    if (iscurr && tipbool)
        $selector.find("tr:eq(1)").click();
}





function showTypoonYB(i, json) {
    var $con = $("#currTypoonYB");
    var length = json.length;
    var currArray = json[length - 1 - i].forecast;
    var time = json.points[length - 1 - i].time.replace(/T/g, " ");
    $("#qbtyoonTime").text(time);
    var html = "";
    var zyybArray = new Array();
    var ribenArray = new Array();
    var chinaArray = new Array();
    var usaArray = new Array();
    var xgArray = new Array();
    var taArray = new Array();
    if (currArray) {
        for (i = 0; i < currArray.length; i++) {
            if (currArray[i].points) {
                if (currArray[i].sets == "美国") {
                    zyybArray = currArray[i].points;
                } else if (currArray[i].sets == "日本") {
                    ribenArray = currArray[i].points;
                } else if (currArray[i].sets == "中国") {
                    chinaArray = currArray[i].points;
                } else if (currArray[i].sets == "中国香港") {
                    xgArray = currArray[i].points;
                } else if (currArray[i].sets == "中国台湾") {
                    taArray = currArray[i].points;
                }
            }
        }
        for (i = 0; i < chinaArray.length; i++) {
            html += '<tr><td><pre>中央台\r\n' + chinaArray[i].time.replace(/T/g, " ").replace(/:00$/g, " ").replace(/^\d+-/g, " ") + '</pre></td><td>' + chinaArray[i].longitude + '°E|' + chinaArray[i].latitude + '°N</td><td>' + chinaArray[i].speed + '</td><td>' + chinaArray[i].pressure + '</td></tr>';
        }
        for (i = 0; i < xgArray.length; i++) {
            html += '<tr><td><pre>中国香港\r\n' + xgArray[i].time.replace(/T/g, " ").replace(/:00$/g, " ").replace(/^\d+-/g, " ") + '</pre></td><td>' + xgArray[i].longitude + '°E|' + xgArray[i].latitude + '°N</td><td>' + xgArray[i].speed + '</td><td>' + xgArray[i].pressure + '</td></tr>';
        }
        for (i = 0; i < taArray.length; i++) {
            html += '<tr><td><pre>中国台湾\r\n' + taArray[i].time.replace(/T/g, " ").replace(/:00$/g, " ").replace(/^\d+-/g, " ") + '</pre></td><td>' + taArray[i].longitude + '°E|' + taArray[i].latitude + '°N</td><td>' + taArray[i].speed + '</td><td>' + taArray[i].pressure + '</td></tr>';
        }
        for (i = 0; i < ribenArray.length; i++) {
            html += '<tr><td><pre>日本\r\n' + ribenArray[i].time.replace(/T/g, " ").replace(/:00$/g, " ").replace(/^\d+-/g, " ") + '</pre></td><td>' + ribenArray[i].longitude + '°E|' + ribenArray[i].latitude + '°N</td><td>' + ribenArray[i].speed + '</td><td>' + ribenArray[i].pressure + '</td></tr>';
        }
        for (i = 0; i < usaArray.length; i++) {
            html += '<tr><td><pre>美国\r\n' + usaArray[i].time.replace(/T/g, " ").replace(/:00$/g, " ").replace(/^\d+-/g, " ") + '</pre></td><td>' + usaArray[i].longitude + '°E|' + usaArray[i].latitude + '°N</td><td>' + usaArray[i].speed + '</td><td>' + usaArray[i].pressure + '</td></tr>';
        }
        var allArray = chinaArray.concat(xgArray).concat(taArray).concat(ribenArray).concat(usaArray);
        $con.find("tr:gt(0)").remove();
        $con.append(html);
        var $tr = $con.find("tr:gt(0)");

        //showSibingsColor($tr,'trgray');
        $tr.each(function (i) {
            $(this).hover(function () {
                $(this).addClass("trhover");
                var currArray = allArray[i];
                var sets = $(this).find("td:eq(0)").text().replace(/\d+小时$/, "");
                var html = getybTyphoonPoupeText(time, sets, currArray);
                popDiv.setLatLng([currArray.latitude, currArray.longitude]).setContent(html).openOn(map);
            }, function () {
                $(this).removeClass("trhover");
                map.closePopup(popDiv);
            });
        });
    }
}

function showDistance(i, json) {
    var $con = $("#currTypoonDT");
    var length = json.points.length;
    var currpoint = json.points[length - 1 - i];
    var url = getUrl("Readearth.PublicSrviceGIS.BLL.TyphoonBLL", "Readearth.PublicSrviceGIS.BLL", "GetStationdistance");
    var data = {
        lat: currpoint.latitude,
        lon: currpoint.longitude
    };
    $.get(url, data, function (msg) {
        var type = msg.type;
        var array = msg.distance;
        var html = "";
        for (var i = 0; i < array.length; i++) {
            html += "<tr>";
            html += "<td>" + array[i].name + "</td>";
            html += "<td>" + array[i].dis + "km</td>";
            html += "</tr>";
        }
        $con.find("tr:gt(0)").remove();
        $con.append(html);
    }, 'json');
}



//获取加载默认台风显示
function getCurrTyphoon(jsonArray) {
    var currArray = new Array();
    var historyArray = new Array();
    var currhtml = "",
        hostorhtml = "";
    for (var i = 0; i < jsonArray.length; i++) {
        if (jsonArray[i].is_current == 1) {
            currArray.push(jsonArray[i]);
            currhtml += '<tr><td><input type="checkbox" checked="checked"/></td><td>' + jsonArray[i].typhoonnumber + '</td><td>' + jsonArray[i].name + '</td><td>' + jsonArray[i].ename + '</td></tr>';
        } else {
            currArray.push(jsonArray[i]);
            currhtml += '<tr><td><input type="checkbox" /></td><td>' + jsonArray[i].typhoonnumber + '</td><td>' + jsonArray[i].name + '</td><td>' + jsonArray[i].ename + '</td></tr>';
        }
    }
    var $currcon = $("#currTypoon");
    if (currhtml) {
        $currcon.append(currhtml);
        initTyphoonSelectCommon(true, $currcon);
        initeSelctTr(true, false, undefined, $currcon);
    } else {
        $currcon.parent().append("<h2 class='currTip'>当前无台风</h2>");
    }
    // showSibingsColor($tr,'trgray');
    for (i = 0; i < currArray.length; i++) {
        if (jsonArray[i].is_current == 1) {
            getTyphoonDetail(true, currArray[i].typhoonnumber);
        }
    }
}

function getHistoryTyphoon(jsonArray) {
    var currArray = new Array();
    var historyArray = new Array();
    var currhtml = "",
        hostorhtml = "";
    for (var i = 0; i < jsonArray.length; i++) {
        historyArray.push(jsonArray[i]);
        hostorhtml += '<tr><td><input type="checkbox" /></td><td>' + jsonArray[i].typhoonnumber + '</td><td>' + jsonArray[i].name + '</td><td>' + jsonArray[i].ename + '</td></tr>'
    }
    var $currcon = $("#currTypoon");
    if (hostorhtml) {
        var $con = $("#historyTypoon");
        $con.append(hostorhtml);
        initTyphoonSelectCommon(false, $con);
        initeSelctTr(true, false, undefined, $con);
    }
}

//点击台风显示列表和图层
function initTyphoonSelectCommon(iscurr, $slector) {
    $slector.find("input").each(function () {
        $(this).click(function () {
            var checked = $(this).attr("checked");
            var sno = $.trim($(this).parent().next().text());
            if (checked == "checked") {
                getTyphoonDetail(iscurr, sno);
            } else {
                removeSelectTypoon(sno);
                for (var i = 0; i < lastTypoonSelectArry.length; i++) {
                    if (lastTypoonSelectArry[i].no == sno && lastTypoonSelectArry[i].type == iscurr)
                        lastTypoonSelectArry.splice(i, 1); //删掉指定储存台风列表具体信息
                }
                var currArray = new Array();
                for (i = 0; i < lastTypoonSelectArry.length; i++) {
                    if (lastTypoonSelectArry[i].type == iscurr)
                        currArray.push(lastTypoonSelectArry[i]);
                }
                var $title, $con, $ybcon;
                if (iscurr) {
                    $title = $("#currTypoonTitle");
                    $con = $("#currTypoonDetail");
                    $ybcon = $("#currTypoonYB");
                } else {
                    $title = $("#historyTypoonTitle");
                    $con = $("#historyTypoonDetail");
                }
                if (currArray.length > 0) {
                    showTyphoonDetail(iscurr, currArray[currArray.length - 1].info);
                    initeSelctTr(iscurr, true, currArray[currArray.length - 1].info, $con);
                } else {
                    $con.find("tr:gt(0)").remove();
                    $title.text("实况路径");
                    if (iscurr)
                        $ybcon.find("tr:gt(0)").remove();
                }
            }
        });
    });
}


//删除指定台风图层
function removeSelectTypoon(id) {
    currfeauterLayer.eachLayer(function (layer) {
        if (layer.typoonId == id)
            layer.eachLayer(function (sulayer) {
                map.removeLayer(sulayer);
            });
    });
}

//删除指定台风图层
function removeAllTypoon() {
    currfeauterLayer.eachLayer(function (layer) {
        layer.eachLayer(function (sulayer) {
            map.removeLayer(sulayer);
        });
    });
}

//获取指定台风具体信息
function getTyphoonDetail(iscurr, sno) {
    layer.msg("正在加载台风:" + sno, {
        icon: 16,
        shade: 0.1,
        time: 10000
    });
    var typhoonId = sno;
    var year = sno.substr(0, 4);
    $.getJSON(API_PATH + "typhoon/points", {
        typhoonnumber: typhoonId
    }, function (json) {
        // 显示台风具体路径点信息
        layer.closeAll();
        $("#currTypoonDetail").show();
        showTyphoonDetail(iscurr, json);
        drawTyphoon(json);
        drawSingleTyphoonGraph(sno, json);
        lastTypoonSelectArry.push({
            'no': sno,
            'type': iscurr,
            'info': json
        });
        initeSelctTr(true, true, json, $("#currentTyphoonTable"));
    });
}
//全年全部查询时获取指定台风具体信息
function getTyphoonDetailYear(iscurr, sno) {
    var typhoonId = sno;
    var year = sno.substr(0, 4);
    $.getJSON(API_PATH + "typhoon/points", {
        typhoonnumber: typhoonId
    }, function (json) {
        // 显示台风具体路径点信息
        showTyphoonDetail(iscurr, json);
        drawTyphoon(json);
        lastTypoonSelectArry.push({
            'no': sno,
            'type': iscurr,
            'info': json
        });
        initeSelctTr(true, true, json, $("#currentTyphoonTable"));
    });
}

//显示指定台风信息
function showTyphoonDetail(iscurr, json) {
    var jsonArray = json;
    var html = "";
    for (var i = jsonArray.length - 1; i >= 0; i--) {
        html += '<tr><td>' + jsonArray[i].happenedat.replace(/T/g, " ").replace(/:00$/g, "").replace(/^\d+-/g, " ") + '</td><td>' + jsonArray[i].longitude + '°E|' + jsonArray[i].latitude + '°N</td><td>' + jsonArray[i].windspeed + '</td><td>' + jsonArray[i].airpressure + '</td></tr>';
    }
    var $con, $title;
    $title = $("#currentTyphoonName");
    $con = $("#currentTyphoonTable");
    $("#currentTyphoonNum").text(json[0].typhoonnumber);
    $("#currentTyphoonIntensity").text(changeIntensity(json[0].intensity));
    $("#currentTyphoonWindspeed").text(json[0].windspeed);
    $("#currentTyphoonPressure").text(json[0].airpressure);
    $("#currentTyphoonHappenedAt").text(json[0].happenedat.replace(/T/g, " ").replace(/:00$/g, "").replace(/^\d+-/g, " "));
    $con.find("tr:gt(0)").remove();
    if (json[0].isdelete) {
        $("#currentTyphoonIsDelete").show();
    }
    $title.text(json[0].name +' / '+ json[0].ename);
    $con.append(html);
}



//历史台风和当前台风切换
function switchTyphoonnav($selector) {
    $selector.each(function (i) {
        $(this).click(function () {
            $(this).addClass("currtynav").siblings().removeClass("currtynav");
            $(this).parent().next().children(":eq(" + i + ")").show().siblings().hide();
        });
    });
}

function switchTyphoonnav2($selector) {
    $selector.each(function (i) {
        $(this).click(function () {
            if ($("#ybnav i").hasClass("oppi")) {
                $(this).removeClass("currtynav");
            } else {
                $(this).addClass("currtynav").siblings().removeClass("currtynav");
                $(this).parent().next().children(":eq(" + i + ")").show().siblings().hide();
            }
        })
    })
}

function switchTyphoonnav3($selector) {
    $selector.each(function (i) {
        if ($("#ybnav i").hasClass("oppi")) {
            $(this).removeClass("currtynav");
        } else {
            $(this).removeClass("currtynav").siblings().addClass("currtynav");
            $(this).parent().next().children(":eq(" + i + ")").hide().siblings().show();
        }
    })
}



//具体台风绘制
function drawTyphoon(json) {
    var jsonArray = json;
    var nodeIco = L.icon({
        iconUrl: "src/images/rotate.gif",
        iconSize: [24, 24],
        iconAnchor: [17, 17]
    });
    var lastMarker = L.marker([], {
        icon: nodeIco
    });
    var style = {
        color: '#333333',
        weight: 2,
        fillColor: "#ff8c00"
    };
    var level7Circle = L.circle([], 200, style);
    var level10Circle = L.circle([], 200, style);
    var level12Circle = L.circle([], 200, style);
    var typhoonLayer = L.layerGroup()
    typhoonLayer.typoonId = json[0].typhoonnumber;
    var count = 0,
        T;

    function drawDynamicTyphoon() {
        var jsonArray = json;
        if (count < jsonArray.length) {
            var currArray = jsonArray[count],
                polyline;
            var lat = L.latLng(currArray.latitude, currArray.longitude);
            lastMarker = lastMarker.setLatLng(lat).addTo(map);
            var currColor = GetPointColor(currArray.windspeed);
            var circleIco = new MyCustomMarker(lat, {
                color: currColor,
                weight: 1,
                fillColor: currColor,
                fillOpacity: 1
            }).addTo(map);
            var pophtml = getTyphoonPoupeText(currArray);
            circleIco.setRadius(currArray.intensity+1).bindPopup(pophtml, {
                showOnMouseOver: !0,
                closeButton: !1,
            });

            if (count != 0) {
                var count1 = -1;
                for (var k = jsonArray.length - 1; k >= 0; k--) {
                    if (jsonArray[k].forecast != null) {
                        if (count1 == -1) {
                            count1 = k;
                        }
                    }
                };
                var lanArray = new Array();
                lanArray.push([jsonArray[count - 1].latitude, jsonArray[count - 1].longitude]);
                lanArray.push([currArray.latitude, currArray.longitude]);
                var lingWeight = (jsonArray.length - count) / jsonArray.length * 2 + 1;
                polyline = L.polyline(lanArray, {
                    color: '#333333',
                    weight: lingWeight
                }).addTo(map).bringToBack();
                typhoonLayer.addLayer(polyline);
                if (count == count1) {
                    map.setView(lat, 5);
                    var ybArray = currArray.forecast;
                    showTypoonYB((jsonArray.length - count1 - 1), json);
                    if (ybArray) {
                        for (var i = 0; i < ybArray.length; i++) {
                            setting = ybArray[i].sets;
                            if (setting == "美国" || setting == "日本" || setting == "中国" || setting == "中国香港" || setting == "中国台湾" || setting == "韩国")
                                drawYBTyoon(typhoonLayer, currArray.happenedat, setting, lat, ybArray[i].points);
                        }
                    }
                }
                if (count == jsonArray.length - 1) {
                    lastMarker.remove();
                }
            } else {
                //map.setView(lat, 5);
                //var myIcon = L.divIcon({ iconSize:[74,20],iconAnchor:[-10,8],className:'tycontitl', html:json.typhoonnumber+json.name});
                // var myIcon = L.divIcon({
                //     iconAnchor: [-16, 8],
                //     className: 'tycontitl',
                //     html: ''
                // });
                // var divmark = L.marker(lat, {
                //     icon: myIcon
                // }).addTo(map);
                typhoonLayer.addLayer(lastMarker);
                // .addLayer(divmark);
                if (jsonArray.length == 1) {
                    var ybArray = currArray.forecast;
                    showTypoonYB((jsonArray.length - count - 1), json);
                    if (ybArray) {
                        for (var i = 0; i < ybArray.length; i++) {
                            setting = ybArray[i].sets;
                            if (setting == "美国" || setting == "日本" || setting == "中国" || setting == "中国香港" || setting == "中国台湾" || setting == "韩国")
                                drawYBTyoon(typhoonLayer, currArray.happenedat, setting, lat, ybArray[i].points);
                        }
                    }
                }
            }
            typhoonLayer.addLayer(circleIco);
            count++;
        } else {
            return;
        }
    }
    T = setInterval(function () {
        drawDynamicTyphoon()
    }, 20);
    currfeauterLayer.addLayer(typhoonLayer);
}


function drawYBTyoon(typhoonLayer, bhappenedat, setting, lastLan, array) {
    var color = getYBColor(setting);
    setting = getGJName(setting);
    for (var i = 0; i < array.length; i++) {
        var currArray = array[i],
            polyline;
        var lat = L.latLng(currArray.latitude, currArray.longitude);
        var currColor = GetPointColor(currArray.windspeed);
        var circleIco = new MyCustomMarker(lat, {
            color: currColor,
            weight: 1,
            fillColor: currColor,
            fillOpacity: 1
        }).addTo(map);;
        var pophtml = getybTyphoonPoupeText(bhappenedat, setting, currArray);
        circleIco.setRadius(4).bindPopup(pophtml, {
            showOnMouseOver: !0,
            closeButton: !1,
        });
        var lanArray = new Array();
        if (i == 0) {
            lanArray.push(lastLan);
            lanArray.push([currArray.latitude, currArray.longitude]);
        } else {
            lanArray.push([array[i - 1].latitude, array[i - 1].longitude]);
            lanArray.push([currArray.latitude, currArray.longitude]);
        }
        polyline = L.polyline(lanArray, {
            color: color,
            dashArray: "10,5",
            weight: 3
        }).addTo(map).bringToBack();
        typhoonLayer.addLayer(polyline);
        typhoonLayer.addLayer(circleIco);
    }
}

function getYBColor(source) {
    var color = "#78A9A9";
    if (source == "美国")
        color = "#ff8c00";
    else if (source == "日本")
        color = "#2B4678";
    else if (source == "中国")
        color = "#ff0000";
    else if (source == "中国香港")
        color = "#ffff00";
    else if (source == "中国台湾")
        color = "#3C7832";
    return color;
}

function getGJName(name) {
    if (name == "中国")
        return "中央气象台";
    else
        return name;
}

/*
0 - 弱于热带低压(TD), 或等级未知, 
1 - 热带低压(TD, 10.8 - 17.1 m / s), 
2 - 热带风暴(TS, 17.2 - 24.4 m / s), 
3 - 强热带风暴(STS, 24.5 - 32.6 m / s), 
4 - 台风(TY, 32.7 - 41.4 m / s), 
5 - 强台风(STY, 41.5 - 50.9 m / s), 
6 - 超强台风(SuperTY, ≥51.0 m / s), 
9 - 变性, 第一个标记表示变性完成.
*/
function changeIntensity(number) {
    var symbol;
    switch (number) {
        case 0:
            symbol = "弱于热带低压(TD)";
            break;
        case 1:
            symbol = "热带低压(TD)";
            break;
        case 2:
            symbol = "热带风暴(TS)";
            break;
        case 3:
            symbol = "强热带风暴(STS)";
            break;
        case 4:
            symbol = "台风(TY)";
            break;
        case 5:
            symbol = "强台风(STY)";
            break;
        case 6:
            symbol = "超强台风(SuperTY)";
            break;
        case 9:
            symbol = "变性";
            break;
    }
    return symbol;
}
//获取台风实况信息
function getTyphoonPoupeText(currArray) {
    var pophtml = "<div class='popdecon'>";
    pophtml += '<p>时间：' + currArray.happenedat.replace(/T/g, " ") + '</p>';
    pophtml += '<p>中心位置：' + currArray.longitude + '°E| ' + currArray.latitude + '°N</p>';
    pophtml += '<p>最大风速：' + currArray.windspeed + 'm/s</p>';
    pophtml += '<p>强度：' + (currArray.intensity ? changeIntensity(currArray.intensity) : '--') + '</p>';
    pophtml += '<p>中心气压：' + (currArray.airpressure ? currArray.airpressure : '--') + 'Pa</p>';
    pophtml += '</div>';
    return pophtml;
}

//获取台风预报信息
function getybTyphoonPoupeText(ybhappenedat, setting, currArray) {
    var pophtml = "<div class='popdecon'>";
    pophtml += '<div><p>起报时间：' + ybhappenedat.replace(/T/g, " ") + '</p>';
    // pophtml+='<p>预报时效：'+setting+currArray.fhour+'小时</p>';
    pophtml += '<p>到达时间：' + currArray.happenedat.replace(/T/g, " ") + '</p>';
    pophtml += '<p>中心位置：' + currArray.longitude + '°E|' + currArray.latitude + '°N</p>';
    pophtml += '<p>最大风速：' + currArray.windspeed + 'm/s</p>';
    pophtml += '<p>强度：' + (currArray.intensity ? currArray.intensity : '--') + '</p>';
    pophtml += '<p>中心气压：' + (currArray.airpressure ? currArray.airpressure : '--') + 'Pa</p>';
    pophtml += '</div>';
    return pophtml;

}



//绘制图例
function createLegendTable() {
    var legendHtml = "<div class='tuliHead'>预报台</div>";
    legendHtml += "<div class='tuliContent'><ul><li><img src='images/legend/tuli_cn.png'>中国</li><li><img src='images/legend/tuli_hk.png'>中国香港</li><li><img src='images/legend/tuli_tw.png'>中国台湾</li><li><img src='images/legend/tuli_jp.png'>日本</li><li><img src='images/legend/tuli_kor.png'>韩国</li><li><img src='images/legend/tuli_usa.png'>美国</li></ul></div>";
    legendHtml += "<div class='tuliHead'>台风等级</div>";
    legendHtml += "<div class='tuliContent'><ul><li>热带低压</li><li>热带风暴</li><li>强热带风暴</li><li>台风</li><li>强台风</li><li>超强台风</li></ul></div>";
    return legendHtml;
}

//根据台风强度获取点的显示颜色
function GetPointColor(windspeed) {
    var b;
    if (windspeed >= 10.8 && windspeed < 17.1)
        b = "#f0dade"; // b = "#00D5CB"
    else if (windspeed >= 17.1 && windspeed < 24.4)
        b = "#f6bfae"; // b= "#FCFA00";
    else if (windspeed >= 24.4 && windspeed < 32.6)
        b = "#fb9f9c"; // b= "#FDAE0D";
    else if (windspeed >= 32.6 && windspeed < 41.4)
        b = "#f36078"; // b= "#FB3B00";
    else if (windspeed >= 41.5 && windspeed < 50.9)
        b = "#d71058"; // b= "#FC4d80";
    else if (windspeed >= 50.9)
        b = "#a70943"; // b = "#C2218E"
    else
        b = "#000000"; // b = "#000000"
    return b
}

//绘制24小时和48小时警戒线
function drawWarningLine() {
    var forcastLineGroup = L.layerGroup([]);
    var WarningPointArray_24 = new Array();
    WarningPointArray_24.push(L.latLng(0, 105));
    WarningPointArray_24.push(L.latLng(4.5, 113));
    WarningPointArray_24.push(L.latLng(11, 119));
    WarningPointArray_24.push(L.latLng(18, 119));
    WarningPointArray_24.push(L.latLng(22, 127));
    WarningPointArray_24.push(L.latLng(34, 127));
    var WarningPointArray_48 = new Array();
    WarningPointArray_48.push(L.latLng(0, 105));
    WarningPointArray_48.push(L.latLng(0, 120));
    WarningPointArray_48.push(L.latLng(15, 132));
    WarningPointArray_48.push(L.latLng(34, 132));
    forcastLineGroup.addLayer(L.polyline(WarningPointArray_24, {
        color: '#FFFF00',
        weight: 2
    }));
    forcastLineGroup.addLayer(L.polyline(WarningPointArray_48, {
        color: '#0000FF',
        weight: 2
    }));
    var Icon_24 = L.icon({
        iconUrl: 'images/hour24.png',
        iconSize: [15, 89],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    });

    var Icon_48 = L.icon({
        iconUrl: 'images/hour48.png',
        iconSize: [15, 89],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    });
    forcastLineGroup.addLayer(L.marker(L.latLng(28, 127), {
        icon: Icon_24
    }));
    forcastLineGroup.addLayer(L.marker(L.latLng(25, 132), {
        icon: Icon_48
    }));
    currfeauterLayer.addLayer(forcastLineGroup).addTo(map);
}






//定制的台风节点标记
MyCustomMarker = L.CircleMarker.extend({
    //a为html文本
    bindPopup: function (a, b) {
        b && b.showOnMouseOver && (L.CircleMarker.prototype.bindPopup.apply(this, [a, b]), this.off("click", this.openPopup, this), this.on("mouseover",
            function (a) {
                var c = a.originalEvent.fromElement || a.originalEvent.relatedTarget,
                    d = this._getParent(c, "leaflet-popup");
                return d == this._popup._container ? !0 : (this.getRadius() >= 5 ? this.setRadius(10) : this.setRadius(7), this.openPopup(), null != b.latlng, void 0)
            },
            this), this.on("mouseout",
            function (a) {
                var c = a.originalEvent.toElement || a.originalEvent.relatedTarget;
                return this._getParent(c, "leaflet-popup") ? (L.DomEvent.on(this._popup._container, "mouseout", this._popupMouseOut, this), !0) : (this.getRadius() > 7 ? this.setRadius(6) : this.setRadius(4), null != b.latlng, this.closePopup(), void 0)
            },
            this))
    },
    _popupMouseOut: function (a) {
        this.getRadius() > 7 ? this.setRadius(6) : this.setRadius(4),
            L.DomEvent.off(this._popup, "mouseout", this._popupMouseOut, this);
        var b = a.toElement || a.relatedTarget;
        return this._getParent(b, "leaflet-popup") ? !0 : b == this._icon ? !0 : (this.closePopup(), void 0)
    },
    _getParent: function (a, b) {
        try {
            for (var c = a.parentNode; null != c;) {
                if (c.className && L.DomUtil.hasClass(c, b)) return c;
                c = c.parentNode
            }
            return !1
        } catch (d) {
            return !1
        }
    }
})


function showSibingsColor($selector, className) {
    $selector.each(function (i) {
        if (i % 2 == 1) {
            $(this).addClass(className);
        } else {
            $(this).removeClass(className);
        }
    })
}

function addtilemap(obj) {
    var bgmap = $(obj).attr("data").split(";");
    baseLayer = L.tileLayer('', {
        subdomains: ["1", "2", "3", "4"],
        maxZoom: 18,
        minZoom: 4
    }).setUrl(bgmap[0]).addTo(map);
    labelLayer = L.tileLayer('', {
        subdomains: ["1", "2", "3", "4"],
        maxZoom: 18,
        minZoom: 4
    }).setUrl(bgmap[1]).addTo(map);
}

function hide() {
    bottuToggle();
    showOrHiddenLegend($(".tytitl i"));
    showOrHiddenLegend($("#ybnav i"));
    $("#ybnav i").parent().next().hide();
    showOrHiddenLegend1($("#moreinfo1"));
    showOrHiddenLegend1($("#moreinfo2"));
    switchTyphoonnav($("#tynav span"));
    switchTyphoonnav2($("#ybnav span"));
    $(".tytitl i").click();
    $(".conzoom").click();
    counthide -= 100;
}