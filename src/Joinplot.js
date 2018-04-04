define(["jquery", "qlik", "./libraries/d3.v4.min", "css!./Joinplot.css", "./initialproperties", "./properties"],
    function ($, qlik, d3, css, initprops, props) {
        "use strict";
        return {
            initialProperties: initprops,
            definition: props,
            support: {
                snapshot: true,
                export: true,
                exportData: true
            },
            paint: function ($element, layout) {


                //--------------------------------------------------------------       
                // START d3 code
                //--------------------------------------------------------------

                // Histogram: https://bl.ocks.org/mbostock/3048450
                // Histogram fix: https://bl.ocks.org/d3noob/96b74d0bd6d11427dd797892551a103c
                // Bins: https://github.com/d3/d3-array/issues/46
                // Scatter: https://bl.ocks.org/sebg/6f7f1dd55e0c52ce5ee0dac2b2769f4b
                // Regression Line: http://trentrichardson.com/2010/04/06/compute-linear-regressions-in-javascript/

                //--------------------------------------------------------------
                // MAIN SVG
                //--------------------------------------------------------------
                function PlotMainSVG() {

                    var svg = d3.select("#" + id).append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .attr("id", "svgContainer" + id);
                }




                //--------------------------------------------------------------
                // HISTOGRAM TOP
                //--------------------------------------------------------------

                function PlotdistplotTop(data) {

                    var formatCount = d3.format(",.0f");

                    var margin = {
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 50
                        },
                        width = (($("#svgContainer" + id).width() - 20) * 0.87 - margin.left - margin.right),
                        height = (($("#svgContainer" + id).height() - 20) * 0.13 - margin.top - margin.bottom);


                    var svg = d3.select("#svgContainer" + id).append("g")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .attr("id", "distplotTop");


                    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


                    var data2 = [];
                    data.forEach(function (d) {
                        data2.push(d.d2Values)
                    });


                    var x = d3.scaleLinear()
                        .range([0, width])
                        .domain(d3.extent(data2))
                        .nice();

                    if (prop.BinsMode_Dropdown == '1') {
                        var thresholds = x.ticks();

                    } else if (prop.BinsMode_Dropdown == '2') {
                        var minThresholds = d3.min(x.domain());
                        var maxThresholds = d3.max(x.domain());
                        var thresholds = d3.range(minThresholds, maxThresholds, (maxThresholds - minThresholds) / prop.nOfBins_String);

                    } else if (prop.BinsMode_Dropdown == '3') {
                        var thresholds = d3.thresholdFreedmanDiaconis(data2, d3.min(data2), d3.max(data2));

                    } else if (prop.BinsMode_Dropdown == '4') {
                        var thresholds = d3.thresholdSturges(data2, d3.min(data2), d3.max(data2));
                    };

                    var histogram = d3.histogram()
                        .domain(x.domain())
                        .thresholds(thresholds);

                    var bins = histogram(data2);
                    //console.log('bins: ', bins)
                    //console.log('bin widths: ' + bins.map(b => (b.x1 - b.x0)));



                    //-----------------------------


                    var y = d3.scaleLinear()
                        .domain([0, d3.max(bins, function (d) {
                            return d.length;
                        })])
                        .range([height, 0]);

                    var bar = g.selectAll(".bar")
                        .data(bins)
                        .enter().append("g")
                        .attr("class", "bar")
                        .attr("transform", function (d) {
                            return "translate(" + x(d.x0) + "," + y(d.length) + ")";
                        });

                    bar.append("rect")
                        .attr("x", 1)
                        .attr("width", function (d) {
                            return x(d.x1) - x(d.x0)
                        })
                        .attr("height", function (d) {
                            return height - y(d.length);
                        })
                        .style("fill", function () {
                            return prop.Distributions_ColorPicker.color
                        })
                        .style("stroke", function () {
                            return prop.Distributions_ColorPicker.color
                        })
                        .on('mousemove', function (d) {

                            tooltip
                                //position
                                .style("left", (x(d.x1) + margin.left - (x(d.x1) - x(d.x0)) / 2) + "px")
                                .style("top", (y(0) + 11) + "px")

                            tooltipInner
                                .html(
                                    'Interval: ' + d3.format(",.4")(d.x0) + ' to ' + d3.format(",.4")(d.x1) +
                                    '<br>' +
                                    'Frequency: ' + d.length
                                )
                                .style("transform", "translate(-50%,0)")

                            var tooltipArrow = tooltipInner.append("div")
                                .attr("class", "lui-tooltip__arrow lui-tooltip__arrow--top");

                        })
                        .on('mouseover', function () {
                            // when mouseover show the tooltip
                            tooltip.style("display", null);
                        })
                        .on('mouseout', function () {
                            // when mouseout hide the tooltip
                            tooltip.style("display", "none");
                        });;


                    g.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3.axisBottom(x)
                            .ticks(0)
                            .tickSizeOuter(0)
                            .tickFormat("")
                        );
                }

                //--------------------------------------------------------------
                // SCATTER PLOT
                //--------------------------------------------------------------
                function PlotScatter(data) {

                    var margin = {
                            top: 10,
                            right: ($("#svgContainer" + id).width() - 20) * 0.13,
                            bottom: 40,
                            left: 50
                        },
                        width = (($("#svgContainer" + id).width() - 20) - margin.left - margin.right),
                        height = (($("#svgContainer" + id).height() - 20) * 0.87 - margin.top - margin.bottom);

                    var x = d3.scaleLinear()
                        .range([0, width]);

                    var y = d3.scaleLinear()
                        .range([height, 0]);


                    var color = d3.scaleOrdinal(eval("d3." + prop.ColourPalette_Dropdown));

                    var xAxis = d3.axisBottom(x).tickFormat(d3.format(xFormat));
                    var yAxis = d3.axisLeft(y).tickFormat(d3.format(yFormat));

                    var svg = d3.select("#svgContainer" + id).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .attr("id", "scatterplot")
                        .attr("y", (($("#svgContainer" + id).height() - 20) * 0.13))
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

                    data.forEach(function (d) {
                        d.d1Values = +d.d1Values;
                        d.d2Values = +d.d2Values;
                    });

                    x.domain(d3.extent(data, function (d) {
                        return d.d2Values;
                    })).nice();
                    y.domain(d3.extent(data, function (d) {
                        return d.d1Values;
                    })).nice();



                    //GRID
                    if (prop.grid_Checkbox) {
                        svg.append("g")
                            .attr("class", "grid")
                            .attr("transform", "translate(0," + height + ")")
                            .call(d3.axisBottom(x)
                                .tickSize(-height)
                                .tickFormat("")
                            )

                        svg.append("g")
                            .attr("class", "grid")
                            .call(d3.axisLeft(y)
                                .tickSize(-width)
                                .tickFormat("")
                            )
                    }

                    // AXIS
                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis)
                        .append("text")
                        .attr("class", "label")
                        .attr("x", width)
                        .attr("y", -6)
                        .style("text-anchor", "end")
                        .style("font-weight", "bold")
                        .text(d2Label);

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("class", "label")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .style("font-weight", "bold")
                        .text(d1Label);



                    //REGRESSION LINE
                    function linearRegression(y, x) {
                        var lr = {};
                        var n = y.length;
                        var sum_x = 0;
                        var sum_y = 0;
                        var sum_xy = 0;
                        var sum_xx = 0;
                        var sum_yy = 0;

                        for (var i = 0; i < y.length; i++) {

                            sum_x += x[i];
                            sum_y += y[i];
                            sum_xy += (x[i] * y[i]);
                            sum_xx += (x[i] * x[i]);
                            sum_yy += (y[i] * y[i]);
                        }

                        lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
                        lr['intercept'] = (sum_y - lr.slope * sum_x) / n;
                        lr['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);

                        return lr;

                    };

                    if (prop.regressionLine_Checkbox) {
                        var yval = data.map(function (d) {
                            return parseFloat(d.d1Values);
                        });
                        var xval = data.map(function (d) {
                            return parseFloat(d.d2Values);
                        });

                        var lr = linearRegression(yval, xval);
                        //console.log(lr);

                        var min = d3.min(x.domain());
                        var max = d3.max(x.domain());

                        var RegressionLine = svg.append("svg:line")
                            .attr("x1", x(min))
                            .attr("y1", y((min * lr.slope) + lr.intercept))
                            .attr("x2", x(max))
                            .attr("y2", y((max * lr.slope) + lr.intercept))
                            .style("stroke", prop.regressionLine_ColorPicker.color)
                            .style("opacity", "0.6")


                        var RegressionLineSelectionArea = svg.append("svg:line")
                            .attr("x1", x(min))
                            .attr("y1", y((min * lr.slope) + lr.intercept))
                            .attr("x2", x(max))
                            .attr("y2", y((max * lr.slope) + lr.intercept))
                            .style("stroke", "black")
                            .style("stroke-width", "20")
                            .style("opacity", "0")

                            .on('mousemove', function () {

                                tooltip
                                    //position
                                    .style("left", (20 + margin.left) + "px")
                                    .style("top", (10 + ($("#svgContainer" + id).height() - 20) * 0.13) + "px")

                                tooltipInner

                                tooltipInner.html(
                                    'Linear regression' +
                                    '<br>' +
                                    'slope: ' + d3.format(',.6f')(lr.slope) +
                                    '<br>' +
                                    'intercept: ' + d3.format(',.6f')(lr.intercept) +
                                    '<br>' +
                                    'r2: ' + d3.format(',.6f')(lr.r2))

                                tooltipInner.style("transform", "translate(0%, 0%)");

                            })
                            .on('mouseover', function () {
                                // when mouseover show the tooltip
                                tooltip.style("display", null);
                            })
                            .on('mouseout', function () {
                                // when mouseout hide the tooltip
                                tooltip.style("display", "none");
                            });;
                    }

                    // DOTS
                    svg.selectAll(".dot")
                        .data(data)
                        .enter().append("circle")
                        .attr("class", "dot")
                        .attr("r", prop.dotsSize_Slider)
                        .attr("cx", function (d) {
                            return x(d.d2Values);
                        })
                        .attr("cy", function (d) {
                            return y(d.d1Values);
                        })
                        .style("fill", function (d) {
                            return color(d.d3Values);
                        })
                        .style("opacity", function () {
                            return prop.dotsOpacity_Slider
                        })
                        .style("stroke-width", function () {
                            if (prop.dotsStroke_Checkbox) {
                                return 1
                            } else {
                                return 0
                            }
                        })
                        //TOOLTIP
                        .on('mousemove', function (d) {

                            tooltip
                                //position
                                .style("left", (x(d.d2Values) + margin.left) + "px")
                                .style("top", (y(d.d1Values) + ($("#svgContainer" + id).height() - 20) * 0.13 - prop.dotsSize_Slider) + "px")

                            tooltipInner

                            if (hypercube.qDimensionInfo.length == 3) {
                                tooltipInner.html(
                                    d3Label + ': ' + d.d3Values +
                                    '<br>' +
                                    d2Label + ': ' + d3.format(xFormat)(d.d2Values) +
                                    '<br>' +
                                    d1Label + ': ' + d3.format(yFormat)(d.d1Values))
                            } else {
                                tooltipInner.html(
                                    d2Label + ': ' + d3.format(xFormat)(d.d2Values) +
                                    '<br>' +
                                    d1Label + ': ' + d3.format(yFormat)(d.d1Values))
                            }


                            tooltipInner.style("transform", "translate(-50%, -100%)");

                            var tooltipArrow = tooltipInner.append("div")
                                .attr("class", "lui-tooltip__arrow lui-tooltip__arrow--bottom");

                        })
                        .on('mouseover', function () {
                            // when mouseover show the tooltip
                            tooltip.style("display", null);
                        })
                        .on('mouseout', function () {
                            // when mouseout hide the tooltip
                            tooltip.style("display", "none");
                        })
                        //Selections
                        .on('click', function (d) {
                            self.backendApi.selectValues(2, [d.dIndex], true); //Quick Selection
                        });




                    // LEGEND
                    if (hypercube.qDimensionInfo.length == 3) {

                        var legend = svg.selectAll(".legend")
                            .data(color.domain())
                            .enter().append("g")
                            .attr("class", "legend")
                            .attr("transform", function (d, i) {
                                return "translate(0," + i * 20 + ")";
                            });

                        legend.append("rect")
                            .attr("x", width - 15)
                            .attr("width", 15)
                            .attr("height", 15)
                            .style("fill", color)
                            .style("opacity", function () {
                                return prop.dotsOpacity_Slider
                            });

                        legend.append("text")
                            .attr("x", width - 18)
                            .attr("y", 6)
                            .attr("dy", ".35em")
                            .text(function (d) {
                                return d;
                            })

                        ;
                    }






                }



                //--------------------------------------------------------------
                // HISTOGRAM RIGHT
                //--------------------------------------------------------------
                function PlotdistplotRight(data) {

                    var formatCount = d3.format(",.0f");

                    var margin = {
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: (($("#svgContainer" + id).height() - 20) * 0.13) + 10
                        },
                        width = (($("#svgContainer" + id).height() - 20) * 0.87 - 40 - 10),
                        height = ((($("#svgContainer" + id).width() - 20) * 0.13) - margin.top - margin.bottom);

                    var svg = d3.select("#svgContainer" + id).append("g")
                        .attr("transform", "translate(" + (($("#svgContainer" + id).width() - 20) + 10) + ",0)rotate(90)")

                    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");



                    var data2 = [];
                    data.forEach(function (d) {
                        data2.push(d.d1Values)
                    });


                    var x = d3.scaleLinear()
                        .range([width, 0])
                        .domain(d3.extent(data2))
                        .nice();

                    if (prop.BinsMode_Dropdown == '1') {
                        var thresholds = x.ticks();

                    } else if (prop.BinsMode_Dropdown == '2') {
                        var minThresholds = d3.min(x.domain());
                        var maxThresholds = d3.max(x.domain());
                        var thresholds = d3.range(minThresholds, maxThresholds, (maxThresholds - minThresholds) / prop.nOfBins_String);

                    } else if (prop.BinsMode_Dropdown == '3') {
                        var thresholds = d3.thresholdFreedmanDiaconis(data2, d3.min(data2), d3.max(data2));

                    } else if (prop.BinsMode_Dropdown == '4') {
                        var thresholds = d3.thresholdSturges(data2, d3.min(data2), d3.max(data2));
                    };

                    var histogram = d3.histogram()
                        .domain(x.domain())
                        .thresholds(thresholds);

                    var bins = histogram(data2);


                    var y = d3.scaleLinear()
                        .domain([0, d3.max(bins, function (d) {
                            return d.length;
                        })])
                        .range([height, 0]);


                    //----------
                    var bar = g.selectAll(".bar")
                        .data(bins)
                        .enter().append("g")
                        .attr("class", "bar")
                        .attr("transform", function (d) {
                            return "translate(" + x(d.x1) + "," + y(d.length) + ")";
                        });

                    bar.append("rect")
                        .attr("x", 1)
                    bar.append("rect")
                        .attr("x", 1)
                        .attr("width", function (d) {
                            return x(d.x0) - x(d.x1);
                        })
                        .attr("height", function (d) {
                            return height - y(d.length);
                        })
                        .style("fill", function () {
                            return prop.Distributions_ColorPicker.color
                        })
                        .style("stroke", function () {
                            return prop.Distributions_ColorPicker.color
                        })
                        .on('mousemove', function (d) {

                            tooltip
                                //position
                                .style("top", (x(d.x1) + (x(d.x0) - x(d.x1)) / 2 + margin.left) + "px")
                                .style("left", ((($("#svgContainer" + id).width() - 20) + 10) - height - 11) + "px")
                                .attr("transform", "translate(" + margin.top + "," + margin.left + ")")

                            tooltipInner
                                .html(
                                    'Interval: ' + d3.format(",.4")(d.x0) + ' to ' + d3.format(",.4")(d.x1) +
                                    '<br>' +
                                    'Frequency: ' + d.length)
                                .style("transform", "translate(-100%,-50%)")

                            var tooltipArrow = tooltipInner.append("div")
                                .attr("class", "lui-tooltip__arrow lui-tooltip__arrow--right");

                        })
                        .on('mouseover', function () {
                            // when mouseover show the tooltip
                            tooltip.style("display", null);
                        })
                        .on('mouseout', function () {
                            // when mouseout hide the tooltip
                            tooltip.style("display", "none");
                        });;

                    g.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3.axisBottom(x)
                            .ticks(0)
                            .tickSizeOuter(0)
                            .tickFormat("")
                        );
                }



                //--------------------------------------------------------------
                // HYPERCUBE
                //--------------------------------------------------------------


                //console.log("> paint");
                var self = this;

                var hypercube = layout.qHyperCube;
                var prop = layout.prop;

                //Push data from the hypercube to the data array
                var data_Grouped = [];

                if (hypercube.qDimensionInfo.length == 3) {
                    hypercube.qDataPages[0].qMatrix.forEach(function (qData) {
                        data_Grouped.push({
                            "d1Values": qData[0].qNum,
                            "d2Values": qData[1].qNum,
                            "d1ValuesText": qData[0].qText,
                            "d2ValuesText": qData[1].qText,
                            "d3Values": qData[2].qText,
                            "instanceCount": qData[3].qNum,
                            "dIndex": qData[2].qElemNumber
                        })
                    });

                    //create rows based on number of instances
                    var data = []
                    data_Grouped.forEach(function (d) {
                        for (var i = 0; i < d.instanceCount; i++) {
                            data.push({
                                "d1Values": d.d1Values,
                                "d2Values": d.d2Values,
                                "d1ValuesText": d.d1ValuesText,
                                "d2ValuesText": d.d2ValuesText,
                                "d3Values": d.d3Values,
                                "dIndex": d.dIndex
                            })
                        }
                    });

                    var d1Label = hypercube.qDimensionInfo[0]['qFallbackTitle'],
                        d2Label = hypercube.qDimensionInfo[1]['qFallbackTitle'],
                        d3Label = hypercube.qDimensionInfo[2]['qFallbackTitle'];

                } else {
                    hypercube.qDataPages[0].qMatrix.forEach(function (qData) {
                        data_Grouped.push({
                            "d1Values": qData[0].qNum,
                            "d2Values": qData[1].qNum,
                            "d1ValuesText": qData[0].qText,
                            "d2ValuesText": qData[1].qText,
                            "instanceCount": qData[2].qNum
                            //,"dIndex": qData[0].qElemNumber
                        })
                    });

                    //create rows based on number of instances
                    var data = []
                    data_Grouped.forEach(function (d) {
                        for (var i = 0; i < d.instanceCount; i++) {
                            data.push({
                                "d1Values": d.d1Values,
                                "d2Values": d.d2Values,
                                "d1ValuesText": d.d1ValuesText,
                                "d2ValuesText": d.d2ValuesText
                            })
                        }
                    });

                    var d1Label = hypercube.qDimensionInfo[0]['qFallbackTitle'],
                        d2Label = hypercube.qDimensionInfo[1]['qFallbackTitle'];
                }


                //console.log(layout);
                //console.log(qlik);
                //console.log(hypercube);
                console.log(data);
                //debugger;

                //definition of margins (set to 0 on the template) and height/width variables
                var margin = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                };

                if (prop.squareShape_Checkbox) {
                    var width = Math.min($element.width() - margin.left - margin.right, $element.height() - margin.top - margin.bottom);
                    var height = width;
                } else {
                    var width = $element.width() - margin.left - margin.right;
                    var height = $element.height() - margin.top - margin.bottom;
                }

                //Assign a unique ID to the $element wrapper
                var id = "ID_D3_" + layout.qInfo.qId;
                $element.attr("id", id);
                //Empty the extension content
                $("#" + id).empty();



                //Tooltip with Leonardo-ui style
                var tooltip = d3.select("#" + id).append("div")
                    .style("display", "none")
                    .style("position", "absolute")
                    .style("opacity", "0.8");

                var tooltipInner = tooltip.append("div")
                    .style("position", "absolute")
                    .attr("class", "lui-tooltip")
                    .style("white-space", "nowrap")
                    .text("");


                //Formats
                if (prop.xFormat_Dropdown == "Custom") {
                    var xFormat = prop.xFormatCustom_String
                } else {
                    var xFormat = prop.xFormat_Dropdown
                }

                if (prop.yFormat_Dropdown == "Custom") {
                    var yFormat = prop.yFormatCustom_String
                } else {
                    var yFormat = prop.yFormat_Dropdown
                }


                //--------------------------------------------------------------
                // EXECUTE
                //--------------------------------------------------------------

                PlotMainSVG()

                PlotdistplotTop(data)
                PlotScatter(data)
                PlotdistplotRight(data)


                //-------------------------------------------------------               
                // END d3 code
                //-------------------------------------------------------

                // needed for exporting/snapshotting
                return qlik.Promise.resolve();

                //console.log("> end of paint");
            }
        };
    });