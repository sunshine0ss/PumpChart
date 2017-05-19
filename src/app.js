// var chart = require('chart');

var option = {
    padding: {
        top: 20,
        left: 50,
        bottom: 30,
        right: 20
    },
    edit: true
        //showCurrent: false
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
    "lineIndex": 1
}];
var chart = new chart('#chart', option);
chart.draw(objects);

$("#inputBtn").on('click', function() {
    chart.getData();
})



// require(['moment','./chart/linechart','./chart/pump',
// 		'./chart/hydrochart','./chart/chart','jquery','jquery-migrate','bootstrap'
// 		//'jquery-ui','angular','ui-bootstrap',
//  		// 'angular-animate','angular-touch','angular-sanitize',
// 		],
//  function(moment,linechart,pump,hydroChart,chart){

// 	// var lineOption = {
// 	// 	element: '#chart',
// 	// 	series:[],
// 	// 	width:900,
// 	// 	height:500,
// 	// 	margin : {
//  //                top: 20,
//  //                right: 20,
//  //                bottom: 30,
//  //                left: 50
//  //            },
// 	// 	data:[{time: "2014-01-01", value: 3840,},
// 	// 	  {time: "2015-01-01", value: 1600},
// 	// 	  {time: "2016-01-01", value:  640},
// 	// 	  {time: "2017-01-01", value:  320}]
// 	// 	}
// 	// var lineChart = linechart(lineOption);
//  // $("#date").inputmask("datetime");

// 	var option = {
//         padding: {
//             top: 20,
//             left: 50,
//             bottom: 30,
//             right: 20
//         },
//         edit:true
//         //showCurrent: false
//     }
// 	var objects=[{"id":17,"name":"增压1#","type":"CSP","dataType":"STATE","values":[{"time":"2017-04-18 0:00:00","value":1},{"time":"2017-04-18 6:00:00","value":0},{"time":"2017-04-18 14:00:00","value":1},{"time":"2017-04-18 21:00:00","value":-1}],"lineIndex":5},
// 			 	{"id":13,"name":"西山1#","type":"CSP","dataType":"STATE","values":[{"time":"2017-04-18 0:00:00","value":0},{"time":"2017-04-18 2:00:00","value":1},{"time":"2017-04-18 6:00:00","value":0},{"time":"2017-04-18 12:00:00","value":-31},{"time":"2017-04-18 20:00:00","value":1}],"lineIndex":4},
// 			 	{"id":18,"name":"增压2#","type":"CSP","dataType":"STATE","values":[{"time":"2017-04-18 0:00:00","value":1},{"time":"2017-04-18 3:00:00","value":1},{"time":"2017-04-18 10:00:00","value":0},{"time":"2017-04-18 15:00:00","value":-1}],"lineIndex":4},
// 			 	{"id":14,"name":"西山2#","type":"RSP","dataType":"STATE","values":[{"time":"2017-04-18 0:00:00","value":150},{"time":"2017-04-18 5:00:00","value":-12},{"time":"2017-04-18 12:00:00","value":0},{"time":"2017-04-18 14:00:00","value":13}],"lineIndex":3},
// 			 	{"id":19,"name":"增压3#","type":"CSP","dataType":"STATE","values":[{"time":"2017-04-18 0:00:00","value":0},{"time":"2017-04-18 2:00:00","value":1},{"time":"2017-04-18 6:00:00","value":0},{"time":"2017-04-18 10:00:00","value":1}],"lineIndex":3},
// 			 	{"id":15,"name":"西山3#","type":"CSP","dataType":"STATE","values":[{"time":"2017-04-18 0:00:00","value":1},{"time":"2017-04-18 2:00:00","value":1},{"time":"2017-04-18 4:00:00","value":0},{"time":"2017-04-18 12:00:00","value":1}],"lineIndex":2},
// 			 	{"id":20,"name":"增压4#","type":"CSP","dataType":"STATE","values":[{"time":"2017-04-18 0:00:00","value":0},{"time":"2017-04-18 5:00:00","value":1},{"time":"2017-04-18 10:00:00","value":0},{"time":"2017-04-18 13:00:00","value":1}],"lineIndex":2},
// 			 	{"id":16,"name":"西山4#","type":"CSP","dataType":"STATE","values":[{"time":"2017-04-18 0:00:00","value":1},{"time":"2017-04-18 8:00:00","value":-20},{"time":"2017-04-18 12:00:00","value":0},{"time":"2017-04-18 20:00:00","value":1}],"lineIndex":1},
// 			 	{"id":21,"name":"增压5#","type":"CSP","dataType":"STATE","values":[{"time":"2017-04-18 0:00:00","value":null},{"time":"2017-04-18 4:00:00","value":-1},{"time":"2017-04-18 10:00:00","value":1},{"time":"2017-04-18 18:00:00","value":0}],"lineIndex":1}];
//  	var chart=new chart('#chart',option);
//  	chart.draw(objects);

