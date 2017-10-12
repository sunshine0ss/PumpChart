define(['d3','jQuery','moment'], function(d3,jquery,moment) {
    // Defines the axis type
    var axis = function(svg,option,params,xScale,yScale) {
    	this.xAxis=null;
    	this.yAxis=null;
        this.axis_svg=svg;
        this.axis_option=option;
        this.axis_params=params;
        this.axis_xScale=xScale;
        this.axis_yScale=yScale;
    }
    //The chain method
    axis.prototype = {
        drawAxis: function(){
            this.xAxis = d3.axisBottom()
                .scale(this.axis_xScale)
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
            this.axis_x=this.axis_svg.append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', 'translate(' + this.axis_option.padding.left + ',' + (this.axis_params.size.height - this.axis_option.padding.bottom) + ')')
                .call(this.xAxis);
           
            this.yAxis = d3.axisLeft()
                .scale(this.axis_yScale);
            this.axis_y=this.axis_svg.append('g')
                .attr('class', 'axis axis--y')
                .attr('transform', 'translate(' + this.axis_option.padding.left + ',' + this.axis_option.padding.top + ')')
                .call(this.yAxis);

            //前后的00:00换行显示，带上日期
            var texts = $('.axis.axis--x').find('text'); //r texts = $('.axis.x').find('text');
            var timeTexts = _.filter(texts, function(d) {
                if (d.innerHTML.includes('00:00') && d.innerHTML != '00:00')
                    return d;
            })
            _.each(timeTexts, function(timeText) {
                var text = timeText.innerHTML;
                var monthText = text.substr(0, 5);

                var b = timeText.cloneNode();

                $(b).attr('y', 21).html(monthText);
                $(timeText).html('00:00')
                var g = timeText.parentElement;
                g.appendChild(b);
            })
            return this; //在每个方法的最后return this;
        },
        remove:function(){
            this.xAxis.remove();
            this.yAxis.remove();
            return this;
        },
        getxAxis:function(){
            return this.xAxis;
        },
        getyAxis:function(){
            return this.yAxis;
        }
    }
    //// Exports axis Component ////
    return axis;

});