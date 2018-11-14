
var curBlock=null;//当前选中的块 ； 必须设置为全局变量
var startHandle=null;//选中的开始手柄；必须设置为全局变量
var endHandle=null;//选中的结束手柄；必须设置为全局变量
var xScale=null;//x轴比例尺（转换时间或x）：必须设置为全局变量
var startData=null;//开始时间的年月日：必须设置为全局变量
var endData=null;//结束时间的年月日：必须设置为全局变量


var click_fn=function(block){
    curBlock=block;
    var x1=curBlock.blockData.x;
    var x2=curBlock.blockData.x+curBlock.blockData.width;
    xScale=pumpChart.getxScale();
    startHandle=pumpChart.getStartHandle();
    endHandle=pumpChart.getEndHandle();

    var startTime=moment(xScale.invert(x1)).format('HH:mm');
    var endTime=moment(xScale.invert(x2)).format('HH:mm');

    startData=moment(xScale.invert(x1)).format('YYYY-MM-DD');
    endData=moment(xScale.invert(x2)).format('YYYY-MM-DD');

    $('#startTime').val(startTime);
    $('#endTime').val(endTime);
    $('#value').val(block.blockData.value);
    var min=block.line_data.minValue;
    var max=block.line_data.maxValue;
    $('#value').attr('min',min);
    $('#value').attr('max',max);
}
var startHandleDragEnd_fn=function(handle){
    var x1=curBlock.blockData.x;
    var startTime=moment(xScale.invert(x1)).format('HH:mm');
    $('#startTime').val(startTime);
}
var endHandleDragEnd_fn=function(handle){
    var x2=curBlock.blockData.x+curBlock.blockData.width;
    var endTime=moment(xScale.invert(x2)).format('HH:mm');
    $('#endTime').val(endTime);
}
var popover_fn=function(value){
    $('#value').val(value);
}
var option = {
    padding: {
        top: 20,
        left: 50,
        bottom: 30,
        right: 20
    },
    showLegend:true,//是否显示图例
    edit: true,//是否编辑
    drag:true,//是否拖拽
    //isContinue:false,//是否延续状态,默认延续
    // xStartTime:new Date('2017-04-18 10:00:00'),//x轴开始时间,默认0点开始
    // xEndTime:new Date('2017-04-18 20:00:00'),//y轴开始时间,默认0点结束
    //xInterval:30,//显示的时间间隔。根据数据和宽度不定显示
    click_fn:click_fn,//block块点击事件
    startHandleDragEnd_fn:startHandleDragEnd_fn,//开始手柄拖动事件
    endHandleDragEnd_fn:endHandleDragEnd_fn,//结束手柄拖动事件
    //dbclick_fn:dbclick_fn,//鼠标双击事件
    popover_fn:popover_fn//弹出框值改变事件
}
//默认配置
  // var default_option = {
  //       padding: {
  //           top: 20,
  //           left: 45,
  //           bottom: 30,
  //           right: 20
  //       },
  //       mode: 'Day',
  //       showCurrent: true,//是否显示当前时间分割线
  //       showHover:true,//是否显示鼠标移动上去的时间
  //       showLegend:false,//是否显示图例
  //       edit: false,//是否编辑
  //       drag:false//是否拖拽
  //   }

var object0 = [{
    "id": 17,
    "name": "增压1#",
    "type": "CSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 6:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 14:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 21:00:00",
        "value": -1
    }],
    "lineIndex": 5
}, {
    "id": 13,
    "name": "西山1#",
    "type": "CSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 10:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 12:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 16:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 18:00:00",
        "value": -31
    }, {
        "time": "2017-04-18 20:00:00",
        "value": 1
    }],
    "lineIndex": 4
}, {
    "id": 18,
    "name": "增压2#",
    "type": "CSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 6:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 8:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 10:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 15:00:00",
        "value": -1
    }, {
        "time": "2017-04-18 18:00:00",
        "value": -1
    }, {
        "time": "2017-04-18 20:00:00",
        "value": -1
    }],
    "lineIndex": 4
}, {
    "id": 14,
    "name": "西山2#",
    "type": "RSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 6:00:00",
        "value": 50
    }, {
        "time": "2017-04-18 8:00:00",
        "value": -12
    }, {
        "time": "2017-04-18 12:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 14:00:00",
        "value": 13
    }, {
        "time": "2017-04-18 20:00:00",
        "value": 13
    }],
    "minValue":45,
    "maxValue":60,
    "lineIndex": 3
}]

