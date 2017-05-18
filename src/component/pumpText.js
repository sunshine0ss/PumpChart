define(['d3', 'jQuery', 'moment', 'lodash'], function(d3, jquery, moment,lodash) {

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
});
