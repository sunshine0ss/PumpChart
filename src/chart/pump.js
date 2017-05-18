define(['d3', 'jQuery', 'moment', 'lodash'], function(d3, jquery, moment) {

    var default_option = {
        padding: {
            top: 20,
            left: 45,
            bottom: 30,
            right: 20
        },
        mode: 'Day',
        showCurrent: true,
        edit: false
    }
    var isEditing = false;
    // Defines consts
    var MODE_DAY = 'Day';

    // Defines all constant values
    var ONE_SECOND = 1000;
    var MINUTES_PER_DAY = 1440;
    var BAR_HEIGHT = 22;
    var BAR_STROKE_WIDTH = 1;
    var BAR_GAP_WIDTH = 10;
    var AXIS_WIDTH = 20;
    var TEXT_WIDTH = 12;
    var TEXT_HEIGHT = 14;
    var EDIT_RECT_WIDTH=4;

    // Defines all class name
    var CLASS_OPEN_STATE = 'rect open_state';
    var CLASS_CLOSE_STATE = 'rect close_state';
    var CLASS_FAULT_STATE = 'rect fault_state';
    var CLASS_INDEFINITE_STATE = 'rect indefinite_state';
    var CLASS_OPEN_TOOLTIP = 'tooltip open_state';
    var CLASS_CLOSE_TOOLTIP = 'tooltip close_state';
    var CLASS_FAULT_TOOLTIP = 'tooltip fault_state';

    // Defines the time format to convert string to datetime.
    var toTime = d3.timeParse('%Y-%m-%d %H:%M:%S');
    var fromTime = d3.timeParse('%H:%M');
    var fromTimeToLong = d3.timeParse('%Y-%m-%d %H:%M');

    var currentTime = null;
    // Defines the hydochart type
    var HydroChart = function(ele, opt) {
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

        var edit_rect_start = null;
        var edit_rect_end = null;
        var edit_text_start = null;
        var edit_text_end = null;

        var searcher = d3.bisector(function(d) {
            return d.time;
        }).left;

        // Get the chart container
        if (isNullOrUndefine(ele)) {
            element = d3.select('body');
        } else {
            if (isString(ele)) {
                element = d3.select(ele);
            } else {
                element = ele;
            }
        }
        element.attr('class', 'hydrochart');

        if (element.setCapture) {
            element.setCapture();
        } else if (window.captureEvents) {
            window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
        }
        //document.captureEvents(Event.MOUSEMOVE|Event.MOUSEDOWN | Event.MOUSEUP);
        // Get the chart option
        option = $.extend({}, default_option, opt);

        //// Defines all instance methods ////

        this.draw = function(data) {
            preprocess(data);
            this.refresh();

            var texts = $('.axis.axis--x').find('text'); //r texts = $('.axis.x').find('text');
            var timeTexts = _.filter(texts, function(d) {
                if (d.innerHTML.includes('00:00') && d.innerHTML != '00:00')
                    return d;
            })
            _.each(timeTexts, function(timeText) {
                var text = timeText.innerHTML;
                var monthText = text.substr(0, 5);

                var b = timeText.cloneNode();

                $(b).attr('y', 21).html(monthText);
                $(timeText).html('00:00')
                var g = timeText.parentElement;
                g.appendChild(b);
            })
        }

        this.refresh = function(refreshSize) {

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
                    if(v.value!=null)
                        v.label = formatValue(parseInt(v.value.toFixed(0)), line.unit, line.type);
                    else
                        v.label ='不定'; 
                }

                // Sort all values by time
                var sorted_values = line.values.sort(function(a, b) {
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
            describe.barNames = d3.map(timelines, function(d) {
                return d.name
            }).keys();
        }

        function beginDraw(refreshSize) {

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

                // Calculate the chart height if not be set.
                var chartHeight = option.padding.top + option.padding.bottom +
                    describe.barCount * (BAR_HEIGHT + BAR_GAP_WIDTH) +
                    AXIS_WIDTH;
                params.size.height = chartHeight;
            } else {
                params.size = option.size;
            }
            
            svg = element
                .append('svg')
                .attr('width', params.size.width)
                .attr('height', params.size.height);

            var xScaleWidth = params.size.width - option.padding.left - option.padding.right;
            xScale = d3.scaleTime()
                .domain([describe.startTime, describe.endTime])
                .nice(d3.timeHour)
                .range([0, xScaleWidth]);

            var yScaleHeight = params.size.height - option.padding.top - option.padding.bottom;
            yScale = d3.scaleBand() //d3.scale.ordinal()
                .domain(describe.barNames)
                .range([0, yScaleHeight]); //.rangeBands([0, yScaleHeight]);

        }

        function drawAxis() {
            xAxis = d3.axisBottom()
                .scale(xScale)
                .tickFormat(
                    function(d) {
                        var data = moment(d).format('HH:mm');
                        if (data == "00:00") {
                            return moment(d).format('MM/DD HH:mm');
                        } else
                            return data;
                    })
                .ticks(24);
            var aa = svg.append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', 'translate(' + option.padding.left + ',' + (params.size.height - option.padding.bottom) + ')')
                .call(xAxis);
            yAxis = d3.axisLeft()
                .scale(yScale);
            svg.append('g')
                .attr('class', 'axis axis--y')
                .attr('transform', 'translate(' + option.padding.left + ',' + option.padding.top + ')')
                .call(yAxis);
        }

        function drawCurve() {
            drawCurveBar();
        }

        function formatClass(d){
            var className=null;
                        if(d.value>0){
                            className=CLASS_OPEN_STATE;
                        }
                        else if(d.value==0){
                            className=CLASS_CLOSE_STATE;

                        }
                        else if(d.value<0){
                            className=CLASS_FAULT_STATE;
                        }
                        else{
                            className=CLASS_INDEFINITE_STATE;
                        }
                        return className;
        }

        function drawCurveBar() {
            _.each(timelines, function(line) {
                // Create svg group for each line
                var top = yScale(line.name) + option.padding.top + ((BAR_HEIGHT - 2) / 2) -
                    describe.barCount * 0.2;
                var g = svg.append('g')
                    .attr('transform', 'translate(' + option.padding.left + ',' + top + ')');
                var rects = g.selectAll('.rect')
                    .data(line.points, function(d) {
                        return d.time;
                    })
                    .enter()
                    .append('rect')
                    .attr('class', function(d, i) {
                        return formatClass(d);
                        // var className=null;
                        // if(d.value>0){
                        //     className=CLASS_OPEN_STATE;
                        // }
                        // else if(d.value==0){
                        //     className=CLASS_CLOSE_STATE;

                        // }
                        // else if(d.value<0){
                        //     className=CLASS_FAULT_STATE;
                        // }
                        // else{
                        //     className=CLASS_INDEFINITE_STATE;
                        // }
                        // return className;
                        //return d.value >= 1 ? CLASS_OPEN_STATE : CLASS_CLOSE_STATE;
                    })
                    .attr('x', function(d, i) {
                        d.x = xScale(d.time);
                        return d.x;
                    })
                    .attr('y', 0)
                    .attr('width', function(d, i) {
                        d.width = 0;
                        if (d.next) {
                            d.width = xScale(d.next.time) - xScale(d.time);
                        }
                        if (d.width < 0) {
                            d.width = 0;
                        }
                        return d.width;
                    })
                    .attr('height', function(d, i) {
                        d.height = BAR_HEIGHT;
                        return BAR_HEIGHT;
                    });
                flushRects();

                function flushRects() {

                    rects.on("click", function(d, i, rects) {
                        var parentWidth = $(this.parentElement).width();

                        isEditing = true;
                        //清除悬浮的线
                        hideHovers();
                        //清楚之前的编辑状态
                        d3.selectAll('.edit_rect').remove();
                        d3.selectAll('.edit_text').remove();
                        edit_rect_start = null;
                        edit_rect_end = null;
                        edit_text_start = null;
                        edit_text_end = null;

                        var curRect = $(rects[i]);
                        var beferRect = null;
                        var afterRect = null;
                        if (i > 0) {
                            beferRect = $(rects[i - 1]);
                        }
                        if (i < rects.length - 2) {
                            afterRect = $(rects[i + 1]);
                        }



                        //左右两边加可拖动的线，并在两条线上显示时间
                        var curRectStartX = parseFloat(curRect.attr('x'));
                        var curRectY = parseFloat(curRect.attr('y')) - 5;

                        //加两个编辑的rect
                        var g = curRect.parent()[0];

                        var d3g = d3.select(g);
                        var isStartDrag = false;
                        var isEndDrag = false;

                        var x = 0;
                        var originalX = null;
                        var isRemoveCur=false;
                        function startRectDragged() {
                            console.log('drag-ing');
                            var pos = d3.mouse(this);
                            x = pos[0] - 2;
                            var maxX = parseFloat(edit_rect_end.attr('x'));
                            if (x >= 0 && x <= maxX) {
                                //改变当前选择的rect并拖动改变其宽度
                                var oldx = parseFloat(edit_rect_start.attr('x'));
                                if (originalX == null)
                                    originalX = oldx;
                                var diffValue = x - oldx;
                                var rectWidth = curRect.width() - diffValue;
                                curRect.attr('x', x).width(rectWidth);

                                d3g.selectAll('.label').filter(function(d, i, texts) {
                                    var curText = $(texts[i]);
                                    var attrX = parseFloat(curText.attr('x')) - 5;
                                    if (attrX == oldx) {
                                        d.x = x;
                                        return true;
                                    }
                                }).attr('x', x + 5);


                                //修改当前编辑的rect和text的位置
                                edit_rect_start.attr('x', x);
                                edit_text_start.attr('x', x)
                                    .text(function() {
                                        return moment(xScale.invert(x)).format('HH:mm');
                                    });

                            }
                            else if(x < 0)
                                x = 0;
                            else if(x > maxX){
                                x = maxX;
                                isRemoveCur=true;
                            }
                        }

                        function startRectDragEnd() {
                            console.log('drag-end');
                            var diffValue = x - originalX;
                            //修改前一个rect的宽度
                            if (beferRect != null) {
                                var beferX = parseFloat(beferRect.attr('x'));
                                var width=beferRect.width();
                                var beferWidth = width+ diffValue;
                                if (beferWidth > 0){//判断是否覆盖前一条
                                    var isMerge=false;
                                    d3g.selectAll('.label').each(function(d, ti, texts) {
                                        if(ti==i){
                                            if(texts[ti].innerHTML==texts[ti-1].innerHTML){
                                                var curText = $(texts[ti]);
                                                curText.remove();
                                                texts = _.toArray(texts); //吧nodelist转成array
                                                texts.splice(ti, 1);
                                                isMerge=true;
                                            }
                                        }
                                    });
                                    if(isMerge){
                                        //状态一样 合并数据
                                        var curWidth=curRect.width()+beferWidth;
                                        curRect.attr('x', beferX).width(curWidth);
                                        //修改当前编辑的rect和text的位置
                                        edit_rect_start.attr('x', beferX);
                                        edit_text_start.attr('x', beferX)
                                            .text(function() {
                                                return moment(xScale.invert(beferX)).format('HH:mm');
                                            });

                                        originalX = beferX;
                                        //移除前一个rect
                                        beferRect.remove();
                                        rects.splice(i - 1, 1);
                                        i = i - 1;
                                        beferRect = $(rects[i - 1]);
                                        flushRects();
                                    }
                                    else
                                        beferRect.width(beferWidth);
                                }
                                else {
                                    originalX = beferX;
                                    //删除前一个rect的label
                                    d3g.selectAll('.label').each(function(d, ti, texts) {
                                        if(ti==i-1){
                                            var curText = $(texts[ti]);
                                            curText.remove();
                                            texts = _.toArray(texts); //吧nodelist转成array
                                            texts.splice(ti, 1);
                                        }
                                    });
                                    //移除前一个rect
                                    beferRect.remove();
                                    rects.splice(i - 1, 1);
                                    i = i - 1;
                                    beferRect = $(rects[i - 1]);
                                    startRectDragEnd();
                                    flushRects();
                                }

                            }
                            else{//如果前面没有rect就加一条灰色不定数据
                                var time = new Date(d.time);
                                time.setHours(0);
                                time.setMinutes(0);
                                time.setSeconds(0);
                                var data={
                                            height:BAR_HEIGHT,
                                            time: time,
                                            value: null,
                                            label: '不定',
                                            next: d,
                                            x:0,
                                            width:x
                                        };
                                //在此之前加一条不定状态的
                                var first=d3.select(g).append('rect')
                                        .datum(data)
                                        .attr('class',CLASS_INDEFINITE_STATE)
                                        .attr('x', 0)
                                        .attr('y', 0)
                                        .attr('width', x)
                                        .attr('height',BAR_HEIGHT).node();
                               
                                rects.splice(0, 0,first);  

                                d3.select(g).append('text')
                                            .datum(data)
                                            .attr('class', 'label')
                                            .text(function(d) {
                                                return d.label;
                                            })
                                            .attr('x',5)
                                            .attr('y', function(d, i) {
                                                return TEXT_HEIGHT;
                                            });

                                beferRect=$(first);
                                i=i+1;
                                flushRects();
                            }
                            //是否删除当前
                            if(isRemoveCur){
                                beferRect.width(beferRect.width()+4);
                                //删除编辑状态
                                d3.selectAll('.edit_rect').remove();
                                d3.selectAll('.edit_text').remove();

                                d3g.selectAll('.label').each(function(d, ti, texts) {
                                        if(ti==i){
                                            var curText = $(texts[ti]);
                                            curText.remove();
                                            texts = _.toArray(texts); //吧nodelist转成array
                                            texts.splice(ti, 1);
                                        }
                                    });
                                //移除当前rect
                                curRect.remove();
                                rects.splice(i, 1);


                                var isMerge=false;
                                //判断前后两条是否可以合并
                                d3g.selectAll('.label').each(function(d, ti, texts) {
                                        if(ti==i-1&&ti<texts.length-1){
                                            if(texts[ti].innerHTML==texts[ti+1].innerHTML){
                                                var curText = $(texts[ti+1]);
                                                curText.remove();
                                                texts = _.toArray(texts); //吧nodelist转成array
                                                texts.splice(ti+1, 1);
                                                isMerge=true;
                                            }
                                        }
                                    });
                                if(isMerge){
                                    var width=beferRect.width()+afterRect.width();
                                    beferRect.width(width);
                                    //删除后一条
                                    afterRect.remove();
                                    rects.splice(i, 1);
                                    afterRect = $(rects[i]);
                                }

                                flushRects(); 
                            }
                        }
                        var startRectDrag = d3.drag()
                            .on("start", function() {
                                x = 0;
                                originalX = null;
                            })
                            .on("drag", startRectDragged)
                            .on("end", startRectDragEnd);

                        edit_rect_start = d3g.append('rect')
                            .attr('class', 'edit_rect')
                            .attr('x', curRectStartX)
                            .attr('y', curRectY)
                            .attr('width', EDIT_RECT_WIDTH)
                            .attr('height', 30)
                            .call(startRectDrag);

                        edit_text_start = d3g.append('text')
                            .attr('class', 'edit_text')
                            .text(function() {
                                return moment(xScale.invert(curRectStartX)).format('HH:mm');
                            })
                            .attr('x', curRectStartX)
                            .attr('y', curRectY);

                        var width = curRect.width();
                        var curRectEndX = curRectStartX + width;

                        function endRectDragged() {
                            var pos = d3.mouse(this);
                            x = pos[0]; // - 2;
                            var minX = parseFloat(edit_rect_start.attr('x'));
                            var maxX=parentWidth - EDIT_RECT_WIDTH;
                            if (x >= minX && x <= maxX) {
                                var oldx = parseFloat(edit_rect_end.attr('x'));
                                if (originalX == null)
                                    originalX = oldx;
                                //改变当前选择的rect并拖动改变其宽度
                                var diffValue = x - oldx;
                                var rectWidth = curRect.width() + diffValue;
                                curRect.width(rectWidth);

                                //修改当前编辑的rect和text的位置
                                edit_rect_end.attr('x', x);
                                edit_text_end.attr('x', x + EDIT_RECT_WIDTH - 31)
                                    .text(function() {
                                        return moment(xScale.invert(x + EDIT_RECT_WIDTH)).format('HH:mm');
                                    });
                            }
                            else if(x<minX){
                                x = minX;
                                isRemoveCur=true;
                            }
                            else if(x>maxX)
                                x = maxX;
                        }

                        function endRectDragEnd() {
                            var diffValue = x - originalX;
                            //修改后一个rect的宽度和位置
                            if (afterRect != null) {
                                var oldwidth=afterRect.width();
                                var afterWidth = oldwidth - diffValue;
                                var oldx = parseFloat(afterRect.attr('x'));
                                var afterX = oldx + diffValue;
                                if (afterWidth > 0){
                                    var isMerge=false;
                                    d3g.selectAll('.label').each(function(d, ti, texts) {
                                        if(ti==i){
                                            if(texts[ti].innerHTML==texts[ti+1].innerHTML){
                                                var curText = $(texts[ti+1]);
                                                curText.remove();
                                                texts = _.toArray(texts); //吧nodelist转成array
                                                texts.splice(ti+1, 1);
                                                isMerge=true;
                                            }
                                        }
                                    });
                                    if(isMerge){
                                        originalX = oldx + oldwidth;
                                        //状态一样 合并数据
                                        var curWidth=curRect.width()+afterWidth-EDIT_RECT_WIDTH;
                                        curRect.width(curWidth);
                                    
                                        //修改当前编辑的rect和text的位置
                                        edit_rect_end.attr('x',originalX-EDIT_RECT_WIDTH);
                                        edit_text_end.attr('x',originalX-EDIT_RECT_WIDTH - 31)
                                            .text(function() {
                                                return moment(xScale.invert(originalX)).format('HH:mm');
                                            });

                                        //移除后一个rect
                                        afterRect.remove();
                                        rects.splice(i + 1, 1);
                                        afterRect = $(rects[i + 1]);
                                        flushRects();
                                    }
                                    else{
                                        afterRect.attr('x', afterX).attr('width', afterWidth);
                                        d3g.selectAll('.label').filter(function(d, ti, texts) {
                                            if(ti==i+1){
                                                return true;
                                            }
                                        }).attr('x', afterX + 5);
                                    }

                                }
                                else {
                                    originalX = oldx + oldwidth;
                                    //删除后一个rect的label
                                    d3g.selectAll('.label').each(function(d, ti, texts) {
                                        if(ti==i+1){
                                            var curText = $(texts[ti]);
                                                curText.remove();
                                                texts = _.toArray(texts); //吧nodelist转成array
                                                texts.splice(ti, 1);
                                            }    
                                    });
                                    afterRect.remove();
                                    rects.splice(i + 1, 1);
                                    afterRect = $(rects[i + 1]);
                                    endRectDragEnd();
                                    flushRects();
                                }
                            }
                            else{
                                var time=xScale.invert(x + EDIT_RECT_WIDTH);
                                var data={
                                            height:BAR_HEIGHT,
                                            time: time,
                                            value: null,
                                            label: '不定',
                                            prev: d
                                        };
                                //在此之前加一条不定状态的
                                var last=d3.select(g).append('rect')
                                        .datum(data)
                                        .attr('class',CLASS_INDEFINITE_STATE)
                                        .attr('x', x + EDIT_RECT_WIDTH)
                                        .attr('y', 0)
                                        .attr('width', Math.abs(diffValue))
                                        .attr('height',BAR_HEIGHT).node();
                                //var index=rects.length-1;
                                rects.splice(rects.length-1, 0,last);  
                                //加text
                                d3.select(g).append('text')
                                            .datum(data)
                                            .attr('class', 'label')
                                            .text(function(d) {
                                                return d.label;
                                            })
                                            .attr('x',x+5)
                                            .attr('y', function(d, i) {
                                                return TEXT_HEIGHT;
                                            });

                                afterRect=$(last);
                                //i=i+1;
                                flushRects();
                            }

                            //是否删除当前
                            if(isRemoveCur){
                                var afterx = parseFloat(afterRect.attr('x'))-4;
                                afterRect.attr('x', afterx).width(afterRect.width()+4);
                                //删除编辑状态
                                d3.selectAll('.edit_rect').remove();
                                d3.selectAll('.edit_text').remove();

                                d3g.selectAll('.label').each(function(d, ti, texts) {
                                        if(ti==i){
                                            var curText = $(texts[ti]);
                                            curText.remove();
                                            texts = _.toArray(texts); //吧nodelist转成array
                                            texts.splice(ti, 1);
                                        }
                                    });
                                //移除当前rect
                                curRect.remove();
                                rects.splice(i, 1);

                                var isMerge=false;
                                //判断前后两条是否可以合并
                                d3g.selectAll('.label').each(function(d, ti, texts) {
                                        if(ti==i-1&&ti<texts.length-1){
                                            if(texts[ti].innerHTML==texts[ti+1].innerHTML){
                                                var curText = $(texts[ti+1]);
                                                curText.remove();
                                                texts = _.toArray(texts); //吧nodelist转成array
                                                texts.splice(ti+1, 1);
                                                isMerge=true;
                                            }
                                        }
                                    });
                                if(isMerge){
                                    var width=beferRect.width()+afterRect.width();
                                    beferRect.width(width);
                                    //删除后一条
                                    afterRect.remove();
                                    rects.splice(i, 1);
                                    afterRect = $(rects[i]);
                                }
                                flushRects(); 
                            }
                        }

                        var endRectDrag = d3.drag()
                            .on("start", function() {
                                x = 0;
                                originalX = null;
                            })
                            .on("drag", endRectDragged)
                            .on("end", endRectDragEnd);

                        edit_rect_end = d3g.append('rect')
                            .attr('class', 'edit_rect')
                            .attr('x', curRectEndX - EDIT_RECT_WIDTH)
                            .attr('y', curRectY)
                            .attr('width', EDIT_RECT_WIDTH)
                            .attr('height', 30)
                            .call(endRectDrag);


                        edit_text_end = d3g.append('text')
                            .attr('class', 'edit_text')
                            .text(function() {
                                return moment(xScale.invert(curRectEndX)).format('HH:mm');
                            })
                            .attr('x', curRectEndX - 31)
                            .attr('y', curRectY);



                    });
                }
                drawCurveText(g, line);
            })
        }

        function drawCurveText(g, line) {
            g.selectAll('.label')
                .data(line.points)
                .enter()
                .append('text')
                .filter(function(d) {
                    return d.width > 15 && d.time !== d.next.time;
                })
                .attr('class', 'label')
                .text(function(d) {
                    return d.label;
                })
                .attr('x', function(d, i) {
                    return xScale(d.time) + 5;
                })
                .attr('y', function(d, i) {
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
            svg.on('mousemove', function() {
                if (!isEditing) {
                    var pos = d3.mouse(this);

                    // Show or hide the hover line and move it.
                    if (inBox(pos[0], pos[1])) {
                        showHovers(pos);
                        //showTooltips(pos);
                        hideCurrentLine();
                    } else {
                        hideHovers();
                        //hideTooltips(pos);
                        showCurrentLine();
                    }
                }
            });

            // Show the current time indicator
            if (option.showCurrent) {

                // Create group of time indicator
                createCurrentTime();
                createCurrentLine();
                showCurrentLine();

                var startTimer = function() {
                    window.setTimeout(function() {
                        currentTime = new Date();
                        showCurrentTime();
                        showCurrentLine();
                        startTimer();
                    }, ONE_SECOND * 10)
                };
                startTimer();
            }
            // if(option.edit)
            //     createEditRect();
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
                .style('opacity', function(d) {
                    return Math.abs(xScale(d) - xScale(time)) < dx ? 0 : 1;
                });
        }

        function moveCurrentTime(time, indicator) {
            var x = xScale(time) + 31; // 11; 重新又设置padding为20，所以要加20;
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
                var x = xScale(currentTime) + 45; //25;重新又设置padding为20，所以要加20
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


        //创建编辑的rect
        function createEditRect() {

            edit_rect_start = svg.append('rect')
                .attr('class', 'edit_rect startEditRect')
                .attr('x', -1)
                .attr('y', -1)
                .attr('width', EDIT_RECT_WIDTH)
                .attr('height', 30);
            edit_text_start = edit_rect_start.append('text')
                .attr('class', 'edit_text_start')
                .attr('x', -1)
                .text('');

            edit_rect_end = svg.append('rect')
                .attr('class', 'edit_rect endEditRect')
                .attr('x', -1)
                .attr('y', -1)
                .attr('width', EDIT_RECT_WIDTH)
                .attr('height', 30);
            edit_text_end = edit_rect_end.append('text')
                .attr('class', 'edit_text_end')
                .attr('x', -1)
                .text('');

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
            var mouseX = pos[0] - 3;
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

        function hideHovers() {
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
            } else {
                if (value === 0) text = '关';
                else if (value < 0) text = '故障';
                else text = value.toString() + ' ' + (unit?(unit.unitText || ""):'');
            }
            return text;
        }
    }


    //// Defines the helper functions ////

    // Check whether the obj is null or undfined.
    var isNullOrUndefine = function(obj) {
        return obj === undefined || obj === null;
    }

    // Check whether the type of the obj is string.
    var isString = function(obj) {
        return isNullOrUndefine(obj) ? false : typeof obj === 'string';
    }

    var getFirst = function(values) {
        return values[0];
    }

    var getLast = function(values) {
        return values[values.length - 1];
    }

    //// Exports HydroChart Component ////
    return HydroChart;
});