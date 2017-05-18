define(['d3', 'jQuery', 'moment', 'lodash'], function(d3, jquery, moment,lodash) {

    var BUTTON_WIDTH = 35;//
    var BUTTON_HEIGHT = 20;//
    var BUTTON_ClASS='btn';
    
    // Check whether the obj is null or undfined.
    var isNullOrUndefine = function(obj) {
        return obj === undefined || obj === null;
    }
    // Defines the button type
    var button = function(svg) {
        this.button=null;
        this.button_svg=svg;
    }
    //The chain method
    button.prototype = {
        add: function(text,float,classn) {
            var className=BUTTON_ClASS;
            if(!isNullOrUndefine(classn)){
                className+=' '+classn;
            }
            this.button=this.button_svg
                .append('button')
                .attr('class',className)
                .text(text)
                .attr('width', BUTTON_WIDTH)
                .attr('height', BUTTON_HEIGHT)
                .attr('style', 'float:'+float);

            // this.button=this.button_svg
            //     .append('button')
            //    // .attr('class',className||'button')
            //     .text(text)
            //     .attr('width', BUTTON_WIDTH)
            //     .attr('height', BUTTON_HEIGHT)
            //     .attr('x', x-BUTTON_WIDTH)
            //     .attr('y', y);
            return this;
        },
        update:function(x,y){ 
            if(this.button!=null){
                if(x!=undefined)
                    this.button.attr('x',x);
                if(y!=undefined)
                    this.button.attr('y',y);
            }
            return this;
        },
        remove:function(){
            if(this.button!=null)
                this.button.remove();
            return this;
        },
        click_Event:function(fn){//点击事件
            if(typeof fn=='function'){
                this.callFn=fn;
                var _this=this;
                this.button.on("click", function(d,i,ele) {
                    fn.call(d,ele);
                })
            }
            return this;
        },
        setDisabled:function(disabled){
            if(this.button!=null){
                if(disabled)
                    this.button.attr("disabled",disabled);
                else
                    this.button.attr("disabled",null);
            }
        }
    }

    //// Exports button Component ////
    return button;
});
