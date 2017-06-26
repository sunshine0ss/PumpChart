define(['d3', 'jQuery', 'moment', 'lodash','pumpText'], function(d3, jquery, moment,lodash,pumpText) {

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
            }
            else{
                var MaxX=this.block_Line.lineWidth;
                //如果没有就创建  不定状态
                var data = {
                    height: BAR_HEIGHT,
                    time:_this.block_xScale.invert(x1),
                    value: null,
                    label: this.stateClass.CLASS_INDEFINITE_STATE.text,
                    width:MaxX
                };
                var rightBlock=new gradientBlock(_this.block_Line);
                rightBlock.draw(data).drawText(data).click_Event(_this.callFn).setLeft(_this);
                _this.rightBlock=rightBlock;
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
                    if (this.line_data != null) {
                        _.remove(this.line_data.points, this.blockData);
                    } //从数据集合删除
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
                if(this.line_data!=null){
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
                rightBlock.setLeft(sameBlock);//设置当前新建块的右侧快的左侧
                this.line_data.points.push(data);//添加到数据集合中

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
                var newBlock = new gradientBlock(this.block_Line);
                newBlock.draw(newData).drawText(newData).click_Event(this.callFn).setLeft(this);

                if (this.line_data != null) {
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
                    var sameBlock = new gradientBlock(this.block_Line);
                    sameBlock.draw(data).drawText(data).click_Event(this.callFn).setLeft(newBlock).setRight(rightBlock);
                    this.line_data.points.push(data); //添加到数据集合中

                    if (rightBlock != null)
                        rightBlock.setLeft(sameBlock); //设置当前新建块的右侧快的左侧

                    newBlock.setRight(sameBlock); //设置中间一块的右侧
                    sameBlock.dbclick_Event(this.dbclick_callFn);
                } else {
                    newBlock.setRight(rightBlock)
                    if (newBlock.blockData.label != rightBlock.blockData.label) {
                        newBlock.changeRight();
                    } else { //合并右侧
                        var rightX2 = rightBlock.blockData.pos.x2;
                        if (x2 > rightX2) { //覆盖了右侧
                            rightBlock.remove();
                        } else {
                            var newRightWidth = rightX2 - x2;
                            rightBlock.update(x2, 0, newRightWidth);
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
        drag_Event: function(dragFn, dragEndFn) {
                var _this = this;
                //定义拖拽结束行为
                function dragStart(d, e, i, event) {
                    timeout = setTimeout(function() {
                        return true;
                    }, 2000);
                }
                //定义拖拽行为
                function dragmove(d) {
                    var newX = d3.event.x;
                    var newY = d3.event.y;
                    d3.select(this)
                        .attr("x", newX)
                        .attr("y", newY);
                    //修改文字位置
                    _this.blockText.update(newX, newY);

                    if (typeof dragFn == 'function') { //回调函数
                        dragFn.call(null, newX, newY);
                    }
                }
                //定义拖拽结束行为
                function dragEnd(d) {
                    var newX = d3.event.x;
                    var newY = d3.event.y;
                    if (typeof dragEndFn == 'function') { //回调函数
                        dragEndFn.call(null, newX, newY, _this);
                    }
                }
                var drag = d3.drag()
                    .on("start", dragStart)
                    .on("drag", dragmove)
                    .on("end", dragEnd);
                this.block.call(drag);
                return this;
            } //鼠标拖拽事件
    }

    //// Exports gradientBlock Component ////
    return gradientBlock;
});