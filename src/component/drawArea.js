define(['d3', 'jquery', 'moment', 'lodash','axis','pumpLine','timeLine','handle'], function(d3, jquery, moment,lodash,axis,pumpLine,timeLine,handle) {

    var option=null;
    var element=null;
    var describe=null;

    // Defines all constant values
    var ONE_SECOND = 1000;
    var BAR_HEIGHT = 22;
    var BAR_GAP_WIDTH = 10;
    var AXIS_WIDTH = 20;
    var HANDLE_WIDTH = 4;

    var _this=null;

    // Defines the hydochart type
    var drawArea = function(opt,ele,desc) {
        //Declaration attributes
        this.version = '1.0';
        this.svg =null;
        this.xScale=null;
        this.yScale=null;
        this.lines=[];

        this.params={};
        this.currentTime =null;//当前时间
        this.currentLine=null;//当前时间的分割线
        this.hoverLine=null;//鼠标移动的提示线
        this.startHandle=null;//开始手柄
        this.endHandle=null;

        this.isEditing=false;

        //Make the variable function in the current scope
        option=opt;
        element=ele;
        describe=desc;

    }  
    // Check whether the obj is null or undfined.
    var isNullOrUndefine = function(obj) {
        return obj === undefined || obj === null;
    }
    //The chain method
    drawArea.prototype = {
        draw: function(refreshSize,isShowCurrent,hasHover) {//Create a plot
            // Compute the size of the svg        
            if (refreshSize ||isNullOrUndefine(option.size)) {
                var rect = element.node().getBoundingClientRect();
                if (rect.width == 0 && rect.height == 0) {
                    rect = option.size;
                }
                this.params.size = {
                    width: rect.width,
                    height: rect.height
                };

                // Calculate the chart height if not be set.
                var chartHeight = option.padding.top + option.padding.bottom +
                    describe.barCount * (BAR_HEIGHT + BAR_GAP_WIDTH) +
                    AXIS_WIDTH;
                this.params.size.height = chartHeight;
            } else {
                this.params.size = option.size||{};
            }

            this.svg = element
                .append('svg')
                .attr('width', this.params.size.width)
                .attr('height', this.params.size.height);

            var xScaleWidth = this.params.size.width - option.padding.left - option.padding.right;
            this.xScale = d3.scaleTime()
                .domain([describe.startTime, describe.endTime])
                .nice(d3.timeHour)
                .range([0, xScaleWidth]);

            var yScaleHeight = this.params.size.height - option.padding.top - option.padding.bottom;
            this.yScale = d3.scaleBand() 
                .domain(describe.barNames)
                .range([0, yScaleHeight]); 

            var _this=this;
            // Chech whether the given coordination in available bound.
            function inBox(x, y) {
                return x >= option.padding.left &&
                    x <= _this.params.size.width - option.padding.right &&
                    y >= option.padding.top &&
                    y <= _this.params.size.height - option.padding.bottom + AXIS_WIDTH;
            }
            // Bind mouse events on svg element;   
            this.svg.on('mousemove', function() {
                if(_this.currentLine!=null&&_this.hoverLine!=null){
                    if (!_this.isEditing) {
                        var pos = d3.mouse(this);
                        // Show or hide the hover line and move it.
                        if (inBox(pos[0], pos[1])) {
                            _this.showHoverLine(pos[0]-3);
                            
                            _this.hideCurrentLine();
                        } else {
                            _this.hideHoverLine();
                            _this.showCurrentLine();
                        }
                    }
                }
            });
            return this;
        },
        drawAsix:function(){
            var dAxis=new axis(this.svg,option,this.params,this.xScale,this.yScale);
            dAxis.drawAxis();
            return this;
        },
        drawChart:function(timelines){
            var _this=this;
            _.each(timelines, function(line) {
                var pLine=new pumpLine(_this.svg,_this.xScale,_this.yScale,option,describe);
                pLine.drawLine(line);
                _this.lines.push(pLine);
            })
            return this;
        },
        bind_check:function(){
            var _this=this;
            var curBlock=null;
            var curRect=null;

            //// Defines all private methods ////
            //startHandle in drag
            var startDragged=function(x){
                var x2=parseFloat(curBlock.block.attr('width'))+parseFloat(curBlock.block.attr('x'));
                var width=x2-x;
                curBlock.update(x,null,width);
            }
            //End of the startHandle drag
            var startDragEnd=function(x){
                curBlock.changeLeft();
                if(curBlock.block==null){//判断当前的块是否被删除
                    curBlock=null;
                    //删除选中状态
                    _this.startHandle.removeHandle();
                    _this.endHandle.removeHandle();
                }
                else{
                    if(parseFloat(curBlock.block.attr('width'))<HANDLE_WIDTH+1){//如果当前的快的宽度小于手柄宽度删除当前块
                        var x=parseFloat(curBlock.block.attr('width'))+parseFloat(curBlock.block.attr('x'));
                        curBlock.update(x,null,0);//修改当前快的位置和宽度
                        curBlock.changeLeft();//修改左侧块
                        curBlock.remove();//删除当前块
                        curBlock=null;
                        //删除选中状态
                        _this.startHandle.removeHandle();
                        _this.endHandle.removeHandle();
                    }
                }
            } 
            //endHandle in drag
            var endDragged=function(x){
                var x1=parseFloat(curBlock.block.attr('x'));
                var width=x-x1;
                curBlock.update(x1,null,width);
            }
            //End of the endHandle drag
            var endDragEnd=function(){
                curBlock.changeRight();
                if(curBlock.block==null){//判断当前的块是否被删除
                    curBlock=null;
                    //删除选中状态
                    _this.startHandle.removeHandle();
                    _this.endHandle.removeHandle();
                }
                else{
                    var curWidth=parseFloat(curBlock.block.attr('width'));
                    var curX=parseFloat(curBlock.block.attr('x'));
                    if(curWidth<HANDLE_WIDTH+1){//如果当前的快的宽度小于手柄宽度删除当前块
                        curBlock.update(curX,null,0);//修改当前快的位置和宽度
                        curBlock.changeRight();//修改右侧块
                        curBlock.remove();//删除当前块
                        curBlock=null;
                        //删除选中状态
                        _this.startHandle.removeHandle();
                        _this.endHandle.removeHandle();
                    }
                    else{
                        //当前宽度+当前x位置(前一块宽度)-2(手柄宽度/2)
                        var endHandleX=curWidth+curX-HANDLE_WIDTH;
                        //重新计算结束手柄的位置
                         _this.endHandle.updatePos(endHandleX);
                        //修改手柄的边界值
                        var minX=_this.startHandle.pos[0];
                        var maxX=_this.endHandle.pos[0];
                        _this.startHandle.setMaxX(maxX);
                        _this.endHandle.setMinX(minX);
                    }
                }
            }

            var select=function(i, rects,block){
                curBlock=block;
                _this.hideHoverLine();
                _this.isEditing=true;
                //先清除之前的手柄
                d3.selectAll('.edit_rect').remove();
                d3.selectAll('.edit_text').remove();
                _this.startHandle=null;
                _this.endHandle=null;

                //获取当前选中的块
                curRect = $(rects[i]);
                //获取当前那一行
                var g = curRect.parent()[0];//获取父级
                var parentWidth= curRect.parent().width();//获取父级总宽
                var d3g = d3.select(g);
                
                //计算手柄的位置
                var x = parseFloat(curRect.attr('x'));
                var y = parseFloat(curRect.attr('y')) - 5;//突出handle长度，比当前块高5个像素
                //添加开始手柄
                _this.startHandle=new handle( d3g ,_this.xScale);
                _this.startHandle.drawHandle(x,y).drawHandleText(x,y).drag_Event(null,startDragged,startDragEnd);

                var width = curRect.width();//获取当前块的宽度
                var endX = x + width- HANDLE_WIDTH;//当前位置加选中块的宽度，减去手柄的宽度
                //添加结束手柄
                _this.endHandle=new handle( d3g ,_this.xScale,'end');//时间的文本要在编辑区域内
                _this.endHandle.drawHandle(endX,y).drawHandleText(endX,y).drag_Event(null,endDragged,endDragEnd);//28是:  30(text width)- 2(handle width/2).
                

                var minX=_this.startHandle.pos[0];
                var maxX=_this.endHandle.pos[0];
                _this.startHandle.setMinX(0).setMaxX(maxX);
                _this.endHandle.setMinX(minX).setMaxX(parentWidth);
            }
            _.each(this.lines, function(line) {
                line.checkBlock_Event(select);
            })
        },
        drawCurrentLine:function(){
            //create currentline 
            this.currentLine=new timeLine(this.svg,option,this.params,this.xScale);
            this.currentLine.drawLine('current_line');
            var _this=this;
            //Refresh every minute
            var startTimer = function() {
                window.setTimeout(function() {
                    if(_this.hoverLine&&_this.hoverLine.isShow){
                        return;
                    }
                    else{
                        _this.showCurrentLine();
                    }
                    startTimer();
                }, ONE_SECOND * 10)
            };
            startTimer();
            return this;
        },
        showCurrentLine:function(){
            //Gets the current time
            this.currentTime = new Date();
            var x = this.xScale(this.currentTime) + option.padding.left; 
            this.currentLine.showLine(x);

            return this;
        },
        hideCurrentLine:function(){
            //hide currentline
            this.currentLine.hideLine();
            return this;
        },
        drawHoverLine:function(){
            this.hoverLine=new timeLine(this.svg,option,this.params,this.xScale,true);
            this.hoverLine.drawLine('hover_line','hover_text');

            return this;
        },
        showHoverLine:function(x,y){
            this.hoverLine.showLine(x);
            return this;
        },
        hideHoverLine:function(){
            this.hoverLine.hideLine();
            return this;
        },
        // drawText:function(timelines){
        //     var line_svg=this.svg;
        //     var line_xScale=this.xScale;
        //     var line_yScale=this.yScale;
        //     _.each(timelines, function(line) {
        //         var pLine=new pumpLine(line_svg,line_xScale,line_yScale,option,describe);
        //         pLine.drawLine(line);
        //     })
        //     return this;
        // },
        getSvg:function(){
            return _this.svg;
        },
        getParams:function(){
            return _this.params;
        },
        getxScale:function(){
            return _this.xScale;
        },
        getyScale:function(){
            return _this.yScale;
        },
    }  
    // Check whether the obj is null or undfined.
    var isNullOrUndefine = function(obj) {
        return obj === undefined || obj === null;
    }

    //// Exports stateBlock Component ////
    return drawArea;
});