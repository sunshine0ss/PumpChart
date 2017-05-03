define(['d3', 'jquery', 'moment', 'lodash'], function(d3, jquery, moment) {

    // Defines the time format to convert string to datetime.
    var toTime = d3.timeParse('%Y-%m-%d %H:%M:%S');
    var fromTime = d3.timeParse('%H:%M');
    var fromTimeToLong = d3.timeParse('%Y-%m-%d %H:%M');

    //根据值转换样式
    function formatClass(d) {
        var className = null;
        if (d.value > 0) {
            className = CLASS_OPEN_STATE;
        } else if (d.value == 0) {
            className = CLASS_CLOSE_STATE;

        } else if (d.value < 0) {
            className = CLASS_FAULT_STATE;
        } else {
            className = CLASS_INDEFINITE_STATE;
        }
        return className;
    }
    // Defines the undefineBlock type
    var undefineBlock = function(svg,g,barHeight) {
        this.version = '1.0';
        this.block =null;


    }
    //The chain method
    undefineBlock.prototype = {
        draw: function(g,data,) {
            this.block=g.datum(data)
                .append('rect')
                .attr('class', function(d, i) {
                    return formatClass(d);
                })
                .attr('x', function(d, i) {
                    d.x = xScale(d.time);
                    return d.x;
                })
                .attr('y', 0)
                .attr('width', function(d, i) {
                    d.width = 0;
                    if (d.next) {
                        d.width = xScale(d.next.time) - xScale(d.time);
                    }
                    if (d.width < 0) {
                        d.width = 0;
                    }
                    return d.width;
                })
                .attr('height', function(d, i) {
                    d.height = barHeight;
                    return barHeight;
                }).on("click", function(d, i, rects) {

                });
            return this;
        },
        // each: function(fn) { //回调方法
        //     for (var i = 0, len = this.elements.length; i < len; i++) {
        //         fn.call(this, this.elements[i]);
        //     }
        //     return this; //在每个方法的最后return this;
        // },
        // addBlock: function(prop, val) {
        //     this.blocks.push(rects)
        //     return this; //在每个方法的最后return this;
        // },
        // drag: function() {

        //     return this;
        // }
    }

    //// Exports undefineBlock Component ////
    return undefineBlock;
});