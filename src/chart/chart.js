define(['d3', 'jquery', 'moment', 'lodash','drawArea'], function(d3, jquery, moment,lodash,drawArea) {

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
    // Defines consts
    var MODE_DAY = 'Day';

    // Defines all constant values
    var ONE_SECOND = 1000;
    var MINUTES_PER_DAY = 1440;

    
    // Defines the time format to convert string to datetime.
    var toTime = d3.timeParse('%Y-%m-%d %H:%M:%S');
    var fromTime = d3.timeParse('%H:%M');
    var fromTimeToLong = d3.timeParse('%Y-%m-%d %H:%M');

    var currentTime = null;
    // Defines the hydochart type
    var Chart = function(ele, opt) {
        this.version = '1.0';

        var element = null,// Container element
            option = null, // Options             
            timelines = [], // The processed data
            params = {}; // The parameters for chart drawing

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

        //document.captureEvents(Event.MOUSEMOVE|Event.MOUSEDOWN | Event.MOUSEUP);
        // Get the chart option
        option = $.extend({}, default_option, opt);
        this.draw = function(data) {
            preprocess(data);
            this.refresh();

        }

        this.refresh = function(refreshSize) {
            // Clear all svg elements.
            element.html('');
            var area=new drawArea(option,element,describe,refreshSize);
            area.drawLegend().draw().drawChart(timelines).drawAsix().drawCurrentLine().drawHoverLine().bind_check().bind_dbclick().bind_popover();            
        }//刷新并绘制
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
        }/*处理并准备数据*/

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

    // $('body').find('.popovers').each(function(){
    //     $(this).click(function(e){
    //         $('.popover').remove();
    //         e.preventDefault();
    //         return false;
    //     });
    //     $(this).popover({
    //         trigger : 'click'
    //     });
    // });
    // $('body').click(function(){
    //     $('.popover').remove();
    // });

    //// Exports HydroChart Component ////
    return Chart;
});