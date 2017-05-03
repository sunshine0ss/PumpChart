define(['d3', 'jquery', 'moment', 'lodash'], function(d3, jquery, moment,lodash) {

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
    }
    //The chain method
    pumpText.prototype = {
        draw: function(data) {
            var _this=this;

            this.pumpText=_this.g.datum(data)
                .append('text')
                .filter(function(d) {
                    return d.width > TEXT_WIDTH && d.time !== d.next.time;
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
            return this;
        },
        update:function(x,y){ 
            if(x!=undefined)
                this.pumpText.attr('x',x + PADDING);
            return this;
        },
        remove:function(){
            this.pumpText.remove();
            return this;
        }
    }

    //// Exports pumpText Component ////
    return pumpText;
});
