(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("d3"), require("jQuery"), require("moment"), require("_"));
	else if(typeof define === 'function' && define.amd)
		define(["d3", "jQuery", "moment", "_"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("d3"), require("jQuery"), require("moment"), require("_")) : factory(root["d3"], root["jQuery"], root["moment"], root["_"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(2), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function(d3, jquery, moment,lodash) {

    var TEXT_WIDTH = 12;//
    var TEXT_HEIGHT = 14;//
    var PADDING=5;//于块的间隔

    
    // Check whether the obj is null or undfined.
    var isNullOrUndefine = function(obj) {
        return obj === undefined || obj === null;
    }
    // Defines the pumpText type
    var pumpText = function(line,xScale) {
        this.version = '1.0';
        this.pumpText=null;
        this.g=line;
        this.block_xScale=xScale;
        this.text_data=null;
    }
    //The chain method
    pumpText.prototype = {
        draw: function(data) {
            var _this=this;
            this.text_data=data;
            var isRemove=false;
            this.pumpText=_this.g
                .append('text')
                .datum(data)
                .filter(function(d,i,ele) {
                    if(d.width > TEXT_WIDTH && (!d.next  ||d.time !== d.next.time))
                        return true;
                    else{
                        //不满足条件就删除text标签
                        $(ele).remove();
                        isRemove=true;
                        return false;
                    }
                })
                .attr('class', 'label')
                .text(function(d) {
                    return d.label;
                })
                .attr('x', function(d, i) {
                    return _this.block_xScale(d.time) + PADDING;
                })
                .attr('y', function(d, i) {
                    return TEXT_HEIGHT;
                });
            if(isRemove)//判断元素是否删除
                this.pumpText=null;//置空
            return this;
        },
        update:function(x,y,width){ 
            this.text_data.width=width;
            this.text_data.time=this.block_xScale.invert(x);

            if(this.pumpText!=null){
                if(!isNullOrUndefine(x)){
                    this.pumpText.attr('x', x+ PADDING);
                }
                if(!isNullOrUndefine(y)){
                    this.pumpText.attr('y', y);
                }
                if(!isNullOrUndefine(width)){
                    this.pumpText.attr('width', width);
                } 
            }
            else{
                this.draw(this.text_data);
            }
            return this;
        },
        updateText:function(data){ 
            this.pumpText.datum(data)
                .text(function(d) {
                    return d.label;
                })
            return this;
        },
        remove:function(){
            if(this.pumpText!=null){
                this.pumpText.remove();
            }
            return this;
        }
    }

    //// Exports pumpText Component ////
    return pumpText;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(2), __webpack_require__(3), __webpack_require__(7), __webpack_require__(14), __webpack_require__(16), __webpack_require__(9), __webpack_require__(10)], __WEBPACK_AMD_DEFINE_RESULT__ = function(d3, jquery, moment, lodash, axis, pumpLine, timeLine, handle, legend) {
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
            function ContentMethod(val) {
                return '<input type="number" id="pumpvalue" name="pumpvalue" style="width: 50px" value=' + val + ' max=' + BLOCK_MAX_VALUE + '><button id="closeBtn" class="popoverBtn red" >关</button>';
            }
            //所有设置弹出框属性的元素绑定弹出
            $("[data-toggle='popover']").each(function(i, e) {
                var val = e.__data__.value; //获取当前值
                if (val == null || val == undefined)
                    val = '';
                var element = $(e);
                element.popover({
                        trigger: 'click', //弹出框的触发事件： click| hover | focus | manual
                        container: "body", //向指定元素中追加弹出框
                        placement: 'top', //弹出框定位方向（即 top|bottom|left|right|auto）
                        html: 'true', //是否解析html标签
                        content: ContentMethod(val,e), //弹出框内容
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
                                //修改值或状态
                                _this.curBlock.updateState(data);
                            }
                            /*  输入框值改变事件  */
                        $('#pumpvalue').on('change', function() {
                                if (this.value > BLOCK_MAX_VALUE) //最大限制
                                    this.value = BLOCK_MAX_VALUE;
                                changeData(this.value); //更新当前块
                                _this.removeHandles(); //关闭选中状态
                                //_this.updateHandles();//更新手柄
                            }) //值改变事件
                            .on('keyup', function() {
                                if (this.value > BLOCK_MAX_VALUE) //最大限制
                                    this.value = BLOCK_MAX_VALUE;
                                changeData(this.value); //更新当前块
                                _this.removeHandles(); //关闭选中状态
                                //_this.updateHandles();//更新手柄
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
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;﻿!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(2), __webpack_require__(3),__webpack_require__(5)], __WEBPACK_AMD_DEFINE_RESULT__ = function(d3, jquery, moment,lodash,drawArea) {

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

        this.element = null;// Container element
        this.option = null;// Options             
        this.timelines = []; // The processed data
        //this.params = {}; // The parameters for chart drawing
        this.describe = null;

        this.area=null;
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

        //document.captureEvents(Event.MOUSEMOVE|Event.MOUSEDOWN | Event.MOUSEUP);
        // Get the chart option
        this.option = $.extend({}, default_option, opt);
  
        //// Defines all private methods ////


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
        var _this=this;
        function preprocess(data) {
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
        }/*处理并准备数据*/
        
        this.draw = function(data) {
            preprocess(data);
            this.refresh();
            return this;   
        }//绘图

        this.refresh = function(refreshSize) {
            // Clear all svg elements.
            this.element.html('');
            this.area=new drawArea(this.option,this.element,this.describe,refreshSize);
            this.area.drawLegend().draw().drawChart(this.timelines).drawAsix().drawCurrentLine().drawHoverLine().bind_check().bind_dbclick().bind_popover();       
            return this;   
        }//刷新并绘制

        this.getData=function(){
            var newData=this.area.getData();
            preprocess(newData);
            return this.timelines;
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
    return { chart: Chart };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0),__webpack_require__(1),__webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function(d3,jquery,moment) {
    // Defines the axis type
    var axis = function(svg,option,params,xScale,yScale) {
    	this.xAxis=null;
    	this.yAxis=null;
        this.axis_svg=svg;
        this.axis_option=option;
        this.axis_params=params;
        this.axis_xScale=xScale;
        this.axis_yScale=yScale;
    }
    //The chain method
    axis.prototype = {
        drawAxis: function(){
            this.xAxis = d3.axisBottom()
                .scale(this.axis_xScale)
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
            this.axis_svg.append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', 'translate(' + this.axis_option.padding.left + ',' + (this.axis_params.size.height - this.axis_option.padding.bottom) + ')')
                .call(this.xAxis);
           
            this.yAxis = d3.axisLeft()
                .scale(this.axis_yScale);
            this.axis_svg.append('g')
                .attr('class', 'axis axis--y')
                .attr('transform', 'translate(' + this.axis_option.padding.left + ',' + this.axis_option.padding.top + ')')
                .call(this.yAxis);

            //前后的00:00换行显示，带上日期
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
            return this; //在每个方法的最后return this;
        },
        remove:function(){
            this.xAxis.remove();
            this.yAxis.remove();
            return this;
        },
        getxAxis:function(){
            return this.xAxis;
        },
        getyAxis:function(){
            return this.yAxis;
        }
    }
    //// Exports axis Component ////
    return axis;

}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(2), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function(d3, jquery, moment,lodash) {

    var BUTTON_WIDTH = 35;//
    var BUTTON_HEIGHT = 20;//
    var BUTTON_ClASS='btn';
    
    // Check whether the obj is null or undfined.
    var isNullOrUndefine = function(obj) {
        return obj === undefined || obj === null;
    }
    // Defines the button type
    var button = function(svg) {
        this.button=null;
        this.button_svg=svg;
    }
    //The chain method
    button.prototype = {
        add: function(text,float,classn) {
            var className=BUTTON_ClASS;
            if(!isNullOrUndefine(classn)){
                className+=' '+classn;
            }
            this.button=this.button_svg
                .append('button')
                .attr('class',className)
                .text(text)
                .attr('width', BUTTON_WIDTH)
                .attr('height', BUTTON_HEIGHT)
                .attr('style', 'float:'+float);

            // this.button=this.button_svg
            //     .append('button')
            //    // .attr('class',className||'button')
            //     .text(text)
            //     .attr('width', BUTTON_WIDTH)
            //     .attr('height', BUTTON_HEIGHT)
            //     .attr('x', x-BUTTON_WIDTH)
            //     .attr('y', y);
            return this;
        },
        update:function(x,y){ 
            if(this.button!=null){
                if(x!=undefined)
                    this.button.attr('x',x);
                if(y!=undefined)
                    this.button.attr('y',y);
            }
            return this;
        },
        remove:function(){
            if(this.button!=null)
                this.button.remove();
            return this;
        },
        click_Event:function(fn){//点击事件
            if(typeof fn=='function'){
                this.callFn=fn;
                var _this=this;
                this.button.on("click", function(d,i,ele) {
                    fn.call(d,ele);
                })
            }
            return this;
        },
        setDisabled:function(disabled){
            if(this.button!=null){
                if(disabled)
                    this.button.attr("disabled",disabled);
                else
                    this.button.attr("disabled",null);
            }
        }
    }

    //// Exports button Component ////
    return button;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1),__webpack_require__(2), __webpack_require__(3),__webpack_require__(15)], __WEBPACK_AMD_DEFINE_RESULT__ = function(d3, jquery, moment,lodash,text) {

    var HANDLE_WIDTH = 4;//手柄宽度
    var HANDLE_HEIGHT = 30;//手柄高度
   // Check whether the obj is null or undfined.
    var isNullOrUndefine = function(obj) {
        return obj === undefined || obj === null;
    }
    var START_EDIT='start';
    var END_EDIT='end';
    var dicType={
        'start':START_EDIT,
        'end':END_EDIT
    }

    // Defines the handle type
    var handle = function(g,xScale,type) {
        this.d3g=g;
        this.handle=null;
        this.handleText=null;
        this.handle_xScale=xScale;


        this.pos=[];
        this.minX=0;//手柄最小的x值范围
        this.maxX=null;//手柄最大的x值范围
        this.distance=28;//text的宽度
        this.type=dicType[type];
    }
    //The chain method
    handle.prototype = {
        drawHandle: function(x,y,className) {
            this.handle = this.d3g.append('rect')
                .attr('class', className||'edit_rect')
                .attr('x', x)
                .attr('y', y)
                .attr('width', HANDLE_WIDTH)
                .attr('height', HANDLE_HEIGHT);
            this.pos[0]=x;
            this.pos[1]=y;
            return this; //在每个方法的最后return this;
        },
        drawHandleText: function(x,y) {
            var textX=x+HANDLE_WIDTH;
            var textTimeX=x;
            if(this.type==END_EDIT){
                textX=x-this.distance-HANDLE_WIDTH;//结束手柄的提示位置在手柄之前
                textTimeX=x+HANDLE_WIDTH;//时间显示为手柄结束位置的时间
            }
            //change the x to time
            var hText=moment(this.handle_xScale.invert(textTimeX)).format('HH:mm');
            //add the handle text
            this.handleText =new text(this.d3g);
            this.handleText.drawText(hText,'edit_text',textX,y);
            return this; //在每个方法的最后return this;
        },
        drag_Event: function(dragStart,dragged,dragEnd) {
            var _this=this;
            //before the drag
            var handleDragStart=function(){
                var pos = d3.mouse(this);//获取鼠标位置
                var x = pos[0];

                if(typeof dragStart==='function')
                    dragStart.call(null,x);//传参数回调
            };
            //Draging
            var handleDragged=function(){
                var pos = d3.mouse(this);//获取鼠标位置
                var x = pos[0];
                //拖动范围限制
                if(x<_this.minX)
                    x=_this.minX;
                if(_this.maxX!=null&&x>_this.maxX)
                    x=_this.maxX;

                if(typeof dragged==='function')
                    dragged.call(null,x);//传参数回调
                
                _this.updatePos(x);
                // //修改手柄位置
                // _this.handle.attr('x', x);
                // _this.pos[0]=x;

                // //更新手柄提示
                // var textTimeX=x;
                // var textX=x+HANDLE_WIDTH;
                // if(_this.type==END_EDIT){
                //     textX=x-_this.distance-HANDLE_WIDTH;//结束手柄的提示位置在手柄之前
                //     textTimeX+=HANDLE_WIDTH;//时间显示为手柄结束位置的时间
                // }
                // var htext=moment(_this.handle_xScale.invert(textTimeX)).format('HH:mm');

                // _this.handleText.update(htext,textX);//修改手柄提示的坐标
            };
            //After the drag
            var handleDragEnd=function(){
                var pos = d3.mouse(this);//获取鼠标位置
                var x = pos[0];
                //拖动范围限制
                if(x<_this.minX)
                    x=_this.minX;
                if(_this.maxX!=null&&x>_this.maxX)
                    x=_this.maxX;

                if(typeof dragEnd==='function')
                    dragEnd.call(null,x);//传参数回调
            };
            //bind the drag event
            var handleDrag = d3.drag()
                .on("start",handleDragStart)
                .on("drag", handleDragged)
                .on("end", handleDragEnd);
            this.handle.call(handleDrag);
            return this;
        },
        updatePos:function(x,y){
            if(x!=undefined){
                //更新手柄显示时间
                var textTimeX=x;//时间显示为手柄结束位置的时间
                var textX=x+HANDLE_WIDTH;
                if(this.type==END_EDIT){
                    x=x-HANDLE_WIDTH;
                    textX=x-this.distance-HANDLE_WIDTH;//结束手柄的提示位置在手柄之前
                }
                this.pos[0]=x;
                //修改手柄位置
                this.handle.attr('x', x);
                var htext=moment(this.handle_xScale.invert(textTimeX)).format('HH:mm');//显示时间
                this.handleText.update(htext,textX);//修改手柄提示的坐标

            }
            if(y!=undefined){
                this.handle.attr('y', y);
            }
        },
        updateTextPos:function(){

        },
        removeHandle:function(){
            this.handle.remove();
            this.handleText.removeText();
            return this;
        },
        removeAllHandle:function(){
            d3.selectAll('.edit_rect').remove();
            d3.selectAll('.edit_text').remove();
            return this;
        },
        setMinX:function(x){
            this.minX=x;
            return this;
        },
        setMaxX:function(x){
            this.maxX=x;
            return this;
        },
        getX:function(){
            return this.pos;
        }
    }
    //// Exports handle Component ////
    return handle;

}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(2), __webpack_require__(3),__webpack_require__(8)], __WEBPACK_AMD_DEFINE_RESULT__ = function(d3, jquery, moment,lodash,button) {

    var LEGEND_HEIGHT = 30;//默认高度

    
    // Check whether the obj is null or undfined.
    var isNullOrUndefine = function(obj) {
        return obj === undefined || obj === null;
    }
    // Defines the legend type
    var legend = function(svg) {
        this.legend_svg=svg;
        this.legend_div=null;
        this.add_button=null;//新增按钮
        this.update_button=null;//编辑按钮
        this.delete_button=null;//删除按钮
        this.cancel_button=null;//取消按钮
    }
    //The chain method
    legend.prototype = {
        draw: function(width,height) {
            var style="width:"+width+"px;height:"+(height||LEGEND_HEIGHT)+"px;";
            this.legend_div=this.legend_svg
                .append('div')
                .attr('class','legend')
                .attr('style',style)
                // .width(width)
                // .height(height||LEGEND_HEIGHT);
                // .css('width', width+'px')
                // .css('height', (height||LEGEND_HEIGHT)+'px');
            return this;
        },
        drawAddBtn: function(float,fn) {
            var btn=new button(this.legend_div);
            this.add_button=btn.add('新增',float,'green btn-sm').click_Event(fn);
            return this;
        },
        drawUpdateBtn:function(float,fn){ 
            var btn=new button(this.legend_div);
            this.update_button=btn.add('编辑',float,'blue btn-sm').click_Event(fn);
            return this;
        },
        drawDeleteBtn:function(float,fn){
            var btn=new button(this.legend_div);
            this.delete_button=btn.add('删除',float,'red btn-sm').click_Event(fn);
            return this;
        },
        drawCancelBtn:function(float,fn){
            var btn=new button(this.legend_div);
            this.cancel_button=btn.add('取消',float,'yellow btn-sm').click_Event(fn);
            return this;
        }
    }

    //// Exports legend Component ////
    return legend;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(2), __webpack_require__(3),__webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function(d3, jquery, moment,lodash,pumpText) {

    var BAR_HEIGHT=22;
    // Defines all class name
    var CLASS_OPEN_STATE = 'rect open_state';//开
    var CLASS_CLOSE_STATE = 'rect close_state';//关
    var CLASS_FAULT_STATE = 'rect fault_state';//故障
    var CLASS_INDEFINITE_STATE = 'rect indefinite_state';//不定



    //根据值转换样式
    function formatClass(d) {
        var className = null;
        if (d.value > 0) {
            d.className = CLASS_OPEN_STATE;
        } else if (d.value == 0) {
            d.className = CLASS_CLOSE_STATE;

        } else if (d.value < 0) {
            d.className = CLASS_FAULT_STATE;
        } else {
            d.className = CLASS_INDEFINITE_STATE;
        }
        return d.className;
    }

    // Check whether the obj is null or undfined.
    var isNullOrUndefine = function(obj) {
        return obj === undefined || obj === null;
    }
    
    // Defines the gradientBlock type
    var gradientBlock = function(line,xScale) {
        this.version = '1.0';
        this.blockType='numeric';

        this.block =null;//当前的块元素
        this.blockText=null;//当前的块的文本原元素

        this.leftBlock=null;
        this.rightBlock=null;

        this.blockData =null;//当前的块的状态
        // this.blockState =null;//当前的块的状态
        
        this.block_Line=line;
        this.block_xScale=xScale;

        this.callFn=null;
    }
    //链式方法
    gradientBlock.prototype = {
        draw: function(data) {//在绘图区绘制出块
            var _this=this;
            this.block=this.block_Line
                .append('rect')
                .datum(data)
                .attr('class', function(d, i) {
                    return formatClass(d);
                })
                .attr('x', function(d, i) {
                    if(d.x==undefined)
                        d.x = _this.block_xScale(d.time);
                    return d.x;
                })
                .attr('y', 0)
                .attr('width', function(d, i) {
                    if(d.width==undefined)
                        d.width = 0;
                    if (d.next) {
                        d.width = _this.block_xScale(d.next.time) - _this.block_xScale(d.time);
                    }
                    if (d.width < 0) {
                        d.width = 0;
                    }
                    return d.width;
                })
                .attr('height', function(d, i) {
                    d.height = BAR_HEIGHT;
                    return BAR_HEIGHT;
                })
                .attr('data-toggle', 'popover')//增加弹出属性
            if(data.colorGrade!=undefined){
                $(this.block._groups[0]).css('fill',data.colorGrade);
            }//设置当前颜色
            //弹出框内容
            if (data.value == undefined) { //不定状态加弹框
                this.block.attr('data-toggle', 'popover')
                    .attr('data-content', '<button id="openBtn" class="popoverBtn green" >开</button><button id="closeBtn" class="popoverBtn red" >关</button>')
            }
            // else{
            //     var BLOCK_MAX_VALUE=50;
            //     this.block.attr('data-toggle', 'popover')
            //         .attr('data-content', '<input type="number" id="pumpvalue" name="pumpvalue" style="width: 50px" value=' + data.value + ' max=' + BLOCK_MAX_VALUE + '>')
            // }
            this.blockData=data;
            return this;
        },//绘制块
        drawText:function(){
            this.blockText=new pumpText(this.block_Line,this.block_xScale);
            this.blockText.draw(this.blockData);
            return this;
        },//块对应的文本提示
        update:function(x,y,width,fn){ 
            if(!isNullOrUndefine(x)){
                this.block.attr('x', x);
            }
            if(!isNullOrUndefine(y)){
                this.block.attr('y', y);
            }
            if(!isNullOrUndefine(width)){
                this.block.attr('width', width);
            }
            //修改对应text的位置
            if(this.blockText!=null)
                this.blockText.update(x,y,width);
            // else{//新加text
            //     this.drawText(this.blockData);
            // }
            //回调函数
            if(typeof fn==='function')
                fn.call(x,y);
            return this;
        },//修改坐标和宽度
        updateWidth:function(width,fn){
            if(!isNullOrUndefine(width)){
                this.block.attr('width',width);
            }
            //回调函数
            if(typeof fn==='function')
                fn.call(x,y);
            return this;
        },//修改宽度
        addWidth:function(width,fn){
            if(!isNullOrUndefine(width)){
                var oldwidth = parseFloat(this.block.attr('width'));
                var rectWidth = oldwidth+ width;
                this.block.attr('width',rectWidth);
            }
            //回调函数
            if(typeof fn==='function')
                fn.call(x,y);
            return this;
        },//修改宽度
        setLeft:function(left){
            if(!isNullOrUndefine(left))
                this.leftBlock=left;
            return this;
        },//设置左边邻近块
        setRight:function(right){
            if(!isNullOrUndefine(right))
                this.rightBlock=right;
            return this;
        },//设置右边邻近块
        changeLeft:function(){
            var _this=this;
            if(_this.block!=null){
                var x2=parseFloat(_this.block.attr('x'));
                if(_this.leftBlock){//判断左边是否有邻近块
                    var x1=parseFloat(_this.leftBlock.block.attr('x'));
                    var width=x2-x1;
                    if(width<=0){//左边块被覆盖
                        _this.leftBlock.remove();//删除前一个
                        _this.changeLeft();//修改新的前一块
                    }
                    else{
                        _this.leftBlock.update(null,null,width);//修改左边的宽度
                    }
                }
                else{//如果没有就创建  不定状态
                    if(_this.blockData.className != CLASS_INDEFINITE_STATE){
                        var data = {
                            height: BAR_HEIGHT,
                            time:_this.block_xScale.invert(0),
                            value: null,
                            label: '不定',
                            width:x2
                        };
                        var leftBlock=new numericBlock(_this.block_Line,_this.block_xScale);
                        leftBlock.draw(data).drawText(data).click_Event(_this.callFn).setRight(_this);
                        _this.leftBlock=leftBlock;
                    }
                }  
            }        
            return this;      
        },//修改左边的块
        changeRight:function(){
            var _this=this;
            //获取当前块的结束位置
            var curX=parseFloat(_this.block.attr('x'));
            var curWidth=parseFloat(_this.block.attr('width'));
            var x1=curX+curWidth;//当前结束位置
            //判断右边是否有邻近块
            if(_this.rightBlock){
                //获取右边快的结束位置
                var oldx=parseFloat(_this.rightBlock.block.attr('x'));
                var oldwidth=parseFloat(_this.rightBlock.block.attr('width'));
                //计算新的坐标
                var x2=oldx+oldwidth;
                var width=x2-x1;//计算高度
                if(width<=0){//右边块被覆盖
                    _this.rightBlock.remove();//删除前一个
                    _this.changeRight();//修改新的前一块
                }
                else{//修改位置和宽度
                    _this.rightBlock.update(x1,null,width);
                }
            }
            else{
                var MaxX=this.block_Line.lineWidth;
                //如果没有就创建  不定状态
                var data = {
                    height: BAR_HEIGHT,
                    time:_this.block_xScale.invert(x1),
                    value: null,
                    label: '不定',
                    width:MaxX
                };
                var rightBlock=new numericBlock(_this.block_Line,_this.block_xScale);
                rightBlock.draw(data).drawText(data).click_Event(_this.callFn).setLeft(_this);
                _this.rightBlock=rightBlock;
            }
            return this;   
        },//修改右边的块
        updateState:function(data){
            var _this=this;
            this.blockData=data;
            this.block.datum(data).attr('class', function(d, i) {
                return formatClass(d);
            })

            //判断两边状态十分合并
            if (this.rightBlock != null) {
                if (this.blockData.label == this.rightBlock.blockData.label) { //状态一致，合并
                    var addWidth = parseFloat(this.rightBlock.block.attr('width')); //计算增加的宽度
                    this.addWidth(addWidth); //合并到当前块
                    this.rightBlock.remove(); //移除右侧
                }
            }
            if (this.leftBlock != null) {
                if (this.blockData.label == this.leftBlock.blockData.label) { //状态一致，合并
                    var addWidth = parseFloat(this.block.attr('width')); //计算增加的宽度
                    this.leftBlock.addWidth(addWidth); //合并到前一块
                    this.remove(); //移除当前
                }
            }

            if(this.blockText){
                this.blockText.updateText(data);
            }
        },//修改当前快的状态
        click_Event:function(fn){//点击事件
            if(typeof fn=='function'){
                this.callFn=fn;
                var _this=this;
                if(this.block!=null){
                    this.block.on("click", function(d, i, rects) {
                        fn.call(d, i, rects,_this);
                    })
                }
            }
            return this;
        },//鼠标单击事件
        dbclick_Event:function(fn){//点击事件
            var _this=this;
            this.block.on("dblclick", function(d, i, rects) {
                if(typeof fn=='function')
                    fn.call(d, i, rects);
            })
            return this;
        },//鼠标双击事件，更改状态
        remove:function(){
            this.block.remove();//移除当前块
            this.block=null;
            this.blockData=null;
            //修改前后块的邻近块
            if(this.leftBlock!=null)
                this.leftBlock.rightBlock=this.rightBlock;
            if(this.rightBlock!=null)
                this.rightBlock.leftBlock=this.leftBlock;
            if(this.rightBlock&&this.leftBlock){
                    //判断是否同一状态，是:合并
                    if(this.leftBlock.blockData.label== this.rightBlock.blockData.label){
                        var x1=parseFloat(this.leftBlock.block.attr('x'));//获取开始坐标
                        var x2=parseFloat(this.rightBlock.block.attr('x'))+parseFloat(this.rightBlock.block.attr('width'));//计算结束坐标
                        var width=x2-x1;//计算宽度
                        this.leftBlock.update(x1,null,width);//合并到前一块
                        this.rightBlock.remove();//删除后一条
                    }
            }
            //删除对应text的位置
            if(this.blockText!=null)
                this.blockText.remove();
        },//删除当前块，并合并相同状态的邻近块
        insertCentre:function(){
            if(this.blockData.className!=CLASS_FAULT_STATE){//故障不能新增
                var totalWidth=parseFloat(this.block.attr('width'));//获取当前快的总宽
                var rightBlock=this.rightBlock;//获取当前的右侧块
                var intWidth=parseInt(totalWidth);
                var x1=parseFloat(this.block.attr('x'));
                var averageWidth=intWidth/3;//平均的宽度：分成三等分
                var x2=x1+averageWidth;
                var x3=x2+averageWidth;

                //先修改当前的块的宽度，再插入两块新的
                this.updateWidth(averageWidth);
                var  newData={//默认新建“开”的状态
                    height: BAR_HEIGHT,
                    time:this.block_xScale.invert(x2),
                    value: 1,
                    label:'开',
                    width:averageWidth,
                    x:x2
                }
                if(this.blockData.className==CLASS_OPEN_STATE){//如果当前是开的就新建关
                    newData.label='关';
                    newData.value=0;
                }
                //新建中间一段
                var newBlock=new numericBlock(this.block_Line,this.block_xScale);
                newBlock.draw(newData).drawText(newData).click_Event(this.callFn).setLeft(this);

                //新建相同的一段
                var data={
                    height: BAR_HEIGHT,
                    time:this.block_xScale.invert(x3),
                    value: this.blockData.value,
                    label:this.blockData.label,
                    width:averageWidth,
                    x:x3
                }
                var sameBlock=new numericBlock(this.block_Line,this.block_xScale);
                sameBlock.draw(data).drawText(data).click_Event(this.callFn).setLeft(newBlock).setRight(rightBlock);
                rightBlock.setLeft(sameBlock);//设置当前新建块的右侧快的左侧

                newBlock.setRight(sameBlock);//设置中间一块的右侧
                this.setRight(newBlock);
            }
            return this;
        }//插入新的块到当前块的中间
    }

    //// Exports gradientBlock Component ////
    return gradientBlock;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(2), __webpack_require__(3),__webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function(d3, jquery, moment,lodash,pumpText) {

    var BAR_HEIGHT=22;
    // Defines all class name
    var CLASS_OPEN_STATE = 'rect open_state';//开
    var CLASS_CLOSE_STATE = 'rect close_state';//关
    var CLASS_FAULT_STATE = 'rect fault_state';//故障
    var CLASS_INDEFINITE_STATE = 'rect indefinite_state';//不定

    var MIN_VALUE=0;
    var MAX_VALUE=50;

    //根据值转换样式
    function formatClass(d) {
        var className = null;
        if (d.value > 0) {
            d.className = CLASS_OPEN_STATE;
        } else if (d.value == 0) {
            d.className = CLASS_CLOSE_STATE;

        } else if (d.value < 0) {
            d.className = CLASS_FAULT_STATE;
        } else {
            d.className = CLASS_INDEFINITE_STATE;
        }
        return d.className;
    }
    // Check whether the obj is null or undfined.
    var isNullOrUndefine = function(obj) {
        return obj === undefined || obj === null;
    }
    // Defines the numericBlock type
    var numericBlock = function(line,xScale) {
        this.version = '1.0';
        this.blockType='numeric';

        this.block =null;//当前的块元素
        this.blockText=null;//当前的块的文本原元素

        this.leftBlock=null;
        this.rightBlock=null;

        this.blockData =null;//当前的块的状态
        // this.blockState =null;//当前的块的状态
        
        this.block_Line=line;
        this.block_xScale=xScale;

        this.callFn=null;
    }
    //链式方法
    numericBlock.prototype = {
        draw: function(data) {//在绘图区绘制出块
            if(data.value>MAX_VALUE){//判断是否超过最大限制
                data.value=MAX_VALUE;
                data.label=MAX_VALUE.toString();
            }

            var _this=this;
            this.block=this.block_Line
                .append('rect')
                .datum(data)
                .attr('class', function(d, i) {
                    return formatClass(d);
                })
                .attr('x', function(d, i) {
                    if(d.x==undefined)
                        d.x = _this.block_xScale(d.time);
                    return d.x;
                })
                .attr('y', 0)
                .attr('width', function(d, i) {
                    if(d.width==undefined)
                        d.width = 0;
                    if (d.next) {
                        d.width = _this.block_xScale(d.next.time) - _this.block_xScale(d.time);
                    }
                    if (d.width < 0) {
                        d.width = 0;
                    }
                    return d.width;
                })
                .attr('height', function(d, i) {
                    d.height = BAR_HEIGHT;
                    return BAR_HEIGHT;
                })
                .attr('data-toggle', 'popover')//增加弹出属性

            this.blockData=data;
            return this;
        },//绘制块
        drawText:function(){
            this.blockText=new pumpText(this.block_Line,this.block_xScale);
            this.blockText.draw(this.blockData);
            return this;
        },//块对应的文本提示
        update:function(x,y,width,fn){ 
            if(!isNullOrUndefine(x)){
                this.block.attr('x', x);
            }
            if(!isNullOrUndefine(y)){
                this.block.attr('y', y);
            }
            if(!isNullOrUndefine(width)){
                this.block.attr('width', width);
            }
            //修改对应text的位置
            if(this.blockText!=null)
                this.blockText.update(x,y,width);
            // else{//新加text
            //     this.drawText(this.blockData);
            // }
            //回调函数
            if(typeof fn==='function')
                fn.call(x,y);
            return this;
        },//修改坐标和宽度
        updateWidth:function(width,fn){
            if(!isNullOrUndefine(width)){
                this.block.attr('width',width);
            }
            //回调函数
            if(typeof fn==='function')
                fn.call(x,y);
            return this;
        },//修改宽度
        addWidth:function(width,fn){
            if(!isNullOrUndefine(width)){
                var oldwidth = parseFloat(this.block.attr('width'));
                var rectWidth = oldwidth+ width;
                this.block.attr('width',rectWidth);
            }
            //回调函数
            if(typeof fn==='function')
                fn.call(x,y);
            return this;
        },//修改宽度
        setLeft:function(left){
            if(!isNullOrUndefine(left))
                this.leftBlock=left;
            return this;
        },//设置左边邻近块
        setRight:function(right){
            if(!isNullOrUndefine(right))
                this.rightBlock=right;
            return this;
        },//设置右边邻近块
        changeLeft:function(){
            var _this=this;
            if(_this.block!=null){
                var x2=parseFloat(_this.block.attr('x'));
                if(_this.leftBlock){//判断左边是否有邻近块
                    var x1=parseFloat(_this.leftBlock.block.attr('x'));
                    var width=x2-x1;
                    if(width<=0){//左边块被覆盖
                        _this.leftBlock.remove();//删除前一个
                        _this.changeLeft();//修改新的前一块
                    }
                    else{
                        _this.leftBlock.update(null,null,width);//修改左边的宽度
                    }
                }
                else{//如果没有就创建  不定状态
                    if(_this.blockData.className != CLASS_INDEFINITE_STATE){
                        var data = {
                            height: BAR_HEIGHT,
                            time:_this.block_xScale.invert(0),
                            value: null,
                            label: '不定',
                            width:x2
                        };
                        var leftBlock=new numericBlock(_this.block_Line,_this.block_xScale);
                        leftBlock.draw(data).drawText(data).click_Event(_this.callFn).setRight(_this);
                        _this.leftBlock=leftBlock;
                    }
                }  
            }        
            return this;      
        },//修改左边的块
        changeRight:function(){
            var _this=this;
            //获取当前块的结束位置
            var curX=parseFloat(_this.block.attr('x'));
            var curWidth=parseFloat(_this.block.attr('width'));
            var x1=curX+curWidth;//当前结束位置
            //判断右边是否有邻近块
            if(_this.rightBlock){
                //获取右边快的结束位置
                var oldx=parseFloat(_this.rightBlock.block.attr('x'));
                var oldwidth=parseFloat(_this.rightBlock.block.attr('width'));
                //计算新的坐标
                var x2=oldx+oldwidth;
                var width=x2-x1;//计算高度
                if(width<=0){//右边块被覆盖
                    _this.rightBlock.remove();//删除前一个
                    _this.changeRight();//修改新的前一块
                }
                else{//修改位置和宽度
                    _this.rightBlock.update(x1,null,width);
                }
            }
            else{
                var MaxX=this.block_Line.lineWidth;
                //如果没有就创建  不定状态
                var data = {
                    height: BAR_HEIGHT,
                    time:_this.block_xScale.invert(x1),
                    value: null,
                    label: '不定',
                    width:MaxX
                };
                var rightBlock=new numericBlock(_this.block_Line,_this.block_xScale);
                rightBlock.draw(data).drawText(data).click_Event(_this.callFn).setLeft(_this);
                _this.rightBlock=rightBlock;
            }
            return this;   
        },//修改右边的块
        updateState:function(data){
            var _this=this;
            this.blockData=data;
            this.block.datum(data).attr('class', function(d, i) {
                return formatClass(d);
            })

            //判断两边状态十分合并
            if (this.rightBlock != null) {
                if (this.blockData.label == this.rightBlock.blockData.label) { //状态一致，合并
                    var addWidth = parseFloat(this.rightBlock.block.attr('width')); //计算增加的宽度
                    this.addWidth(addWidth); //合并到当前块
                    this.rightBlock.remove(); //移除右侧
                }
            }
            if (this.leftBlock != null) {
                if (this.blockData.label == this.leftBlock.blockData.label) { //状态一致，合并
                    var addWidth = parseFloat(this.block.attr('width')); //计算增加的宽度
                    this.leftBlock.addWidth(addWidth); //合并到前一块
                    this.remove(); //移除当前
                }
            }

            if(this.blockText){
                this.blockText.updateText(data);
            }
        },//修改当前快的状态
        click_Event:function(fn){//点击事件
            if(typeof fn=='function'){
                this.callFn=fn;
                var _this=this;
                if(this.block!=null){
                    this.block.on("click", function(d, i, rects) {
                        fn.call(d, i, rects,_this);
                    })
                }
            }
            return this;
        },//鼠标单击事件
        dbclick_Event:function(fn){//点击事件
            var _this=this;
            this.block.on("dblclick", function(d, i, rects) {
                if(typeof fn=='function')
                    fn.call(d, i, rects);
            })
            return this;
        },//鼠标双击事件，更改状态
        remove:function(){
            this.block.remove();//移除当前块
            this.block=null;
            this.blockData=null;
            //修改前后块的邻近块
            if(this.leftBlock!=null)
                this.leftBlock.rightBlock=this.rightBlock;
            if(this.rightBlock!=null)
                this.rightBlock.leftBlock=this.leftBlock;
            if(this.rightBlock&&this.leftBlock){
                    //判断是否同一状态，是:合并
                    if(this.leftBlock.blockData.label== this.rightBlock.blockData.label){
                        var x1=parseFloat(this.leftBlock.block.attr('x'));//获取开始坐标
                        var x2=parseFloat(this.rightBlock.block.attr('x'))+parseFloat(this.rightBlock.block.attr('width'));//计算结束坐标
                        var width=x2-x1;//计算宽度
                        this.leftBlock.update(x1,null,width);//合并到前一块
                        this.rightBlock.remove();//删除后一条
                    }
            }
            //删除对应text的位置
            if(this.blockText!=null)
                this.blockText.remove();
        },//删除当前块，并合并相同状态的邻近块
        insertCentre:function(){
            if(this.blockData.className!=CLASS_FAULT_STATE){//故障不能新增
                var totalWidth=parseFloat(this.block.attr('width'));//获取当前快的总宽
                var rightBlock=this.rightBlock;//获取当前的右侧块
                var intWidth=parseInt(totalWidth);
                var x1=parseFloat(this.block.attr('x'));
                var averageWidth=intWidth/3;//平均的宽度：分成三等分
                var x2=x1+averageWidth;
                var x3=x2+averageWidth;

                //先修改当前的块的宽度，再插入两块新的
                this.updateWidth(averageWidth);
                var  newData={//默认新建“开”的状态
                    height: BAR_HEIGHT,
                    time:this.block_xScale.invert(x2),
                    value: 1,
                    label:'开',
                    width:averageWidth,
                    x:x2
                }
                if(this.blockData.className==CLASS_OPEN_STATE){//如果当前是开的就新建关
                    newData.label='关';
                    newData.value=0;
                }
                //新建中间一段
                var newBlock=new numericBlock(this.block_Line,this.block_xScale);
                newBlock.draw(newData).drawText(newData).click_Event(this.callFn).setLeft(this);

                //新建相同的一段
                var data={
                    height: BAR_HEIGHT,
                    time:this.block_xScale.invert(x3),
                    value: this.blockData.value,
                    label:this.blockData.label,
                    width:averageWidth,
                    x:x3
                }
                var sameBlock=new numericBlock(this.block_Line,this.block_xScale);
                sameBlock.draw(data).drawText(data).click_Event(this.callFn).setLeft(newBlock).setRight(rightBlock);
                rightBlock.setLeft(sameBlock);//设置当前新建块的右侧快的左侧

                newBlock.setRight(sameBlock);//设置中间一块的右侧
                this.setRight(newBlock);
            }
            return this;
        }//插入新的块到当前块的中间
    }

    //// Exports numericBlock Component ////
    return numericBlock;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(2), __webpack_require__(3), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function(d3, jquery, moment, lodash, pumpText) {

    var BAR_HEIGHT = 22;
    // Defines all class name
    var CLASS_OPEN_STATE = 'rect open_state'; //开
    var CLASS_CLOSE_STATE = 'rect close_state'; //关
    var CLASS_FAULT_STATE = 'rect fault_state'; //故障
    var CLASS_INDEFINITE_STATE = 'rect indefinite_state'; //不定

    //根据值转换样式
    function formatClass(d) {
        var className = null;
        if (d.value > 0) {
            d.className = CLASS_OPEN_STATE;
        } else if (d.value == 0) {
            d.className = CLASS_CLOSE_STATE;

        } else if (d.value < 0) {
            d.className = CLASS_FAULT_STATE;
        } else {
            d.className = CLASS_INDEFINITE_STATE;
        }
        return d.className;
    }
    // Check whether the obj is null or undfined.
    var isNullOrUndefine = function(obj) {
        return obj === undefined || obj === null;
    }

    // Defines the stateBlock type
    var stateBlock = function(line, xScale) {
            this.version = '1.0';
            this.blockType = 'state';
            this.block = null; //当前的块元素
            this.blockText = null; //当前的块的文本原元素

            this.leftBlock = null;
            this.rightBlock = null;

            this.blockData = null; //当前的块的状态

            this.block_Line = line;
            this.block_xScale = xScale;

            this.callFn = null;
        }
        //链式方法
    stateBlock.prototype = {
        draw: function(data) { //在绘图区绘制出块
            var _this = this;
            this.block = this.block_Line
                .append('rect')
                .datum(data)
                .attr('class', function(d, i) {
                    return formatClass(d);
                })
                .attr('x', function(d, i) {
                    if (d.x == undefined)
                        d.x = _this.block_xScale(d.time);
                    return d.x;
                })
                .attr('y', 0)
                .attr('width', function(d, i) {
                    if (d.width == undefined)
                        d.width = 0;
                    if (d.next) {
                        d.width = _this.block_xScale(d.next.time) - _this.block_xScale(d.time);
                    }
                    if (d.width < 0) {
                        d.width = 0;
                    }
                    return d.width;
                })
                .attr('height', function(d, i) {
                    d.height = BAR_HEIGHT;
                    return BAR_HEIGHT;
                })

            if (data.value == undefined) { //不定状态加弹框
                this.block.attr('data-toggle', 'popover')
                    .attr('data-content', '<button id="openBtn" class="popoverBtn green" >开</button><button id="closeBtn" class="popoverBtn red" >关</button>')
            }
            this.blockData = data;
            return this;
        }, //绘制块
        drawText: function() {
            this.blockText = new pumpText(this.block_Line, this.block_xScale);
            this.blockText.draw(this.blockData);
            return this;
        }, //块对应的文本提示
        update: function(x, y, width, fn) {
            if (!isNullOrUndefine(x)) {
                this.block.attr('x', x);
            }
            if (!isNullOrUndefine(y)) {
                this.block.attr('y', y);
            }
            if (!isNullOrUndefine(width)) {
                this.block.attr('width', width);
            }
            //修改对应text的位置
            if (this.blockText != null)
                this.blockText.update(x, y, width);
            // else{//新加text
            //     this.drawText(this.blockData);
            // }
            //回调函数
            if (typeof fn === 'function')
                fn.call(x, y);
            return this;
        }, //修改坐标和宽度
        updateWidth: function(width, fn) {
            if (!isNullOrUndefine(width)) {
                this.block.attr('width', width);
            }
            //回调函数
            if (typeof fn === 'function')
                fn.call(x, y);
            return this;
        }, //修改宽度
        addWidth: function(width, fn) {
            if (!isNullOrUndefine(width)) {
                var oldwidth = parseFloat(this.block.attr('width'));
                var rectWidth = oldwidth + width;
                this.block.attr('width', rectWidth);
            }
            //回调函数
            if (typeof fn === 'function')
                fn.call(x, y);
            return this;
        }, //修改宽度
        setLeft: function(left) {
            if (!isNullOrUndefine(left))
                this.leftBlock = left;
            return this;
        },
        setRight: function(right) {
            if (!isNullOrUndefine(right))
                this.rightBlock = right;
            return this;
        },
        changeLeft: function() {
            var _this = this;
            if (_this.block != null) {
                var x2 = parseFloat(_this.block.attr('x'));
                if (_this.leftBlock) { //判断左边是否有邻近块
                    var x1 = parseFloat(_this.leftBlock.block.attr('x'));
                    var width = x2 - x1;
                    if (width <= 0) { //左边块被覆盖
                        _this.leftBlock.remove(); //删除前一个
                        _this.changeLeft(); //修改新的前一块
                    } else {
                        _this.leftBlock.update(null, null, width);
                    }
                } else { //如果没有就创建  不定状态
                    if (_this.blockData.className != CLASS_INDEFINITE_STATE) {
                        var data = {
                            height: BAR_HEIGHT,
                            time: _this.block_xScale.invert(0),
                            value: null,
                            label: '不定',
                            width: x2
                        };
                        var leftBlock = new stateBlock(_this.block_Line, _this.block_xScale);
                        leftBlock.draw(data).drawText(data).click_Event(_this.callFn).setRight(_this);
                        _this.leftBlock = leftBlock;
                    }
                }
            }
            return this;
        }, //修改左边的块
        changeRight: function() {
            var _this = this;
            //获取当前块的结束位置
            var curX = parseFloat(_this.block.attr('x'));
            var curWidth = parseFloat(_this.block.attr('width'));
            var x1 = curX + curWidth; //当前结束位置
            //判断右边是否有邻近块
            if (_this.rightBlock) {
                //获取右边快的结束位置
                var oldx = parseFloat(_this.rightBlock.block.attr('x'));
                var oldwidth = parseFloat(_this.rightBlock.block.attr('width'));
                //计算新的坐标
                var x2 = oldx + oldwidth;
                var width = x2 - x1; //计算高度
                if (width <= 0) { //右边块被覆盖
                    _this.rightBlock.remove(); //删除前一个
                    _this.changeRight(); //修改新的前一块
                } else { //修改位置和宽度
                    _this.rightBlock.update(x1, null, width);
                    // _this.rightBlock.blockText
                }
            } else {

                // //获取当前选中的块
                // var curRect = $(rects[i]);
                // //获取当前那一行
                // var g = curRect.parent()[0];//获取父级
                // var parentWidth= curRect.parent().width();//获取父级总宽
                var MaxX = this.block_Line.lineWidth;
                //如果没有就创建  不定状态
                var data = {
                    height: BAR_HEIGHT,
                    time: _this.block_xScale.invert(x1),
                    value: null,
                    label: '不定',
                    width: MaxX
                };
                var rightBlock = new stateBlock(_this.block_Line, _this.block_xScale);
                rightBlock.draw(data).drawText(data).click_Event(_this.callFn).setLeft(_this);
                _this.rightBlock = rightBlock;
            }
            return this;
        }, //修改右边的块
        updateState: function(data) {
            this.block.attr('class', function(d, i) {
                return formatClass(d);
            })

            //判断两边状态十分合并
            if (this.rightBlock != null) {
                if (this.blockData.label == this.rightBlock.blockData.label) { //状态一致，合并
                    var addWidth = parseFloat(this.rightBlock.block.attr('width')); //计算增加的宽度
                    this.addWidth(addWidth); //合并到当前块
                    this.rightBlock.remove(); //移除右侧
                }
            }
            if (this.leftBlock != null) {
                if (this.blockData.label == this.leftBlock.blockData.label) { //状态一致，合并
                    var addWidth = parseFloat(this.block.attr('width')); //计算增加的宽度
                    this.leftBlock.addWidth(addWidth); //合并到前一块
                    this.remove(); //移除当前
                }
            }
            if (this.blockText) {
                this.blockText.updateText(data);
            }
        }, //修改当前快的状态
        click_Event: function(fn) { //点击事件
            if (typeof fn == 'function') {
                this.callFn = fn;
                var _this = this;
                if (this.block != null) {
                    this.block.on("click", function(d, i, rects) {

                        // rects.popover({   
                        //     trigger:'click',//manual 触发方式  
                        //     placement : 'top',    
                        //     html: 'true',   
                        //     content : '<input type="number" id="pumpvalue" name="pumpvalue" style="width: 50px"><button style="height: 26px;width: 25px;margin: 0px;padding: 0px;" onclick="btnClick()">关</button>',  //这里可以直接写字符串，也可以 是一个函数，该函数返回一个字符串；  
                        //     animation: false  
                        // }) 

                        fn.call(d, i, rects, _this);
                    })
                }
            }
            return this;
        }, //鼠标单击事件
        dbclick_Event: function(fn) { //点击事件
            var _this = this;
            this.block.on("dblclick", function(d, i, rects) {
                if (d.value == 0) { //关--->开
                    d.value = 1;
                    d.label = '开';
                } else if (d.value == 1) { //开--->关
                    d.value = 0;
                    d.label = '关';
                } else if (d.value == undefined) { //不定--->开
                    d.value = 1;
                    d.label = '开';
                }
                _this.updateState(d); //修改当前状态
               
                if (typeof fn == 'function') //回调函数
                    fn.call(d, i, rects);
            })
            return this;
        }, //鼠标双击事件，更改状态
        remove: function() {
            this.block.remove(); //移除当前块
            this.block = null;
            this.blockData = null;
            //修改前后块的邻近块
            if (this.leftBlock != null)
                this.leftBlock.rightBlock = this.rightBlock;
            if (this.rightBlock != null)
                this.rightBlock.leftBlock = this.leftBlock;
            if (this.rightBlock && this.leftBlock) {
                //判断是否同一状态，是:合并
                if (this.leftBlock.blockData.label == this.rightBlock.blockData.label) {
                    var x1 = parseFloat(this.leftBlock.block.attr('x')); //获取开始坐标
                    var x2 = parseFloat(this.rightBlock.block.attr('x')) + parseFloat(this.rightBlock.block.attr('width')); //计算结束坐标
                    var width = x2 - x1; //计算宽度
                    this.leftBlock.update(x1, null, width); //合并到前一块
                    this.rightBlock.remove(); //删除后一条
                }
            }
            //删除对应text的位置
            if (this.blockText != null)
                this.blockText.remove();
        }, //删除当前块，并合并相同状态的邻近块
        insertCentre: function() {
                if (this.blockData.className != CLASS_FAULT_STATE) { //故障不能新增
                    var totalWidth = parseFloat(this.block.attr('width')); //获取当前快的总宽
                    var rightBlock = this.rightBlock; //获取当前的右侧块
                    var intWidth = parseInt(totalWidth);
                    var x1 = parseFloat(this.block.attr('x'));
                    var averageWidth = intWidth / 3; //平均的宽度：分成三等分
                    var x2 = x1 + averageWidth;
                    var x3 = x2 + averageWidth;

                    //先修改当前的块的宽度，再插入两块新的
                    this.updateWidth(averageWidth);
                    var newData = { //默认新建“开”的状态
                        height: BAR_HEIGHT,
                        time: this.block_xScale.invert(x2),
                        value: 1,
                        label: '开',
                        width: averageWidth,
                        x: x2
                    }
                    if (this.blockData.className == CLASS_OPEN_STATE) { //如果当前是开的就新建关
                        newData.label = '关';
                        newData.value = 0;
                    }
                    //新建中间一段
                    var newBlock = new stateBlock(this.block_Line, this.block_xScale);
                    newBlock.draw(newData).drawText(newData).click_Event(this.callFn).setLeft(this);

                    //新建相同的一段
                    var data = {
                        height: BAR_HEIGHT,
                        time: this.block_xScale.invert(x3),
                        value: this.blockData.value,
                        label: this.blockData.label,
                        width: averageWidth,
                        x: x3
                    }
                    var sameBlock = new stateBlock(this.block_Line, this.block_xScale);
                    sameBlock.draw(data).drawText(data).click_Event(this.callFn).setLeft(newBlock).setRight(rightBlock);
                    if (rightBlock != null)
                        rightBlock.setLeft(sameBlock); //设置当前新建块的右侧快的左侧

                    newBlock.setRight(sameBlock); //设置中间一块的右侧
                    this.setRight(newBlock);
                }
                return this;
            } //插入新的块到当前块的中间
    }

    //// Exports stateBlock Component ////
    return stateBlock;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1),__webpack_require__(13),__webpack_require__(12),__webpack_require__(11), __webpack_require__(2), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function(d3, jquery,stateBlock,numericBlock,gradientBlock, moment) {

    // Defines the time format to convert string to datetime.
    var toTime = d3.timeParse('%Y-%m-%d %H:%M:%S');
    var fromTime = d3.timeParse('%H:%M');
    var fromTimeToLong = d3.timeParse('%Y-%m-%d %H:%M');

    var BAR_HEIGHT=22;


    var DEFAULT_COLOR=[0,0,255];//蓝色
    var COLOR_STEP=5;//颜色分级步长
    var ColorGrade=[];//渐变颜色

    //计算渐变色系
    function getColorGradient() {
        var code = DEFAULT_COLOR;
        //当前颜色/255，计算基数
        var curR = parseFloat(code[0] / 255).toFixed(2);
        var curG = parseFloat(code[1] / 255).toFixed(2);
        var curB = parseFloat(code[2] / 255).toFixed(2);
        //计算每步需要加的数字 ——（1-基数）/步长
        var stepR = parseFloat((1 - curR) / (COLOR_STEP + 1)).toFixed(2);
        var stepG = parseFloat((1 - curG) / (COLOR_STEP + 1)).toFixed(2);
        var stepB = parseFloat((1 - curB) / (COLOR_STEP + 1)).toFixed(2);
            //渐变填充色
        for (var i = 1; i <= COLOR_STEP; i++) {
            var r = parseInt(code[0]);
            var g = parseInt(code[1]);
            var b = parseInt(code[2]);
            if (i > 1) {
                r = parseInt(parseFloat(stepR * i + parseFloat(curR)) * 255);
                g = parseInt(parseFloat(stepG * i + parseFloat(curG)) * 255);
                b = parseInt(parseFloat(stepB * i + parseFloat(curB)) * 255);
            }
            ColorGrade.push([r, g, b]);
        }
        ColorGrade=_.reverse(ColorGrade);//反转顺序：颜色先浅再深
    }
    //rgb颜色转换成16进制
    var changeColor=function(rgbColor){
        for (var i = 0; i < rgbColor.length; i++) {
          rgbColor[i] = parseInt(rgbColor[i]).toString(16);
          if (rgbColor[i].length == 1) rgbColor[i] = '0' + rgbColor[i];
        }
        var str = "#"+rgbColor.join('');
        //console.log(str); 
        return str;
    }


    // Defines the pumpLine type
    var pumpLine = function(svg,xScale,yScale,option,describe) {
        this.g=null;
        this.version = '1.0';
        this.blocks=[];//所有的块
        this.lineWidth=parseFloat(svg.attr('width'))-option.padding.left-option.padding.right;//计算宽

        this.line_svg=svg;
        this.line_option=option;
        this.line_xScale=xScale;
        this.line_yScale=yScale;
        this.line_describe=describe;

        this.valueGrade=[];//值域

    }

    //The chain method
    pumpLine.prototype = {
        drawLine:function(line){
            var _this=this;
            var top = this.line_yScale(line.name) + this.line_option.padding.top + ((BAR_HEIGHT - 2) / 2) -
                    this.line_describe.barCount * 0.2;
            this.g = this.line_svg.append('g')
                .attr('transform', 'translate(' + this.line_option.padding.left + ',' + top + ')');
            if(line.points.length>0){
                var type=stateBlock;
                if(line.type=='CSP')//定速泵
                    type=stateBlock;
                else if(line.type=='RSP')//定速泵
                    type=numericBlock;
                else{//流量/压力
                    type=gradientBlock;
                    getColorGradient();
                    var maxPoint=_.maxBy(line.points, function(o) { return o.value; });//获取最大值
                    _this.getValueGrade(maxPoint.value);
                }

                //循环数据并绘制块
                _.each(line.points,function(data){
                    var block=null;
                    block=new type(_this.g,_this.line_xScale);
                    if(type==gradientBlock&&data.value!=null){
                        var colorRgb=_this.getColorByValue(data.value);
                        data.colorGrade =changeColor(colorRgb);
                    }
                    block.draw(data).drawText();
                    //设置邻近块
                    var left=null;
                    var length=_this.blocks.length
                    if(length>0){
                        left=_this.blocks[length-1];
                        block.setLeft(left);
                        left.setRight(block);
                    }
                    _this.blocks.push(block);
                })
                //$("[data-toggle='popover']").popover();
            }

            return this;
        },
        getValueGrade:function(maxValue) {
            var values=[];
            var valueStep=maxValue/COLOR_STEP;
            //渐变填充色
            for (var i = 0; i <= COLOR_STEP; i++) {
                values.push(i*valueStep);
            }
            this.valueGrade=values;
        },
        getColorByValue(value) {
            var _this=this;
            //渐变填充色
            for (var i = 0; i < _this.valueGrade.length; i++) {
                if(value>_this.valueGrade[i]&&value<=_this.valueGrade[i+1])
                    return _.clone(ColorGrade[i]);
            }
        },//获取对应颜色
        checkBlock_Event:function(fn){
            if(typeof fn==='function'){
                _.each(this.blocks,function(block){
                    block.click_Event(fn);
                })     
            }
            return this;
        },
        dbclick_Event:function(fn){
            if(typeof fn==='function'){
                _.each(this.blocks,function(block){
                    block.dbclick_Event(fn);
                })     
            }
            return this;
        },
        remove:function(){
            this.g.remove();
            return this;
        }
    }

    //// Exports pumpLine Component ////
    return pumpLine;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(2), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function(d3, jquery, moment,lodash) {

    var TEXT_WIDTH = 12;
    var TEXT_HEIGHT = 14;


    // Check whether the obj is null or undfined.
    var isNullOrUndefine = function(obj) {
        return obj === undefined || obj === null;
    }

    // Defines the text type
    var text = function(line) {
        this.version = '1.0';
        this.text=null;
        this.g=line;
    }
    //The chain method
    text.prototype = {
        drawText: function(text,className,x,y) {
            this.text=this.g.append('text')
                            .attr('class', className||'label')
                            .text(text)
                            .attr('x', x)
                            .attr('y', y);
            return this;
        },
        moveText:function(x,y){
            if(!isNullOrUndefine(x))
                this.text.attr('x', x);
            if(!isNullOrUndefine(y))
                this.text.attr('y', y);
        },
        update:function(text,x,y){ 
            if(!isNullOrUndefine(text))
                this.text.text(text);
            if(!isNullOrUndefine(x))
                this.text.attr('x', x);
            if(!isNullOrUndefine(y))
                this.text.attr('y', y);
            return this;
        },
        removeText:function(){
            this.text.remove();
        }
    }

    //// Exports text Component ////
    return text;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(2), __webpack_require__(3),__webpack_require__(17)], __WEBPACK_AMD_DEFINE_RESULT__ = function(d3, jquery, moment,lodash,timeText) {

    var TEXT_WIDTH = 12;
    var TEXT_HEIGHT = 14;

    // Defines the timeLine type
    var timeLine = function(svg,option,params,xScale,isShowText) {
        //Declaration attributes
        this.version = '1.0';
        this.currentLine=null;
        this.currentText=null;
        this.isShow=false;
        this.showText=false;
        //Make the variable function in the current scope
        this.time_svg=svg;
        this.time_option=option;
        this.time_params=params;
        this.time_xScale=xScale;
        if (isShowText)//是否显示时间值
            this.showText=isShowText;
    }
    //The chain method
    timeLine.prototype = {
        drawLine: function(className,text_class) {
            // Create the mouse pointer line
            this.currentLine=this.time_svg.append("line")
                .attr('class', className)
                .classed("hide", false)
                .attr("x1", -1)
                .attr("x2", -1)
                .attr("y1", this.time_option.padding.top)
                .attr("y2", this.time_params.size.height - this.time_option.padding.bottom);
            //Show time label
            if(this.showText){
                this.currentText=new timeText(this.time_svg,this.time_xScale,this.time_option);
                this.currentText.drawText(text_class);
            }
            return this;
        },
        showLine:function(x,y){
            this.currentLine.classed("hide", false)
                            .attr("x1", x)
                            .attr("x2", x);  
            if(this.showText){
                this.currentText.showText(x);
            }  
            this.isShow=true;
            return this;
        },
        moveLine:function(x){
            this.currentLine.attr("x1", x)
                            .attr("x2", x);   
            if(this.showText){
                this.currentText.showText(x);
            }   
            return this;
        },
        hideLine:function(){
            this.currentLine.classed("hide", true)
                            .attr("x1", -1)
                            .attr("x2", -1);
            if(this.showText){
                this.currentText.hideText();
            }  
            this.isShow=false;
            return this;
        },
        // moveLine:function(time){  
        // 	var x = time_xScale(time) + 31; // 11; 重新又设置padding为20，所以要加20;
        //     var y = time_params.size.height - time_option.padding.bottom + 12;
        //     this.currentLine.attr('transform', 'translate(' + x + ',' + y + ')')
        //     return this;
        // }
    }

    //// Exports timeLine Component ////
    return timeLine;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(2), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function(d3, jquery, moment,lodash) {

    var TEXT_WIDTH = 12;
    var TEXT_HEIGHT = 14;

    var time_svg=null;
    var time_xScale=null;
    var time_option=null;

    // Defines the text type
    var timeText = function(svg,xScale,option) {
        //Declaration attributes
        this.version = '1.0';
        this.timeText=null;
        //Make the variable function in the current scope
        this.time_svg=svg;
        this.time_xScale=xScale;
        this.time_option=option;
    }
    //The chain method
    timeText.prototype = {
        drawText: function(className) {
            this.timeText=this.time_svg.append('text')
                .attr('class', className)//'hover_text'
                .text('00:00')
                .style('opacity', 0)
                .attr('x', -1)
                .attr('y', this.time_option.padding.top + 8);
            // svg.append('text')
            //     .attr('class', className)//'hover_text'
            //     .text('00:00')
            //     .style('opacity', 0)
            //     .attr('x', -1)
            //     .attr('y', option.padding.top + 8);
            return this;
        },
        showText:function(x,y){
            var time = this.time_xScale.invert(x - this.time_option.padding.left);
            var text = time.toLocaleTimeString('zh-CN', {
                hour12: false
            }).substr(0, 5);
            this.timeText.style('opacity', 1)
                .text(text)
                .attr("x", x);
            return this;
        },
        hideText:function(){
            this.timeText.style('opacity', 0)
                .attr("x", -1);
            return this;
        }
    }

    //// Exports timeText Component ////
    return timeText;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ })
/******/ ]);
});