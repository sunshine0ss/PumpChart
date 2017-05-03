define(['d3','jquery'], function(d3,jquery) {
    var linechart = function(option) {
		var element= d3.select(option.element);
		var margin =option.margin||{left:0,right:0,top:0,bottom:0};
		var data=option.data;
       
        var elementWidth=option.width||$(option.element).width();
        var elementHeight=option.height||$(option.element).height();

        var width = elementWidth - margin.left - margin.right,
            height = elementHeight - margin.top - margin.bottom;

        var svg =element
                .append('svg')
                //.attr('margin',margin)
                .attr('width', elementWidth)
                .attr('height', elementHeight);
        var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var parseTime =d3.timeParse("%Y-%m-%d");// d3.timeParse("%d-%b-%y");

        var x = d3.scaleTime()
            .rangeRound([0, width]);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        var line = d3.line()
            .x(function(d) {
                return x(parseTime(d.time));//x(d.time);
            })
            .y(function(d) {
                return y(d.value);
            });


        x.domain(d3.extent(data, function(d) {
            return parseTime(d.time);//d.time;
        }));
        y.domain(d3.extent(data, function(d) {
            return d.value;
        }));

        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            //.select(".domain")
            //.remove();  //移除x轴

        // //y轴在右边
        // g.append("g") 
        //     .attr("class", "y axis axisRight")
        //     .attr("transform", "translate(" + (width) + ",0)")
        //     .call(d3.axisRight(y))
        //     .append("text")
        //     .attr("fill", "#000")
        //     .attr("transform", "rotate(-90)")
        //     .attr("y", 6)
        //     .attr("dy", "0.71em")
        //     .attr("text-anchor", "end")
        //     .text("Price ($)");

        //y轴在左边
        g.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Price ($)");

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", line);

    }
    return linechart;

    // return {
    //     linechart: linechart
    // };
});