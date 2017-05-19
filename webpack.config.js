'use strict';

const webpack = require("webpack");
const path = require("path");

module.exports = {
    context: __dirname + "/src",
    entry: {
        chart: "./chart/chart.js",
    },
    output: {
        path: __dirname + "/src/dist",
        //filename: "[name].bundle.[hash].js",//封装提供给别人
        filename: "[name].bundle.js",//调试用
        libraryTarget: 'umd',
        umdNamedDefine: true        
    },
    resolve: {
        alias: {
            'drawArea': path.join(__dirname, '/src/component/drawArea'),
            'axis': path.join(__dirname, '/src/component/axis'),
            'pumpLine': path.join(__dirname, '/src/component/pumpLine'),
            'pumpText': path.join(__dirname, '/src/component/pumpText'),
            'text': path.join(__dirname, '/src/component/text'),
            'handle': path.join(__dirname, '/src/component/handle'),
            'timeLine': path.join(__dirname, '/src/component/timeLine'),
            'timeText': path.join(__dirname, '/src/component/timeText'),
            'button': path.join(__dirname, '/src/component/button'),
            'legend': path.join(__dirname, '/src/component/legend'),
            'stateBlock': path.join(__dirname, '/src/component/pumpBlocks/stateBlock'),
            'numericBlock': path.join(__dirname, '/src/component/pumpBlocks/numericBlock'),
            'undefineBlock': path.join(__dirname, '/src/component/pumpBlocks/undefineBlock'),
            'gradientBlock': path.join(__dirname, '/src/component/pumpBlocks/gradientBlock')
        }
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false,
        //         drop_console: false,
        //     }
        // }),
    ],//压缩
    externals: {
        jQuery: 'jQuery',
        d3: 'd3',
        lodash: '_',
        moment: 'moment',
        // bootstrap: 'bootstrap'
    }
};