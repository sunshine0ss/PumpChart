define(['d3', 'jQuery', 'moment', 'lodash', 'pumpText'], function(d3, jquery, moment, lodash, pumpText) {

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

            this.callFn = null;//点击回调
            this.dbclick_callFn=null;//双击回调
        }
        //链式方法
    stateBlock.prototype = {
        draw: function(data) { //在绘图区绘制出块
            data.blockType=this.blockType;
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
                    //.attr('data-content', '<button id="openBtn" class="popoverBtn green" >开</button><button id="closeBtn" class="popoverBtn red" >关</button>')
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
            _this.dbclick_callFn = fn;
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
               
                if (typeof fn == 'function'){ //回调函数
                    fn.call(d, i, rects);
                }
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

                    newBlock.dbclick_Event(this.dbclick_callFn);
                    sameBlock.dbclick_Event(this.dbclick_callFn);
                    
                }
                return this;
            } //插入新的块到当前块的中间
    }

    //// Exports stateBlock Component ////
    return stateBlock;
});