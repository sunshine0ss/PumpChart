define(['d3', 'jQuery','stateBlock','numericBlock','gradientBlock', 'moment', 'lodash'], function(d3, jquery,stateBlock,numericBlock,gradientBlock, moment) {

    // Defines the time format to convert string to datetime.
    var toTime = d3.timeParse('%Y-%m-%d %H:%M:%S');
    var fromTime = d3.timeParse('%H:%M');
    var fromTimeToLong = d3.timeParse('%Y-%m-%d %H:%M');

    var BAR_HEIGHT=22;


    var DEFAULT_COLOR=[0,0,255];//蓝色
    var COLOR_STEP=5;//颜色分级步长
    var ColorGrade=[];//渐变颜色

    //计算渐变色系
    function getColorGradient() {
        var colorLength=COLOR_STEP+1;//间隔加一是颜色的数量
        var code = DEFAULT_COLOR;
        //当前颜色/255，计算基数
        var curR = parseFloat(code[0] / 255).toFixed(2);
        var curG = parseFloat(code[1] / 255).toFixed(2);
        var curB = parseFloat(code[2] / 255).toFixed(2);
        //计算每步需要加的数字 ——（1-基数）/步长
        var stepR = parseFloat((1 - curR) / (colorLength + 1)).toFixed(2);
        var stepG = parseFloat((1 - curG) / (colorLength + 1)).toFixed(2);
        var stepB = parseFloat((1 - curB) / (colorLength + 1)).toFixed(2);
        //渐变填充色
        for (var i = 1; i <= colorLength; i++) {
            var r = parseInt(code[0]);
            var g = parseInt(code[1]);
            var b = parseInt(code[2]);
            if (i > 1) {
                r = parseInt(parseFloat(stepR * i + parseFloat(curR)) * 255);
                g = parseInt(parseFloat(stepG * i + parseFloat(curG)) * 255);
                b = parseInt(parseFloat(stepB * i + parseFloat(curB)) * 255);
            }
            ColorGrade.push([r, g, b]);
        }
        ColorGrade=_.reverse(ColorGrade);//反转顺序：颜色先浅再深
    }
    //rgb颜色转换成16进制
    var changeColor=function(rgbColor){
        for (var i = 0; i < rgbColor.length; i++) {
          rgbColor[i] = parseInt(rgbColor[i]).toString(16);
          if (rgbColor[i].length == 1) rgbColor[i] = '0' + rgbColor[i];
        }
        var str = "#"+rgbColor.join('');
        //console.log(str); 
        return str;
    }


    // Defines the pumpLine type
    var pumpLine = function(svg,xScale,yScale,option,describe) {
        this.g=null;
        this.version = '1.0';
        this.blocks=[];//所有的块
        this.lineWidth=parseFloat(svg.attr('width'))-option.padding.left-option.padding.right;//计算宽

        this.line_svg=svg;
        this.line_option=option;
        this.line_xScale=xScale;
        this.line_yScale=yScale;
        this.line_describe=describe;

        this.valueGrade=[];//值域

    }

    //The chain method
    pumpLine.prototype = {
        drawLine:function(line){
            var _this=this;
            var top = this.line_yScale(line.name) + this.line_option.padding.top + ((BAR_HEIGHT - 2) / 2) -
                    this.line_describe.barCount * 0.2;
            this.g = this.line_svg.append('g')
                .attr('transform', 'translate(' + this.line_option.padding.left + ',' + top + ')');
            if(line.points.length>0){
                var minValue=null;
                var maxValue=null;
                var type=stateBlock;
                if(line.type=='CSP')//定速泵
                    type=stateBlock;
                else if(line.type=='RSP')//定速泵
                    type=numericBlock;
                else{//流量/压力
                    type=gradientBlock;
                    getColorGradient();
                    // var maxPoint=_.maxBy(line.points, function(o) { return o.value; });//获取最大值
                    // _this.getValueGrade(maxPoint.value);
                    if(line.hasOwnProperty('minValue'))
                        minValue=line.minValue;
                    if(line.hasOwnProperty('maxValue'))
                        maxValue=line.maxValue;
                    _this.getValueGrade(minValue,maxValue);
                }

                //循环数据并绘制块
                _.each(line.points,function(data){
                    var block=null;
                    block=new type(_this.g,_this.line_xScale,ColorGrade,_this.valueGrade);
                    block.draw(data).drawText();//绘制快
                    //设置最大最小限制
                    if(minValue!=null)
                        block.setMinValue(minValue);
                    if(maxValue!=null)
                        block.setMaxValue(maxValue);
                    //设置邻近块
                    var left=null;
                    var length=_this.blocks.length;
                    if(length>0){
                        left=_this.blocks[length-1];
                        block.setLeft(left);
                        left.setRight(block);
                    }
                    _this.blocks.push(block);
                })
                //$("[data-toggle='popover']").popover();
            }

            return this;
        },
        getValueGrade:function(minValue,maxValue) {
            var values=[];
            var valueStep=(maxValue-minValue)/(COLOR_STEP-1);
            //渐变填充色
            for (var i = 0; i < COLOR_STEP; i++) {
                values.push(minValue+i*valueStep);
            }
            this.valueGrade=values;
        },
        getColorByValue(value) {
            var _this=this;
            //渐变填充色
            for (var i = 0; i < _this.valueGrade.length; i++) {
                var rgbColor=null;
                if(i==0){
                    if(value<=_this.valueGrade[i])
                        rgbColor=ColorGrade[i];
                    else if(value>_this.valueGrade[i]&&value<=_this.valueGrade[i+1])
                        rgbColor=ColorGrade[i+1];
                }
                else if(i>0&&i<_this.valueGrade.length-1){
                    if(value>_this.valueGrade[i]&&value<=_this.valueGrade[i+1])
                        rgbColor=ColorGrade[i+1];
                }
                else if(i==_this.valueGrade.length-1){
                    if(value>_this.valueGrade[i])
                        rgbColor=ColorGrade[i+1];
                }
                if(rgbColor!=null)
                    return changeColor(_.clone(rgbColor));
            }
        },//获取对应颜色
        checkBlock_Event:function(fn){
            if(typeof fn==='function'){
                _.each(this.blocks,function(block){
                    block.click_Event(fn);
                })     
            }
            return this;
        },
        dbclick_Event:function(fn){
            if(typeof fn==='function'){
                _.each(this.blocks,function(block){
                    block.dbclick_Event(fn);
                })     
            }
            return this;
        },
        remove:function(){
            this.g.remove();
            return this;
        }
    }

    //// Exports pumpLine Component ////
    return pumpLine;
});