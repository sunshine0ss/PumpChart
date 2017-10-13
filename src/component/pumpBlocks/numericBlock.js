define(['d3', 'jQuery', 'moment', 'lodash', 'pumpText'], function(d3, jquery, moment, lodash, pumpText) {

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

            this.click_callFn = null; //点击回调
            this.rightclick_callFn = null; //点击回调
            this.dbclick_callFn = null; //双击回调

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
            if (isNullOrUndefine(data.unitText))
                data.unitText = '';
            data.blockType = this.blockType; //设置当前类型
            if (!data.maxValue)
                data.maxValue = MAX_VALUE; //设置默认最大值
            if (!data.minValue)
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
            if (this.block != null) { //判断是否被删除 
                var _this = this;
                if (!isNullOrUndefine(x)) {
                    this.block.attr('x', function(d) {
                        d.x = x;
                        d.pos.x1 = d.x;
                        d.time = _this.block_xScale.invert(d.x);
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
                    if (width > this.block_Line.lineWidth) //长度不能超出行容器
                        width = this.block_Line.lineWidth;
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
            }
            return this;
        }, //修改坐标和宽度
        updateWidth: function(width, fn) {
            if (this.block != null) { //判断是否被删除 
                if (width > this.block_Line.lineWidth) //长度不能超出行容器
                    width = this.block_Line.lineWidth;
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
            }
            return this;
        }, //修改宽度
        addWidth: function(width, fn) {
            if (this.block != null) { //判断是否被删除 
                if (!isNullOrUndefine(width)) {
                    var oldwidth = parseFloat(this.block.attr('width'));
                    var rectWidth = oldwidth + width;
                    if (rectWidth > this.block_Line.lineWidth) //长度不能超出行容器
                        rectWidth = this.block_Line.lineWidth;
                    this.block.attr('width', function(d) {
                        d.width = rectWidth;
                        d.pos.x2 = d.x + d.width;
                        return d.width;
                    });
                }
                //回调函数
                if (typeof fn === 'function')
                    fn.call(x, y);
            }
            return this;
        }, //修改宽度
        setLeft: function(left) {
            if (this.block != null) { //判断是否被删除 
                if (!isNullOrUndefine(left)) {
                    this.leftBlock = left;
                    if (left)
                        this.blockData.prev = left.blockData;
                }
            }
            return this;
        }, //设置左边邻近块
        setRight: function(right) {
            if (this.block != null) { //判断是否被删除 
                if (!isNullOrUndefine(right)) {
                    this.rightBlock = right;
                    if (right)
                        this.blockData.next = right.blockData;
                }
            }
            return this;
        }, //设置右边邻近块
        setMinValue: function(min) {
            if (this.block != null) { //判断是否被删除 
                if (!isNullOrUndefine(min))
                    this.blockData.minValue = min;
            }
            return this;
        }, //设置下限
        setMaxValue: function(max) {
            if (this.block != null) { //判断是否被删除 
                if (!isNullOrUndefine(max))
                    this.blockData.maxValue = max;
            }
            return this;
        }, //设置上限
        changeLeft: function() {
            if (this.block != null) { //判断是否被删除 
                var _this = this;
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
                        leftBlock.draw(data).drawText(data).setRight(_this);

                        //绑定事件
                        if (this.click_callFn)
                            leftBlock.click_Event(this.click_callFn);
                        if (this.rightclick_callFn)
                            leftBlock.rightClick_Event(this.rightclick_callFn);
                        if (this.dbclick_callFn)
                            leftBlock.dbclick_Event(this.dbclick_callFn);
                        if (this.hasDrag)
                            leftBlock.drag_Event(this.dragStartFn, this.dragFn, this.dragEndFn);
                        if (this.block_Line != null) {
                            this.block_Line.blocks.push(leftBlock);
                            this.line_data.points.push(data);
                        } //添加到数据集合中
                        _this.leftBlock = leftBlock;
                    }
                }
            }
            return this;
        }, //修改左边的块
        changeRight: function() {
            if (this.block != null) { //判断是否被删除 
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

                    if (this.rightBlock && this.rightBlock.block && this.blockData.label.trim() == this.rightBlock.blockData.label.trim()) { //状态一致，合并
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
                            width: MaxX - x1
                        };
                        var rightBlock = new numericBlock(_this.block_Line);
                        rightBlock.draw(data).drawText(data).setLeft(_this);

                        //绑定事件
                        if (this.click_callFn)
                            rightBlock.click_Event(this.click_callFn);
                        if (this.rightclick_callFn)
                            rightBlock.rightClick_Event(this.rightclick_callFn);
                        if (this.dbclick_callFn)
                            rightBlock.dbclick_Event(this.dbclick_callFn);
                        if (this.hasDrag)
                            rightBlock.drag_Event(this.dragStartFn, this.dragFn, this.dragEndFn);
                        if (this.block_Line != null) {
                            this.block_Line.blocks.push(rightBlock);
                            this.line_data.points.push(data);
                        } //添加到数据集合中
                        _this.rightBlock = rightBlock;
                    }
                }
            }
            return this;
        }, //修改右边的块
        updateState: function(data) {
            if (this.block != null) { //判断是否被删除 
                var _this = this;
                if (data.value < data.minValue) //最小限制
                    data.value = data.minValue;
                if (data.value > data.maxValue) //最大限制
                    data.value = data.maxValue;
                data.label = data.value.toString();
                this.block.attr('class', function(d, i) {
                    return _this.formatClass(d);
                })
                this.blockData = data;

                //判断两边状态十分合并
                if (this.rightBlock != null&&this.rightBlock.blockData!=null) {
                    if (this.blockData.label.trim() == this.rightBlock.blockData.label.trim()) { //状态一致，合并
                        var addWidth = parseFloat(this.rightBlock.block.attr('width')); //计算增加的宽度
                        this.addWidth(addWidth); //合并到当前块
                        this.rightBlock.remove(); //移除右侧
                    }
                }
                if (this.leftBlock != null&&this.leftBlock.blockData!=null) {
                    if (this.blockData.label.trim() == this.leftBlock.blockData.label.trim()) { //状态一致，合并
                        var addWidth = parseFloat(this.block.attr('width')); //计算增加的宽度
                        this.leftBlock.addWidth(addWidth); //合并到前一块 
                        this.remove(); //移除当前
                    }
                }

                if (this.blockText) {
                    this.blockText.updateText(data);
                }
            }
            return this;
        }, //修改当前快的状态
        remove: function() {
            if (this.line_data != null) {
                _.remove(this.line_data.points, this.blockData);
            } //从数据集合删除
            _.remove(this.block_Line.blocks, this);
            if (this.block != null) {
                this.block.remove(); //移除当前块
                this.block = null;
                this.blockData = null;
                //修改前后块的邻近块
                if (this.leftBlock != null)
                    this.leftBlock.setRight(this.rightBlock);
                if (this.rightBlock != null)
                    this.rightBlock.setLeft(this.leftBlock);
                if (this.rightBlock && this.leftBlock) {
                    //判断是否同一状态，是:合并
                    if (this.leftBlock.blockData != null && this.rightBlock.blockData != null && this.leftBlock.blockData.label == this.rightBlock.blockData.label) {
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
            if (this.block != null) { //判断是否被删除 
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
            }
            return this;
        }, //还原坐标
        insertCentre: function() {
            if (this.blockData != null && this.blockData.className != this.stateClass.CLASS_FAULT_STATE.class) { //故障不能新增
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
                newBlock.draw(newData).drawText(newData).setLeft(this);
                //绑定事件
                if (this.click_callFn)
                    newBlock.click_Event(this.click_callFn);
                if (this.rightclick_callFn)
                    newBlock.rightClick_Event(this.rightclick_callFn);
                if (this.dbclick_callFn)
                    newBlock.dbclick_Event(this.dbclick_callFn);
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
            if (this.block != null&&block.block!=null) { //判断是否被删除 
                if (isNullOrUndefine(x)) {
                    x = block.blockData.x;
                }
                var rightBlock = this.rightBlock; //获取当前的右侧块
                var addBlockWidth = parseFloat(block.block.attr('width'));
                var x2 = x + addBlockWidth;
                if(x2>=this.block_Line.lineWidth){//如果超出容器，重新算宽度
                    addBlockWidth=addBlockWidth-(x2-this.block_Line.lineWidth);
                    x2=this.block_Line.lineWidth;
                }
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
                    newBlock.draw(newData).drawText(newData).setLeft(this);
                    //绑定事件
                    if (this.click_callFn)
                        newBlock.click_Event(this.click_callFn);
                    if (this.rightclick_callFn)
                        newBlock.rightClick_Event(this.rightclick_callFn);
                    if (this.dbclick_callFn)
                        newBlock.dbclick_Event(this.dbclick_callFn);
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
                        sameBlock.draw(data).drawText(data).setLeft(newBlock).setRight(rightBlock);
                        //绑定事件
                        if (this.click_callFn)
                            sameBlock.click_Event(this.click_callFn);
                        if (this.rightclick_callFn)
                            sameBlock.rightClick_Event(this.rightclick_callFn);
                        if (this.dbclick_callFn)
                            sameBlock.dbclick_Event(this.dbclick_callFn);
                        if (this.hasDrag)
                            sameBlock.drag_Event(this.dragStartFn, this.dragFn, this.dragEndFn);

                        this.line_data.points.push(data); //添加到数据集合中
                        this.block_Line.blocks.push(sameBlock);

                        if (rightBlock != null)
                            rightBlock.setLeft(sameBlock); //设置当前新建块的右侧快的左侧

                        newBlock.setRight(sameBlock); //设置中间一块的右侧
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

                    if (this.line_data.points.length > 1) {
                        // Sort all values by time
                        var sorted_values = this.line_data.points.sort(function(a, b) {
                            return a.time - b.time;
                        });
                        this.line_data.points = sorted_values;
                    }
                } else { //状态一样，合并
                    if(x2>x3){//x2<x3 拖动块包含在当前块里面，不做修改
                        //修改当前的块
                        var width = x2 - this.blockData.x;
                        this.updateWidth(width).changeRight();
                    }
                }
            }
            return this;
        }, //插入块到当前块
        inBox: function(x, y) {
            if (this.blockData!= null) {
                return x >= this.blockData.pos.x1 &&
                    x <= this.blockData.pos.x2 &&
                    y >= this.blockData.pos.y1 &&
                    y <= this.blockData.pos.y2;
            } else
                return false;
        }, //是否在坐标范围内
        click_Event: function(fn) { //点击事件
            if (typeof fn == 'function') {
                this.click_callFn = fn;
                var _this = this;
                if (this.block != null) {
                    this.block.on("click", function(d, i, rects) {
                        fn.call(d, i, rects, _this);
                    })
                }
            }
            return this;
        }, //鼠标单击事件
        rightClick_Event: function(fn) {
            if (typeof fn == 'function') {
                this.rightclick_callFn = fn;
                var _this = this;
                if (this.block != null) {
                    this.block.on("mousedown", function(d, i, rects) {
                        if (d3.event.button == 2)
                            fn.call(d, i, rects, _this);
                    })
                }
            }
            return this;
        }, //鼠标右键单击事件
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
                    if(_this.block)
                        _this.block.raise();//层叠置顶
                    if(_this.blockText&&_this.blockText.pumpText)
                        _this.blockText.pumpText.raise();
                    if(_this.block_Line&&_this.block_Line.g)
                        _this.block_Line.g.raise();
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
                    .filter(function(d, i, rects) {
                        return d3.event.button == 2 && d.label != _this.stateClass.CLASS_INDEFINITE_STATE.text;
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
});