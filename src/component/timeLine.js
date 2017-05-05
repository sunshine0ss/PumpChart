define(['d3', 'jquery', 'moment', 'lodash','timeText'], function(d3, jquery, moment,lodash,timeText) {

    var TEXT_WIDTH = 12;
    var TEXT_HEIGHT = 14;

    // Defines the timeLine type
    var timeLine = function(svg,option,params,xScale,isShowText) {
        //Declaration attributes
        this.version = '1.0';
        this.currentLine=null;
        this.currentText=null;
        this.isShow=false;
        this.showText=false;
        //Make the variable function in the current scope
        this.time_svg=svg;
        this.time_option=option;
        this.time_params=params;
        this.time_xScale=xScale;
        if (isShowText)//是否显示时间值
            this.showText=isShowText;
    }
    //The chain method
    timeLine.prototype = {
        drawLine: function(className,text_class) {
            // Create the mouse pointer line
            this.currentLine=this.time_svg.append("line")
                .attr('class', className)
                .classed("hide", false)
                .attr("x1", -1)
                .attr("x2", -1)
                .attr("y1", this.time_option.padding.top)
                .attr("y2", this.time_params.size.height - this.time_option.padding.bottom);
            //Show time label
            if(this.showText){
                this.currentText=new timeText(this.time_svg,this.time_xScale,this.time_option);
                this.currentText.drawText(text_class);
            }
            return this;
        },
        showLine:function(x,y){
            this.currentLine.classed("hide", false)
                            .attr("x1", x)
                            .attr("x2", x);  
            if(this.showText){
                this.currentText.showText(x);
            }  
            this.isShow=true;
            return this;
        },
        moveLine:function(x){
            this.currentLine.attr("x1", x)
                            .attr("x2", x);   
            if(this.showText){
                this.currentText.showText(x);
            }   
            return this;
        },
        hideLine:function(){
            this.currentLine.classed("hide", true)
                            .attr("x1", -1)
                            .attr("x2", -1);
            if(this.showText){
                this.currentText.hideText();
            }  
            this.isShow=false;
            return this;
        },
        // moveLine:function(time){  
        // 	var x = time_xScale(time) + 31; // 11; 重新又设置padding为20，所以要加20;
        //     var y = time_params.size.height - time_option.padding.bottom + 12;
        //     this.currentLine.attr('transform', 'translate(' + x + ',' + y + ')')
        //     return this;
        // }
    }

    //// Exports timeLine Component ////
    return timeLine;
});
