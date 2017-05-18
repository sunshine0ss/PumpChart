define(['d3', 'jQuery', 'moment', 'lodash'], function(d3, jquery, moment,lodash) {

    var TEXT_WIDTH = 12;
    var TEXT_HEIGHT = 14;

    var time_svg=null;
    var time_xScale=null;
    var time_option=null;

    // Defines the text type
    var timeText = function(svg,xScale,option) {
        //Declaration attributes
        this.version = '1.0';
        this.timeText=null;
        //Make the variable function in the current scope
        this.time_svg=svg;
        this.time_xScale=xScale;
        this.time_option=option;
    }
    //The chain method
    timeText.prototype = {
        drawText: function(className) {
            this.timeText=this.time_svg.append('text')
                .attr('class', className)//'hover_text'
                .text('00:00')
                .style('opacity', 0)
                .attr('x', -1)
                .attr('y', this.time_option.padding.top + 8);
            // svg.append('text')
            //     .attr('class', className)//'hover_text'
            //     .text('00:00')
            //     .style('opacity', 0)
            //     .attr('x', -1)
            //     .attr('y', option.padding.top + 8);
            return this;
        },
        showText:function(x,y){
            var time = this.time_xScale.invert(x - this.time_option.padding.left);
            var text = time.toLocaleTimeString('zh-CN', {
                hour12: false
            }).substr(0, 5);
            this.timeText.style('opacity', 1)
                .text(text)
                .attr("x", x);
            return this;
        },
        hideText:function(){
            this.timeText.style('opacity', 0)
                .attr("x", -1);
            return this;
        }
    }

    //// Exports timeText Component ////
    return timeText;
});