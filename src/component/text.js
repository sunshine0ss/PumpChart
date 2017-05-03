define(['d3', 'jquery', 'moment', 'lodash'], function(d3, jquery, moment,lodash) {

    var TEXT_WIDTH = 12;
    var TEXT_HEIGHT = 14;

    var g=null;
    var block_xScale=null;

    // Check whether the obj is null or undfined.
    var isNullOrUndefine = function(obj) {
        return obj === undefined || obj === null;
    }

    // Defines the text type
    var text = function(line) {
        this.version = '1.0';
        this.text=null;
        g=line;
    }
    //The chain method
    text.prototype = {
        drawText: function(text,className,x,y) {
            this.text=g.append('text')
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
});
