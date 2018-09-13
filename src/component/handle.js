define(['d3', 'jQuery','moment', 'lodash','text'], function(d3, jquery, moment,lodash,text) {

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

});