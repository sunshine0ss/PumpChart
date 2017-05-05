define(['d3', 'jquery', 'moment', 'lodash','button'], function(d3, jquery, moment,lodash,button) {

    var LEGEND_HEIGHT = 30;//默认高度

    
    // Check whether the obj is null or undfined.
    var isNullOrUndefine = function(obj) {
        return obj === undefined || obj === null;
    }
    // Defines the legend type
    var legend = function(svg) {
        this.legend_svg=svg;
        this.legend_div=null;
        this.add_button=null;//新增按钮
        this.update_button=null;//编辑按钮
        this.delete_button=null;//删除按钮
        this.cancel_button=null;//取消按钮
    }
    //The chain method
    legend.prototype = {
        draw: function(width,height) {
            var style="width:"+width+"px;height:"+(height||LEGEND_HEIGHT)+"px;";
            this.legend_div=this.legend_svg
                .append('div')
                .attr('class','legend')
                .attr('style',style)
                // .width(width)
                // .height(height||LEGEND_HEIGHT);
                // .css('width', width+'px')
                // .css('height', (height||LEGEND_HEIGHT)+'px');
            return this;
        },
        drawAddBtn: function(float,fn) {
            var btn=new button(this.legend_div);
            this.add_button=btn.add('新增',float,'green btn-sm').click_Event(fn);
            return this;
        },
        drawUpdateBtn:function(float,fn){ 
            var btn=new button(this.legend_div);
            this.add_button=btn.add('编辑',float,'blue btn-sm').click_Event(fn);
            return this;
        },
        drawDeleteBtn:function(float,fn){
            var btn=new button(this.legend_div);
            this.add_button=btn.add('删除',float,'red btn-sm').click_Event(fn);
            return this;
        },
        drawCancelBtn:function(float,fn){
            var btn=new button(this.legend_div);
            this.add_button=btn.add('取消',float,'yellow btn-sm').click_Event(fn);
            return this;
        }
    }

    //// Exports legend Component ////
    return legend;
});
