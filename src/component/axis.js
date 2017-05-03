define(['d3','jquery','moment'], function(d3,jquery,moment) {
    var axis_svg=null;
    var axis_option=null;
    var axis_params=null;
    var axis_xScale=null;
    var axis_yScale=null;

    // Defines the axis type
    var axis = function(svg,option,params,xScale,yScale) {
    	this.xAxis=null;
    	this.yAxis=null;
        axis_svg=svg;
        axis_option=option;
        axis_params=params;
        axis_xScale=xScale;
        axis_yScale=yScale;
    }
    //The chain method
    axis.prototype = {
        drawAxis: function(){
            xAxis = d3.axisBottom()
                .scale(axis_xScale)
                .tickFormat(
                function (d) {
                    var data = moment(d).format('HH:mm');
                    if (data == "00:00") {
                        return moment(d).format('MM/DD HH:mm');
                    }
                    else
                        return data;
                })
                .ticks(24);
            axis_svg.append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', 'translate(' + axis_option.padding.left + ',' + (axis_params.size.height - axis_option.padding.bottom) + ')')
                .call(xAxis);
           
            yAxis = d3.axisLeft()
                .scale(axis_yScale);
            axis_svg.append('g')
                .attr('class', 'axis axis--y')
                .attr('transform', 'translate(' + axis_option.padding.left + ',' + axis_option.padding.top + ')')
                .call(yAxis);
            return this; //在每个方法的最后return this;
        },
        getxAxis:function(){
            return this.xAxis;
        },
        getyAxis:function(){
            return this.yAxis;
        }
        // each: function(fn){//回调方法
        //     for(var i= 0,len=this.elements.length; i<len; i++){
        //         fn.call(this, this.elements[i]);
        //     }
        //     return this; //在每个方法的最后return this;
        // },
        // drag:function(){

        //     return this; 
        // }
    }
    //// Exports axis Component ////
    return axis;

});