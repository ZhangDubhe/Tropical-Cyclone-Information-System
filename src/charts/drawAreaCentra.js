var parseDate = d3.time.format("%b %Y").parse;
var margin = {top: 8, right: 0, bottom: 2, left: 0},
    width = 960 - margin.left - margin.right,
    height = 70 - margin.top - margin.bottom,
    padding = -10;

//获取系统提交的URL的格式
function getUrl(provider, assembly, method) {
    return "http://www.readearth.com/publictyphoon/PatrolHandler.ashx?provider=" + provider + "&assembly=" + assembly + "&method=" + method;
}

function getData() {
    var data ;
    var url = getUrl("Readearth.PublicSrviceGIS.BLL.TyphoonBLL", "Readearth.PublicSrviceGIS.BLL", "GetTyhoonByYear");
    $.getJSON("src/php/queryYear.php",{url:url,queryYear:true},
        function(result) {
            console.log("query!")
            $rows = $("#all-bar-view").find("td")
            var length = result.totalYear
            var array = [],
                year = 1981;
            for(var i=0; i<length;i++){

                $($rows[i]).html("")
                var temp = {year : year, value : result.count[year]};
                array.push(temp)
                year = year + 1;

            }

            data = array;
            console.log(data);
            drawYearBar(data);
            addYearBarInfo(data);
        }
    );

}

function drawYearBar(data) {
    var width = $("#all-bar-view").width();
    var each_height = 10;
    var height = $("#all-bar-view table").height();
    // #length*height;
    var margin = {top:10,left:0,right:5,bottom:10};
    // TODO: PADDING OF EACHOTHER
    var xScale = d3.scale.linear().range([0,(width - margin.left - margin.right)/2]);    //X轴和Y轴
    var yScale = d3.scale.ordinal().rangeRoundBands([0,height],0);   //
    var svg = d3.select("#all-bar-view .svg-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

     //对加载的数据排序
    xScale.domain([0,d3.max(data, function (d) {
        return parseFloat(d.value);
    })]);
    yScale.domain(data.map(function(d){return d.year}));
    bar1 = svg.append("g")
        .attr("class","bar")
        .attr("transform","translate("+ 0 +"," + margin.top +")");
    bar1.selectAll("rect").data(data).enter()
        .append("rect")
        .attr("x", function (d) {
            return 0;
        })
        .attr("y", function (d) {
            return yScale(d.year);
        })
        .attr("width", function (d) {
            return xScale(d.value);
        })
        .attr("height", each_height)
        .attr("fill","#fff");
    bar1.selectAll("text").data(data).enter()
        .append("text")
        .attr("x", function (d) {
            return xScale(d.value)+5;
        })
        .attr("y", function (d) {
            return yScale(d.year)+10;
        })
        .attr("class","bar-text")
        .text(function (d) {
            return d.value;
        })
}
function queryEachYear() {
    var url = getUrl("Readearth.PublicSrviceGIS.BLL.TyphoonBLL", "Readearth.PublicSrviceGIS.BLL", "GetTyhoonByYear");
    var data = [];
    $.getJSON("src/php/queryEachYearDetails.php",{url:url,queryYear:true,year:1981},
        function(result) {
            $rows = $("#all-bar-view").find("td")
            var length = result.totalYear,
                data = []


            data = array;
        });
    return data;
}

function CenterArea(data) {
    var width = $("#year-area-view").width(),
        height = $("#year-area-view table").height();
    var eachYearHeight = 20;
    // #length*height;
    var margin = {top:5,left:0,right:5,bottom:5};
    var year =1981;
    for(var i;i<=0;i++){
        year ++;
        drawOneYear(year);
    }

    function drawOneYear(year) {
        data = queryEachYear()
        //读取json传输的数据
        createChart(data,yPosition)
    }

    createChart(data,yPosition)

    function createChart(data) {
        var symbol = [],
            charts = [],
            maxDataPoint = 0;
        var data_length = data.length;

        console.log(data);
        /*

         return lots of object with:
         {date:"May 2008",
         price:"1400.38",
         symbol:"S&P 500"}
         */
        // Nest data by symbol.
        var symbols = d3.nest()
            .key(function(d) { return d.symbol; })
            .entries(data);
        // Compute the maximum price per symbol, needed for the y-domain.
        // maxValue to store
        symbols.forEach(function(s) {
            s.maxValue = d3.max(s.values, function(d) { return d.price; });
        });



        var w = +width,
            h = (+height-20 - (+padding*(data.length-1))) / data.length;
        console.log("width:",w," height:",h);
        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var area = d3.svg.area()
            .x(function(d) { return x(d.date); })
            .interpolate(interpolate)
            .y0(function(d) { return h-y(d.price)/2; })
            .y1(function(d) { return y(d.price)/2; });


        x.domain([
            d3.min(symbols, function (s) {
                return s.values[0].date;
            }),
            d3.max(symbols, function (s) {
                return s.values[s.values.length - 1].date;
            })
        ])

        var svg = d3.select("#year-area-view .svg-container").selectAll("svg")
            .data(symbols)
            .enter().append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "svg-control")
            .style("top",height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        //area
        svg.append("path")
            .attr("class", "area")
            .attr("transform", function(d,i) {
                return "translate(0," + ((h+padding)*i) + ")"
            })
            .attr("d", function (d) {
                y.domain([0, d.maxValue]);
                return area(d.values);
            }).attr('title',(function (d) {
            return d.key;}));
        console.log("add area path - svg：\r", svg);


        function multiple(single) {
            var g = d3.select(this);
            y.domain([0, d3.max(single, function(d) {
                return d.size; })]);
            // y.domain([0, d3.max(data, function(layer) { return d3.max(layer, function(d) { return d.size; }); })])
            g.append("path")
                .attr("class", "area")
                .attr("d", area(single));
            console.log("add area path -svg:\r",g);
            /*g.append("path")
                .attr("class", "line")
                .attr("d", line(single));
            console.log("add line path - svg：\r", g);*/
        }
        function interpolate(points) {
            console.log(points);
            var x0 = points[0][0], y0 = points[0][1], x1, y1, x2,
                path = [x0, ",", y0],
                i = 0,
                n = points.length;

            while (++i < n) {
                x1 = points[i][0], y1 = points[i][1], x2 = (x0 + x1) / 2;
                path.push("C", x2, ",", y0, " ", x2, ",", y1, " ", x1, ",", y1);
                x0 = x1, y0 = y1;
            }
            return path.join("");
        }
    }
    function type(d) {
        d.price = +d.price;
        d.date = parseDate(d.date);
        return d;
    }
}


function example() {
    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var area = d3.svg.area()
        .x(function (d) {
            return x(d.date);
        })
        .y0(height)
        .y1(function (d) {
            return y(d.price);
        });

    var line = d3.svg.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.price);
        });

