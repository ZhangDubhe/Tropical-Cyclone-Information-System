/**
 * Created by Zhang on 2017/7/18.
 */
var BaseMapUrl =  "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}";
var ChinaGray = L.tileLayer(BaseMapUrl,{id:"ArcGIS_ChinaGray",attribution:"GEOQ 智图"});
var china_cener = [37.22,110.00],
    init_china_zoom = 3,
    customBaseLayer = ChinaGray; //底图图层

// init map
var map = L.map('map',{
    center:china_cener,
    zoom:init_china_zoom,
    layers:customBaseLayer
});
console.log(map);