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
        this.line=line;
        this.block_xScale=xScale;
        this.text_data=null;
    }
    //The chain method
    pumpText.prototype = {
        draw: function(data) {
            var _this=this;
            if(_this.line&&_this.line.g){
                this.text_data=data;
                var isRemove=false;
                this.pumpText=_this.line.g
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
            }
            
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
                    this.pumpText.attr('y', y+TEXT_HEIGHT);
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
        //默认样式
    var defaultClass = {
        CLASS_OPEN_STATE: {
            'text': '开',
            'class': 'rect open_state'
        },
        CLASS_CLOSE_STATE: {
            'text': '关',
            'class': 'rect close_state'
        },
        CLASS_FAULT_STATE: {
            'text': '故障',
            'class': 'rect fault_state'
        },
        CLASS_INDEFINITE_STATE: {
            'text': '不定',
            'class': 'rect indefinite_state'
        }
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
            this.hasDrag = false;
            this.hasPopover = false; //是否有弹出事件

            this.isEditing = false; //是否编辑中
            this.curBlock = null; //当前选中的块
            this.gWIDTH = null;
            //Make the variable function in the current scope
            this.option = opt;
            this.element = ele;
            this.describe = desc;

            this.dicState = defaultClass;


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
        drawChart: function(timelines, stateClass) {
            var _this = this;
            if (stateClass)
                this.dicState = stateClass;
            this.originalData = timelines;
            this.updateData = _.cloneDeep(timelines);
            _.each(this.updateData, function(line) {
                var pLine = new pumpLine(_this.svg, _this.xScale, _this.yScale, _this.option, _this.describe);
                pLine.drawLine(line, stateClass);
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
                    if (_this.curBlock != null && _this.curBlock.block != null) {
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
                    if (_this.curBlock == null || _this.curBlock.block == null) { //判断当前的块是否被删除
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
                if (_this.curBlock == null || _this.curBlock.block == null) { //判断当前的块是否被删除
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
                _this.removeHandles(); //清除手柄

                _this.hideHoverLine(); //隐藏提示线
                _this.isEditing = true; //选中：编辑状态
                _this.curBlock = block;
                var label = _this.curBlock.blockData.label;

                if (_this.chartLegend != null) {
                    /*故障 状态不能新增*/
                    if (label == _this.dicState.CLASS_FAULT_STATE.text) {
                        _this.chartLegend.add_button.setDisabled(true); //如果是故障状态 禁用 新增
                        _this.chartLegend.delete_button.setDisabled(false); //其他状态 启用 删除
                    }
                    /*不定 状态不能删除*/
                    else if (label == _this.dicState.CLASS_INDEFINITE_STATE.text) {
                        _this.chartLegend.add_button.setDisabled(true); //新增 按钮禁用
                        _this.chartLegend.delete_button.setDisabled(true); //删除 按钮禁用
                    } else {
                        _this.chartLegend.add_button.setDisabled(false); //其他状态 启用 新增
                        _this.chartLegend.delete_button.setDisabled(false); //其他状态 启用 删除
                    }
                }

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
                var y = parseFloat(curRect.attr('y'));


                var minX = x;
                if (!(x == 0 && label == _this.dicState.CLASS_INDEFINITE_STATE.text)) {
                    //添加开始手柄
                    _this.startHandle = new handle(d3g, _this.xScale);
                    _this.startHandle.drawHandle(x, y).drawHandleText(x, y).drag_Event(null, startDragged, startDragEnd); //-2是 handle的文体提示与块的间隔
                }
                var width = parseFloat(curRect.attr('width')) //curRect.width();//获取当前块的宽度

                var x2 = x + width;
                var endX = x2 - HANDLE_WIDTH; //当前位置加选中块的宽度，减去手柄的宽度

                if (!(x2 == _this.gWIDTH && label == _this.dicState.CLASS_INDEFINITE_STATE.text)) {
                    //添加结束手柄
                    _this.endHandle = new handle(d3g, _this.xScale, 'end'); //时间的文本要在编辑区域内
                    _this.endHandle.drawHandle(endX, y).drawHandleText(endX, y).drag_Event(null, endDragged, endDragEnd); //28是:  30(text width)- 2(handle width/2).
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
                var curY = parseFloat(this.curBlock.block.attr('y'));
                var endHandleX = curWidth + curX;
                //修改手柄位置
                if (this.startHandle != null)
                    this.startHandle.updatePos(curX, curY);
                if (this.endHandle != null)
                    this.endHandle.updatePos(endHandleX, curY);
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

            this.curBlock = null;
        }, //清除手柄
        bind_dbclick: function() {
            this.hasDBclick = true;
            var _this = this;
            var changeState = function(i, rects, block) {
                    _this.updateHandles();
                } //双击回调
            _.each(this.lines, function(line) {
                line.dbclick_Event(changeState); //绑定事件
            })
            return this;
        }, //鼠标双击，更改状态
        bind_drag: function() {
            this.hasDrag = true;
            var _this = this;
            var curDragBlock=null;
            var curLine=null;
            var tempLine =null;
            var dragStart= function(block) {
                curDragBlock=block;
                _this.removeHandles();//移除编辑手柄
                if (_this.hoverLine.isShow) {
                    _this.hideHoverLine(); //隐藏提示线
                    _this.isEditing = true; //选中：编辑状态
                }
                curLine=_.cloneDeep(block.block_Line);
                tempLine = new pumpLine(curLine.line_svg, curLine.line_xScale, curLine.line_yScale, curLine.line_option, curLine.line_describe);
                var lineData=curLine.line_data;
                lineData.points=[];
                lineData.points.push(block.blockData);
                
                tempLine.drawLine(lineData, curLine.stateClass).drag_Event(null,drag,dragEnd);
               
            } //拖动结束回调
            var drag = function(x, y) {
                if (_this.curBlock != null)
                    _this.updateHandles();
            } //拖动中回调

            var dragEnd = function(x, y, block) {
                if(curDragBlock!=null&&curDragBlock.block!=null){
                    var pos = block.line_data.pos;
                    var newX = pos.x1 + x;
                    var newY = pos.y1 + y;
                    var margin = false;
                    _.each(_this.lines, function(line) {
                        if (line.inBox(newX, newY)&&line.blocks[0].blockType==block.blockType) {//在同类型的分组内
                            if(line.g!=curDragBlock.block_Line.g){//不是同一行
                                _.each(line.blocks, function(lineBlock) {
                                    if (lineBlock!=curDragBlock&&lineBlock.inBox(x, 0)) {
                                        margin = true;
                                        lineBlock.insertBlock(block,x);
                                        //拖动的块的前一块覆盖空白
                                        var width=parseFloat(block.block.attr('width'));
                                        var x2=block.blockData.x+width;
                                        curDragBlock.update(x2,0,0);
                                        curDragBlock.changeLeft();
                                        curDragBlock.remove();
                                        return false;
                                        // var leftWidth = x - lineBlock.blockData.x;
                                        // lineBlock.updateWidth(leftWidth);

                                        //line.insert(block);
                                    }
                                })
                            }
                            else{//当前行的整块拖动
                                _.each(line.blocks, function(lineBlock) {
                                    if (lineBlock!=curDragBlock&&lineBlock.inBox(x, 0)) {
                                        margin = true;
                                        lineBlock.insertBlock(block,x);
                                        curDragBlock.remove();
                                        return false;
                                        // var leftWidth = x - lineBlock.blockData.x;
                                        // lineBlock.updateWidth(leftWidth);

                                        //line.insert(block);
                                    }
                                })
                            }
                        }
                    })
                    tempLine.remove();
                    _this.bind_popover();
                }
            } //拖动结束回调
            _.each(this.lines, function(line) {
                line.drag_Event(dragStart,drag, dragEnd); //绑定事件
            })
            return this;
        }, //拖拽事件
        bind_popover: function() {
            this.hasPopover = true;
            var _this = this;
            //弹出框内容
            function ContentMethod(data) {
                var html = '';
                var val = data.value; //获取当前值
                if (val == null || val == undefined)
                    val = '';
                var openClass='green';
                var closeClass='red';
                if(_this.dicState.CLASS_OPEN_STATE.class.indexOf('open')==-1){
                    openClass='red';
                    closeClass='green';
                }
                if (data.blockType == 'state') {
                    html = '<button class="popoverBtn '+openClass+' openBtn" >开</button><button class="popoverBtn '+closeClass+' closeBtn" >关</button>';
                } else if (data.blockType == 'numeric') {
                    html = '<input type="number" class="pumpvalue" name="pumpvalue" style="width: 50px" value=' + val + ' max=' + data.maxValue + '><span>'+data.unitText+'</span><button  class="popoverBtn '+closeClass+' closeBtn" >关</button>';
                } else if (data.blockType == 'gradient') {
                    html = '<input type="text" class="pumpvalue" name="pumpvalue" style="width: 50px" value=' + val + ' max=' + data.maxValue + '><span>'+data.unitText+'</span>';
                }
                return html;
            }
            var popEle = "[data-toggle='popover']";
            if (_this.element && _this.element.nodes().length > 0)
                popEle = "#" + _this.element.nodes()[0].id + " " + popEle;
            //所有设置弹出框属性的元素绑定弹出
            $(popEle).each(function(i, e) {
                var element = $(e);
                element.popover({
                        trigger: 'click', //弹出框的触发事件： click| hover | focus | manual
                        container: '#' + _this.element.node().id, //向指定元素中追加弹出框
                        placement: 'top', //弹出框定位方向（即 top|bottom|left|right|auto）
                        html: 'true', //是否解析html标签
                        content: ContentMethod(e.__data__), //弹出框内容
                        animation: false //动画过渡效果

                    }).on("click", function() {
                        var ele = this;
                        var data = ele.__data__;
                        $(ele).popover("show"); //显示弹出框
                        var popId = $(ele).attr('aria-describedby');//获取对应弹出框的id
                        //删除其他的弹出框
                        $('.popover').each(function(i,e){
                            if(e.id!=popId){
                                e.remove();
                            }
                        })

                        $('#' + popId + ' .pumpvalue').val(data.value); //更新弹出框的input的值

                        $(ele).siblings("[data-toggle]").on("mouseleave", function() {
                            $(ele).popover('hide');
                        });

                        /*  弹出框事件  */
                        var changeData = function(valtext) {
                            if(valtext){
                                valtext.trim();
                                if (valtext == '') {
                                    data.value = undefined;
                                    data.label = _this.dicState.CLASS_INDEFINITE_STATE.text;
                                } else {
                                    var val=0;
                                    if (data.blockType == 'gradient')
                                        val=parseFloat(valtext);
                                    else
                                        val = parseInt(valtext);
                                    data.value = val;
                                    if (val > 0) {
                                        data.label = valtext;
                                    } else if (val == 0)
                                        data.label = _this.dicState.CLASS_CLOSE_STATE.text;
                                    else if (val < 0)
                                        data.label = _this.dicState.CLASS_FAULT_STATE.text;
                                }
                                //修改值或状态
                                _this.curBlock.updateState(data);
                            }
                        }
                        var previousValue=null;
                        var timer=null;
                        /*  输入框值改变事件  */
                        $('#' + popId + ' .pumpvalue').on('change', function() {
                                if (_this.curBlock != null && _this.curBlock.block != null) {
                                    changeData(this.value); //更新当前块
                                    $(this).val(data.value); //this.value =data.value;
                                    //_this.removeHandles(); //关闭选中状态
                                    _this.updateHandles(); //更新手柄
                                }
                            }) //值改变事件
                            .on('keyup', function() {
                                var ele=this;
                                var searchText = ele.value.trim();
                                if (searchText != previousValue) {
                                    if (timer) clearTimeout(timer)
                                    timer = setTimeout(function () {
                                        if (_this.curBlock != null && _this.curBlock.block != null) {
                                            changeData(searchText); //更新当前块
                                            $(ele).val(data.value); //this.value =data.value;
                                            //_this.removeHandles(); //关闭选中状态
                                            _this.updateHandles(); //更新手柄
                                        }
                                    }, 500);
                                    previousValue = searchText;
                                }
                            }) //手动输入事件

                        /*  关闭按钮点击事件  */
                        $('#' + popId + ' .closeBtn').on('click', function() {
                                if (_this.curBlock != null && _this.curBlock.block != null) {
                                    data.value = 0;
                                    data.label = _this.dicState.CLASS_CLOSE_STATE.text;
                                    _this.curBlock.updateState(data); //状态修改为关
                                    $(ele).popover('hide'); //关掉弹出框
                                    _this.removeHandles(); //关闭选中状态
                                    //_this.updateHandles();//更新手柄
                                }
                            })
                            /*  打开按钮点击事件  */
                        $('#' + popId + ' .openBtn').on('click', function() {
                            if (_this.curBlock != null && _this.curBlock.block != null) {
                                data.value = 1;
                                data.label = _this.dicState.CLASS_OPEN_STATE.text;
                                _this.curBlock.updateState(data); //状态修改为关
                                $(ele).popover('hide'); //关掉弹出框
                                _this.removeHandles(); //关闭选中状态
                                //_this.updateHandles();//更新手柄
                            }
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
                this.drawChart(this.originalData,this.dicState);
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
        showHover:true,
        showLegend:false,
        edit: false,
        drag:false
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

                // Try to convert time string to Date object.
                _.each(line.values,function(v) {
                    if (isString(v.time)) {
                        v.time = toTime(v.time);
                    }
                    if(v.value!=null)
                        v.label = formatValue(parseInt(v.value.toFixed(0)), line.type, line.format, line.unit);
                    else
                        v.label =dicState.CLASS_INDEFINITE_STATE.text; 
                    if(v.unitText==undefined)
                        v.unitText=line.unitText||'';
                })

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
                    else{
                        //跨天的数据处理
                        if (sorted_values[i].time.getDate() !== sorted_values[i - 1].time.getDate()) {
                            // if(i>2&&sorted_values[i - 1].value == sorted_values[i - 2].value){
                            //     var last=merged_values.length-1;
                            //     _.remove(merged_values,merged_values[last]);
                            // }
                            merged_values.push(sorted_values[i]);
                        }  
                    }
                    if(i>2&&sorted_values[i - 1].value == sorted_values[i - 2].value){
                        var last=merged_values.length-2;
                        if(last>0)
                            _.remove(merged_values,merged_values[last]);
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
                        value: null,
                        label: dicState.CLASS_INDEFINITE_STATE.text,
                        unitText:line.unitText||''
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


                        var lastIndex=merged_values.length-1;
                        if(merged_values[lastIndex - 1].value == merged_values[lastIndex].value){
                            _.remove(merged_values,merged_values[lastIndex]);
                            last=getLast(merged_values);
                        }//删除重复数据

                        var point = {
                            time: time,
                            value: null,
                            label: dicState.CLASS_INDEFINITE_STATE.text,
                            unitText:line.unitText||'',
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
                this.area.drawLegend();
            this.area.draw().drawChart(this.timelines).drawAsix();//绘制曲线

            if(this.option.showCurrent)//是否显示当前提示线
                this.area.drawCurrentLine();
            if(this.option.showHover)//是否显示鼠标悬浮提示
                this.area.drawHoverLine();
            if(this.option.edit)
                this.area.bind_check().bind_dbclick().bind_popover();
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
                this.area.drawLegend();
            this.area.draw().drawChart(this.timelines,dicState).drawAsix();//绘制曲线

            if(this.option.showCurrent)//是否显示当前提示线
                this.area.drawCurrentLine();
            if(this.option.showHover)//是否显示鼠标悬浮提示
                this.area.drawHoverLine();
            if(this.option.edit)//是否可编辑
                this.area.bind_check().bind_dbclick().bind_popover();
            if(this.option.drag)//是否可拖拽
                this.area.bind_drag();
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
        bind_drag:function(){
            this.area.bind_drag();
            return this;
        },//拖拽事件
        bind_popover:function(){
            this.area.bind_popover();
            return this;
        },
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
        }
    }

    //// Exports pumpChart Component ////
    return { pumpChart: pumpChart };
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
    var HANDLE_PADDING=-5;
    var TEXT_PADDING=-2;
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
                .attr('y', y+HANDLE_PADDING)//突出handle长度，比当前块高5个像素
                .attr('width', HANDLE_WIDTH)
                .attr('height', HANDLE_HEIGHT);
            this.pos[0]=x;
            this.pos[1]=y+HANDLE_PADDING;
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
            this.handleText.drawText(hText,'edit_text',textX,y+TEXT_PADDING);
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
                var textY=null;
                if(y!=undefined){

                    this.pos[1]=y;
                    this.handle.attr('y', y+HANDLE_PADDING);
                    textY=y+TEXT_PADDING;
                }
                var htext=moment(this.handle_xScale.invert(textTimeX)).format('HH:mm');//显示时间
                this.handleText.update(htext,textX,textY);//修改手柄提示的坐标
            }
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

    // Check whether the obj is null or undfined.
    var isNullOrUndefine = function(obj) {
        return obj === undefined || obj === null;
    }
    
    // Defines the gradientBlock type
    var gradientBlock = function(line) {
        this.version = '1.0';
        this.blockType='gradient';

        this.block =null;//当前的块元素
        this.blockText=null;//当前的块的文本原元素

        this.leftBlock=null;
        this.rightBlock=null;

        this.blockData =null;//当前的块的状态
        // this.blockState =null;//当前的块的状态
        
        this.block_Line=line;
        this.block_xScale = line.line_xScale; //x比例尺
        this.line_data = line.line_data; //赋值行的数据
        this.block_ColorGrade=line.ColorGrade;
        this.block_ValueGrade=line.valueGrade;

        this.hasDrag=false;//是否有拖拽
        this.dragStartFn=null;//拖拽开始回调函数
        this.dragFn=null;//拖拽中回调函数
        this.dragEndFn=null;//拖拽结束回调函数

        this.callFn=null;
        if (!isNullOrUndefine(line.stateClass))
            this.stateClass =line.stateClass;
    }
    //链式方法
    gradientBlock.prototype = {
        formatClass:function(d) {
            var className = null;
            if (d.value > 0) {
                d.className = this.stateClass.CLASS_OPEN_STATE.class; //dicClass['开'];
            } else if (d.value == 0) {
                d.className = this.stateClass.CLASS_CLOSE_STATE.class; //dicClass['关'];

            } else if (d.value < 0) {
                d.className = this.stateClass.CLASS_FAULT_STATE.class; //dicClass['故障'];
            } else {
                d.className = this.stateClass.CLASS_INDEFINITE_STATE.class; //dicClass['不定'];
            }
            return d.className;
        },
        draw: function(data) {//在绘图区绘制出块
            if(isNullOrUndefine(data.unitText))
                data.unitText='';
            if(!isNullOrUndefine(data.value))
                data.label=data.value.toString().trim();
            data.blockType=this.blockType;
            var _this=this;
            this.block=this.block_Line.g
                .append('rect')
                .datum(data)
                .attr('class', function(d, i) {
                    return _this.formatClass(d);
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
            if(!isNullOrUndefine(data.value)){
                data.colorGrade=this.getColorByValue(data.value);
                if(data.colorGrade!=undefined){
                    $(this.block.node()).css('fill',data.colorGrade);
                }//设置当前颜色
            }
            this.blockData=data;
            var pos = {};
            pos.x1 = data.x;
            pos.y1 = 0;
            pos.x2 = data.x + data.width;
            pos.y2 = 0 + BAR_HEIGHT;
            this.blockData.pos = pos;
            return this;
        },//绘制块
        getColorByValue:function(value) {
            var _this=this;
            //渐变填充色
            for (var i = 0; i < _this.block_ValueGrade.length; i++) {
                var rgbColor=null;
                if(i==0){
                    if(value<=_this.block_ValueGrade[i])
                        rgbColor=_this.block_ColorGrade[i];
                    else if(value>_this.block_ValueGrade[i]&&value<=_this.block_ValueGrade[i+1])
                        rgbColor=_this.block_ColorGrade[i+1];
                }
                else if(i>0&&i<_this.block_ValueGrade.length-1){
                    if(value>_this.block_ValueGrade[i]&&value<=_this.block_ValueGrade[i+1])
                        rgbColor=_this.block_ColorGrade[i+1];
                }
                else if(i==_this.block_ValueGrade.length-1){
                    if(value>_this.block_ValueGrade[i])
                        rgbColor=_this.block_ColorGrade[i+1];
                }
                if(rgbColor!=null)
                    return changeColor(_.clone(rgbColor));
            }
        },//获取对应颜色
        drawText:function(){
            this.blockText=new pumpText(this.block_Line,this.block_xScale);
            this.blockText.draw(this.blockData);
            return this;
        },//块对应的文本提示
        update:function(x,y,width,fn){ 
            if(!isNullOrUndefine(x)){
                this.block.attr('x', function(d) {
                    d.x = x;
                    d.pos.x1 = d.x;
                    return d.x;
                });
            }
            if(!isNullOrUndefine(y)){
                this.block.attr('y',  function(d) {
                    d.y = y;
                    d.pos.y1 = d.y;
                    return d.y;
                });
            }
            if(!isNullOrUndefine(width)){
                this.block.attr('width', function(d) {
                    d.width = width;
                    d.pos.x2 = d.x + d.width;
                    return d.width;
                });
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
                this.block.attr('width',function(d) {
                    d.width = width;
                    d.pos.x2 = d.x + d.width;
                    return d.width;
                });
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
                this.block.attr('width',function(d) {
                    d.width = rectWidth;
                    d.pos.x2 = d.x + d.width;
                    return d.width;
                });
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
        setMinValue:function(min){
            if(!isNullOrUndefine(min))
                this.blockData.minValue=min;
            return this;
        },//设置下限
        setMaxValue:function(max){
            if(!isNullOrUndefine(max))
                this.blockData.maxValue=max;
            return this;
        },//设置上限
        changeLeft:function(){
            var _this=this;
            if(_this.block!=null){
                var x2=parseFloat(_this.block.attr('x'));
                if(_this.leftBlock && _this.leftBlock.block){//判断左边是否有邻近块
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
                    if(_this.blockData.className !=_this.stateClass.CLASS_INDEFINITE_STATE.class){
                        var data = {
                            height: BAR_HEIGHT,
                            time:_this.block_xScale.invert(0),
                            value: null,
                            label: _this.stateClass.CLASS_INDEFINITE_STATE.text,
                            width:x2
                        };
                        var leftBlock=new gradientBlock(_this.block_Line);
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
            if(_this.rightBlock && _this.rightBlock.block){
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
                
                if (_this.rightBlock&&_this.rightBlock.block&&this.blockData.label.trim() == this.rightBlock.blockData.label.trim()) { //状态一致，合并
                    var addWidth = parseFloat(this.rightBlock.block.attr('width')); //计算增加的宽度
                    this.addWidth(addWidth); //合并到当前块
                    this.rightBlock.remove(); //移除右侧
                }
            }
            else{
                var MaxX=this.block_Line.lineWidth;
                if(x1<MaxX){
                    //如果没有就创建  不定状态
                    var data = {
                        height: BAR_HEIGHT,
                        time:_this.block_xScale.invert(x1),
                        value: null,
                        label: this.stateClass.CLASS_INDEFINITE_STATE.text,
                        width:MaxX-x1
                    };
                    var rightBlock=new gradientBlock(_this.block_Line);
                    rightBlock.draw(data).drawText(data).click_Event(_this.callFn).setLeft(_this);
                    _this.rightBlock=rightBlock;
                }
            }
            return this;   
        },//修改右边的块
        updateState:function(data){
            var _this=this;
            if (data.value < data.minValue) {//最小限制
                data.value = data.minValue;
            }
            if (data.value > data.maxValue){ //最大限制
                data.value = data.maxValue;
            }
            data.label=data.value.toString();
            this.block.attr('class', function(d, i) {//.datum(data)
                return _this.formatClass(d);
            })
            if(!isNullOrUndefine(data.value)){//修改填充颜色
                data.label=data.value.toString().trim();
                
                data.colorGrade=this.getColorByValue(data.value);
                if(data.colorGrade!=undefined){
                    $(_this.block.node()).css('fill',data.colorGrade);
                }//设置当前颜色
            }
            else{//清除填充颜色
                $(_this.block.node()).css('fill','');
            }
            _this.blockData=data;

            //判断两边状态十分合并
            if (this.rightBlock != null) {
                if (this.blockData.label.trim() == this.rightBlock.blockData.label.trim()) { //状态一致，合并
                    var addWidth = parseFloat(this.rightBlock.block.attr('width')); //计算增加的宽度
                    this.addWidth(addWidth); //合并到当前块
                    this.rightBlock.remove(); //移除右侧
                }
            }
            if (this.leftBlock != null) {
                if (this.blockData.label.trim() == this.leftBlock.blockData.label.trim()) { //状态一致，合并
                    var addWidth = parseFloat(this.block.attr('width')); //计算增加的宽度
                    this.leftBlock.addWidth(addWidth); //合并到前一块
                    this.remove(); //移除当前
                }
            }

            if(this.blockText){
                this.blockText.updateText(data);
            }
            return this;
        },//修改当前快的状态
        remove:function(){
            if(this.line_data!=null){
                _.remove(this.line_data.points,this.blockData);
            }//从数据集合删除
             _.remove(this.block_Line.points, this);
            if(this.block!=null){
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
                            var x2=parseFloat(this.leftBlock.block.attr('width'))+x1;//左边的结束坐标
                            var curx2 = parseFloat(this.rightBlock.block.attr('x')) + parseFloat(this.rightBlock.block.attr('width')); //计算结束坐标
                            if(x2<curx2){//判断是否修改左侧宽度
                                var width = curx2 - x1; //计算宽度
                                this.leftBlock.update(x1, null, width); //合并到前一块
                            }
                            this.rightBlock.remove();//删除后一条
                        }
                }
                //删除对应text的位置
                if(this.blockText!=null)
                    this.blockText.remove();
            }
            return this;
        },//删除当前块，并合并相同状态的邻近块
        restorePos: function() {
            var _this = this;
            this.block
                .attr('x', function(d) {
                    d.x = _this.blockData.x;
                    return d.x;
                })
                .attr('y', 0);

            //修改对应text的位置
            if (this.blockText != null)
                this.blockText.update(this.blockData.x, 0);
            return this;
        }, //还原坐标
        insertCentre:function(){
            if(this.blockData.className!=this.stateClass.CLASS_FAULT_STATE.class){//故障不能新增
                var totalWidth=parseFloat(this.block.attr('width'));//获取当前快的总宽
                var rightBlock=this.rightBlock;//获取当前的右侧块
                var intWidth=parseInt(totalWidth);
                var x1=parseFloat(this.block.attr('x'));
                var averageWidth=intWidth/3;//平均的宽度：分成三等分
                var x2=x1+averageWidth;
                var x3=x2+averageWidth;

                //先修改当前的块的宽度，再插入两块新的
                this.updateWidth(averageWidth);
                var newData={//默认新建“不定”的状态
                    height: BAR_HEIGHT,
                    time:this.block_xScale.invert(x2),
                    value: undefined,
                    label:this.stateClass.CLASS_INDEFINITE_STATE.text,
                    width:averageWidth,
                    x:x2
                }
                //新建中间一段
                var newBlock=new gradientBlock(this.block_Line);
                newBlock.draw(newData).drawText(newData).click_Event(this.callFn).setLeft(this);
                if(this.hasDrag)
                    newBlock.drag_Event(this.dragStartFn,this.dragFn,this.dragEndFn);
                if (this.block_Line != null) {
                    this.block_Line.blocks.push(newBlock);
                    this.line_data.points.push(newData);
                }//添加到数据集合中
                //新建相同的一段
                var data={
                    height: BAR_HEIGHT,
                    time:this.block_xScale.invert(x3),
                    value: this.blockData.value,
                    label:this.blockData.label,
                    width:averageWidth,
                    x:x3
                }
                var sameBlock=new gradientBlock(this.block_Line);
                sameBlock.draw(data).drawText(data).click_Event(this.callFn).setLeft(newBlock).setRight(rightBlock);
                if(this.hasDrag)
                    sameBlock.drag_Event(this.dragStartFn,this.dragFn,this.dragEndFn);
                this.line_data.points.push(data);//添加到数据集合中
                this.block_Line.blocks.push(sameBlock);
                if (rightBlock != null)
                    rightBlock.setLeft(sameBlock); //设置当前新建块的右侧快的左侧

                newBlock.setRight(sameBlock);//设置中间一块的右侧
                this.setRight(newBlock);

                if(this.line_data.points.length>1){
                    // Sort all values by time
                    var sorted_values = this.line_data.points.sort(function(a, b) {
                        return a.time - b.time;
                    });
                    this.line_data.points=sorted_values;
                }
            }
            return this;
        },//插入新的块到当前块的中间
        insertBlock: function(block,x,y) {
            if(isNullOrUndefine(x)){
                x=block.blockData.x;
            }
            var rightBlock = this.rightBlock; //获取当前的右侧块
            var addBlockWidth=parseFloat(block.block.attr('width'));
            var x2=x+addBlockWidth;
            var x3=this.blockData.pos.x2;
            if (this.blockData.label != block.blockData.label) { 
                //修改当前的块
                var width=x-this.blockData.x;
                this.updateWidth(width);
                //新增一块
                var newData={
                    height: BAR_HEIGHT,
                    time: this.block_xScale.invert(x),
                    value: block.blockData.value,
                    label: block.blockData.label,
                    width: addBlockWidth,
                    x: x
                }
                //新建中间一段
                var newBlock = new gradientBlock(this.block_Line);
                newBlock.draw(newData).drawText(newData).click_Event(this.callFn).setLeft(this);
                if(this.hasDrag)
                    newBlock.drag_Event(this.dragStartFn,this.dragFn,this.dragEndFn);
                if (this.block_Line != null) {
                    this.block_Line.blocks.push(newBlock);
                    this.line_data.points.push(newData);
                } //添加到数据集合中
                this.setRight(newBlock);

                if(x3>x2){//包含在当前块
                    var sameWidth=x3-x2;
                    //新建相同的一段
                    var data = {
                        height: BAR_HEIGHT,
                        time: this.block_xScale.invert(x2),
                        value: this.blockData.value,
                        label: this.blockData.label,
                        width: sameWidth,
                        x: x2
                    }
                    var sameBlock = new gradientBlock(this.block_Line);
                    sameBlock.draw(data, this.line_data).drawText(data).click_Event(this.callFn).setLeft(newBlock).setRight(rightBlock);
                    if(this.hasDrag)
                        sameBlock.drag_Event(this.dragStartFn,this.dragFn,this.dragEndFn);
                    this.line_data.points.push(data); //添加到数据集合中
                    this.block_Line.blocks.push(sameBlock);
                                        
                    if (rightBlock != null)
                        rightBlock.setLeft(sameBlock); //设置当前新建块的右侧快的左侧

                    newBlock.setRight(sameBlock); //设置中间一块的右侧
                    sameBlock.dbclick_Event(this.dbclick_callFn);
                }
                else{
                    newBlock.setRight(rightBlock);
                    if (rightBlock != null)
                        rightBlock.setLeft(newBlock);
                    if(newBlock.blockData.label != rightBlock.blockData.label){
                        newBlock.changeRight();
                    }
                    else{//合并右侧
                        var rightX2=rightBlock.blockData.pos.x2;
                        rightBlock.remove();
                        if(x2>rightX2){//覆盖了右侧,移除右侧并修改新的右侧块
                            newBlock.changeRight();
                        }
                        else{//合并右侧
                           var marginWidth= rightX2-x;
                           newBlock.updateWidth(marginWidth);
                        }
                    }
                    
                }
                
                newBlock.dbclick_Event(this.dbclick_callFn);

                if (this.line_data.points.length > 1) {
                    // Sort all values by time
                    var sorted_values = this.line_data.points.sort(function(a, b) {
                        return a.time - b.time;
                    });
                    this.line_data.points = sorted_values;
                }
            }
            else{//状态一样，合并
                //修改当前的块
                var width=x2-this.blockData.x;
                this.updateWidth(width).changeRight();
            }
            return this;
        }, //插入块到当前块
        inBox: function(x, y) {
            if (this.blockData) {
                return x >= this.blockData.pos.x1 &&
                    x <= this.blockData.pos.x2 &&
                    y >= this.blockData.pos.y1 &&
                    y <= this.blockData.pos.y2;
            } else
                return false;
        }, //是否在坐标范围内
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
        drag_Event: function(dragStartFn,dragFn, dragEndFn) {
            var _this = this;
            this.hasDrag=true;
            this.dragStartFn=dragStartFn;
            this.dragFn=dragFn;
            this.dragEndFn=dragEndFn;

            var oldx=0;
            var oldy=0;
            var dragStart = function(d, i, rects) {
                oldx = event.x;
                oldy = event.y;
                if (typeof dragStartFn == 'function') { //回调函数
                    dragStartFn.call(null, _this);
                }
            }
            var drag = function(d, i, rects) {
                var diffValueX = event.x - oldx;
                var diffValueY = event.y - oldy;

                var newX = parseFloat(d3.select(this).attr("x")) + diffValueX;
                var newY = parseFloat(d3.select(this).attr("y")) + diffValueY;

                d3.select(this)
                    .attr("x", newX)
                    .attr("y", newY);
                //修改文字位置
                _this.blockText.update(newX, newY);
                //更新历史值
                oldx = event.x;
                oldy = event.y;
                if (typeof dragFn == 'function') { //回调函数
                    dragFn.call(null, newX, newY);
                }
            }
            var dragEnd = function(d, i, rects) {
                var diffValueX = event.x - oldx;
                var diffValueY = event.y - oldy;
                var newX = parseFloat(d3.select(this).attr("x")) + diffValueX;
                var newY = parseFloat(d3.select(this).attr("y")) + diffValueY;
                if (typeof dragEndFn == 'function') { //回调函数
                    dragEndFn.call(null, newX, newY, _this);
                }
            }
            var blockDrag = d3.drag()
                .filter(function() {
                    return d3.event.button == 2;
                })
                .on("start", dragStart)
                .on("drag", drag)
                .on("end", dragEnd);
            this.block.call(blockDrag);
            return this;
        } //鼠标拖拽事件
    }

    //// Exports gradientBlock Component ////
    return gradientBlock;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(2), __webpack_require__(3), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function(d3, jquery, moment, lodash, pumpText) {

    var BAR_HEIGHT = 22; //默认高度
    var MIN_VALUE = 0; //下限
    var MAX_VALUE = 50; //上限

    // Check whether the obj is null or undfined.
    var isNullOrUndefine = function(obj) {
            return obj === undefined || obj === null;
        }
        // Defines the numericBlock type
    var numericBlock = function(line) {
            this.version = '1.0';
            this.blockType = 'numeric';

            this.block = null; //当前的块元素
            this.blockText = null; //当前的块的文本原元素

            this.leftBlock = null;
            this.rightBlock = null;

            this.blockData = null; //当前的块的状态

            this.block_Line = line;
            this.block_xScale = line.line_xScale;
            this.line_data = line.line_data;

            this.callFn = null;

            this.hasDrag = false; //是否有拖拽
            this.dragStartFn = null; //拖拽开始回调函数
            this.dragFn = null; //拖拽中回调函数
            this.dragEndFn = null; //拖拽结束回调函数

            if (!isNullOrUndefine(line.stateClass))
                this.stateClass = line.stateClass;
        }
        //链式方法
    numericBlock.prototype = {
        formatClass: function(d) {
            var className = null;
            if (d.value > 0) {
                d.className = this.stateClass.CLASS_OPEN_STATE.class; //dicClass['开'];
            } else if (d.value == 0) {
                d.className = this.stateClass.CLASS_CLOSE_STATE.class; //dicClass['关'];

            } else if (d.value < 0) {
                d.className = this.stateClass.CLASS_FAULT_STATE.class; //dicClass['故障'];
            } else {
                d.className = this.stateClass.CLASS_INDEFINITE_STATE.class; //dicClass['不定'];
            }
            return d.className;
        },
        draw: function(data) { //在绘图区绘制出块   
            if(isNullOrUndefine(data.unitText))
                data.unitText='';
            data.blockType = this.blockType; //设置当前类型
            if(!data.maxValue)
                data.maxValue = MAX_VALUE; //设置默认最大值
            if(!data.minValue)
                data.minValue = MIN_VALUE; //设置默认最大值
            if (data.value > MAX_VALUE) { //判断是否超过最大限制
                data.value = MAX_VALUE;
                data.label = MAX_VALUE.toString().trim();
            }

            var _this = this;

            if (this.block_Line && this.block_Line.g) {
                this.block = this.block_Line.g
                    .append('rect')
                    .datum(data)
                    .attr('class', function(d, i) {
                        return _this.formatClass(d);
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
                    .attr('data-toggle', 'popover') //增加弹出属性

                this.blockData = data;
                var pos = {};
                pos.x1 = data.x;
                pos.y1 = 0;
                pos.x2 = data.x + data.width;
                pos.y2 = 0 + BAR_HEIGHT;
                this.blockData.pos = pos;
            }
            return this;
        }, //绘制块
        drawText: function() {
            this.blockText = new pumpText(this.block_Line, this.block_xScale);
            this.blockText.draw(this.blockData);
            return this;
        }, //块对应的文本提示
        update: function(x, y, width, fn) {
            if (!isNullOrUndefine(x)) {
                this.block.attr('x', function(d) {
                    d.x = x;
                    d.pos.x1 = d.x;
                    return d.x;
                });
            }
            if (!isNullOrUndefine(y)) {
                this.block.attr('y', function(d) {
                    d.y = y;
                    d.pos.y1 = d.y;
                    return d.y;
                });
            }
            if (!isNullOrUndefine(width)) {
                this.block.attr('width', function(d) {
                    d.width = width;
                    d.pos.x2 = d.x + d.width;
                    return d.width;
                });
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
                this.block.attr('width', function(d) {
                    d.width = width;
                    d.pos.x2 = d.x + d.width;
                    return d.width;
                });
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
                this.block.attr('width', function(d) {
                    d.width = rectWidth;
                    d.pos.x2 = d.x + d.width;
                    return d.width;
                });
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
        }, //设置左边邻近块
        setRight: function(right) {
            if (!isNullOrUndefine(right))
                this.rightBlock = right;
            return this;
        }, //设置右边邻近块
        setMinValue: function(min) {
            if (!isNullOrUndefine(min))
                this.blockData.minValue = min;
            return this;
        }, //设置下限
        setMaxValue: function(max) {
            if (!isNullOrUndefine(max))
                this.blockData.maxValue = max;
            return this;
        }, //设置上限
        changeLeft: function() {
            var _this = this;
            if (_this.block != null) {
                var x2 = parseFloat(_this.block.attr('x'));
                if (_this.leftBlock && _this.leftBlock.block) { //判断左边是否有邻近块
                    var x1 = parseFloat(_this.leftBlock.block.attr('x'));
                    var width = x2 - x1;
                    if (width <= 0) { //左边块被覆盖
                        _this.leftBlock.remove(); //删除前一个
                        _this.changeLeft(); //修改新的前一块
                    } else {
                        _this.leftBlock.update(null, null, width); //修改左边的宽度
                    }
                } else { //如果没有就创建  不定状态
                    if (_this.blockData.className != _this.stateClass.CLASS_INDEFINITE_STATE.class) {
                        var data = {
                            height: BAR_HEIGHT,
                            time: _this.block_xScale.invert(0),
                            value: null,
                            label: _this.stateClass.CLASS_INDEFINITE_STATE.text,
                            width: x2
                        };
                        var leftBlock = new numericBlock(_this.block_Line);
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
            if (_this.rightBlock && _this.rightBlock.block) {
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
                }

                if (_this.rightBlock&&_this.rightBlock.block&&this.blockData.label.trim() == this.rightBlock.blockData.label.trim()) { //状态一致，合并
                    var addWidth = parseFloat(this.rightBlock.block.attr('width')); //计算增加的宽度
                    this.addWidth(addWidth); //合并到当前块
                    this.rightBlock.remove(); //移除右侧
                }
            } else {
                var MaxX = this.block_Line.lineWidth;
                if (x1 < MaxX) {
                    //如果没有就创建  不定状态
                    var data = {
                        height: BAR_HEIGHT,
                        time: _this.block_xScale.invert(x1),
                        value: null,
                        label: _this.stateClass.CLASS_INDEFINITE_STATE.text,
                        width: MaxX-x1
                    };
                    var rightBlock = new numericBlock(_this.block_Line);
                    rightBlock.draw(data).drawText(data).click_Event(_this.callFn).setLeft(_this);
                    _this.rightBlock = rightBlock;
                }
            }
            return this;
        }, //修改右边的块
        updateState: function(data) {
            var _this = this;
            if (data.value < data.minValue) //最小限制
                data.value = data.minValue;
            if (data.value > data.maxValue) //最大限制
                data.value = data.maxValue;
            data.label=data.value.toString();
            this.block.attr('class', function(d, i) {
                return _this.formatClass(d);
            })
            this.blockData = data;

            //判断两边状态十分合并
            if (this.rightBlock != null) {
                if (this.blockData.label.trim() == this.rightBlock.blockData.label.trim()) { //状态一致，合并
                    var addWidth = parseFloat(this.rightBlock.block.attr('width')); //计算增加的宽度
                    this.addWidth(addWidth); //合并到当前块
                    this.rightBlock.remove(); //移除右侧
                }
            }
            if (this.leftBlock != null) {
                if (this.blockData.label.trim() == this.leftBlock.blockData.label.trim()) { //状态一致，合并
                    var addWidth = parseFloat(this.block.attr('width')); //计算增加的宽度
                    this.leftBlock.addWidth(addWidth); //合并到前一块 
                    this.remove(); //移除当前
                }
            }

            if (this.blockText) {
                this.blockText.updateText(data);
            }
            return this;
        }, //修改当前快的状态
        remove: function() {
            if (this.line_data != null) {
                _.remove(this.line_data.points, this.blockData);
            } //从数据集合删除
            _.remove(this.block_Line.points, this);

            if (this.block != null) {
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
                        var x2 = parseFloat(this.leftBlock.block.attr('width')) + x1; //左边的结束坐标
                        var curx2 = parseFloat(this.rightBlock.block.attr('x')) + parseFloat(this.rightBlock.block.attr('width')); //计算结束坐标
                        if (x2 < curx2) { //判断是否修改左侧宽度
                            var width = curx2 - x1; //计算宽度
                            this.leftBlock.update(x1, null, width); //合并到前一块
                        }
                        this.rightBlock.remove(); //删除后一条
                    }
                }
                //删除对应text的位置
                if (this.blockText != null)
                    this.blockText.remove();
            }
            return this;
        }, //删除当前块，并合并相同状态的邻近块
        restorePos: function() {
            var _this = this;
            this.block
                .attr('x', function(d) {
                    d.x = _this.blockData.x;
                    return d.x;
                })
                .attr('y', 0);

            //修改对应text的位置
            if (this.blockText != null)
                this.blockText.update(this.blockData.x, 0);
            return this;
        }, //还原坐标
        insertCentre: function() {
            if (this.blockData.className != this.stateClass.CLASS_FAULT_STATE.class) { //故障不能新增
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
                    label: '1',
                    width: averageWidth,
                    x: x2
                }
                if (this.blockData.className == this.stateClass.CLASS_OPEN_STATE.class) { //如果当前是开的就新建关
                    newData.label = this.stateClass.CLASS_CLOSE_STATE.text;
                    newData.value = 0;
                }
                //新建中间一段
                var newBlock = new numericBlock(this.block_Line);
                newBlock.draw(newData).drawText(newData).click_Event(this.callFn).setLeft(this);
                if (this.hasDrag)
                    newBlock.drag_Event(this.dragStartFn, this.dragFn, this.dragEndFn);
                if (this.block_Line != null) {
                    this.block_Line.blocks.push(newBlock);
                    this.line_data.points.push(newData);
                } //添加到数据集合中

                //新建相同的一段
                var data = {
                    height: BAR_HEIGHT,
                    time: this.block_xScale.invert(x3),
                    value: this.blockData.value,
                    label: this.blockData.label,
                    width: averageWidth,
                    x: x3
                }
                var sameBlock = new numericBlock(this.block_Line);
                sameBlock.draw(data).drawText(data).click_Event(this.callFn).setLeft(newBlock).setRight(rightBlock);
                if (this.hasDrag)
                    sameBlock.drag_Event(this.dragStartFn, this.dragFn, this.dragEndFn);
                rightBlock.setLeft(sameBlock); //设置当前新建块的右侧快的左侧
                this.line_data.points.push(data); //添加到数据集合中
                this.block_Line.blocks.push(sameBlock);
                if (rightBlock != null)
                    rightBlock.setLeft(sameBlock); //设置当前新建块的右侧快的左侧

                newBlock.setRight(sameBlock); //设置中间一块的右侧
                this.setRight(newBlock);


                if (this.line_data.points.length > 1) {
                    // Sort all values by time
                    var sorted_values = this.line_data.points.sort(function(a, b) {
                        return a.time - b.time;
                    });
                    this.line_data.points = sorted_values;
                }
            }
            return this;
        }, //插入新的块到当前块的中间
        insertBlock: function(block, x, y) {
            if (isNullOrUndefine(x)) {
                x = block.blockData.x;
            }
            var rightBlock = this.rightBlock; //获取当前的右侧块
            var addBlockWidth = parseFloat(block.block.attr('width'));
            var x2 = x + addBlockWidth;
            var x3 = this.blockData.pos.x2;
            if (this.blockData.label != block.blockData.label) {
                //修改当前的块
                var width = x - this.blockData.x;
                this.updateWidth(width);
                //新增一块
                var newData = {
                        height: BAR_HEIGHT,
                        time: this.block_xScale.invert(x),
                        value: block.blockData.value,
                        label: block.blockData.label,
                        width: addBlockWidth,
                        x: x
                    }
                    //新建中间一段
                var newBlock = new numericBlock(this.block_Line);
                newBlock.draw(newData).drawText(newData).click_Event(this.callFn).setLeft(this);
                if (this.hasDrag)
                    newBlock.drag_Event(this.dragStartFn, this.dragFn, this.dragEndFn);

                if (this.block_Line != null) {
                    this.block_Line.blocks.push(newBlock);
                    this.line_data.points.push(newData);
                } //添加到数据集合中
                this.setRight(newBlock);

                if (x3 > x2) { //包含在当前块
                    var sameWidth = x3 - x2;
                    //新建相同的一段
                    var data = {
                        height: BAR_HEIGHT,
                        time: this.block_xScale.invert(x2),
                        value: this.blockData.value,
                        label: this.blockData.label,
                        width: sameWidth,
                        x: x2
                    }
                    var sameBlock = new numericBlock(this.block_Line);
                    sameBlock.draw(data).drawText(data).click_Event(this.callFn).setLeft(newBlock).setRight(rightBlock);
                    if (this.hasDrag)
                        sameBlock.drag_Event(this.dragStartFn, this.dragFn, this.dragEndFn);

                    this.line_data.points.push(data); //添加到数据集合中
                    this.block_Line.blocks.push(sameBlock);

                    if (rightBlock != null)
                        rightBlock.setLeft(sameBlock); //设置当前新建块的右侧快的左侧

                    newBlock.setRight(sameBlock); //设置中间一块的右侧
                    sameBlock.dbclick_Event(this.dbclick_callFn);
                } else {
                    newBlock.setRight(rightBlock);
                    if (rightBlock != null)
                        rightBlock.setLeft(newBlock);
                    if (newBlock.blockData.label != rightBlock.blockData.label) {
                        newBlock.changeRight();
                    } else { //合并右侧
                        var rightX2 = rightBlock.blockData.pos.x2;
                        rightBlock.remove();
                        if (x2 > rightX2) { //覆盖了右侧
                            newBlock.changeRight();
                        } else {
                            var marginWidth = rightX2 - x;
                            newBlock.updateWidth(marginWidth);
                        }
                    }

                }

                newBlock.dbclick_Event(this.dbclick_callFn);

                if (this.line_data.points.length > 1) {
                    // Sort all values by time
                    var sorted_values = this.line_data.points.sort(function(a, b) {
                        return a.time - b.time;
                    });
                    this.line_data.points = sorted_values;
                }
            } else { //状态一样，合并
                //修改当前的块
                var width = x2 - this.blockData.x;
                this.updateWidth(width).changeRight();
            }
            return this;
        }, //插入块到当前块
        inBox: function(x, y) {
            if (this.blockData) {
                return x >= this.blockData.pos.x1 &&
                    x <= this.blockData.pos.x2 &&
                    y >= this.blockData.pos.y1 &&
                    y <= this.blockData.pos.y2;
            } else
                return false;
        }, //是否在坐标范围内
        click_Event: function(fn) { //点击事件
            if (typeof fn == 'function') {
                this.callFn = fn;
                var _this = this;
                if (this.block != null) {
                    this.block.on("click", function(d, i, rects) {
                        fn.call(d, i, rects, _this);
                    })
                }
            }
            return this;
        }, //鼠标单击事件
        dbclick_Event: function(fn) { //点击事件
            var _this = this;
            if (this.block != null) {
                this.block.on("dblclick", function(d, i, rects) {
                    if (typeof fn == 'function')
                        fn.call(d, i, rects);
                })
            }
            return this;
        }, //鼠标双击事件，更改状态
        drag_Event: function(dragStartFn, dragFn, dragEndFn) {
            var _this = this;
            this.hasDrag = true;
            this.dragStartFn = dragStartFn;
            this.dragFn = dragFn;
            this.dragEndFn = dragEndFn;

            var oldx = 0;
            var oldy = 0;
            var dragStart = function(d, i, rects) {
                oldx = event.x;
                oldy = event.y;
                if (typeof dragStartFn == 'function') { //回调函数
                    dragStartFn.call(null, _this);
                }
            }
            var drag = function(d, i, rects) {
                var diffValueX = event.x - oldx;
                var diffValueY = event.y - oldy;

                var newX = parseFloat(d3.select(this).attr("x")) + diffValueX;
                var newY = parseFloat(d3.select(this).attr("y")) + diffValueY;

                d3.select(this)
                    .attr("x", newX)
                    .attr("y", newY);
                //修改文字位置
                _this.blockText.update(newX, newY);
                //更新历史值
                oldx = event.x;
                oldy = event.y;
                if (typeof dragFn == 'function') { //回调函数
                    dragFn.call(null, newX, newY);
                }
            }
            var dragEnd = function(d, i, rects) {
                var diffValueX = event.x - oldx;
                var diffValueY = event.y - oldy;
                var newX = parseFloat(d3.select(this).attr("x")) + diffValueX;
                var newY = parseFloat(d3.select(this).attr("y")) + diffValueY;
                if (typeof dragEndFn == 'function') { //回调函数
                    dragEndFn.call(null, newX, newY, _this);
                }
            }
            var blockDrag = d3.drag()
                .filter(function() {
                    return d3.event.button == 2;
                })
                .on("start", dragStart)
                .on("drag", drag)
                .on("end", dragEnd);
            this.block.call(blockDrag);
            return this;
        } //鼠标拖拽事件
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
    // Check whether the obj is null or undfined.
    var isNullOrUndefine = function(obj) {
        return obj === undefined || obj === null;
    }

    // Defines the stateBlock type
    var stateBlock = function(line) {
            this.version = '1.0';
            this.blockType = 'state';
            this.block = null; //当前的块元素
            this.blockText = null; //当前的块的文本原元素

            this.leftBlock = null;
            this.rightBlock = null;

            this.blockData = null; //当前的块的状态

            this.block_Line = line;
            this.block_xScale = line.line_xScale; //x比例尺
            this.line_data = line.line_data; //赋值行的数据

            this.callFn = null; //点击回调
            this.dbclick_callFn = null; //双击回调

            this.hasDrag=false;//是否有拖拽
            this.dragStartFn=null;//拖拽开始回调函数
            this.dragFn=null;//拖拽中回调函数
            this.dragEndFn=null;//拖拽结束回调函数

            if (!isNullOrUndefine(line.stateClass))
                this.stateClass =line.stateClass;
        }
        //链式方法
    stateBlock.prototype = {
        formatClass:function(d) {
            var className = null;
            if (d.value > 0) {
                d.className = this.stateClass.CLASS_OPEN_STATE.class; //dicClass['开'];
            } else if (d.value == 0) {
                d.className = this.stateClass.CLASS_CLOSE_STATE.class; //dicClass['关'];

            } else if (d.value < 0) {
                d.className = this.stateClass.CLASS_FAULT_STATE.class; //dicClass['故障'];
            } else {
                d.className = this.stateClass.CLASS_INDEFINITE_STATE.class; //dicClass['不定'];
            }
            return d.className;
        },
        draw: function(data) { //在绘图区绘制出块
            var _this = this;
            data.blockType = this.blockType; //设置数据类型
            if(this.block_Line&&this.block_Line.g){
                this.block = this.block_Line.g
                .append('rect')
                .datum(data)
                .attr('class', function(d, i) {
                    return _this.formatClass(d);
                })
                .attr('x', function(d, i) {
                    if (d.x == undefined)
                        d.x = _this.block_xScale(d.time);
                    return d.x;
                })
                .attr('y', 0)
                .attr('width', function(d, i) {
                    if(!isNullOrUndefine(d.width)){
                        if (d.width < 0) {
                            d.width = 0;
                        }
                    }
                    else{
                        if (d.width == undefined)
                            d.width = 0;
                        if (d.next) {
                            d.width = _this.block_xScale(d.next.time) - _this.block_xScale(d.time);
                        }
                    }
                    return d.width;
                })
                .attr('height', function(d, i) {
                    d.height = BAR_HEIGHT;
                    return BAR_HEIGHT;
                });
                this.blockData = data;
                var pos = {};
                pos.x1 = data.x;
                pos.y1 = 0;
                pos.x2 = data.x + data.width;
                pos.y2 = 0 + BAR_HEIGHT;
                this.blockData.pos = pos;

                if (data.value == undefined) { //不定状态加弹框
                    this.block.attr('data-toggle', 'popover')
                        //.attr('data-content', '<button id="openBtn" class="popoverBtn green" >开</button><button id="closeBtn" class="popoverBtn red" >关</button>')
                }
            }
            
            return this;
        }, //绘制块
        drawText: function() {
            this.blockText = new pumpText(this.block_Line, this.block_xScale);
            this.blockText.draw(this.blockData);
            return this;
        }, //块对应的文本提示
        update: function(x, y, width, fn) {
            if (!isNullOrUndefine(x)) {
                this.block.attr('x', function(d) {
                    d.x = x;
                    d.pos.x1 =d.x;
                    return d.x;
                });

            }
            if (!isNullOrUndefine(y)) {
                this.block.attr('y', function(d) {
                    d.y = y;
                    return d.y;
                });
            }
            if (!isNullOrUndefine(width)) {
                this.block.attr('width', function(d) {
                    d.width = width;
                    d.pos.x2 =d.x + d.width;
                    return d.width;
                });
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
                this.block.attr('width', function(d) {
                    d.width = width;
                    d.pos.x2 = d.x + d.width;
                    return d.width;
                });
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
                this.block.attr('width',function(d) {
                    d.width = rectWidth;
                    d.pos.x2 = d.x + d.width;
                    return d.width;
                });
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
                if (_this.leftBlock&&_this.leftBlock.block) { //判断左边是否有邻近块
                    var x1 = parseFloat(_this.leftBlock.block.attr('x'));
                    var width = x2 - x1;
                    if (width <= 0) { //左边块被覆盖
                        _this.leftBlock.remove(); //删除前一个
                        _this.changeLeft(); //修改新的前一块
                    } else {
                        _this.leftBlock.update(null, null, width);
                    }
                } else { //如果没有就创建  不定状态
                    if (_this.blockData.className != _this.stateClass.CLASS_INDEFINITE_STATE.class) {
                        var data = {
                            height: BAR_HEIGHT,
                            time: _this.block_xScale.invert(0),
                            value: null,
                            label: '不定',
                            width: x2
                        };
                        var leftBlock = new stateBlock(_this.block_Line);
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
            if (_this.rightBlock&&_this.rightBlock.block) {
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
                }
                if (_this.rightBlock&&_this.rightBlock.block&&this.blockData.label.trim() == this.rightBlock.blockData.label.trim()) { //状态一致，合并
                    var addWidth = parseFloat(this.rightBlock.block.attr('width')); //计算增加的宽度
                    this.addWidth(addWidth); //合并到当前块
                    this.rightBlock.remove(); //移除右侧
                }
            } else {
                // //获取当前选中的块
                // var curRect = $(rects[i]);
                // //获取当前那一行
                // var g = curRect.parent()[0];//获取父级
                // var parentWidth= curRect.parent().width();//获取父级总宽
                var MaxX = this.block_Line.lineWidth;
                if(x1<MaxX){
                    //如果没有就创建  不定状态
                    var data = {
                        height: BAR_HEIGHT,
                        time: _this.block_xScale.invert(x1),
                        value: null,
                        label: _this.stateClass.CLASS_INDEFINITE_STATE.text,
                        width: MaxX-x1
                    };
                    var rightBlock = new stateBlock(_this.block_Line);
                    rightBlock.draw(data).drawText(data).click_Event(_this.callFn).setLeft(_this);
                    _this.rightBlock = rightBlock;
                }
            }
            return this;
        }, //修改右边的块
        updateState: function(data) {
            var _this=this;
            this.block.attr('class', function(d, i) {
                return _this.formatClass(d);
            })

            //判断两边状态十分合并
            if (this.rightBlock != null) {
                if (this.blockData.label.trim() == this.rightBlock.blockData.label.trim()) { //状态一致，合并
                    var addWidth = parseFloat(this.rightBlock.block.attr('width')); //计算增加的宽度
                    this.addWidth(addWidth); //合并到当前块
                    this.rightBlock.remove(); //移除右侧
                }
            }
            if (this.leftBlock != null) {
                if (this.blockData.label.trim() == this.leftBlock.blockData.label.trim()) { //状态一致，合并
                    var addWidth = parseFloat(this.block.attr('width')); //计算增加的宽度
                    this.leftBlock.addWidth(addWidth); //合并到前一块
                    this.remove(); //移除当前
                }
            }
            if (this.blockText) {
                this.blockText.updateText(data);
            }
            return this;
        }, //修改当前快的状态
        remove: function() {
            if (this.line_data != null) {
                _.remove(this.line_data.points, this.blockData);
            } //从数据集合删除
             _.remove(this.block_Line.points, this);
             if(this.block!=null){
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
                    if (this.leftBlock.blockData.label.trim() == this.rightBlock.blockData.label.trim()) {
                        var x1 = parseFloat(this.leftBlock.block.attr('x')); //获取开始坐标
                        var x2 = parseFloat(this.leftBlock.block.attr('width')) + x1; //左边的结束坐标
                        var curx2 = parseFloat(this.rightBlock.block.attr('x')) + parseFloat(this.rightBlock.block.attr('width')); //计算结束坐标
                        if (x2 < curx2) { //判断是否修改左侧宽度
                            var width = curx2 - x1; //计算宽度
                            this.leftBlock.update(x1, null, width); //合并到前一块
                        }
                        this.rightBlock.remove(); //删除后一条
                    }
                }
                //删除对应text的位置
                if (this.blockText != null)
                    this.blockText.remove();
             }
            
            return this;
        }, //删除当前块，并合并相同状态的邻近块
        restorePos: function() {
            var _this = this;
            this.block
                .attr('x', function(d) {
                    d.x = _this.blockData.x;
                    return d.x;
                })
                .attr('y', 0);

            //修改对应text的位置
            if (this.blockText != null)
                this.blockText.update(this.blockData.x, 0);
            return this;
        }, //还原坐标
        insertCentre: function() {
            if (this.blockData.className != this.stateClass.CLASS_FAULT_STATE.class) { //故障不能新增
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
                    label: this.stateClass.CLASS_OPEN_STATE.text,
                    width: averageWidth,
                    x: x2
                }
                if (this.blockData.className == this.stateClass.CLASS_OPEN_STATE.class) { //如果当前是开的就新建关
                    newData.label = this.stateClass.CLASS_CLOSE_STATE.text;
                    newData.value = 0;
                }
                //新建中间一段
                var newBlock = new stateBlock(this.block_Line);
                newBlock.draw(newData).drawText(newData).click_Event(this.callFn).setLeft(this);
                if(this.hasDrag)
                    newBlock.drag_Event(this.dragStartFn,this.dragFn,this.dragEndFn);
                if (this.block_Line != null) {
                    this.block_Line.blocks.push(newBlock);
                    this.line_data.points.push(newData);
                } //添加到数据集合中

                //新建相同的一段
                var data = {
                    height: BAR_HEIGHT,
                    time: this.block_xScale.invert(x3),
                    value: this.blockData.value,
                    label: this.blockData.label,
                    width: averageWidth,
                    x: x3
                }
                var sameBlock = new stateBlock(this.block_Line);
                sameBlock.draw(data).drawText(data).click_Event(this.callFn).setLeft(newBlock).setRight(rightBlock);
                if(this.hasDrag)
                    sameBlock.drag_Event(this.dragStartFn,this.dragFn,this.dragEndFn);
                this.block_Line.blocks.push(sameBlock);
                this.line_data.points.push(data); //添加到数据集合中

                if (rightBlock != null)
                    rightBlock.setLeft(sameBlock); //设置当前新建块的右侧快的左侧

                newBlock.setRight(sameBlock); //设置中间一块的右侧
                this.setRight(newBlock);

                newBlock.dbclick_Event(this.dbclick_callFn);
                sameBlock.dbclick_Event(this.dbclick_callFn);

                if (this.line_data.points.length > 1) {
                    // Sort all values by time
                    var sorted_values = this.line_data.points.sort(function(a, b) {
                        return a.time - b.time;
                    });
                    this.line_data.points = sorted_values;
                }
            }
            return this;
        }, //插入新的块到当前块的中间
        insertBlock: function(block,x,y) {
            if(isNullOrUndefine(x)){
                x=block.blockData.x;
            }
            var rightBlock = this.rightBlock; //获取当前的右侧块
            var addBlockWidth=parseFloat(block.block.attr('width'));
            var x2=x+addBlockWidth;
            var x3=this.blockData.pos.x2;
            if (this.blockData.label != block.blockData.label) { 
                //修改当前的块
                var width=x-this.blockData.x;
                this.updateWidth(width);
                //新增一块
                var newData={
                    height: BAR_HEIGHT,
                    time: this.block_xScale.invert(x),
                    value: block.blockData.value,
                    label: block.blockData.label,
                    width: addBlockWidth,
                    x: x
                }
                //新建中间一段
                var newBlock = new stateBlock(this.block_Line);
                newBlock.draw(newData).drawText(newData).click_Event(this.callFn).setLeft(this);
                if(this.hasDrag)
                    newBlock.drag_Event(this.dragStartFn,this.dragFn,this.dragEndFn);
                if (this.block_Line != null) {
                    this.block_Line.blocks.push(newBlock);
                    this.line_data.points.push(newData);
                } //添加到数据集合中
                this.setRight(newBlock);

                if(x3>x2){//包含在当前块
                    var sameWidth=x3-x2;
                    //新建相同的一段
                    var data = {
                        height: BAR_HEIGHT,
                        time: this.block_xScale.invert(x2),
                        value: this.blockData.value,
                        label: this.blockData.label,
                        width: sameWidth,
                        x: x2
                    }
                    var sameBlock = new stateBlock(this.block_Line);
                    sameBlock.draw(data, this.line_data).drawText(data).click_Event(this.callFn).setLeft(newBlock).setRight(rightBlock);
                    this.block_Line.blocks.push(sameBlock);
                    this.line_data.points.push(data); //添加到数据集合中
                    if(this.hasDrag)
                        sameBlock.drag_Event(this.dragStartFn,this.dragFn,this.dragEndFn);

                    if (rightBlock != null)
                        rightBlock.setLeft(sameBlock); //设置当前新建块的右侧快的左侧

                    newBlock.setRight(sameBlock); //设置中间一块的右侧
                    sameBlock.dbclick_Event(this.dbclick_callFn);
                }
                else{
                    newBlock.setRight(rightBlock);
                    if (rightBlock != null)
                        rightBlock.setLeft(newBlock);
                    if(newBlock.blockData.label != rightBlock.blockData.label){
                        newBlock.changeRight();
                    }
                    else{//合并右侧
                        var rightX2=rightBlock.blockData.pos.x2;
                        rightBlock.remove();
                        if(x2>rightX2){//覆盖了右侧,移除右侧并修改新的右侧块
                            newBlock.changeRight();
                        }
                        else{//合并右侧
                           var marginWidth= rightX2-x;
                           newBlock.updateWidth(marginWidth);
                        }
                    }
                    
                }
                
                newBlock.dbclick_Event(this.dbclick_callFn);

                if (this.line_data.points.length > 1) {
                    // Sort all values by time
                    var sorted_values = this.line_data.points.sort(function(a, b) {
                        return a.time - b.time;
                    });
                    this.line_data.points = sorted_values;
                }
            }
            else{//状态一样，合并
                //修改当前的块
                var width=x2-this.blockData.x;
                this.updateWidth(width).changeRight();
            }
            return this;
        }, //插入块到当前块
        inBox: function(x, y) {
            if (this.blockData) {
                return x >= this.blockData.pos.x1 &&
                    x <= this.blockData.pos.x2 &&
                    y >= this.blockData.pos.y1 &&
                    y <= this.blockData.pos.y2;
            } else
                return false;
        }, //是否在坐标范围内
        click_Event: function(fn) { //点击事件
            if (typeof fn == 'function') {
                this.callFn = fn;
                var _this = this;
                if (this.block != null) {
                    this.block.on("click", function(d, i, rects) {
                        fn.call(d, i, rects, _this);
                    })
                }
            }
            return this;
        }, //鼠标单击事件
        dbclick_Event: function(fn) { //点击事件
            var _this = this;
            _this.dbclick_callFn = fn;
            if (this.block != null) {
                this.block.on("dblclick", function(d, i, rects) {
                    if (d.value == 0) { //关--->开
                        d.value = 1;
                        d.label = _this.stateClass.CLASS_OPEN_STATE.text;
                    } else if (d.value == 1) { //开--->关
                        d.value = 0;
                        d.label = _this.stateClass.CLASS_CLOSE_STATE.text;
                    } else if (isNullOrUndefine(d.value)) { //不定--->开
                        d.value = 1;
                        d.label = _this.stateClass.CLASS_OPEN_STATE.text;
                    }
                    _this.updateState(d); //修改当前状态

                    if (typeof fn == 'function') { //回调函数
                        fn.call(d, i, rects);
                    }
                })
            }
            return this;
        }, //鼠标双击事件，更改状态
        drag_Event: function(dragStartFn,dragFn, dragEndFn) {
            var _this = this;
            this.hasDrag=true;
            this.dragStartFn=dragStartFn;
            this.dragFn=dragFn;
            this.dragEndFn=dragEndFn;

            var oldx=0;
            var oldy=0;
            var dragStart=function(d, i, rects) {
                    oldx=event.x;
                    oldy=event.y;
                    if (typeof dragStartFn == 'function') { //回调函数
                        dragStartFn.call(null, _this);
                    }
            }
            var drag=function(d, i, rects) {
                    var diffValueX = event.x-oldx;
                    var diffValueY = event.y-oldy;

                    var newX =parseFloat(d3.select(this).attr("x"))+diffValueX;
                    var newY =parseFloat(d3.select(this).attr("y"))+diffValueY;

                    d3.select(this)
                        .attr("x", newX)
                        .attr("y", newY);
                    //修改文字位置
                    _this.blockText.update(newX, newY);
                    //更新历史值
                    oldx=event.x;
                    oldy=event.y;
                    if (typeof dragFn == 'function') { //回调函数
                        dragFn.call(null, newX, newY);
                    }
            }
            var dragEnd=function(d, i, rects) {
                    var diffValueX = event.x-oldx;
                    var diffValueY = event.y-oldy;
                    var newX =parseFloat(d3.select(this).attr("x"))+diffValueX;
                    var newY =parseFloat(d3.select(this).attr("y"))+diffValueY;
                    if (typeof dragEndFn == 'function') { //回调函数
                        dragEndFn.call(null, newX, newY, _this);
                    }
            }
            var blockDrag = d3.drag()
                .filter(function(){
                    return d3.event.button == 2;
                })
                .on("start",dragStart)
                .on("drag", drag)
                .on("end", dragEnd);
            this.block.call(blockDrag);
            return this;
        } //鼠标拖拽事件
        // drag_Event: function(dragStartFn,dragFn, dragEndFn) {
        //     var _this = this;
        //     this.hasDrag=true;
        //     this.dragStartFn=dragStartFn;
        //     this.dragFn=dragFn;
        //     this.dragEndFn=dragEndFn;

        //     var isDraging=false;
        //     var oldx=0;
        //     var oldy=0;
        //     this.block.on("mousedown", function(d, i, rects) {
        //         var event=d3.event;
        //         if(event.button==2){//如果是右键
        //             // window.captureEvents(event.type);
        //             isDraging=true;
        //             oldx=event.x;
        //             oldy=event.y;
        //             if (typeof dragStartFn == 'function') { //回调函数
        //                 dragStartFn.call(null, _this);
        //             }
        //         }
        //     })
        //     this.block.on("mousemove", function(d, i, rects) {
        //         var event=d3.event;
        //          if(event.button==2&&isDraging){//如果是右键
        //             var diffValueX = event.x-oldx;
        //             var diffValueY = event.y-oldy;

        //             var newX =parseFloat(d3.select(this).attr("x"))+diffValueX;
        //             var newY =parseFloat(d3.select(this).attr("y"))+diffValueY;

        //             d3.select(this)
        //                 .attr("x", newX)
        //                 .attr("y", newY);
        //             //修改文字位置
        //             _this.blockText.update(newX, newY);
        //             //更新历史值
        //             oldx=event.x;
        //             oldy=event.y;
        //             if (typeof dragFn == 'function') { //回调函数
        //                 dragFn.call(null, newX, newY);
        //             }
        //          }
        //     })
        //     this.block.on("mouseup", function(d, i, rects) {
        //         var event=d3.event;
        //          if(event.button==2&&isDraging){//如果是右键
        //             var diffValueX = event.x-oldx;
        //             var diffValueY = event.y-oldy;
        //             var newX =parseFloat(d3.select(this).attr("x"))+diffValueX;
        //             var newY =parseFloat(d3.select(this).attr("y"))+diffValueY;
        //             if (typeof dragEndFn == 'function') { //回调函数
        //                 dragEndFn.call(null, newX, newY, _this);
        //             }
        //             isDraging=false;
        //          }
        //     })
        //     return this;
        // } //鼠标拖拽事件
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

    //计算渐变色系
    function getColorGradient(ColorGrade) {
        var colorLength=COLOR_STEP+1;//间隔加一是颜色的数量
        var code = DEFAULT_COLOR;
        //当前颜色/255，计算基数
        var curR = parseFloat(code[0] / 255).toFixed(2);
        var curG = parseFloat(code[1] / 255).toFixed(2);
        var curB = parseFloat(code[2] / 255).toFixed(2);
        //计算每步需要加的数字 ——（1-基数）/步长
        var stepR = parseFloat((1 - curR) / (colorLength + 1)).toFixed(2);
        var stepG = parseFloat((1 - curG) / (colorLength + 1)).toFixed(2);
        var stepB = parseFloat((1 - curB) / (colorLength + 1)).toFixed(2);
        //渐变填充色
        for (var i = 1; i <= colorLength; i++) {
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

        this.pos={};

        this.line_svg=svg;
        this.line_option=option;
        this.line_xScale=xScale;
        this.line_yScale=yScale;
        this.line_describe=describe;
        this.stateClass=null;
        this.line_data=null;

        this.valueGrade=[];//值域
        this.ColorGrade=[];
    }

    //The chain method
    pumpLine.prototype = {
        drawLine:function(line,stateClass){
            var _this=this;
            this.line_data=line;
            this.stateClass=stateClass;
            //计算top
            var top = this.line_yScale(line.name) + this.line_option.padding.top + ((BAR_HEIGHT - 2) / 2) -
                    this.line_describe.barCount * 0.2;
            this.g = this.line_svg.append('g')
                .attr('transform', 'translate(' + this.line_option.padding.left + ',' + top + ')');
            var pos={};
            pos.x1=this.line_option.padding.left;
            pos.y1=top;
            pos.x2=pos.x1+this.lineWidth;
            pos.y2=top+BAR_HEIGHT;
            this.line_data.pos=pos;

            if(line.points.length>0){
                var minValue=null;
                var maxValue=null;
                var type=stateBlock;
                if(line.type=='CSP')//定速泵
                    type=stateBlock;
                else if(line.type=='RSP')//定速泵
                    type=numericBlock;
                else{//流量/压力
                    type=gradientBlock;
                    getColorGradient(this.ColorGrade);
                    // var maxPoint=_.maxBy(line.points, function(o) { return o.value; });//获取最大值
                    // _this.getValueGrade(maxPoint.value);
                    if(line.hasOwnProperty('minValue'))
                        minValue=line.minValue;
                    if(line.hasOwnProperty('maxValue'))
                        maxValue=line.maxValue;
                    _this.getValueGrade(minValue,maxValue);
                }

                //循环数据并绘制块
                _.each(line.points,function(data){
                    var block=null;
                    block=new type(_this);
                    block.draw(data).drawText();//绘制快
                    //设置最大最小限制
                    if(minValue!=null)
                        block.setMinValue(minValue);
                    if(maxValue!=null)
                        block.setMaxValue(maxValue);
                    //设置邻近块
                    var left=null;
                    var length=_this.blocks.length;
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
        getValueGrade:function(minValue,maxValue) {
            var values=[];
            var valueStep=(maxValue-minValue)/(COLOR_STEP-1);
            //渐变填充色
            for (var i = 0; i < COLOR_STEP; i++) {
                values.push(minValue+i*valueStep);
            }
            this.valueGrade=values;
        },
        getColorByValue:function(value) {
            var _this=this;
            //渐变填充色
            for (var i = 0; i < _this.valueGrade.length; i++) {
                var rgbColor=null;
                if(i==0){
                    if(value<=_this.valueGrade[i])
                        rgbColor=_this.ColorGrade[i];
                    else if(value>_this.valueGrade[i]&&value<=_this.valueGrade[i+1])
                        rgbColor=_this.ColorGrade[i+1];
                }
                else if(i>0&&i<_this.valueGrade.length-1){
                    if(value>_this.valueGrade[i]&&value<=_this.valueGrade[i+1])
                        rgbColor=_this.ColorGrade[i+1];
                }
                else if(i==_this.valueGrade.length-1){
                    if(value>_this.valueGrade[i])
                        rgbColor=_this.ColorGrade[i+1];
                }
                if(rgbColor!=null)
                    return changeColor(_.clone(rgbColor));
            }
        },//获取对应颜色
        remove:function(){
            this.g.remove();
            return this;
        },
        insert:function(block){
            var type=stateBlock;
            if(block){
                if(block.blockType=='state')//定速泵
                    type=stateBlock;
                else if(block.blockType=='numeric')//定速泵
                    type=numericBlock;
                else//流量/压力
                    type=gradientBlock;
                var newBlock=null;
                newBlock=new type(this);
                newBlock.draw(block.blockData).drawText();//绘制快

                this.blocks.push(newBlock);
               // _.sortBy(this.blocks, [function(b) { return b.blockData.time; }]);
            }
            return this;
        },
        checkBlock_Event:function(fn){
            if(typeof fn==='function'){
                _.each(this.blocks,function(block){
                    block.click_Event(fn);
                })     
            }
            return this;
        },//选中事件
        dbclick_Event:function(fn){
            if(typeof fn==='function'){
                _.each(this.blocks,function(block){
                    block.dbclick_Event(fn);
                })     
            }
            return this;
        },//双击事件
        drag_Event:function(dragStartFn,dragFn,dragEndFn){
            // var line={
            //     'name':'temporary',
            //     'points':[],
            //     'type':this.line_data.type,
            // }
            // if(this.line_data.hasOwnProperty('minValue'))
            //     line.minValue=this.line_data.minValue;
            // if(this.line_data.hasOwnProperty('maxValue'))
            //     line.maxValue=this.line_data.maxValue;;
            // var tempLine = new pumpLine(this.line_svg, this.line_xScale, this.line_yScale, this.line_option, this.line_describe);
            // tempLine.drawLine(line, this.stateClass);
            _.each(this.blocks,function(block){
                block.drag_Event(dragStartFn,dragFn,dragEndFn);
            }) 
            return this;
        },//拖拽事件
        inBox:function(x,y){
            if(this.line_data){
                return x >=this.line_data.pos.x1 &&
                        x <= this.line_data.pos.x2 &&
                        y >= this.line_data.pos.y1 &&
                        y <= this.line_data.pos.y2;
            }
            else
                return false;
        }//是否在坐标范围内
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