// 	$("#inputBtn").on('click',function(){
// 		chart.getData();
// 	})   


//  	// $("#inputBtn").popover({   
//   //               trigger:'click',//manual 触发方式  
//   //               placement : 'top',    
//   //               html: 'true',   
//   //               content : '<input type="number" id="pumpvalue" name="pumpvalue" style="width: 50px"><button style="height: 26px;width: 25px;margin: 0px;padding: 0px;" onclick="btnClick()">关</button>',  //这里可以直接写字符串，也可以 是一个函数，该函数返回一个字符串；  
//   //               animation: false  
//   //           })   


// 	// $("[data-toggle='popover']").popover();
// 	// var pump=new pump('#pump',option);
//  // 	pump.draw(objects);

// 	// var objectValues=[
// 	// 			{"id":17,"name":"增压1#","type":"CSP","dataType":"STATE","seriesType":"pump","values":[{"time":"2017-04-18 0:00:00","value":1},{"time":"2017-04-18 1:00:00","value":0},{"time":"2017-04-18 4:00:00","value":1},{"time":"2017-04-18 6:00:00","value":1},{"time":"2017-04-18 13:00:00","value":0},{"time":"2017-04-18 16:00:00","value":1}],"lineIndex":5},
// 	// 		 	{"id":13,"name":"西山1#","type":"CSP","dataType":"STATE","seriesType":"pump","values":[{"time":"2017-04-18 0:00:00","value":0},{"time":"2017-04-18 10:00:00","value":1},{"time":"2017-04-18 12:00:00","value":0},{"time":"2017-04-18 16:00:00","value":1},{"time":"2017-04-18 18:00:00","value":0},{"time":"2017-04-18 23:00:00","value":1}],"lineIndex":4},
// 	// 		 	{"id":18,"name":"增压2#","type":"CSP","dataType":"STATE","seriesType":"pump","values":[{"time":"2017-04-18 0:00:00","value":1},{"time":"2017-04-18 8:00:00","value":1},{"time":"2017-04-18 14:00:00","value":0},{"time":"2017-04-18 23:00:00","value":1}],"lineIndex":4},
// 	// 		 	{"id":14,"name":"西山2#","type":"CSP","dataType":"STATE","seriesType":"pump","values":[{"time":"2017-04-18 0:00:00","value":1},{"time":"2017-04-18 2:00:00","value":1},{"time":"2017-04-18 12:00:00","value":0},{"time":"2017-04-18 21:00:00","value":1}],"lineIndex":3},
// 	// 		 	{"id":19,"name":"增压3#","type":"CSP","dataType":"STATE","seriesType":"pump","values":[{"time":"2017-04-18 0:00:00","value":0},{"time":"2017-04-18 4:00:00","value":1},{"time":"2017-04-18 12:00:00","value":0},{"time":"2017-04-18 19:00:00","value":1}],"lineIndex":3},
// 	// 		 	{"id":15,"name":"西山3#","type":"CSP","dataType":"STATE","seriesType":"pump","values":[{"time":"2017-04-18 0:00:00","value":1},{"time":"2017-04-18 10:00:00","value":1},{"time":"2017-04-18 14:00:00","value":0},{"time":"2017-04-18 18:00:00","value":1}],"lineIndex":2},
// 	// 		 	{"id":20,"name":"增压4#","type":"CSP","dataType":"STATE","seriesType":"pump","values":[{"time":"2017-04-18 0:00:00","value":0},{"time":"2017-04-18 6:00:00","value":1},{"time":"2017-04-18 12:00:00","value":0},{"time":"2017-04-18 20:00:00","value":1}],"lineIndex":2},
// 	// 		 	{"id":21,"name":"增压5#","type":"CSP","dataType":"STATE","seriesType":"pump","values":[{"time":"2017-04-18 0:00:00","value":0},{"time":"2017-04-18 3:00:00","value":1}],"lineIndex":1},
// 	// 		 	// {"id":16,"name":"西山4#","type":"CSP","dataType":"STATE","seriesType":"line","seriesHeight":"60","values":[{"time":"2017-04-18 0:00:00","value":10},{"time":"2017-04-18 1:00:00","value":150},{"time":"2017-04-18 4:00:00","value":180},{"time":"2017-04-18 8:00:00","value":80},{"time":"2017-04-18 15:00:00","value":50},{"time":"2017-04-18 20:00:00","value":100}],"lineIndex":1}
// 	// 		 	]

// 	// var hydroChart=new hydroChart('#hydroChart',option)
//  // 	hydroChart.draw(objectValues);

// })
// // function btnClick(){
// // 	alert('a');
// // }