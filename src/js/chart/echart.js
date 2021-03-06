/**
 * Create by benjamin at 2014/7/4
 * echarts main script
 */
angular.module("ui.website.chart",[])
    .service('ChartService', [function(){
        /**
         * highcharts 类型
         * @type
         * @deprecated 不在支持highcharts类型
         */
        var defaultHighchartOptionsMap = {
            // 平滑曲线图
            pline: {
                chart: {
                    type: 'spline',
                    margin:[30,20,65,20]
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    gridLineWidth: 0,
                    //categories: arr_time_key,
                    categories: [],
                    lineColor: '#bababa',
                    type: 'datetime',
                    tickmarkPlacement:'on',
                    labels: {
                        style: { fontSize: '14px'},
                        y:20
                    }
                },
                yAxis: {
                    title: {
                        text: '',
                        style: {
                            color: '#bababa',//颜色
                            fontSize:'14px'  //字体
                        }
                    },
                    lineColor: '#bababa',
                    labels: {
                        enabled:false,
                        style: { fontSize: '14px' }
                    },
                    plotLines: [{
                        value: 0,
                        width: 0,
                        color: '#808080'
                    }],
                    tickPixelInterval: 30,
                    lineWidth: 0,
                    tickWidth: 0,
                    gridLineColor: '#efefef'
                },
                tooltip: {
                    //crosshairs: true,
                    shared: true,
                    valueSuffix: '',
                    borderWidth:1,
                    borderColor: '#8b8b8b',
                    useHTML:true,
                    crosshairs: {
                        width: 1,
                        color: 'gray',
                        dashStyle: 'shortdot'
                    },
                    formatter: function(){
                        return '';
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: false
                        },
                        enableMouseTracking: true,
                        lineColor:"#47a6ff"
                    },
                    series: {
                        marker: {
                            symbol: 'circle'
                        }
                    }
                },
                legend :  {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                    borderWidth: 0
                },
                credits : {
                    enabled:false//不显示highCharts版权信息
                },
                series: [{
                    name:'',
                    data: []
                }]
            }
        };

        var defaultEChartOptionsMap = {
            line: {
                title: {
                    text: ''
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:[]
                },
                toolbox: {
                    show: false
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : []
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [

                ]
            },
            bar: {
                "title":{
                    "x":"center"
                },
                "tooltip":{
                    "borderWidth":1,
                    "borderColor":"#8b8b8b",
                    "backgroundColor":"#ffffff",
                    "textStyle":{
                        "color":"#333333"
                    },
                    "trigger":"item",
                    "formatter":"{b} : {c}%"
                },
                "calculable":false,
                "grid":{
                    "borderWidth":0,
                    "x":'3%',
                    "y":20,
                    "y2":50,
                    "width":"94%"
                },
                "xAxis":[
                    {
                        "show":true,
                        "type":"category",
                        "data":[],
                        "splitLine":{
                            "show":true,
                            "lineStyle":{
                                "color":"white",
                                "width":10
                            }
                        },
                        "axisLabel":{
                            "show":true,
                            "interval":"0",
                            "margin":15
                        },
                        "axisLine":{
                            "show":true,
                            "lineStyle":{
                                "color":"#d2d2d2",
                                "width":1
                            }
                        },
                        "axisTick":{
                            "onGap":null,
                            "lineStyle":{
                                "color":"#d2d2d2"
                            }
                        }
                    }
                ],
                "yAxis":[
                    {
                        "type":"value",
                        "show":false
                    }
                ],
                "series":[

                ]
            },
            /**
             * 饼图
             */
            'pie': {
                legend: {
                    orient: 'horizontal',
                    y: 'bottom',
                    data: []
                },
                tooltip : {
                    trigger: 'item',
                    borderWidth:1,
                    borderColor: '#8b8b8b',
                    backgroundColor:"#ffffff",
                    textStyle:{
                        color:'#333333'
                    },
                    formatter: function (params) {
                        var res = params.name + ': '+Number(params.percent).toFixed(1) + '%'
                        return res;
                    }
                },
                //重点参数，去除圆饼图的上下空白圈
                calculable : false,
                series : [
                    {
                        name: '',
                        type: 'pie',
                        //center: ['50%', '45%'],
                        //radius: ['50', '80'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                }
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    position: 'center',
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            }
                        }
                        ,
                        data: []
                    }]
            }
        };

        return {
            getInstance: function(dom, chart, chartType){
                if(!chart){
                    if(chartType == 'echarts'){
                        return echarts.init(dom);
                    } else if(chartType == 'highcharts'){
                        return $(dom).highcharts();
                    }
                } else if(defaultEChartOptionsMap.hasOwnProperty(chart)){
                    return echarts.init(dom);
                }else if(defaultHighchartOptionsMap.hasOwnProperty(chart)){
                    return highcharts.init(dom);
                }
            },
            getOption: function(chart, originalData, style, formatter, config){
                if(!chart){
                    return originalData;
                }
                var option = angular.copy(defaultEChartOptionsMap[chart]);

                if(formatter()){
                    option.tooltip.formatter = formatter();
                }

                var y = originalData.data;
                var x = originalData.category;
                if(config.limit > 0 && x.length > config.limit){
                    x = x.slice(0, config.limit);
                    //y = y.slice(0, config.limit);
                }
                var series = [];
                if(chart == 'bar'){
                    for(var j = 0; j < y.length; j++){
                        var yAxisDatas = [];
                        var perData = y[j];
                        var formatData = [];
                        var seriesItem = {
                            name: '',
                            type: chart,
                            barWidth: 30,
                            data:[]
                        }
                        if(config.limit > 0 && x.length > config.limit){
                            perData = perData.slice(0, config.limit);
                            //y = y.slice(0, config.limit);
                        }
                        for(var i = 0; i < perData.length; i++){
                            var item = {
                                name: x[i],
                                data: perData[i]
                            }
                            formatData.push(item);
                        }
                        // array 浅copy一份
                        var sortForColor = config && config.sortForColor;
                        var color = style && style.color && style.color.length >= y.length && style.color[0].length >= perData.length;
                        if(sortForColor && color){
                            var formatDataCopy = formatData.concat();
                            formatDataCopy.sort(function(a, b){
                                return Number(b.data) - Number(a.data);
                            });
                            for(var i = 0; i < formatDataCopy.length; i++){
                                formatDataCopy[i].color = style.color[j][i];
                            }
                            //formatData = formatDataCopy;
                        }

                        for(var i = 0 ; i < formatData.length; i++){
                            var yAxisDataItem = {
                                "value": formatData[i].data,
                                "name": formatData[i].name,
                                "itemStyle":{
                                    "normal":{
                                        //"color":formatData[i].color,
                                        "label":{
                                            "show":true,
                                            "position":"top",
                                            "formatter":"{c}%",
                                            "textStyle":{
                                                "color":"#37a3fd"
                                            }
                                        },
                                        "labelLine":{
                                            "show":false
                                        }
                                    },
                                    //    ,
                                    "emphasis":{
                                        "label":{
                                            "show":true,
                                            "position":"top",
                                            "formatter":"{c}%",
                                            "textStyle":{
                                                "color":"#37a3fd"
                                            }
                                        }
                                    }
                                }
                            };
                            if(formatData[i].color){
                                yAxisDataItem.itemStyle.normal.color = formatData[i].color;
                            }
                            yAxisDatas.push(yAxisDataItem);
                        }
                        seriesItem.data = yAxisDatas;
                        series.push(seriesItem);
                    }

                    option.series = series;
                    option.xAxis[0].data = originalData.category;
                    if(style.orientation === 'vertical'){
                        var temp = option.yAxis;
                        option.yAxis = xAxis;
                        option.xAxis = temp;
                    }
                    return option;
                }else if(chart == 'line'){
                    for(var j = 0; j < y.length; j++){
                        var yAxisDatas = [];
                        var perData = y[j];
                        var formatData = [];
                        var seriesItem = {
                            name: '',
                            type: chart,
                            data:[]
                        }

                        for(var i = 0; i < perData.length; i++){
                            var item = {
                                name: x[i],
                                data: perData[i]
                            }
                            formatData.push(item);
                        }

                        for(var i = 0 ; i < formatData.length; i++){
                            var yAxisDataItem = {
                                "value": formatData[i].data,
                                "name": formatData[i].name
                                //"itemStyle":{
                                //    "normal":{
                                //        "label":{
                                //            "show":true,
                                //            "position":"top",
                                //            "formatter":"{c}%",
                                //            "textStyle":{
                                //                "color":"#37a3fd"
                                //            }
                                //        },
                                //        "labelLine":{
                                //            "show":false
                                //        }
                                //    },
                                //    //    ,
                                //    "emphasis":{
                                //        "label":{
                                //            "show":true,
                                //            "position":"top",
                                //            "formatter":"{c}%",
                                //            "textStyle":{
                                //                "color":"#37a3fd"
                                //            }
                                //        }
                                //    }
                                //}
                            };
                            yAxisDatas.push(yAxisDataItem);
                        }
                        if(style && style.color && style.color.length >= y.length){
                            var itemStyle = {
                                "normal":{
                                    color: style.color[j],
                                }
                            };
                            seriesItem.lineStyle = itemStyle;
                        }
                        seriesItem.data = yAxisDatas;
                        series.push(seriesItem);
                    }

                    option.series = series;
                    option.xAxis[0].data = originalData.category;
                    return option;
                }else if (chart == 'pie'){

                    for(var j =0 ; j< y.length; j++){
                        var yAxisDatas = [];
                        var yDataItem = y[j];
                        if(!yDataItem || yDataItem.length != x.length){
                            throw new Error('Data error, check your data please');
                        }
                        for(var i = 0 ; i < x.length; i++){
                            var yAxisDataItem = {
                                name: x[i],
                                value: y[j][i],
                                itemStyle: {
                                    normal: {
                                        //color: style.color[i % style.color.length]
                                    },
                                    emphasis: {
                                        label: {
                                            show:false
                                        }
                                    }
                                }
                            };
                            if(style.color && style.color.length >= y.length && style.color[0].length >= x.length){
                                yAxisDataItem.itemStyle.normal.color = style.color[j][i];
                            }
                            yAxisDatas.push(yAxisDataItem);
                        }
                        option.series[j].data = yAxisDatas;
                        option.legend.data = originalData.category;
                        if(style && style.center && style.center.length >= y.length){
                            option.series[j].center = style.center[j];
                        }
                        if(style && style.radius && style.radius.length >= y.length){
                            option.series[j].radius = style.radius[j];
                        }
                        return option;
                    }
                }
            }
        }
    }])
    .directive('chart', ['ChartService', function(ChartService){
        var defaultConfig = {
            // 是否显示loading画面
            showLoading: true,
            // 是否按照颜色值排序
            sortForColor: false,
            // 是否限制显示
            limit: -1,
            // 没有数据时的提示
            noDataTemplateUrl: 'templates/echarts/no-data.html'
        };
        // 默认的样式
        var defaultStyle = {

            bar: {
                //color: ["#03a7e5","#03a7e5","#1db5ee","#1db5ee","#42ccff","#42ccff","#7ddcff","#7ddcff","#a6e7ff","#a6e7ff","#a6e7ff"],
                orientation: 'horizontal'
            },
            pie: {
                //color: ["#42ccff", "#fbd444"]
            }
        }
        return {
            restrict: 'A',
            scope: {
                // 何种类型的图表 bar line pie or 自定义option
                chart: '@',
                // echarts HightCharts
                //chartType: '@',
                config: '@',
                // 数据 格式: {category:[], data:[[],[],[]]}
                data: '=',
                eventType: '@',
                eventHandler: '&',
                chartStyle: '@',
                tooltipFormatter: '&'
            },
            templateUrl: 'website-ui/chart/no-data.html',
            replace: false,
            compile: function(templateEle, templateAttrs){
                return function(scope, ele, attrs, ctrls){
                    //console.log(scope)
                    var computedStyle = window.getComputedStyle(ele[0]);
                    var height = computedStyle.getPropertyValue('height')
                    //没有设置height高度
                    if(height == '0px'){
                        ele.css({
                            height: '200px'
                        });
                    }
                    var config_ = {};
                    var style_ = {};
                    try{
                        if(scope.config){
                            config_ = JSON.parse(scope.config);
                        }
                        if(scope.chartStyle){
                            style_ = JSON.parse(scope.chartStyle);
                        }

                    } catch (e){

                    }
                    var config = angular.extend({}, defaultConfig, config_);
                    var style = defaultStyle[scope.chart];
                    var style_extend = angular.extend({}, style, style_);
                    var chartType;
                    if(attrs.hasOwnProperty('echarts')){
                        chartType = 'echarts';
                    }
                    var chart_dom = ele.find('div').find('div')[0];
                    //alert(chart_dom.id);
                    var chartInstance = ChartService.getInstance(chart_dom, scope.chart, chartType);
                    if(scope.eventType && scope.eventHandler){
                        chartInstance.on(scope.eventType, function(param){
                            scope.eventHandler()(param);
                            //alert('a');
                        });
                        console.log('绑定事件成功');
                    }
                    if(config.showLoading){
                        chartInstance.showLoading();
                    }
                    scope.$watch('data', function(newValue, oldValue){
                        if(newValue){
                            try{
                                var option = ChartService.getOption(scope.chart, newValue, style_extend, scope.tooltipFormatter, config);
                                chartInstance.hideLoading();
                                chartInstance.setOption(option);
                                scope.noData = false;
                                //scope.noData = true;
                            }catch (e){
                                console.error(e.message);
                                chartInstance.hideLoading();
                                scope.noData = true;
                            }
                        }
                    });
                }
            }
        }
}]).run(['$templateCache', function($templateCache){
    var template = [];
    template.push('<div style="position: relative;height: 100%;">');
    template.push('<div style="height: 100%; width: 100%;">');
    template.push('</div>');
    template.push('<div ng-if="noData" style="height: 100%; width: 100%; position: absolute; left: 0;top: 0;;">暂无数据</div></div>');
    $templateCache.put('website-ui/chart/no-data.html', template.join(''));
}])