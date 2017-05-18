define(['d3','jQuery','moment','lodash','./linechart'], function(d3,jquery,moment,loadsh,linechart) {

    var default_option = {
        padding: {
            top: 20,
            left: 45,
            bottom: 30,
            right: 20
        },
        mode: 'Day',
        showCurrent: true,
    }

    // Defines consts
    var MODE_DAY = 'Day';
    var MODE_MONTH = 'Month';

    // Defines all constant values
    var ONE_SECOND = 1000;
    var MINUTES_PER_DAY = 1440;
    var BAR_HEIGHT = 22;//泵图的高度
    var BAR_STROKE_WIDTH = 1;
    var BAR_GAP_WIDTH = 10;
    var AXIS_WIDTH = 20;
    var TEXT_WIDTH = 12;
    var TEXT_HEIGHT = 14;
    var LINE_HEIGHT = 60;

    // Defines all class name
    var CLASS_OPEN_STATE = 'rect open_state';
    var CLASS_CLOSE_STATE = 'rect close_state';
    var CLASS_FAULT_STATE = 'rect fault_state';
    var CLASS_OPEN_TOOLTIP = 'tooltip open_state';
    var CLASS_CLOSE_TOOLTIP = 'tooltip close_state';
    var CLASS_FAULT_TOOLTIP = 'tooltip fault_state';

    // Defines the time format to convert string to datetime.
    var toTime =d3.timeParse('%Y-%m-%d %H:%M:%S');
    var fromTime =d3.timeParse('%H:%M');
    var fromTimeToLong =d3.timeParse('%Y-%m-%d %H:%M');

    var currentTime = null;
    // Defines the hydochart type
    var HydroChart = function (ele, opt) {
        this.version = '1.0';

        var element = null, // Container element
            option = null, // Options             
            timelines = [], // The processed data
            params = {}; // The parameters for chart drawing

        var svg = null,
            xScale = null,
            yScale = null,
            xAxis = null,
            yAxis = null;

        var hoverLine = null,
            hoverText = null;
        var currentLine = null;

        var timeIndicator = null;

        var searcher = d3.bisector(function (d) {
            return d.time;
        }).left;

        // Get the chart container
        if (isNullOrUndefine(ele)) {
            element = d3.select('body');
        } 
        else {
            if (isString(ele)) {
                element = d3.select(ele);
            } else {
                element = ele;
            }
        }
        element.attr('class', 'hydrochart');

        // Get the chart option
        option = $.extend({}, default_option, opt);
        var xScaleWidth =0;
        var yScaleHeight=0;
        //// Defines all instance methods ////

        this.draw = function (data) {
            preprocess(data);
            this.refresh();

            var texts = $('.axis.axis--x').find('text');//r texts = $('.axis.x').find('text');
            var timeTexts = _.filter(texts, function (d) {
                if (d.innerHTML.includes('00:00') && d.innerHTML != '00:00')
                    return d;
            })
            _.each(timeTexts, function (timeText) {
                var text = timeText.innerHTML;
                var monthText = text.substr(0, 5);

                var b = timeText.cloneNode();

                $(b).attr('y', 21).html(monthText);
                $(timeText).html('00:00')
                var g = timeText.parentElement;
                g.appendChild(b);
            })
        }

        this.refresh = function (refreshSize) {

            // Clear all svg elements.
            element.html('');

            beginDraw(refreshSize);
            drawCurve();
            drawAxis();
            endDraw();
        }

        //// Defines all private methods ////

        var describe = null;

        function preprocess(data) {
            if (isNullOrUndefine(data)) {
                console.warn("Input data is null or undfined.");
                return null;
            }

            // Clear timelines
            timelines = [];
            describe = {
                startTime: null,
                endTime: null,
                barNames: null,
                barCount: 0
            };

            // Process the raw data.
            for (var i in data) {
                // Clone and protected the raw data.
                var line = $.extend({}, data[i]);
                timelines.push(line);

                // Try to convert time string to Date object.
                for (var i in line.values) {
                    var v = line.values[i];
                    if (isString(v.time)) {
                        v.time = toTime(v.time);
                    }
                    v.label = formatValue(parseInt(v.value.toFixed(0)), line.unit, line.type);
                }

                // Sort all values by time
                var sorted_values = line.values.sort(function (a, b) {
                    return a.time - b.time;
                });

                // Merges the points with same value.
                var merged_values = [sorted_values[0]];
                for (var i = 1, j = sorted_values.length; i < j; i++) {
                    if (sorted_values[i].value !== sorted_values[i - 1].value) {
                        merged_values.push(sorted_values[i]);
                    }
                }

                // Make sure that the pump curve at least 2 points
                if (merged_values.length == 1) {
                    var time = new Date(merged_values[0].time);
                    time.setDate(time.getDate() + 1);
                    time.setHours(0);
                    time.setMinutes(0);
                    time.setSeconds(0);

                    var point = {
                        time: time,
                        value: merged_values[0].value,
                        label: merged_values[0].label
                    }
                    merged_values.push(point);
                }

                for (var i = 0, j = merged_values.length; i < j; i++) {
                    var v = merged_values[i];

                    // Make relation between neibour values  
                    if (i > 0) {
                        v.prev = merged_values[i - 1];
                    }
                    if (i < j - 1) {
                        v.next = merged_values[i + 1];
                    }
                }

                // Day Mode
                // The time of first point should 0:00 and 
                // The time of last point should 0:00 in next day.
                if (option.mode == MODE_DAY) {
                    var first = getFirst(merged_values);
                    if (first.time.getHours() !== 0 || first.time.getMinutes() !== 0) {
                        first.time.setHours(0);
                        first.time.setMinutes(0);
                    }

                    var last = getLast(merged_values);
                    if (last.time.getHours() !== 0 ||
                        last.time.getMinutes() !== 0 ||
                        moment(last.time).format() !== moment(first.time).add(1, 'day').format()) {
                        // TODO: to process the timeline if the last point is not 23:59 or 0:00 in next day
                        var time = new Date(last.time);
                        time.setDate(time.getDate() + 1);
                        time.setHours(0);
                        time.setMinutes(0);
                        time.setSeconds(0);

                        var point = {
                            time: time,
                            value: last.value,
                            label: last.label,
                            prev: last
                        }
                        last.next = point;
                        merged_values.push(point);
                    }
                }

                // Rename points property
                line.points = merged_values;
                delete line.values;

                for (var i in line.points) {
                    var point = line.points[i];
                    if (describe.startTime === null || point.time <= describe.startTime) {
                        describe.startTime = point.time;
                    }
                    if (describe.endTime === null || point.time >= describe.endTime) {
                        describe.endTime = point.time;
                    }
                }
            }

            // To statistic the values
            describe.barCount = timelines.length;
            describe.barNames = d3.map(timelines, function (d) {
                return d.name
            }).keys();
        }

        function beginDraw(refreshSize) {
            var lineH=0;
            // Compute the size of the svg        
            if (refreshSize || isNullOrUndefine(option.size)) {
                var rect = element.node().getBoundingClientRect();
                if (rect.width == 0 && rect.height == 0) {
                    rect = option.size;
                }
                params.size = {
                    width: rect.width,
                    height: rect.height
                };
                var lines=_.filter(timelines,{'seriesType':'line'});
                var pumps=_.filter(timelines,{'seriesType':'pump'});

                // var lineCount=0;
                // var pumpCount=0;
                // var lineHeight=LINE_HEIGHT;
                // var pumpHeight=BAR_HEIGHT;
                
                var chartHeight=0;
                if(lines.length>0){
                    _.each(lines,function(line){
                        if(line.seriesHeight)
                            chartHeight=chartHeight+parseInt(line.seriesHeight)+BAR_GAP_WIDTH;
                        else{
                            line.seriesHeight=BAR_HEIGHT;
                            chartHeight=chartHeight+BAR_HEIGHT+BAR_GAP_WIDTH;
                        }
                    })
                }
                if(pumps.length>0){
                    _.each(pumps,function(pump){
                        if(pump.seriesHeight)
                            chartHeight=chartHeight+parseInt(pump.seriesHeight)+BAR_GAP_WIDTH;
                        else{
                            pump.seriesHeight=BAR_HEIGHT;
                            chartHeight=chartHeight+BAR_HEIGHT+BAR_GAP_WIDTH;
                        }
                    })
                }

                // Calculate the chart height if not be set.
                chartHeight += option.padding.top + option.padding.bottom + AXIS_WIDTH;

                // var chartHeight = option.padding.top + option.padding.bottom +
                //     describe.barCount * (BAR_HEIGHT + BAR_GAP_WIDTH) +
                //     AXIS_WIDTH;
                params.size.height = chartHeight;
            } else {
                params.size = option.size;
            }

            svg = element
                .append('svg')
                .attr('width', params.size.width)
                .attr('height', params.size.height);

            xScaleWidth = params.size.width - option.padding.left - option.padding.right;
            xScale = d3.scaleTime()
                .domain([describe.startTime, describe.endTime])
                .nice(d3.timeHour)
                .range([0, xScaleWidth]);

            yScaleHeight = params.size.height - option.padding.top - option.padding.bottom;
            yScale = d3.scaleBand()
                .domain(describe.barNames)
                //.range([0,yScaleHeight]);
                //.bandwidth(d3.extent(timelines, function(l) { return l.seriesHeight; }))
                .range([0, yScaleHeight-60,yScaleHeight]);

        }

        function drawAxis() {
            xAxis = d3.axisBottom()
                .scale(xScale)
                .tickFormat(
                function (d) {
                    var data = moment(d).format('HH:mm');
                    if (data == "00:00") {
                        return moment(d).format('MM/DD HH:mm');
                    }
                    else
                        return data;
                })
                .ticks(24);
            var aa = svg.append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', 'translate(' + option.padding.left + ',' + (params.size.height - option.padding.bottom) + ')')
                .call(xAxis);
            // xAxis = d3.svg.axis()
            //     .scale(xScale)
            //     .tickFormat(
            //     function (d) {
            //         var data = d.format('HH:MM');
            //         if (data == "00:00") {
            //             return d.format('mm/dd HH:MM');
            //         }
            //         else
            //             return data;
            //     })
            //     .ticks(24)
            //     .orient('bottom');
            // var aa = svg.append('g')
            //     .attr('class', 'axis x')
            //     .attr('transform', 'translate(' + option.padding.left + ',' + (params.size.height - option.padding.bottom) + ')')
            //     .call(xAxis);

            yAxis = d3.axisLeft()
                .scale(yScale);
            svg.append('g')
                .attr('class', 'axis axis--y')
                .attr('transform', 'translate(' + option.padding.left + ',' + option.padding.top + ')')
                .call(yAxis);
            // yAxis = d3.svg.axis()
            //     .scale(yScale)
            //     .orient('left');
            // svg.append('g')
            //     .attr('class', 'axis y')
            //     .attr('transform', 'translate(' + option.padding.left + ',' + option.padding.top + ')')
            //     .call(yAxis);
        }

        function drawCurve() {
            drawCurveBar();
        }

        function drawCurveBar() {
            _.each(timelines,function(line){
                // Create svg group for each line

                if(line.seriesType=='pump'){

                    // Create svg group for each line
                    var top = yScale(line.name) + option.padding.top + ((BAR_HEIGHT - 2) / 2)
                              - describe.barCount * 0.2;

                    var g = svg.append('g')
                        .attr('transform', 'translate(' + option.padding.left + ',' + top + ')');
                    var rects = g.selectAll('.rect')
                    .data(line.points, function (d) {
                        return d.time;
                    })
                    .enter()
                    .append('rect')
                    .attr('class', function (d, i) {
                        return d.value >= 1 ? CLASS_OPEN_STATE : CLASS_CLOSE_STATE;
                    })
                    .attr('x', function (d, i) {
                        d.x = xScale(d.time);
                        return d.x;
                    })
                    .attr('y', 0)
                    .attr('width', function (d, i) {
                        d.width = 0;
                        if (d.next) {
                            d.width = xScale(d.next.time) - xScale(d.time);
                        }
                        if (d.width < 0) {
                            d.width = 0;
                        }
                        return d.width;
                    })
                    .attr('height', function (d, i) {
                        d.height = BAR_HEIGHT;
                        return BAR_HEIGHT;
                    });

                    drawCurveText(g, line);
                }
                else if(line.seriesType=='line'){
                    // var lineOption = {
                    //     element: g,
                    //     width:xScaleWidth,
                    //     height:yScaleHeight,
                    //     data:line.points
                    //  }

                    // var lineChart =linechart(lineOption); 
                    var gHeight=BAR_HEIGHT;
                    if(line.seriesHeight)
                        gHeight=parseInt(line.seriesHeight);
                    var top = yScale(line.name) + option.padding.top + ((gHeight - 2) / 2)
                              - describe.barCount * 0.2;

                    var g = svg.append('g')
                        .attr('transform', 'translate(' + option.padding.left + ',' + top + ')');

                    //y轴
                    var y = d3.scaleLinear()
                        .domain(d3.extent(line.points, function(d) { return d.value; }))
                        .rangeRound([gHeight,0])

                    var d3line = d3.line()
                        .x(function(d) {
                            return xScale(d.time);//x(d.time);
                        })
                        .y(function(d) {
                            return y(d.value);
                        });
                        // .select(".domain")
                        // .remove();

                    g.append("g")
                        .call(d3.axisLeft(y))
                        .append("text")
                        .attr("fill", "#000")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", "0.71em")
                        .attr("text-anchor", "end")
                        .text("水量");
                     g.append("path")
                        .datum(line.points)
                        .attr("fill", "none")
                        .attr("stroke", "steelblue")
                        .attr("stroke-linejoin", "round")
                        .attr("stroke-linecap", "round")
                        .attr("stroke-width", 1.5)
                        .attr("d", d3line)
                        .attr('height',gHeight );

                    drawCurveText(g, line);
                }
                

            })
        }

        function drawCurveText(g, line) {
            g.selectAll('.label')
                .data(line.points)
                .enter()
                .append('text')
                .filter(function (d) {
                    return d.width > 15 && d.time !== d.next.time;
                })
                .attr('class', 'label')
                .text(function (d) {
                    return d.label;
                })
                .attr('x', function (d, i) {
                    return xScale(d.time) + 5;
                })
                .attr('y', function (d, i) {
                    return TEXT_HEIGHT;
                });
        }

        // To draw drag handler if edit is on.
        function drawDragHandler() {

        }

        function endDraw() {
            createHovers();
            // createTooltips();
            currentTime = new Date();
            // Bind mouse events on svg element;            
            svg.on('mousemove', function () {
                var pos = d3.mouse(this);

                // Show or hide the hover line and move it.
                if (inBox(pos[0], pos[1])) {
                    showHovers(pos);
                    //showTooltips(pos);
                    hideCurrentLine();
                } else {
                    hideHovers(pos);
                    //hideTooltips(pos);
                    showCurrentLine();
                }
            });

            // Show the current time indicator
            if (option.showCurrent) {

                // Create group of time indicator
                createCurrentTime();
                createCurrentLine();
                showCurrentLine();

                var startTimer = function () {
                    window.setTimeout(function () {
                        currentTime = new Date();
                        showCurrentTime();
                        showCurrentLine();
                        startTimer();
                    }, ONE_SECOND * 10)
                };
                startTimer();
            }
        }
        //创建当前时间的文本
        function createCurrentTime() {
            //var now = new Date();
            timeIndicator = svg.append('g');
            moveCurrentTime(currentTime, timeIndicator);

            //var x = xScale(currentTime) + 25;

            timeIndicator.append('text')
                .attr('class', 'time_indicator')
                .attr('x', 9)
                .text('^')
            timeIndicator.append('text')
                .attr('class', 'time_indicator_text')
                .attr('y', 5)
                .text(fromTime(currentTime));

            hideAxisText(currentTime);
        }
        //显示当前时间的文本
        function showCurrentTime() {
            //var now = new Date();
            moveCurrentTime(currentTime, timeIndicator);
            timeIndicator.select('text.time_indicator_text')
                .text(fromTime(currentTime));
            hideAxisText(currentTime);
        }

        // To hide axis x text if current time covered on it.
        function hideAxisText(time) {
            var dx = timeIndicator.select('text.time_indicator_text')
                .node()
                .getBoundingClientRect().width;
            svg.selectAll('.axis.x text')
                .transition()
                .duration(100)
                .style('opacity', function (d) {
                    return Math.abs(xScale(d) - xScale(time)) < dx ? 0 : 1;
                });
        }

        function moveCurrentTime(time, indicator) {
            var x = xScale(time) + 31;// 11; 重新又设置padding为20，所以要加20;
            var y = params.size.height - option.padding.bottom + 12;
            indicator.attr('transform', 'translate(' + x + ',' + y + ')')
        }

        //创建当前时间的线
        function createCurrentLine() {

            currentLine = svg.append("line")
                .attr('class', 'current_line')
                .classed("hide", false)
                .attr("x1", -1)
                .attr("x2", -1)
                .attr("y1", option.padding.top)
                .attr("y2", params.size.height - option.padding.bottom);

        }
        //显示当前时间的线
        function showCurrentLine() {
            //如果鼠标悬浮的线没消失就不显示
            if (hoverLine.attr("x1") == -1) {
                //var time = new Date();
                var x = xScale(currentTime) + 45;//25;重新又设置padding为20，所以要加20
                currentLine.classed("hide", false)
                    .attr("x1", x)
                    .attr("x2", x)
            }

        }

        // To hide axis x text if current time covered on it.
        function hideCurrentLine() {
            currentLine.classed("hide", true)
              .attr("x1", -1)
              .attr("x2", -1)
        }


        function createHovers() {
            // Create the mouse pointer line
            hoverLine = svg.append("line")
                .attr('class', 'hover_line')
                .classed("hide", false)
                .attr("x1", -1)
                .attr("x2", -1)
                .attr("y1", option.padding.top)
                .attr("y2", params.size.height - option.padding.bottom);

            // Create the hover text.

            hoverText = svg.append('text')
                .attr('class', 'hover_text')
                .text('00:00')
                .style('opacity', 0)
                .attr('x', -1)
                .attr('y', option.padding.top + 8);

        }

        function showHovers(pos) {
            var mouseX = pos[0];
            hoverLine.classed("hide", false)
                .attr("x1", mouseX)
                .attr("x2", mouseX)


            var time = xScale.invert(mouseX - option.padding.left);
            var text = time.toLocaleTimeString('zh-CN', {
                hour12: false
            }).substr(0, 5);
            hoverText.style('opacity', 1)
                .text(text)
                .attr("x", mouseX + 5);

        }

        function hideHovers(pos) {
            hoverLine.classed("hide", true)
                .attr("x1", -1)
                .attr("x2", -1)

            hoverText.style('opacity', 0)
                .attr("x", -1);

        }

        function createTooltips() {
            for (var i in timelines) {
                var y = yScale(timelines[i].name) + option.padding.top + TEXT_HEIGHT / 2 -
                    Math.round(describe.barCount / 10) * 1;
                var tooltip = svg.append('text')
                    .attr('class', 'tooltip')
                    .text('00:00')
                    .style('opacity', 0)
                    .attr('x', -1)
                    .attr('y', y);
                timelines[i].tooltip = tooltip;
            }
        }

        function showTooltips(pos) {

            // Get the time by mouse x
            var time = xScale.invert(pos[0] - option.padding.left);

            var maxWidth = 0;
            for (var i in timelines) {
                var line = timelines[i];

                // Search the index of nearest time point
                var idx = searcher(line.points, time);
                var point = line.points[idx - 1];
                if (point) {
                    var text = line.name + ' ' + fromTimeToLong(time) + ' ' + point.label;
                    var clazz = point.value >= 1 ? CLASS_OPEN_TOOLTIP : CLASS_CLOSE_TOOLTIP;

                    var tooltip = line.tooltip;
                    tooltip.style('opacity', 10)
                        .text(text)
                        .attr('class', clazz)
                        .attr('x', pos[0] + 5);

                    var width = tooltip.node().getBBox().width;
                    if (width > maxWidth) maxWidth = width;
                }
            }

            // Set tooltip x value.
            if (pos[0] + maxWidth > params.size.width - option.padding.right) {
                for (var i in timelines) {
                    var width = timelines[i].tooltip.node().getBBox().width;
                    var x = pos[0] - width - 5;
                    timelines[i].tooltip
                        .attr('x', x);
                }
            }

        }

        function hideTooltips(pos) {
            for (var i in timelines) {
                timelines[i].tooltip
                    .style('opacity', 0)
                    .attr('x', -1);
            }
        }

        // Chech whether the given coordination in available bound.
        function inBox(x, y) {
            return x >= option.padding.left &&
                x <= params.size.width - option.padding.right &&
                y >= option.padding.top &&
                y <= params.size.height - option.padding.bottom + AXIS_WIDTH;
        }

        function formatValue(value, unit, type) {
            type = type.toLowerCase();
            var text = '';
            if (type == "csp") {
                if (value === 0) text = '关';
                else if (value > 0) text = '开';
                else if (value < 0) text = '故障';
            }
            else
            {
                if (value === 0) text = '关';
                else if (value < 0) text = '故障';
                else text = value.toString() + ' ' + (unit.unitText || "");
            }
            return text;
        }
    }


    //// Defines the helper functions ////

    // Check whether the obj is null or undfined.
    var isNullOrUndefine = function (obj) {
        return obj === undefined || obj === null;
    }

    // Check whether the type of the obj is string.
    var isString = function (obj) {
        return isNullOrUndefine(obj) ? false : typeof obj === 'string';
    }

    var getFirst = function (values) {
        return values[0];
    }

    var getLast = function (values) {
        return values[values.length - 1];
    }

    //// Exports HydroChart Component ////
    return HydroChart;
});