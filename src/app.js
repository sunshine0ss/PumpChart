// var chart = require('chart');

var option = {
    padding: {
        top: 20,
        left: 50,
        bottom: 30,
        right: 20
    },
    showLegend:true,
    edit: true,
    drag:true
}

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
        "time": "2017-04-18 2:00:00",
        "value": 1
    }, {
        "time": "2017-04-18 4:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 12:00:00",
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
        "time": "2017-04-18 13:00:00",
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
        "time": "2017-04-18 20:00:00",
        "value": 1
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
    }, {
        "time": "2017-04-21 22:00:00",
        "value": 50
    }],
    "minValue":20,
    "maxValue":600,
    //"format":'0.00',
    "lineIndex": 1
}];


// var dicState={
//     CLASS_OPEN_STATE:{'text':'开','class':'rect close_state'},
//     CLASS_CLOSE_STATE:{'text':'关','class':'rect open_state'},
//     CLASS_FAULT_STATE:{'text':'故障','class':'rect fault_state'},
//     CLASS_INDEFINITE_STATE:{'text':'不定','class':'rect indefinite_state'}
// }


// {
//         "time": "2017-04-18 6:00:00",
//         "value": 0
//     }, 

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

var chart = new chart('#chart', option);
//chart.draw(objects);
chart.draw(objects1);
// chart.draw(objects1,dicState);

$("#inputBtn").on('click', function() {
    chart.getData();
})