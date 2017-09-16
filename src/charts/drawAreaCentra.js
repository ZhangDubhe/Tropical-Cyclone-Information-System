// var parseDate = d3.time.format("%b %Y").parse;
var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
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
            // console.log(data);
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

function CenterArea() {
    var container_width = $("#year-area-view").width(),
        container_height = $("#year-area-view table").height();
    console.log("table area : width:",width," height:",height)
    var eachYearHeight = $(".tiny-div").height() + 2;

    var init_year = 1981,
        year = 1981;

    var $svgContainer = $("#year-area-view .svg-container")




    drawYearArea()
    function drawYearArea() {
        for(var i=0;i<=2;i++){
            year = init_year + i;
            $svgContainer.append("<svg id=\"container-"+ year +"\"  width='"+container_width+"' height='"+ eachYearHeight +"' ></svg>");

            var container = d3.select("#container-"+year),
                width = +container.attr("width"),
                height = +container.attr("height");

            var url = "resource/data/typhoon/chart/" + year +".csv";

            d3.csv(url, type, function (data) {

                var symbols = d3.nest()
                    .key(function(d) { return d.id; })
                    .entries(data);
                // Compute the maximum price per symbol, needed for the y-domain.
                // maxValue to store
                symbols.forEach(function(s) {
                    s.maxValue = d3.max(s.values, function(d) { return d.I; });
                });

                var w = +width,
                    h = eachYearHeight-eachYearHeight/10;

                var x = d3.scale.linear()
                    .range([0, width]);

                var y = d3.scale.linear()
                    .range([ eachYearHeight, 0]);

                var area = d3.svg.area()
                    .x(function(d) { return x(d.date); })
                    .y0(function(d) { return h-y(d.I)/2; })
                    .y1(function(d) { return y(d.I)/2; })
                    .interpolate('monotone');

                x.domain([
                    d3.min(symbols, function (s) {
                        return s.values[0].date;
                    }),
                    d3.max(symbols, function (s) {
                        return s.values[s.values.length - 1].date;
                    })
                ]);

                var svg = container.append('g')
                    .attr("class","content")
                    .attr("id","group-"+ year);

                var graphics = container.selectAll('g')
                    .data(symbols)
                    .enter().append('g')
                    //                .attr('transform', 'translate(0,' + (eachYearHeight * (i+1) )+ ')')
                    .attr('class',"normalTyphoon")
                    .attr('id',(function (d) {
                        return d.key;}))
                    .append('path')
                    .attr("class", "area")
                    .attr("class", function (d) {
                        return d.replaceName
                    })
                    .attr("d", function (d) {
                        y.domain([0, d.maxValue]);
                        return area(d.values);
                    })
                    .attr('title',(function (d) {
                        return d.key;}))
                    .on("mouseover",function (d) {
                        $("#typhoonName").html(d.key)
                    });



                function multiple(single) {
                    var g = d3.select(this);
                    y.domain([0, d3.max(single, function(d) {
                        return d.size; })]);
                    g.append("path")
                        .attr("class", "area")
                        .attr("d", area(single));
                    console.log("add area path -svg:\r",g);
                }

                function interpolate(points) {
                    // console.log(points);
                    var x0 = points[0][0], y0 = points[0][1], x1, y1, x2,
                        path = [x0, ",", y0],
                        i = 0,
                        n = points.length;

                    while (++i < n) {
                        x1 = points[i][0];
                        y1 = points[i][1];
                        x2 = (x0 + x1) / 2;
                        path.push("C", x2, ",", y0, " ", x2, ",", y1, " ", x1, ",", y1);
                        x0 = x1;
                        y0 = y1;
                    }
                    return path.join("");
                }
            });
        }
    }

    function createChart(data) {
        // console.log(data)
        var symbol = [],
            charts = [],
            maxDataPoint = 0;
        var container = d3.select("#container-"+year),
            width = +container.attr("width"),
            height = +container.attr("height");

        YEAR = data[0].date.getFullYear();
        var init_Height = (YEAR - 1981)*eachYearHeight;
        var data_length = data.length;

        /*

         return lots of object with:
         {date:"May 2008",
         price:"1400.38",
         symbol:"S&P 500"}
         */
        // Nest data by symbol.
        var symbols = d3.nest()
            .key(function(d) { return d.id; })
            .entries(data);
        // Compute the maximum price per symbol, needed for the y-domain.
        // maxValue to store
        symbols.forEach(function(s) {
            s.maxValue = d3.max(s.values, function(d) { return d.I; });
        });



        var w = +width,
            h = eachYearHeight-eachYearHeight/10;

        console.log("eachYearHeight",eachYearHeight,"single height:",h);
        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([ eachYearHeight, 0]);

        var area = d3.svg.area()
            .x(function(d) { return x(d.date); })
            .interpolate(interpolate)
            // .interpolate("monotone")
            .y0(function(d) { return h-y(d.I)/2; })
            .y1(function(d) { return y(d.I)/2; });

        var xAxis  = d3.svg.axis()
            .scale(x)
            .orient('middle')
            .ticks(12)

        x.domain([
            d3.min(symbols, function (s) {
                return s.values[0].date;
            }),
            d3.max(symbols, function (s) {
                return s.values[s.values.length - 1].date;
            })
        ])

        var svg = container.append('g')
            .attr("class","content")
            .attr("id","group-"+YEAR)


        console.log(data)
//
/*        svg.append('g')
            .attr("class","x axis")
            .call(xAxis)
            .style("fill","white")
            .attr('transform', 'translate(0,' + (eachYearHeight/2 - 4.5) + ')')*/

        var graphics = container.selectAll('g')
            .data(symbols)
            .enter().append('g')
            .attr('class',"normalTyphoon")
            .attr('id',(function (d) {
                return d.key;}))
            .append('path')
            .attr("class", "area")
            .attr("class", function (d) {
                return d.replaceName
            })
            // .attr("d",area)
            .attr("d", function (d) {
                y.domain([0, d.maxValue]);
                return area(d.values);
            })
            .attr('title',(function (d) {
                return d.key;}))
            .on("mouseover",function () {
                d3.select(this).transition().duration(500).attr("fill", "white")
            });



        /*//area
        svg.append("path")
            .attr("class", "area")
            .attr("class", "normalTyphoon")
            .attr("class", function (d) {
                return d.replaceName
            })
            .attr("transform", function(d,i) {
                return "translate(0," + eachYearHeight + ")"
            })
            .attr("d", function (d) {
                y.domain([0, d.maxValue]);
                return area(d.values);
            }).attr('title',(function (d) {
            return d.key;}));*/
        // console.log("add area path - svg：\r", svg);


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
            // console.log(points);
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
        d.I = d.I;
        d.date = parseDate(d.date);
        // console.log(d)
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

    var $yearSelector = $("#dropdownYear").siblings("ul").find(".dropdown-inner ul");
    $yearSelector.html("");
    for(var i = 0;i<30  ;i++) {

        $yearSelector.append("<li>" +
            "<a href=\"#\">"+ data[i].year +"<span class=\"li-right icon-check-tick\"></span> </a>" +
            "</li>");

    }
    $("#dropdownYear").siblings("ul").find(".li-right").click(function () {
        var year = $(this).parent().text()
        // TODO: click year to requir details of each year .
        console.log(year)
        queryEachYear(year)
    });

}

function queryEachYear(year) {
    var data = [];

    console.log("queryEachYear input:", year)
    var url = "../../resource/data/year/" + parseInt(year)  + ".json";

    $.getJSON("src/php/queryEachYear.php",{url:url,queryYear:true,year:year},
        function(result) {
            $rows = $("#all-bar-view").find("td")
            var length = result.totalYear;
            data = result;
            addYearDetails(data)
            console.log("queryEachYear output:", data)
        });
}
function addYearDetails(data) {
    var $nameList = $("#dropdownName").siblings("ul").find(".dropdown-inner ul");
    $nameList.html("");
    console.log("add Year Details into the selector")
    var length = data.length;
    for(var i = 0;i<length ;i++) {
        var name = "";
        if(data[i].name == "-" && data[i].ename == "-"){
            name = "unnamed"}
        else {
            if(data[i].name == "-"){
                name = data[i].ename}
            else{
                name = data[i].name}
        };

        $nameList.append("<li>" +
            "<a href=\"#\">"+ name +"<span ty-id='"+ data[i].tfbh +"' class=\"li-right icon-check-tick\"></span> </a>" +
            "</li>");
    }
    $("#dropdownName").siblings("ul").find(".li-right").click(function () {
        var tyId = $(this).attr("ty-id")
    //    TODO: detail and path
        console.log(tyId)
        getTyphoonDetail(false, tyId)
    });



}

CenterArea();
getData()

