var parseDate = d3.time.format("%b %Y").parse;
var margin = {top: 8, right: 0, bottom: 2, left: 0},
    width = 960 - margin.left - margin.right,
    height = 70 - margin.top - margin.bottom,
    padding = -10;

function getData() {
    $.getJSON("src/php/query.php",{draw:'yearFrequence'}, test)
}
function test(result) {
    var array = [],
        data = [];
    for(var i = 0;i< result.length;i++){
        var temp = {year : result.year[i], value : result.count[i]};
        array.push(temp)
    }
    data = array;
    console.log('\r',data);
    draw(data);

}
function draw(data) {
    var width = 150;
    var each_height = 40;
    var height = 700;
    // #length*height;
    var margin = {top:3,left:5,right:5,bottom:3};
    var xScale = d3.scale.linear().range([0,(width- margin.left - margin.right)/2]);    //X轴和Y轴
    var yScale = d3.scale.ordinal().rangeRoundBands([0,height - margin.top - margin.bottom],0.1);   //
    var svg = d3.select("#all-bar-view")
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
        .attr("transform","translate("+ width/2 +"," + margin.top +")");
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
        .attr("height", function () {
            return yScale.rangeBand();
        })
        .attr("fill","#fff");
    bar1.selectAll("text").data(data).enter()
        .append("text")
        .attr("x", function (d) {
            return 0;
        })
        .attr("y", function (d) {
            return yScale(d.year)+yScale.rangeBand();
        })
        .attr("class","bar-text")
        .text(function (d) {
            return d.year + ':' +d.value;
        })

}
function CenterArea() {

//data.tsv takes a file path and a callback function
//     data_path = 'resource/data/data.tsv';
    // d3.tsv(data_path, type, createChart);
    data_path = ""
    //读取json传输的数据
    d3.json(data_path, type, function (data) {
        createChart(data)
    });

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

        var svg = d3.select("#year-area-view").selectAll("svg")
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
