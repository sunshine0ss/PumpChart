define(['d3', 'jquery', 'moment', 'lodash','pumpText'], function(d3, jquery, moment,lodash,pumpText) {

    var BAR_HEIGHT=22;
    // Defines all class name
    var CLASS_OPEN_STATE = 'rect open_state';
    var CLASS_CLOSE_STATE = 'rect close_state';
    var CLASS_FAULT_STATE = 'rect fault_state';
    var CLASS_INDEFINITE_STATE = 'rect indefinite_state';


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
    var stateBlock = function(line,xScale) {
        this.version = '1.0';
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
    stateBlock.prototype = {
        draw: function(data) {//在绘图区绘制出块
            var _this=this;
            this.block=this.block_Line.datum(data)
                .append('rect')
                .attr('class', function(d, i) {
                    return formatClass(d);
                })
                .attr('x', function(d, i) {
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
                // .on("click", function(d, i, rects) {
                //     this.click_Event();
                // });
            this.blockData=data;
            // this.blockState=data.label;
            return this;
        },
        drawText:function(data){
            this.blockText=new pumpText(this.block_Line,this.block_xScale);
            this.blockText.draw(data);
            return this;
        },
        update:function(x,y,fn){ //修改坐标和宽度
            if(!isNullOrUndefine(x)){
                var oldx = parseFloat(this.block.attr('x'));
                var oldwidth = parseFloat(this.block.attr('width'));
                var diffValue = oldx-x;
                var rectWidth = oldwidth+ diffValue;
                this.block.attr('x', x).attr('width',rectWidth);
            }
            if(!isNullOrUndefine(y)){
                this.block.attr('y', y);
            }
            //修改对应text的位置
            if(this.blockText!=null)
                this.blockText.update(x,y);

            //回调函数
            if(typeof fn==='function')
                fn.call(x,y);
            return this;
        },
        updatePos:function(x,y,fn){ //修改坐标
            if(!isNullOrUndefine(x)){
                var oldx = parseFloat(this.block.attr('x'));
                var oldwidth = parseFloat(this.block.attr('width'));
                var diffValue = oldx-x;
                var rectWidth = oldwidth+ diffValue;
                this.block.attr('x', x).attr('width',rectWidth);
            }
            if(!isNullOrUndefine(y)){
                this.block.attr('y', y);
            }
            //修改对应text的位置
            if(this.blockText!=null)
                this.blockText.update(x,y);
            //回调函数
            if(typeof fn==='function')
                fn.call(x,y);
            return this;
        },
        updateWidth:function(diffValue,fn){//修改宽度
            if(!isNullOrUndefine(diffValue)){
                var oldwidth = parseFloat(this.block.attr('width'));
                var rectWidth = oldwidth+ diffValue;
                this.block.attr('width',rectWidth);
            }
            //回调函数
            if(typeof fn==='function')
                fn.call(x,y);
            return this;
        },
        setLeft:function(left){
            if(!isNullOrUndefine(left))
                this.leftBlock=left;
            return this;
        },
        setRight:function(right){
            if(!isNullOrUndefine(right))
                this.rightBlock=right;
            return this;
        },
        changeLeft:function(diffValue,fn){
            var _this=this;
            if(_this.leftBlock){
                    var width=parseFloat(_this.leftBlock.block.attr('width'));
                    var diff=Math.abs(diffValue);//取绝对值
                    //差值超过宽度就删除当前块，并改变前一块
                    if(diff>width){
                        _this.leftBlock.remove();//删除前一个
                        var newDiff=diffValue-width;
                        _this.changeLeft(newDiff);//改变其前一个
                        //_this.leftBlock=_this.leftBlock.leftBlock;
                    }
                    else{
                        //判断是否同一状态，是:合并
                        if(_this.blockData.label== _this.leftBlock.blockData.label){

                            var addWidth=parseFloat(_this.block.attr('width'))-diffValue;
                            _this.leftBlock.updateWidth(addWidth);//合并到前一块
                            _this.remove();//删除当前

                            //回调函数
                            if(typeof fn==='function')
                                fn.call(x,y);
                        }
                        else{
                            _this.leftBlock.updateWidth(-diffValue);
                        }
                    }
                
            }
            else{//如果没有就创建  不定状态
                if(_this.blockData.className != CLASS_INDEFINITE_STATE){
                    var data = {
                        height: BAR_HEIGHT,
                        time:_this.block_xScale.invert(0),
                        value: null,
                        label: '不定',
                        width:Math.abs(diffValue)
                    };
                    var leftBlock=new stateBlock(_this.block_Line,_this.block_xScale);
                    leftBlock.draw(data).drawText(data).click_Event(_this.callFn).setRight(_this);
                    _this.leftBlock=leftBlock;
                }
            }          
            return this;      
        },
        changeRight:function(diffValue,fn){
            var _this=this;
            if(_this.rightBlock){
                var width=parseFloat(_this.rightBlock.block.attr('width'));
                var diff=Math.abs(diffValue);
                if(diff>width){//差值超过宽度就删除当前块，并改变前一块
                    _this.rightBlock.remove();
                    var newDiff=diffValue+width;
                    _this.changeRight(newDiff);
                }
                else{
                    //判断是否同一状态，是:合并
                    if(_this.blockData.label== _this.rightBlock.blockData.label){
                        var addWidth=parseFloat(_this.rightBlock.block.attr('width'))+diffValue;
                        _this.updateWidth(addWidth);//合并到前一块
                        _this.rightBlock.remove();//删除后一条

                        //回调函数
                        if(typeof fn==='function')
                            fn.call(x,y);
                    }
                    else{
                        var oldx = parseFloat(_this.rightBlock.block.attr('x'));
                        var x = oldx - diffValue;
                        _this.rightBlock.update(x);
                    }
                }
            }
            else{
                var x=parseFloat(this.block.attr('x'))+parseFloat(this.block.attr('width'));
                //如果没有就创建  不定状态
                var data = {
                    height: BAR_HEIGHT,
                    time:_this.block_xScale.invert(x),
                    value: null,
                    label: '不定',
                    width:Math.abs(diffValue)
                };
                var rightBlock=new stateBlock(_this.block_Line,_this.block_xScale);
                rightBlock.draw(data).drawText(data).click_Event(_this.callFn).setLeft(_this);
                _this.rightBlock=rightBlock;
            }
            return this;   
        },
        click_Event:function(fn){//点击事件
            if(typeof fn=='function'){
                this.callFn=fn;
                var _this=this;
                this.block.on("click", function(d, i, rects) {
                    fn.call(d, i, rects,_this);
                })
            }
            return this;
        },
        remove:function(){
            this.block.remove();
            this.block=null;
            this.blockData=null;
            if(this.leftBlock!=null)
                this.leftBlock.rightBlock=this.rightBlock;
            if(this.rightBlock!=null)
                this.rightBlock.leftBlock=this.leftBlock;
            //删除对应text的位置
            if(this.blockText!=null)
                this.blockText.remove();
        }
        // each: function(fn) { //回调方法
        //     for (var i = 0, len = this.elements.length; i < len; i++) {
        //         fn.call(this, this.elements[i]);
        //     }
        //     return this; //在每个方法的最后return this;
        // },
        // addBlock: function(prop, val) {
        //     this.blocks.push(rects)
        //     return this; //在每个方法的最后return this;
        // },
        // drag: function() {

        //     return this;
        // }
    }

    //// Exports stateBlock Component ////
    return stateBlock;
});