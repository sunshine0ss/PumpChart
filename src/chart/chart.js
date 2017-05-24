﻿define(['d3', 'jQuery', 'moment', 'lodash','drawArea'], function(d3, jquery, moment,lodash,drawArea) {

    var default_option = {
        padding: {
            top: 20,
            left: 45,
            bottom: 30,
            right: 20
        },
        mode: 'Day',
        showCurrent: true,
        showHover:true,
        showLegend:false,
        edit: false
    }
    // Defines consts
    var MODE_DAY = 'Day';

    // Defines all constant values
    var ONE_SECOND = 1000;
    var MINUTES_PER_DAY = 1440;

    
    // Defines the time format to convert string to datetime.
    var toTime = d3.timeParse('%Y-%m-%d %H:%M:%S');
    var fromTime = d3.timeParse('%H:%M');
    var fromTimeToLong = d3.timeParse('%Y-%m-%d %H:%M');

    // Defines the chart type
    var chart = function(ele, opt) {
        this.version = '1.0';

        this.element = null;// Container element
        this.option = null;// Options             
        this.timelines = []; // The processed data
        //this.params = {}; // The parameters for chart drawing
        this.describe = null;

        // Get the chart container
        if (isNullOrUndefine(ele)) {
            this.element = d3.select('body');
        } else {
            if (isString(ele)) {
                this.element = d3.select(ele);
            } else {
                this.element = ele;
            }
        }
        this.element.attr('class', 'hydrochart');

        // Get the chart option
        this.option = $.extend({}, default_option, opt);
    }

    // Check whether the obj is null or undfined.
    var isNullOrUndefine = function(obj) {
        return obj === undefined || obj === null;
    }

    var formatValue = function (value, unit, type) {
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

    //链式方法
    chart.prototype = {
        preprocess:function(data) {
            var _this=this;
            if (isNullOrUndefine(data)) {
                console.warn("Input data is null or undfined.");
                return null;
            }
            // Clear timelines
            _this.timelines = [];
            _this.describe = {
                startTime: null,
                endTime: null,
                barNames: null,
                barCount: 0
            };

            // Process the raw data.
            for (var i in data) {
                // Clone and protected the raw data.
                var line = $.extend({}, data[i]);
                _this.timelines.push(line);

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
                if (_this.option.mode == MODE_DAY) {
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
                            value: null,
                            label: '不定',
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
                    if (_this.describe.startTime === null || point.time <= _this.describe.startTime) {
                        _this.describe.startTime = point.time;
                    }
                    if (_this.describe.endTime === null || point.time >= _this.describe.endTime) {
                        _this.describe.endTime = point.time;
                    }
                }
            }

            // To statistic the values
            _this.describe.barCount = _this.timelines.length;
            _this.describe.barNames = d3.map(_this.timelines, function(d) {
                return d.name
            }).keys();
        },/*处理并准备数据*/
        refresh : function(refreshSize) {
            // Clear all svg elements.
            this.element.html('');
            this.area=new drawArea(this.option,this.element,this.describe,refreshSize);
            if(this.option.showLegend)//是否画编辑按钮
                this.area.drawLegend();
            this.area.draw().drawChart(this.timelines).drawAsix();//绘制曲线

            if(this.option.showCurrent)//是否显示当前提示线
                this.area.drawCurrentLine();
            if(this.option.showHover)//是否显示鼠标悬浮提示
                this.area.drawHoverLine();
            if(this.option.edit)
                this.area.bind_check().bind_dbclick().bind_popover();
            return this; 
            return this;   
        },//刷新并绘制
        draw: function(data) {
            this.preprocess(data);
            this.element.html('');
            this.area=new drawArea(this.option,this.element,this.describe);
            if(this.option.showLegend)//是否画编辑按钮
                this.area.drawLegend();
            this.area.draw().drawChart(this.timelines).drawAsix();//绘制曲线

            if(this.option.showCurrent)//是否显示当前提示线
                this.area.drawCurrentLine();
            if(this.option.showHover)//是否显示鼠标悬浮提示
                this.area.drawHoverLine();
            if(this.option.edit)
                this.area.bind_check().bind_dbclick().bind_popover();
            return this;   //.drawCurrentLine().drawHoverLine().bind_check().bind_dbclick().bind_popover();
        },
        drawLegend:function(){
            this.area.drawLegend();
            return this;
        },
        drawCurrentLine:function(){
            this.area.drawCurrentLine();
            return this;
        },
        drawHoverLine:function(){
            this.area.drawHoverLine();
            return this;
        },
        bind_check:function(){
            this.area.bind_check();
            return this;
        },
        bind_dbclick:function(){
            this.area.bind_dbclick();
            return this;
        },
        bind_popover:function(){
            this.area.bind_popover();
            return this;
        },
        getData:function(){
            var newData=this.area.getData();
            this.preprocess(newData);
            return this.timelines;
        }
    }

    //// Exports chart Component ////
    return { chart: chart };
});