var objects = [{
    "id": 17,
    "name": "增压1#",
    "type": "CSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 6:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 14:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 21:00:00",
        "value": -1
    },{
        "time": "2017-04-19 0:00:00",
        "value": 0
    }, {
        "time": "2017-04-19 2:00:00",
        "value": 1
    }, {
        "time": "2017-04-20 6:00:00",
        "value": 0
    }, {
        "time": "2017-04-20 12:00:00",
        "value": -1
    }, {
        "time": "2017-04-21 10:00:00",
        "value": 1
    }],
    "lineIndex": 5
}, {
    "id": 13,
    "name": "西山1#",
    "type": "CSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 2:00:00",
        "value": 1
    }, {
        "time": "2017-04-19 6:00:00",
        "value": 0
    }, {
        "time": "2017-04-20 12:00:00",
        "value": -31
    }, {
        "time": "2017-04-21 9:00:00",
        "value": 1
    }],
    "lineIndex": 4
}, {
    "id": 18,
    "name": "增压2#",
    "type": "CSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 3:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 10:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 15:00:00",
        "value": -1
    }, {
        "time": "2017-04-19 15:00:00",
        "value": -1
    }, {
        "time": "2017-04-20 15:00:00",
        "value": -1
    }, {
        "time": "2017-04-21 15:00:00",
        "value": -1
    }],
    "lineIndex": 4
}, {
    "id": 14,
    "name": "西山2#",
    "type": "RSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": 50
    }, {
        "time": "2017-04-18 5:00:00",
        "value": -12
    }, {
        "time": "2017-04-18 12:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 14:00:00",
        "value": 13
    }, {
        "time": "2017-04-19 20:00:00",
        "value": 13
    }, {
        "time": "2017-04-20 8:00:00",
        "value": 25
    }, {
        "time": "2017-04-21 14:00:00",
        "value": 25
    }],
    "minValue":45,
    "maxValue":60,
    "lineIndex": 3
}, {
    "id": 19,
    "name": "增压3#",
    "type": "CSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 2:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 6:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 10:00:00",
        "value": 1
    }, {
        "time": "2017-04-20 10:00:00",
        "value": 0
    }],
    "lineIndex": 3
}, {
    "id": 15,
    "name": "西山3#",
    "type": "CSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 12:00:00",
        "value": 1
    }, {
        "time": "2017-04-19 14:00:00",
        "value": 0
    }, {
        "time": "2017-04-20 12:00:00",
        "value": 1
    }],
    "lineIndex": 2
}, {
    "id": 20,
    "name": "增压4#",
    "type": "CSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 5:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 10:00:00",
        "value": 0
    }, {
        "time": "2017-04-19 13:00:00",
        "value": 1
    }],
    "lineIndex": 2
}, {
    "id": 16,
    "name": "西山4#",
    "type": "CSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 8:00:00",
        "value": -20
    }, {
        "time": "2017-04-18 12:00:00",
        "value": 0
    }, {
        "time": "2017-04-19 10:00:00",
        "value": 1
    }, {
        "time": "2017-04-20 17:00:00",
        "value": 0
    }, {
        "time": "2017-04-21 6:00:00",
        "value": -1
    }],
    "lineIndex": 1
}, {
    "id": 21,
    "name": "增压5#",
    "type": "CSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": null
    }, {
        "time": "2017-04-18 4:00:00",
        "value": -1
    }, {
        "time": "2017-04-18 10:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 18:00:00",
        "value": 0
    }, {
        "time": "2017-04-19 10:00:00",
        "value": 1
    }, {
        "time": "2017-04-20 18:00:00",
        "value": 0
    }],
    "lineIndex": 1
}, {
    "id": 23,
    "name": "西山5#",
    "type": "PRESSURE",
    "dataType": "PRESSURE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": null
    }, {
        "time": "2017-04-18 12:00:00",
        "value": 360
    }, {
        "time": "2017-04-18 19:00:00",
        "value": 100
    }, {
        "time": "2017-04-19 4:00:00",
        "value": 550
    }, {
        "time": "2017-04-19 18:00:00",
        "value": 250
    }, {
        "time": "2017-04-20 2:00:00",
        "value": 50
    }, {
        "time": "2017-04-21 22:00:00",
        "value": 50
    }],
    "minValue":20,
    "maxValue":600,
    //"format":'0.00',
    "lineIndex": 1,
    "unitText":'HZ'
}];


