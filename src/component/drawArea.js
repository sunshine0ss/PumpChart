define(['d3', 'jQuery', 'moment', 'lodash', 'axis', 'pumpLine', 'timeLine', 'handle', 'legend'], function(d3, jquery, moment, lodash, axis, pumpLine, timeLine, handle, legend) {
    // Defines all constant values
    var ONE_SECOND = 1000;
    var BAR_HEIGHT = 22; //默认bar的高度
    var BAR_GAP_WIDTH = 10; //默认
    var AXIS_WIDTH = 20;
    var HANDLE_WIDTH = 4; //默认手柄宽度

    var BLOCK_MIN_VALUE = 0; //数值块的最小值
    var BLOCK_MAX_VALUE = 50; //数值块的最大值

    var BTN_FLOAT = 'right'; //默认按钮浮动位置

    // Check whether the obj is null or undfined.
    var isNullOrUndefine = function(obj) {
        return obj === undefined || obj === null;
    }

    // Defines the hydochart type
    var drawArea = function(opt, ele, desc, refreshSize) {
            //Declaration attributes
            this.version = '1.0';
            this.svg = null; //画布
            this.xScale = null; //x轴比例尺
            this.yScale = null; //y轴比例尺

            this.params = {};
            this.lines = []; //泵图行集合
            this.currentTime = null; //当前时间
            this.currentLine = null; //当前时间的分割线
            this.hoverLine = null; //鼠标移动的提示线
            this.startHandle = null; //开始手柄
            this.endHandle = null; //结束手柄
            this.chartLegend = null; //图例
            this.dAxis = null; //坐标轴
            this.originalData = null; //原始数据
            this.updateData = null; //修改数据

            this.hasChecked = false; //是否有选中
            this.hasDBclick = false; //是否有双击事件
            this.hasPopover = false; //是否有弹出事件

            this.isEditing = false; //是否编辑中
            this.curBlock = null; //当前选中的块
            this.gWIDTH = null;
            //Make the variable function in the current scope
            this.option = opt;
            this.element = ele;
            this.describe = desc;



            // Compute the size of the svg        
            if (refreshSize || isNullOrUndefine(this.option.size)) {
                var rect = this.element.node().getBoundingClientRect();
                if (rect.width == 0 && rect.height == 0) {
                    rect = this.option.size;
                }
                this.params.size = {
                    width: rect.width,
                    height: rect.height
                };

                // Calculate the chart height if not be set.
                var chartHeight = this.option.padding.top + this.option.padding.bottom +
                    this.describe.barCount * (BAR_HEIGHT + BAR_GAP_WIDTH) +
                    AXIS_WIDTH;
                this.params.size.height = chartHeight;
            } else {
                this.params.size = this.option.size || {};
            }
        }
        // Check whether the obj is null or undfined.
    var isNullOrUndefine = function(obj) {
            return obj === undefined || obj === null;
        }
        //The chain method
    drawArea.prototype = {
        draw: function() { //Create a plot
            // Compute the size of the svg        
            //创建画布
            this.svg = this.element
                .append('svg')
                .attr('width', this.params.size.width)
                .attr('height', this.params.size.height);

            //创建x轴的比例尺
            var xScaleWidth = this.params.size.width - this.option.padding.left - this.option.padding.right;
            this.xScale = d3.scaleTime()
                .domain([this.describe.startTime, this.describe.endTime])
                .nice(d3.timeHour)
                .range([0, xScaleWidth]);

            //创建y轴的比例尺
            var yScaleHeight = this.params.size.height - this.option.padding.top - this.option.padding.bottom;
            this.yScale = d3.scaleBand()
                .domain(this.describe.barNames)
                .range([0, yScaleHeight]);

            var _this = this;
            // Chech whether the given coordination in available bound.
            function inBox(x, y) {
                return x >= _this.option.padding.left &&
                    x <= _this.params.size.width - _this.option.padding.right &&
                    y >= _this.option.padding.top &&
                    y <= _this.params.size.height - _this.option.padding.bottom + AXIS_WIDTH;
            }
            // Bind mouse events on svg element;   
            this.svg.on('mousemove', function() {
                if (_this.currentLine != null && _this.hoverLine != null) {
                    if (!_this.isEditing) { //当前不是选中状态，显示当前时间线和鼠标移动提示线
                        var pos = d3.mouse(this);
                        // Show or hide the hover line and move it.
                        if (inBox(pos[0], pos[1])) { //判断鼠标在当前绘图区范围内
                            _this.showHoverLine(pos[0] - 3);
                            _this.hideCurrentLine();
                        } else {
                            _this.hideHoverLine();
                            _this.showCurrentLine();
                        }
                    }
                }
            });
            return this;
        }, //绘制绘图区
        drawAsix: function() {
            this.dAxis = new axis(this.svg, this.option, this.params, this.xScale, this.yScale);
            this.dAxis.drawAxis();
            return this;
        }, //绘制坐标轴
        drawChart: function(timelines) {
            var _this = this;
            this.originalData = timelines;
            this.updateData = _.cloneDeep(timelines);
            _.each(this.updateData, function(line) {
                var pLine = new pumpLine(_this.svg, _this.xScale, _this.yScale, _this.option, _this.describe);
                pLine.drawLine(line);
                _this.lines.push(pLine);
            })
            return this;
        }, //绘制曲线
        drawLegend: function() {
            var _this = this;
            var width = this.params.size.width - this.option.padding.right;

            var click_event = function(ele) {
                var type = $(ele).text();
                if (type == '取消') {
                    _this.refresh();
                } else {
                    if (_this.curBlock != null) {
                        if (type == '新增') {
                            _this.curBlock.insertCentre();
                            _this.bind_popover();
                        } else if (type == '删除') {
                            //删除前一条覆盖当前
                            var width = parseFloat(_this.curBlock.block.attr('width'));
                            _this.curBlock.leftBlock.addWidth(width);
                            _this.curBlock.remove();

                            //删除后一条往前覆盖
                            // _this.curBlock.updateWidth(0);
                            // _this.curBlock.changeRight();
                            // _this.curBlock.remove();
                        }
                        _this.curBlock = null;
                        //删除选中状态
                        _this.removeHandles();
                    }
                }
            }
            this.chartLegend = new legend(this.element);
            this.chartLegend.draw(width).drawCancelBtn(BTN_FLOAT, click_event).drawDeleteBtn(BTN_FLOAT, click_event).drawAddBtn(BTN_FLOAT, click_event);
            return this;
        }, //图例,增删改 按钮
        bind_check: function() {
            var _this = this;
            this.hasChecked = true;
            var curRect = null;
            //// Defines all private methods ////
            //startHandle in drag
            var startDragged = function(x) {
                    var x2 = parseFloat(_this.curBlock.block.attr('width')) + parseFloat(_this.curBlock.block.attr('x'));
                    var width = x2 - x;
                    _this.curBlock.update(x, null, width);
                }
                //End of the startHandle drag
            var startDragEnd = function(x) {
                    _this.curBlock.changeLeft();
                    if (_this.curBlock.block == null) { //判断当前的块是否被删除
                        _this.curBlock = null;
                        //删除选中状态
                        _this.removeHandles();
                    } else {
                        if (parseFloat(_this.curBlock.block.attr('width')) < HANDLE_WIDTH + 1) { //如果当前的快的宽度小于手柄宽度删除当前块
                            var x = parseFloat(_this.curBlock.block.attr('width')) + parseFloat(_this.curBlock.block.attr('x'));
                            _this.curBlock.update(x, null, 0); //修改当前快的位置和宽度
                            _this.curBlock.changeLeft(); //修改左侧块
                            _this.curBlock.remove(); //删除当前块
                            _this.curBlock = null;
                            //删除选中状态
                            _this.removeHandles();
                        }
                    }
                }
                //endHandle in drag
            var endDragged = function(x) {
                    var x1 = parseFloat(_this.curBlock.block.attr('x'));
                    var width = x - x1;
                    _this.curBlock.update(x1, null, width);
                }
                //End of the endHandle drag
            var endDragEnd = function() {
                _this.curBlock.changeRight();
                if (_this.curBlock.block == null) { //判断当前的块是否被删除
                    _this.curBlock = null;
                    //删除选中状态
                    _this.removeHandles();
                } else {
                    var curWidth = parseFloat(_this.curBlock.block.attr('width'));
                    var curX = parseFloat(_this.curBlock.block.attr('x'));
                    if (curWidth < HANDLE_WIDTH + 1) { //如果当前的快的宽度小于手柄宽度删除当前块
                        _this.curBlock.update(curX, null, 0); //修改当前快的位置和宽度
                        _this.curBlock.changeRight(); //修改右侧块
                        _this.curBlock.remove(); //删除当前块
                        _this.curBlock = null;
                        //删除选中状态
                        _this.removeHandles();
                    } else {
                        //当前宽度+当前x位置(前一块宽度)-2(手柄宽度/2)
                        var endHandleX = curWidth + curX;
                        //重新计算结束手柄的位置
                        _this.endHandle.updatePos(endHandleX);
                        //修改手柄的边界值
                        var minX = _this.startHandle.pos[0];
                        var maxX = _this.endHandle.pos[0];

                        if (_this.startHandle != null)
                            _this.startHandle.setMaxX(maxX);

                        if (_this.endHandle != null)
                            _this.endHandle.setMinX(minX);
                    }
                }
            }

            var select = function(i, rects, block) {
                _this.curBlock = block;
                _this.removeHandles(); //清除手柄

                _this.hideHoverLine(); //隐藏提示线
                _this.isEditing = true; //选中：编辑状态
                var label = _this.curBlock.blockData.label;
                /*故障 状态不能新增*/
                if (label == '故障')
                    _this.chartLegend.add_button.setDisabled(true); //如果是故障状态 禁用 新增
                else
                    _this.chartLegend.add_button.setDisabled(false); //其他状态 启用 新增


                /*不定 状态不能删除*/
                if (label == '不定')
                    _this.chartLegend.delete_button.setDisabled(true); //如果是故障状态 禁用 新增
                else
                    _this.chartLegend.delete_button.setDisabled(false); //其他状态 启用 新增

                //获取当前选中的块
                curRect = $(rects[i]);
                //获取当前那一行
                var g = curRect.parent()[0]; //获取父级
                var parentWidth = 0;
                if (_this.gWIDTH == null) {
                    _.each(g.childNodes, function(child) {
                        if (child.tagName == "rect") {
                            var width = parseFloat($(child).attr('width'));
                            parentWidth += width;
                        }
                    })
                    _this.gWIDTH = parentWidth;
                } //获取g的宽度

                //var parentWidth= curRect.parent().width();//获取父级总宽
                var d3g = d3.select(g);

                //计算手柄的位置
                var x = parseFloat(curRect.attr('x'));
                var y = parseFloat(curRect.attr('y')) - 5; //突出handle长度，比当前块高5个像素


                var minX = x;
                if (!(x == 0 && label == '不定')) {
                    //添加开始手柄
                    _this.startHandle = new handle(d3g, _this.xScale);
                    _this.startHandle.drawHandle(x, y).drawHandleText(x, -2).drag_Event(null, startDragged, startDragEnd); //-2是 handle的文体提示与块的间隔
                }
                var width = parseFloat(curRect.attr('width')) //curRect.width();//获取当前块的宽度

                var x2 = x + width;
                var endX = x2 - HANDLE_WIDTH; //当前位置加选中块的宽度，减去手柄的宽度

                if (!(x2 == _this.gWIDTH && label == '不定')) {
                    //添加结束手柄
                    _this.endHandle = new handle(d3g, _this.xScale, 'end'); //时间的文本要在编辑区域内
                    _this.endHandle.drawHandle(endX, y).drawHandleText(endX, -2).drag_Event(null, endDragged, endDragEnd); //28是:  30(text width)- 2(handle width/2).
                }
                //设置手柄的可移动范围
                if (_this.startHandle != null)
                    _this.startHandle.setMinX(0).setMaxX(endX);
                if (_this.endHandle != null)
                    _this.endHandle.setMinX(x + 4).setMaxX(_this.gWIDTH);
            }
            _.each(this.lines, function(line) {
                line.checkBlock_Event(select); //绑定事件
            })
            return this;
        }, //鼠标单击，选中编辑
        updateHandles: function() {
            if (isNullOrUndefine(this.curBlock) || isNullOrUndefine(this.curBlock.block)) {
                this.removeHandles();
            } else {
                var curWidth = parseFloat(this.curBlock.block.attr('width'));
                var curX = parseFloat(this.curBlock.block.attr('x'));
                var endHandleX = curWidth + curX;
                //修改手柄位置
                if (this.endHandle != null)
                    this.endHandle.updatePos(endHandleX);
            }
        }, //更新手柄
        removeHandles: function() {
            this.showHoverLine(); //显示提示线
            this.isEditing = false; //清除选中状态
            //清除手柄
            if (this.startHandle != null)
                this.startHandle.removeHandle();
            if (this.endHandle != null)
                this.endHandle.removeHandle();
            this.startHandle = null;
            this.endHandle = null;
        }, //清除手柄
        bind_dbclick: function() {
            this.hasDBclick = true;
            var _this = this;
            _.each(this.lines, function(line) {
                var changeState = function(i, rects, block) {
                        _this.updateHandles();
                    } //双击回调
                line.dbclick_Event(changeState); //绑定事件
            })
            return this;
        }, //鼠标双击，更改状态
        bind_popover: function() {
            this.hasPopover = true;
            var _this = this;
            //弹出框内容
            function ContentMethod(data) {
                var html = '';
                var val = data.value; //获取当前值
                if (val == null || val == undefined)
                    val = '';
                if (data.blockType == 'state') {
                    html = '<button id="openBtn" class="popoverBtn green" >开</button><button id="closeBtn" class="popoverBtn red" >关</button>';
                } else if (data.blockType == 'numeric') {
                    html = '<input type="number" id="pumpvalue" name="pumpvalue" style="width: 50px" value=' + val + ' max=' + data.maxValue + '><button id="closeBtn" class="popoverBtn red" >关</button>';
                } else if (data.blockType == 'gradient') {
                    html = '<input type="number" id="pumpvalue" name="pumpvalue" style="width: 50px" value=' + val + ' max=' + data.maxValue + '>';
                }
                return html;
            }
            //所有设置弹出框属性的元素绑定弹出
            $("[data-toggle='popover']").each(function(i, e) {
                // var val = e.__data__.value; //获取当前值
                // if (val == null || val == undefined)
                //     val = '';
                var element = $(e);
                element.popover({
                        trigger: 'click', //弹出框的触发事件： click| hover | focus | manual
                        container: "body", //向指定元素中追加弹出框
                        placement: 'top', //弹出框定位方向（即 top|bottom|left|right|auto）
                        html: 'true', //是否解析html标签
                        content: ContentMethod(e.__data__), //弹出框内容
                        animation: false //动画过渡效果

                    }).on("click", function() {
                        var ele = this;
                        var data = ele.__data__;
                        $(ele).popover("show"); //显示弹出框
                        $('#pumpvalue').val(data.value); //更新弹出框的input的值

                        $(ele).siblings("[data-toggle]").on("mouseleave", function() {
                            $(ele).popover('hide');
                        });

                        /*  弹出框事件  */
                        var changeData = function(val) {
                            val.trim();
                            if(_this.curBlock.blockType!='gradient'){
                                if (val == undefined) {
                                    data.value = val;
                                    data.label = '不定';
                                } else {
                                    val = parseInt(val);
                                    data.value = val;
                                    if (val > 0) {
                                        data.label = val;
                                    } else if (val == 0)
                                        data.label = '关';
                                    else if (val < 0)
                                        data.label = '故障';
                                }
                            }
                            else{
                                data.label = val;
                                val = parseInt(val);
                                data.value = val;//获取当前值
                            }
                            //修改值或状态
                            _this.curBlock.updateState(data);
                        }
                            /*  输入框值改变事件  */
                        $('#pumpvalue').on('change', function() {
                                if (this.value < data.minValue) //最小限制
                                    this.value = data.minValue;
                                if (this.value > data.maxValue) //最大限制
                                    this.value = data.maxValue;
                                changeData(this.value); //更新当前块
                                //_this.removeHandles(); //关闭选中状态
                                _this.updateHandles(); //更新手柄
                            }) //值改变事件
                            .on('keyup', function() {
                                if (this.value < data.minValue) //最小限制
                                    this.value = data.minValue;
                                if (this.value > data.maxValue) //最大限制
                                    this.value = data.maxValue;
                                changeData(this.value); //更新当前块
                                //_this.removeHandles(); //关闭选中状态
                                _this.updateHandles(); //更新手柄
                                // var searchText = this.value.trim();//获取当前输入值
                                // if (searchText != _this.previousValue) {
                                //     if (_this.timer) clearTimeout(_this.timer)
                                //     _this.timer = setTimeout(function () {
                                //         if (this.value < data.minValue) //最小限制
                                //             this.value = data.minValue;
                                //         if (this.value > data.maxValue) //最大限制
                                //             this.value = data.maxValue;
                                //         changeData(this.value); //更新当前块
                                //         //_this.removeHandles(); //关闭选中状态
                                //         _this.updateHandles(); //更新手柄
                                //     }, 100);
                                //     _this.previousValue = searchText;
                                // }//延时加载

                            }) //手动输入事件
                            /*  关闭按钮点击事件  */
                        $('#closeBtn').on('click', function() {
                                data.value = 0;
                                data.label = '关';
                                _this.curBlock.updateState(data); //状态修改为关
                                $(ele).popover('hide'); //关掉弹出框
                                _this.removeHandles(); //关闭选中状态
                                //_this.updateHandles();//更新手柄
                            })
                            /*  打开按钮点击事件  */
                        $('#openBtn').on('click', function() {
                            data.value = 1;
                            data.label = '开';
                            _this.curBlock.updateState(data); //状态修改为关
                            $(ele).popover('hide'); //关掉弹出框
                            _this.removeHandles(); //关闭选中状态
                            //_this.updateHandles();//更新手柄
                        })
                    }) //点击事件
                    .on("mouseleave", function() {
                        var that = this;
                        setTimeout(function() {
                            if (!$(".popover:hover").length) {
                                $(that).popover("hide");
                            }
                        }, 100);
                    }); //鼠标移出时删除当前弹出框

            });
        }, //绑定数值弹框
        drawCurrentLine: function() {
            //create currentline 
            this.currentLine = new timeLine(this.svg, this.option, this.params, this.xScale);
            this.currentLine.drawLine('current_line');
            var _this = this;
            //Refresh every minute
            var startTimer = function() {
                window.setTimeout(function() {
                    if (_this.hoverLine && _this.hoverLine.isShow) {
                        return;
                    } else {
                        _this.showCurrentLine();
                    }
                    startTimer();
                }, ONE_SECOND * 10)
            };
            startTimer();
            return this;
        }, //绘制当前时间的提示线
        showCurrentLine: function() {
            //Gets the current time
            this.currentTime = new Date();
            var x = this.xScale(this.currentTime) + this.option.padding.left;
            this.currentLine.showLine(x);

            return this;
        }, //显示当前时间
        hideCurrentLine: function() {
            //hide currentline
            this.currentLine.hideLine();
            return this;
        }, //隐藏当前时间
        drawHoverLine: function() {
            this.hoverLine = new timeLine(this.svg, this.option, this.params, this.xScale, true);
            this.hoverLine.drawLine('hover_line', 'hover_text');

            return this;
        }, //绘制鼠标移动提示线
        showHoverLine: function(x, y) {
            this.hoverLine.showLine(x);
            return this;
        },
        hideHoverLine: function() {
            this.hoverLine.hideLine();
            return this;
        },
        getSvg: function() {
            return _this.svg;
        },
        getParams: function() {
            return _this.params;
        },
        getxScale: function() {
            return _this.xScale;
        },
        getyScale: function() {
            return _this.yScale;
        },
        remove: function() {
            this.svg.remove();
            this.svg = null; //画布
            this.xScale = null; //x轴比例尺
            this.yScale = null; //y轴比例尺
            this.lines = []; //泵图行集合
            this.currentTime = null; //当前时间
            this.currentLine = null; //当前时间的分割线
            this.hoverLine = null; //鼠标移动的提示线
            this.startHandle = null; //开始手柄
            this.endHandle = null; //结束手柄
            this.chartLegend = null; //图例
            this.dAxis = null; //坐标轴
            this.originalData = null; //数据
            this.hasChecked = false; //是否有选中
            this.isEditing = false; //是否编辑中
            this.curBlock = null; //当前选中的块
            //Make the variable function in the current scope
            this.option = opt;
            this.element = ele;
            this.describe = desc;
            return this;
        }, //删除当前画布
        removeChart: function() {
            _.each(this.lines, function(line) {
                line.remove();
            })
            return this;
        }, //删除当前chart
        refresh: function() {
            this.isEditing = false
            this.svg.remove();
            this.draw();
            if (this.originalData != null)
                this.drawChart(this.originalData);
            if (this.dAxis != null)
                this.drawAsix();
            if (this.currentLine)
                this.drawCurrentLine();
            if (this.hoverLine)
                this.drawHoverLine();
            if (this.hasChecked)
                this.bind_check();
            if (this.hasDBclick)
                this.bind_dbclick();
            if (this.hasPopover)
                this.bind_popover();
            return this;
        }, //刷新
        getData: function() {
            return this.updateData;
        }
    }

    //// Exports stateBlock Component ////
    return drawArea;
});