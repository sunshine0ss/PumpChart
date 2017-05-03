define(['d3', 'jquery','moment', 'lodash','text'], function(d3, jquery, moment,lodash,text) {

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
        this.distance=28;//手柄与text的间距
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
            var textX=x;
            var textTimeX=x;
            if(this.type==END_EDIT){
                textX=x-this.distance;//结束手柄的提示位置在手柄之前
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
            var oldx=null;
            //before the drag
            var handleDragStart=function(){
                var pos = d3.mouse(this);//获取鼠标位置
                var x = pos[0] - 2;//位置往前移动，能够顺畅的拖动，避免鼠标卡掉

                oldx = parseFloat(_this.handle.attr('x'));//获取手柄原始位置

                if(typeof dragStart==='function')
                    dragStart.call(null,x);//传参数回调
            };
            //Draging
            var handleDragged=function(){
                var pos = d3.mouse(this);//获取鼠标位置
                var x = pos[0] - 2;//位置往前移动，能够顺畅的拖动，避免鼠标卡掉
                if(_this.type==END_EDIT){
                    x=pos[0];
                }//结束手柄拖动x不减少
                //拖动范围限制
                if(x<_this.minX)
                    x=_this.minX;
                if(_this.maxX!=null&&x>_this.maxX)
                    x=_this.maxX;

                var prex = parseFloat(_this.handle.attr('x'))
                var diffValue = prex-x;//获取差值

                if(typeof dragged==='function')
                    dragged.call(null,x,diffValue);//传参数回调
                //修改手柄位置
                _this.handle.attr('x', x);
                _this.pos[0]=x;

                //更新手柄提示
                var textTimeX=x;
                var textX=x;
                if(_this.type==END_EDIT){
                    textX=x-_this.distance;//结束手柄的提示位置在手柄之前
                    textTimeX+=HANDLE_WIDTH;//时间显示为手柄结束位置的时间
                }
                var htext=moment(_this.handle_xScale.invert(textTimeX)).format('HH:mm');

                _this.handleText.update(htext,textX);//修改手柄提示的坐标
            };
            //After the drag
            var handleDragEnd=function(){
                var pos = d3.mouse(this);//获取鼠标位置
                var x = pos[0] - 2;//位置往前移动，能够顺畅的拖动，避免鼠标卡掉
                if(_this.type==END_EDIT){
                    x=pos[0];
                }//结束手柄拖动x不减少
                var diffValue = oldx-x;//获取差值

                if(typeof dragEnd==='function')
                    dragEnd.call(null,x,diffValue);//传参数回调
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
                this.handle.attr('x', x);
                //更新手柄提示
                var textTimeX=x;
                var textX=x;
                if(this.type==END_EDIT){
                    textX=x-this.distance;//结束手柄的提示位置在手柄之前
                    textTimeX+=HANDLE_WIDTH;//时间显示为手柄结束位置的时间
                }
                var htext=moment(this.handle_xScale.invert(textTimeX)).format('HH:mm');//显示时间
                this.handleText.update(htext,textX);//修改手柄提示的坐标

            }
            if(y!=undefined){
                this.handle.attr('y', y);
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

});