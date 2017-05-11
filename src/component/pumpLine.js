define(['d3', 'jquery','stateBlock','numericBlock', 'moment', 'lodash'], function(d3, jquery,stateBlock,numericBlock, moment) {

    // Defines the time format to convert string to datetime.
    var toTime = d3.timeParse('%Y-%m-%d %H:%M:%S');
    var fromTime = d3.timeParse('%H:%M');
    var fromTimeToLong = d3.timeParse('%Y-%m-%d %H:%M');

    var BAR_HEIGHT=22;
    // Defines the pumpLine type
    var pumpLine = function(svg,xScale,yScale,option,describe) {
        this.g=null;
        this.version = '1.0';
        this.blocks=[];
        this.lineWidth=parseFloat(svg.attr('width'))-option.padding.left-option.padding.right;

        this.line_svg=svg;
        this.line_option=option;
        this.line_xScale=xScale;
        this.line_yScale=yScale;
        this.line_describe=describe;
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
                //循环数据并绘制块
                _.each(line.points,function(data){
                    var block=null;
                    if(line.dataType=='STATE')
                        block=new stateBlock(_this.g,_this.line_xScale);
                    else
                        block=new numericBlock(_this.g,_this.line_xScale);

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
        },
        popover:function(){
            function ContentMethod(val) {
                return '<input type="number" id="pumpvalue" name="pumpvalue" style="width: 50px" value='+val+'><button class="popoverBtn red" onclick="btnClick()">关</button>'
            }
            $("[data-toggle='popover']").each(function(i,e) {
                var val=e.__data__.value;//获取当前值
                if(val==null||val==undefined)
                    val='';
                var element = $(e);
                element.popover({
                    trigger: 'click',
                    container: "body" ,
                    placement: 'top', 
                    html: 'true',
                    content: ContentMethod(val),
                    animation: false  

                }).on("click", function () {
                    var _this = this;
                    $(this).popover("show");
                    // $(this).siblings("[data-toggle]").on("click", function () {
                    //     $(_this).popover('hide');
                    // });
                    $(this).siblings(".popover").on("mouseleave", function () {
                        $(_this).popover('hide');
                    });
                }).on("mouseleave", function () {
                    var _this = this;
                    setTimeout(function () {
                        if (!$(".popover:hover").length) {
                            $(_this).popover("hide")
                        }
                    }, 100);
                });
            });
        }
        // each: function(fn){//回调方法
        //     for(var i= 0,len=this.elements.length; i<len; i++){
        //         fn.call(this, this.elements[i]);
        //     }
        //     return this; //在每个方法的最后return this;
        // },
        // setStyle: function(prop, val){
        //     this.each(function(el){
        //         el.style[prop] = val;
        //     });
        //     return this; //在每个方法的最后return this;
        // },
        // drag:function(){

        //     return this; 
        // }
    }

    //// Exports pumpLine Component ////
    return pumpLine;
});