//data.tsv takes a file path and a callback function
    data_path = 'resource/data/data.tsv';
    d3.tsv(data_path, type, simpleAreaChart);
    function simpleAreaChart(data) {

        // Nest data by symbol.
        var symbols = d3.nest()
            .key(function (d) {
                return d.symbol;
            })
            .entries(data);

        // Compute the maximum price per symbol, needed for the y-domain.
        symbols.forEach(function (s) {
            s.maxValue = d3.max(s.values, function (d) {
                return d.price;
            });
        });

        // Compute the minimum and maximum date across symbols.
        // We assume values are sorted by date.
        x.domain([
            d3.min(symbols, function (s) {
                return s.values[0].date;
            }),
            d3.max(symbols, function (s) {
                return s.values[s.values.length - 1].date;
            })
        ]);

        // Add an SVG element for each symbol, with the desired dimensions and margin.
        var svg = d3.select("#year-area-view").selectAll("svg")
            .data(symbols)
            .enter().append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Add the area path elements. Note: the y-domain is set per element.
        svg.append("path")
            .attr("class", "area")
            .attr("d", function (d) {
                y.domain([0, d.maxValue]);
                return area(d.values);
            }).attr('title',(function (d) {
            return d.key;}));


        // Add a small label for the symbol name.
        svg.append("text")
            .attr("x", width - 6)
            .attr("y", height - 6)
            .attr("class", "chart-inner")
            .style("text-anchor", "end")
            .text(function (d) {
                return d.key;
            });

    }
    function type(d) {
        d.price = +d.price;
        d.date = parseDate(d.date);
        return d;
    }
}


function addYearBarInfo(data) {

    var $yearSelector = $("#dropdownYear").siblings("ul").find(".dropdown-inner>ul");
    $yearSelector.html("");
    for(var i = 0;i<30  ;i++) {

        $yearSelector.append("<li>" +
            "<a href=\"#\">"+ data[i].year +"<span class=\"li-right icon-check-tick\"></span> </a>" +
            "</li>");

    }
    $().click(function () {
        var year = ""
        // TODO: click year to requir details of each year .
        requryYearDetails(year)
    });

}

function requryYearDetails(year) {

}


// CenterArea();
getData()