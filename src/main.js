/// This is the main entry point of the site.
/// Make sure this file has been refered in app.html before other js file.

(function(window) {
    'use strict';

    // 初始化 RequireJS
    requirejs.config({
        baseUrl: '/',
        paths: {
            /* 定义第三方组件库 */
            'jquery':'assets/vendor/jquery-2.1.3.min',//'assets/vendor/jquery/dist/jquery.min',//
            'jquery-migrate':'assets/vendor/jquery-migrate-1.2.1.min',//'assets/vendor/jquery/dist/jquery.min',//解决版本差异
            // 'inputmask': 'assets/vendor/jquery/dist/jquery.inputmask',
            'lodash': 'assets/vendor/lodash/dist/lodash.min',
            'd3': 'assets/vendor/d3/d3.min',
            'moment':"assets/vendor/moment/min/moment-with-locales.min",
            'bootstrap':"assets/vendor/bootstrap/js/bootstrap.min",


            'drawArea': 'component/drawArea',
            'axis': 'component/axis',
            'pumpLine': 'component/pumpLine',
            'pumpText': 'component/pumpText',
            'text': 'component/text',
            'handle':'component/handle',
            'timeLine': 'component/timeLine',
            'timeText': 'component/timeText',
            'button': 'component/button',
            'legend': 'component/legend',
            'stateBlock': 'component/pumpBlocks/stateBlock',
            'numericBlock': 'component/pumpBlocks/numericBlock',
            'undefineBlock': 'component/pumpBlocks/undefineBlock',

        },
        packages: [{
            name: 'moment',
            location: 'assets/vendor/moment',
            main: 'moment'
        }],
        shim: {
            bootstrap: ['jquery'],
            'jquery-migrate':['jquery']
        },
        map: {
            '*': {
                'css': '../../assets/vendor/require-css/css'
            }
        },
        deps: [ ],

        /* TODO：在正式上线前需要移除这行代码 */
        //urlArgs: 'bust=' + (new Date()).getTime()
    });

    /// 全局初始化 ///
    requirejs(['moment', 'moment/locale/zh-cn', 'app'],
        function(moment) {
            moment.locale('zh-cn');
        });

})(window);