var dicState={
    CLASS_OPEN_STATE:{'text':'开','class':'rect close_state'},
    CLASS_CLOSE_STATE:{'text':'关','class':'rect open_state'},
    CLASS_FAULT_STATE:{'text':'故障','class':'rect fault_state'},
    CLASS_INDEFINITE_STATE:{'text':'不定','class':'rect indefinite_state'}
}

var objects1 = [{
    "id": 1,
    "name": "增压1#",
    "type": "CSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 14:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 21:00:00",
        "value": -1
    }],
    "lineIndex": 1
}, {
    "id": 2,
    "name": "西山1#",
    "type": "CSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 2:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 6:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 12:00:00",
        "value": -31
    }, {
        "time": "2017-04-18 20:00:00",
        "value": 1
    }],
    "lineIndex": 2
}, {
    "id": 3,
    "name": "增压2#",
    "type": "CSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 3:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 10:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 15:00:00",
        "value": -1
    }],
    "lineIndex": 3
}, {
    "id": 4,
    "name": "西向1#",
    "type": "RSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": 40
    }, {
        "time": "2017-04-18 4:00:00",
        "value": 32
    }, {
        "time": "2017-04-18 10:00:00",
        "value": 16
    }, {
        "time": "2017-04-18 16:00:00",
        "value": 42
    }, {
        "time": "2017-04-18 20:00:00",
        "value": 3
    }],
    "lineIndex": 4
}, {
    "id": 5,
    "name": "西山2#",
    "type": "RSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": 150
    }, {
        "time": "2017-04-18 5:00:00",
        "value": -12
    }, {
        "time": "2017-04-18 12:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 14:00:00",
        "value": 13
    }],
    "lineIndex": 5
}, {
    "id": 6,
    "name": "增压3#",
    "type": "CSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 2:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 6:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 10:00:00",
        "value": 1
    }],
    "lineIndex": 6
}, {
    "id": 7,
    "name": "西山3#",
    "type": "CSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 2:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 4:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 12:00:00",
        "value": 1
    }],
    "lineIndex": 7
}, {
    "id": 8,
    "name": "增压4#",
    "type": "CSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 5:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 10:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 13:00:00",
        "value": 1
    }],
    "lineIndex": 8
}, {
    "id": 9,
    "name": "西山4#",
    "type": "CSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 8:00:00",
        "value": -20
    }, {
        "time": "2017-04-18 12:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 20:00:00",
        "value": 1
    }],
    "lineIndex": 9
}, {
    "id": 10,
    "name": "增压5#",
    "type": "CSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": null
    }, {
        "time": "2017-04-18 4:00:00",
        "value": -1
    }, {
        "time": "2017-04-18 10:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 18:00:00",
        "value": 0
    }],
    "lineIndex": 10
}, {
    "id": 11,
    "name": "西山压力",
    "type": "PRESSURE",
    "dataType": "PRESSURE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": null
    }, {
        "time": "2017-04-18 4:00:00",
        "value": 360
    }, {
        "time": "2017-04-18 9:00:00",
        "value": 100
    }, {
        "time": "2017-04-18 14:00:00",
        "value": 550
    }, {
        "time": "2017-04-18 18:00:00",
        "value": 250
    }, {
        "time": "2017-04-18 22:00:00",
        "value": 50
    }],
    "minValue":20,
    "maxValue":600,
    'unitText':'HZ',
    //"format":'0.00',
    "lineIndex": 11
}, {
    "id": 110,
    "name": "西向压力",
    "type": "PRESSURE",
    "dataType": "PRESSURE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": 250
    }, {
        "time": "2017-04-18 10:00:00",
        "value": 60
    }, {
        "time": "2017-04-18 16:00:00",
        "value": 180
    }, {
        "time": "2017-04-18 20:00:00",
        "value": 580
    }],
    "minValue":20,
    "maxValue":600,
    //"format":'0.00',
    "lineIndex": 11
}];

var pumpChart = new pumpChart('#chart', option);
//chart.draw(objects);
pumpChart.draw(objects1);
// chart.draw(objects1,dicState);


$("#inputBtn").on('click', function() {
    pumpChart.getData();
})

