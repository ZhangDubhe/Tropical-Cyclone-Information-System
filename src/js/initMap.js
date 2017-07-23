/**
 * Created by Zhang on 2017/7/18.
 */


var terLayer = L.tileLayer("http://t{s}.tianditu.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z};http://t{s}.tianditu.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}",{
        minZoom: 1,
        maxZoom: 19,
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        attribution: "天地图地形服务"
    }),
    vecLayer= L.tileLayer("http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}",{
        id:"geoQ_ChinaGray",
        minZoom: 1,
        maxZoom: 19,
        attribution:"GEOQ 智图"
    }),
     //天地图卫星底图服务
    imgLayer= L.tileLayer("http://t{s}.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}",
        {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
            attribution: "天地图影像服务"
        })
//标注
var labelLayer =L.tileLayer("http://t{s}.tianditu.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}",
        {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
            attribution: "天地图标注服务"
        })
var sea_cener = [30, 123],
    init_china_zoom = 4,
    defLatLon = L.latLng(30, 123);
var basemapLayer = vecLayer;
// init map
var map = L.map('map',{
    center:sea_cener,
    zoom:init_china_zoom,
    layers:basemapLayer
});/*
map = L.map('mapid', {
    zoomControl: false,
    attributionControl: false,
    zoom:init_china_zoom,
    layers:vecLayer
}).setView(defLatLon, 6);*/
var ss = L.Control.coordinates({
    decimals: 4,
    decimalSeperator: ",",
    labelTemplateLat: "纬度: {y}",
    labelTemplateLng: "经度: {x}",
    enableUserInput: false
}).addTo(map);
($(function () {
    $(".icon-layer").click(function () {
        console.log("2")
        $("#map-control-box").show().html(
            "<img id='verLayer' class='active mapLayer' src='img/verLayer.png'/>"+
            "<p role='laber' for='verLayer'>行政区划</p>"+
            "<img id='imgLayer' class='mapLayer' src='img/imgLayer.png'/>"+
        "<p role='laber' for='imgLayer'>影像</p>"+
            "<img id='terLayer' class='mapLayer' src='img/terLayer.png'/>"+
            "<p role='laber' for='terLayer'>地形</p>"+
            "<img id='newLayer' class='mapLayer' src='img/newLayer.png'/>"
        )
    })
    $('img .mapLayer').click(function () {
        $(this).addClass("active")
            .siblings().removeClass("active");
        var mapid = $(this).attr("id");
        if(customBaselayer){
            map.removeLayer(customBaselayer);
        }
        if(mapid=="vecLayer"){
            customBaselayer= vecLayer
            map.addLayer(customBaselayer);
        }else if(mapid=="imgLayer"){
            customBaselayer= imgLayer;
            map.addLayer(customBaselayer);
        }
        else if(mapid=="terLayer"){
            customBaselayer= terLayer;
            map.addLayer(customBaselayer);
        }
        else if(mapid=="terLayer"){
            layer.msg("此功能未开通")
        }
    })
}))