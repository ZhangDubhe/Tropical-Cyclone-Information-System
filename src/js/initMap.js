/**
 * Created by Zhang on 2017/7/18.
 */
var arcgisBaseMapUrl =  "http://cache1.arcgisonline.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}",
    arcgisChinaGray = L.tileLayer(arcgisBaseMapUrl,{id:"ArcGIS_ChinaGray",attribution:"ArcGIS Online"}),
    retinaMap = L.layerGroup([
        L.esri.basemapLayer('DarkGray', {
            detectRetina: true
        }),
// include the labels at normal resolution
        L.esri.basemapLayer('DarkGrayLabels')
    ]

);
var china_cener = [37.22,110.00],
    init_china_zoom = 4,
    customBaseLayer = arcgisChinaGray; //底图图层

// init map
var map = L.map('map',{
    center:china_cener,
    zoom:init_china_zoom,
    layers:customBaseLayer
});