var dragEvt = function(curDragBlock, startTime, endTime) {
     var newX1 = xScale(moment(startTime));
     var newX2 = xScale(moment(endTime));
     var width = newX2 - newX1;

     var leftBlockX1 = 0;
     var rightBlockX2 = 0;
     if (curDragBlock.leftBlock != null && curDragBlock.leftBlock.blockData)
         leftBlockX1 = curDragBlock.leftBlock.blockData.pos.x1;
     if (curDragBlock.rightBlock != null && curDragBlock.rightBlock.blockData)
         rightBlockX2 = curDragBlock.rightBlock.blockData.pos.x2;
     if (leftBlockX1 <= newX1 && newX2 <= rightBlockX2)
         return true;
     else {
         var curLine = _.cloneDeep(curDragBlock.block_Line);
         var lineData = curLine.line_data;
         lineData.points = [];
         var cloneData=_.cloneDeep(curDragBlock.blockData);
         lineData.points.push(cloneData);
         tempLine = pumpChart.area.addLine(lineData);
         //tempLine.drawLine(lineData);

         var block = tempLine.blocks[0];
         block.update(newX1, 0, width);
         _.each(curDragBlock.block_Line.blocks, function(lineBlock) {
             if (lineBlock != curDragBlock && lineBlock.inBox(newX1, 0)) {
                 if (block.block) {
                     //拖动的块的前一块覆盖空白
                     var addwidth = curDragBlock.blockData.width;
                     curDragBlock.leftBlock.addWidth(addwidth);
                     curDragBlock.remove();
                 }
                 lineBlock.insertBlock(block, newX1);
                 return false;
             }
         })
         tempLine.remove();
         return false;
     }
 }


var editChart=function(){
    var val=$('#value').val();
    var min=$('#value').attr('min');
    var max=$('#value').attr('max');
    if(min&&val<min){//判断是否有上下限
        val=min;
        $('#value').val(val);
    }
    else if(max&&val>max){
        val=max;
        $('#value').val(val);
    }
    var startTime=startData+' '+$('#startTime').val();//必须拼成“YYYY-MM-DD HH:mm:ss”
    var endTime=startData+' '+$('#endTime').val();
    if($('#endTime').val()=="00:00")//判断为00:00时，取（开始时间+一天）的整0点
        endTime=moment(endTime).add(1,'day').format('YYYY-MM-DD');

    if (moment(startTime).isBefore(moment(endTime))) {
        //如果在块范围之内，允许修改
        if (dragEvt(curBlock, startTime, endTime)) {
            var startX = xScale(moment(startTime));
            var endX = xScale(moment(endTime));
            var width = endX - startX;
            curBlock.update(startX, null, width); //修改当前块位置和宽度

            curBlock.changeLeft();
            curBlock.changeRight();

            pumpChart.area.removeHandles(); //删除手柄
            pumpChart.changeBlockData(val, curBlock); //修改块的状态/值

            $('#startTime').val(null);
            $('#endTime').val(null);
            $(elem).css("display", "none");


        } else {
            pumpChart.area.removeHandles(); //删除手柄
            $('#startTime').val(null);
            $('#endTime').val(null);
        }
    }
    else{
        wapPromptService.warning('开始时间不能大于结束时间', "提示");
    }

    // var startX=xScale(moment(startTime));
    // var endX=xScale(moment(endTime));//xScale（）必须传时间格式
    // // startHandle.updatePos(startX);//修改手柄位置
    // // endHandle.updatePos(endX);//修改手柄位置
    // var width=endX-startX;//计算宽度
    // curBlock.update(startX, null, width);//修改当前块位置和宽度
    
    // curBlock.changeLeft();//修改左边块
    // curBlock.changeRight();//修改右边块

    // pumpChart.changeBlockData(val,curBlock);//修改块的状态/值
    // pumpChart.area.updateHandles();//修改手柄
}//修改泵图块






// var objs = [{
//     "id": 1,
//     "name": "增压1#",
//     "type": "CSP",
//     "dataType": "STATE",
//     "values": [{
//         "time": "2017-04-18 0:00:00",
//         "value": 1
//     }],
//     "lineIndex": 1
// }, {
//     "id": 2,
//     "name": "西山1#",
//     "type": "RSP",
//     "dataType": "STATE",
//     "values": [{
//         "time": "2017-04-18 0:00:00",
//         "value": 0
//     },{
//         "time": "2017-04-18 9:00:00",
//         "value": 122
//     }],
//     "lineIndex": 2
// }, {
//     "id": 3,
//     "name": "增压2#",
//     "type": "CSP",
//     "dataType": "STATE",
//     "values": [{
//         "time": "2017-04-18 0:00:00",
//         "value": 1
//     }],
//     "lineIndex": 3
// }]
// chart.draw(objs,dicState);