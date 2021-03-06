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
        edit: false,
        drag:false,        
        isContinue:true,//是否延续状态
        xStartTime:null,//x轴开始时间
        xEndTime:null,//y轴开始时间
        xInterval:15,//x轴时间间隔,单位：分
        legendBtn_fn:null,//图例操作按钮点击事件
        click_fn:null,//block块点击事件
        dbclick_fn:null,//双击事件
        popover_fn:null,//弹框改变事件
        startHandleDragEnd_fn:null,//开始手柄拖动事件
        endHandleDragEnd_fn:null,//结束手柄拖动事件
        dragStart_fn:null,//拖动开始事件
        dragging_fn:null,//拖动中事件
        dragEnd_fn:null//拖动结束事件
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

    var dicState={
        CLASS_OPEN_STATE:{'text':'开','class':'rect open_state'},
        CLASS_CLOSE_STATE:{'text':'关','class':'rect close_state'},
        CLASS_FAULT_STATE:{'text':'故障','class':'rect fault_state'},
        CLASS_INDEFINITE_STATE:{'text':'不定','class':'rect indefinite_state'}
    }


    // Check whether the obj is null or undfined.
    var isNullOrUndefine = function(obj) {
        return obj === undefined || obj === null;
    }

    var formatValue = function (value, type,format,unit) {
            type = type.toLowerCase();
            var text = '';
            if (type == "csp") {
                if (value === 0) text = dicState.CLASS_CLOSE_STATE.text;
                else if (value > 0) text = dicState.CLASS_OPEN_STATE.text;
                else if (value < 0) text = dicState.CLASS_FAULT_STATE.text;
            } else {
                if (value === 0) text = dicState.CLASS_CLOSE_STATE.text;
                else if (value < 0) text = dicState.CLASS_FAULT_STATE.text;
                else {
                    if(!isNullOrUndefine(format)){//判断是个格式转换
                        if (format.indexOf('.') != -1) {
                            var startIndex = format.indexOf('.') + 1;
                            format = format.substring(startIndex).length;
                            value = parseFloat(value).toFixed(format);
                        }
                    }
                    text = value.toString() + ' ' + (unit?(unit.unitText || ""):'')
                };
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

    // Defines the pumpChart type
    var pumpChart = function(ele, opt) {
        this.version = '1.0';

        this.element = null;// Container element
        this.option = null;// Options             
        this.timelines = []; // The processed data
        //this.params = {}; // The parameters for pumpChart drawing
        this.describe = null;

        // Get the pumpChart container
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

        // Get the pumpChart option
        this.option = $.extend({}, default_option, opt);
        if (this.option.xStartTime)
            this.option.xStartTime = new Date(this.option.xStartTime);
        if (this.option.xEndTime)
            this.option.xEndTime = new Date(this.option.xEndTime);
        // if(!this.option.isContinue){//延续状态，x轴开始结束无效
        //     if(this.option.xStartTime)
        //         this.option.xStartTime=new Date(this.option.xStartTime)
        //     if(this.option.xEndTime)
        //         this.option.xEndTime=new Date(this.option.xEndTime)
        // }
        // else{
        //     this.option.xStartTime=null;
        //     this.option.xEndTime=null;
        // }
    }
    //链式方法
    pumpChart.prototype = {
        preprocess:function(data) {
            var _this=this;
            // Clear timelines
            _this.timelines = [];
            _this.describe = {
                startTime: null,
                endTime: null,
                barNames: null,
                barCount: 0
            };

            // Process the raw data.
            _.each(data,function(d){
                // Clone and protected the raw data.
                var line = $.extend({}, d);
                _this.timelines.push(line);
                var values=[];
                // Try to convert time string to Date object.
                _.forEach(line.values,function(v,index) {
                    //新增判断，是否在开始结束时间内
                    if (isString(v.time)) {
                        v.time = toTime(v.time);
                    }
                    if(v.value!=null)
                        v.label = formatValue(parseFloat(v.value), line.type, line.format, line.unit);
                    else
                        v.label =dicState.CLASS_INDEFINITE_STATE.text; 
                    if(v.unitText==undefined)
                        v.unitText=line.unitText||'';

                    if (_this.option.xStartTime){
                        if(v.time<_this.option.xStartTime){
                            var next=line.values[index+1];
                            if(next&&next.time<_this.option.xStartTime){
                                return;
                            }
                            else{
                                v.time=_this.option.xStartTime;
                            }
                        }
                    }
                    if (_this.option.xEndTime&&v.time>_this.option.xEndTime){
                        v.time=_this.option.xEndTime;
                        values.push(v);
                        return false;
                    }
                    values.push(v);
                })

                // Sort all values by time
                var sorted_values = values.sort(function(a, b) {
                    return a.time - b.time;
                });

                var lastTime=null;
                // Merges the points with same value.
                var merged_values = [sorted_values[0]];
                if (sorted_values.length == 1)
                    lastTime = moment(sorted_values[0].time).startOf('day').add(1, 'day');
                for (var i = 1, j = sorted_values.length; i < j; i++) {
                    if (sorted_values[i].value !== sorted_values[i - 1].value) {
                        merged_values.push(sorted_values[i]);
                    }
                    if (i == sorted_values.length - 1) {
                        //跨天的数据处理
                        if (sorted_values[i].time.getDate() !== sorted_values[i - 1].time.getDate()) {
                            if(sorted_values[i].value !== sorted_values[i - 1].value){
                                merged_values.push(sorted_values[i]);
                            }
                        }  
                        lastTime = moment(sorted_values[i].time).startOf('day').add(1, 'day');
                    }
                    // if(i>2&&sorted_values[i - 1].value == sorted_values[i - 2].value){
                    //     var last=merged_values.length-2;
                    //     if(last>0)
                    //         _.remove(merged_values,merged_values[last]);
                    // }
                }

                // Make sure that the pump curve at least 2 points
                // if (merged_values.length == 1) {
                //     var time = new Date(merged_values[0].time);
                //     time.setDate(time.getDate() + 1);
                //     time.setHours(0);
                //     time.setMinutes(0);
                //     time.setSeconds(0);
                //     if(_this.option.xEndTime)
                //         time =_this.option.xEndTime

                //     var point = {
                //         time: time,
                //         value: null,
                //         label: dicState.CLASS_INDEFINITE_STATE.text,
                //         unitText:line.unitText||''
                //     }
                //     merged_values.push(point);
                // }

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
                    var firstTime=new Date(first.time);
                    firstTime.setHours(0);
                    firstTime.setMinutes(0);
                    if(_this.option.xStartTime){
                        firstTime=_this.option.xStartTime;
                    }
                    if (first.time>firstTime) {
                        if(_this.option.isContinue){//前后延续状态
                            first.time=firstTime;
                        }
                        else{//不延续，没数据设置为不定
                            var firstpoint = {
                            time: firstTime,
                            value: null,
                            label: dicState.CLASS_INDEFINITE_STATE.text,
                            unitText:line.unitText||'',
                            next: first
                            }
                            merged_values.unshift(firstpoint);
                        }
                    }
                    _this.describe.startTime = firstTime;

                    var last = getLast(merged_values);
                    if(_this.option.xEndTime)
                        lastTime=_this.option.xEndTime;
                    // else if(last.time.getHours() !== 0 ||
                    //     last.time.getMinutes() !== 0){
                        // TODO: to process the timeline if the last point is not 23:59 or 0:00 in next day
                        
                        // lastTime.setDate(lastTime.getDate() + 1);
                        // lastTime.setHours(0);
                        // lastTime.setMinutes(0);
                        // lastTime.setSeconds(0);
                    // }
                    lastTime = new Date(lastTime);
                    
                    if (last.time<lastTime) {
                        if(!_this.option.isContinue){//如果不延续，则吧最后一个数据改成不定
                            last.value=null;
                            last.label= dicState.CLASS_INDEFINITE_STATE.text;
                        }
                        // var lastIndex=merged_values.length-1;
                        // if(merged_values[lastIndex - 1].value == merged_values[lastIndex].value){
                        //     _.remove(merged_values,merged_values[lastIndex]);
                        //     last=getLast(merged_values);
                        // }//删除重复数据

                        var point = {
                            time: lastTime,
                            value: null,
                            label: dicState.CLASS_INDEFINITE_STATE.text,
                            unitText:line.unitText||'',
                            prev: last
                        }
                        last.next = point;
                        merged_values.push(point);
                    }
                    else if(last.time>lastTime)
                        last.time=lastTime;
                    _this.describe.endTime = lastTime;
                }

                // Rename points property
                line.points = merged_values;
                delete line.values;
            })
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
                this.area.drawLegend(this.option.legendBtn_fn);
            this.area.draw().drawChart(this.timelines).drawAsix();//绘制曲线

            if(this.option.showCurrent)//是否显示当前提示线
                this.area.drawCurrentLine();
            if(this.option.showHover)//是否显示鼠标悬浮提示
                this.area.drawHoverLine();
            if(this.option.edit)
                this.area.bind_check(this.option.click_fn,this.option.startHandleDragEnd_fn,this.option.endHandleDragEnd_fn).bind_dbclick(this.option.dbclick_fn).bind_popover(this.option.popover_fn);
            if(this.option.drag)//是否可拖拽
                this.area.bind_drag(this.option.dragStart_fn,this.option.dragging_fn,this.option.dragEnd_fn);
            return this;   
        },//刷新并绘制
        draw: function(data,stateClass) {
            if (isNullOrUndefine(data)) {
                console.warn("Input data is null or undfined.");
                return null;
            }
            if(!isNullOrUndefine(stateClass))
                dicState=stateClass;
            this.preprocess(data);//准备数据
            this.element.html('');
            this.area=new drawArea(this.option,this.element,this.describe);//绘制绘图区
            if(this.option.showLegend)//是否画编辑按钮
                this.area.drawLegend(this.option.legendBtn_fn);
            this.area.draw().drawChart(this.timelines,dicState).drawAsix();//绘制曲线

            if(this.option.showCurrent)//是否显示当前提示线
                this.area.drawCurrentLine();
            if(this.option.showHover)//是否显示鼠标悬浮提示
                this.area.drawHoverLine();
            if(this.option.edit)//是否可编辑
                this.area.bind_check(this.option.click_fn,this.option.startHandleDragEnd_fn,this.option.endHandleDragEnd_fn).bind_dbclick(this.option.dbclick_fn).bind_popover(this.option.popover_fn);
            if(this.option.drag)//是否可拖拽
                this.area.bind_drag(this.option.dragStart_fn,this.option.dragging_fn,this.option.dragEnd_fn);
            return this;   //.drawCurrentLine().drawHoverLine().bind_check().bind_dbclick().bind_popover();
        },//根据数据绘制
        drawLegend:function(legendBtn_fn){
            this.option.legendBtn_fn=legendBtn_fn;
            this.area.drawLegend(this.option.legendBtn_fn);
            return this;
        },//图例,增删改 按钮
        drawCurrentLine:function(){
            this.area.drawCurrentLine();
            return this;
        },//当前时间显示的时间线
        drawHoverLine:function(){
            this.area.drawHoverLine();
            return this;
        },//鼠标移动显示的时间线
        addLine:function(line){
            return this.area.addLine(line);
        },
        bind_check:function(click_fn,startHandleDragEnd_fn,endHandleDragEnd_fn){
            this.option.click_fn=click_fn;
            this.option.startHandleDragEnd_fn=startHandleDragEnd_fn;
            this.option.endHandleDragEnd_fn=endHandleDragEnd_fn;
            this.area.bind_check(click_fn,startHandleDragEnd_fn,endHandleDragEnd_fn);
            return this;
        },//绑定鼠标点击事件
        bind_dbclick:function(dbclick_fn){
            this.option.dbclick_fn=dbclick_fn;
            this.area.bind_dbclick(dbclick_fn);
            return this;
        },//绑定鼠标双击事件
        bind_drag:function(dragStart_fn,dragging_fn,dragEnd_fn){
            this.option.dragStart_fn=dragStart_fn;
            this.option.dragging_fn=dragging_fn;
            this.option.dragEnd_fn=dragEnd_fn;
            this.area.bind_drag(dragStart_fn,dragging_fn,dragEnd_fn);
            return this;
        },//拖拽事件
        bind_popover:function(popover_fn){
            this.option.popover_fn=popover_fn;
            this.area.bind_popover(popover_fn);
            return this;
        },//绑定修改的弹框
        changeBlockData:function(valtext,block){
            this.area.changeBlockData(valtext,block);
            return this;
        },//修改块的状态/值
        getxScale: function() {
            var xScale=this.area.getxScale();
            return xScale;
        },//获取x轴的比例尺
        getyScale: function() {
            var yScale=this.area.getyScale();
            return yScale;
        },//获取y轴的比例尺
        getStartHandle: function() {
            var startHandle=this.area.getStartHandle();
            return startHandle;
        },//获取拖动的开始手柄
        getEndHandle: function() {
            var endHandle=this.area.getEndHandle();
            return endHandle;
        },//获取拖动的结束手柄
        getData:function(){
            var newData=this.area.getData();
            //this.preprocess(newData);
            _.each(newData,function(data){
                if(data.points.length>0){
                    var newPoints=[];
                    var sameValue=null;
                    _.each(data.points,function(point){
                        if(sameValue==null){
                            sameValue=point.value;
                            newPoints.push(point);
                        }
                        if(point.value!=sameValue){
                            sameValue=point.value;
                            newPoints.push(point);
                        }
                    })
                    //data.oldPoint=_.cloneDeep(data.points);
                    data.points=newPoints;
                }
            })
            return newData;
        },//获取修改后的数据
        removeSvg: function() {
            this.area.remove();
            return this;
        }, //删除当前画布
        removeChart: function() {
            this.area.removeChart();
            return this;
        }, //删除当前chart
    }

    //// Exports pumpChart Component ////
    return { pumpChart: pumpChart };
});