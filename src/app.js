// var chart = require('chart');

var option = {
    padding: {
        top: 20,
        left: 50,
        bottom: 30,
        right: 20
    },
    showLegend:true,
    edit: true
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
        "time": "2017-04-18 6:00:00",
        "value": 0
    }, {
        "time": "2017-04-18 12:00:00",
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
    "lineIndex": 4
}, {
    "id": 14,
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
    }],
    "minValue":20,
    "maxValue":600,
    //"format":'0.00',
    "lineIndex": 1
}];
var dicClass={
    '开':'rect close_state',//'rect open_state',
    '关':'rect open_state',//'rect close_state',
    '故障':'rect fault_state',
    '不定':'rect indefinite_state'
}


var objects1 = [{
    "id": 1,
    "name": "1#",
    "type": "CSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": 1
    }],
    "lineIndex": 1
},{
    "id": 2,
    "name": "2#",
    "type": "CSP",
    "dataType": "STATE",
    "values": [{
        "time": "2017-04-18 0:00:00",
        "value": 0
    }],
    "lineIndex": 1
}]
var chart = new chart('#chart', option);
chart.draw(objects,dicClass);

