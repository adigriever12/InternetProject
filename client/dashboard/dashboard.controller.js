(function() {
    'use strict';

    angular.module('dashboard')
        .controller('dashboardController', dashboardController);

    dashboardController.$inject = ['dashboardService', '$sce'];
    function dashboardController(dashboardService, $sce) {

        var vm = this;

        dashboardService.connectedScreens().then(function(response) {
            vm.connectedScreens = response;
        });
        
        dashboardService.getMessages().then(function(response) {
            vm.messages = response;
            vm.totalMessages = vm.messages.length;
            createCharts();
        });

        function createCharts() {
            var pieContent = [{ label: "Sunday", value: 0 },
                { label: "Monday", value: 0 },
                { label: "Tuesday", value: 0 },
                { label: "Wednesday", value: 0 },
                { label: "Thursday", value: 0 },
                { label: "Friday", value: 0 },
                { label: "Saturday", value: 0 }];

            var barChartData = [];

            for(var message in vm.messages)
            {
                var data = {};
                data.index = message;
                data.name = vm.messages[message].name;
                data.screensNum = vm.messages[message].frames.length;
                barChartData.push(data);

                for(var frame in vm.messages[message].timeFrame) {

                    for(var day in vm.messages[message].timeFrame[frame].days){

                        var currentDay = vm.messages[message].timeFrame[frame].days[day];

                        var content = pieContent.filter(function(x) {
                            return x.label === currentDay;
                        }, currentDay)[0];

                        content.value++;
                    }
                }

            }

            createPie(pieContent);
            createBarChart(barChartData);

        };
        function createPie(pieContent){
            var pie = new d3pie("pie", {
                header: {
                    title: {
                        text: "messages"
                    },
                    location: "pie-center"
                },
                size: {
                    pieInnerRadius: "80%"
                },
                data: {
                    content: pieContent
                }
            });
        };

        function createBarChart(barChartData){
            var results,
                data = [];

            var valueLabelWidth = 40; // space reserved for value labels (right)
            var barHeight = 25; // height of one bar
            var barLabelWidth = 200; // space reserved for bar labels
            var barLabelPadding = 5; // padding between bar and bar labels (left)
            var gridLabelHeight = 18; // space reserved for gridline labels
            var gridChartOffset = 3; // space between start of grid and first bar
            var maxBarWidth = 420; // width of the bar with the max value
            
            results = d3.map( barChartData );
            results.forEach( function( key, val ) {
                var result = {};
                result.name = val.name;
                result.screensNum = val.screensNum;
                data.push( result );
            } );

            // accessor functions
            var barLabel = function(d) { return d['name']; };
            var barValue = function(d) { return parseFloat(d['screensNum']); };

            // scales
            var yScale = d3.scale.ordinal().domain(d3.range(0, data.length)).rangeBands([0, data.length * barHeight]);
            var y = function(d, i) { return yScale(i); };
            var yText = function(d, i) { return y(d, i) + yScale.rangeBand() / 2; };
            var x = d3.scale.linear().domain([0, d3.max(data, barValue)]).range([0, maxBarWidth]);
            
            // svg container element
            var chart = d3.select('#chart').append("svg")
                .attr('width', maxBarWidth + barLabelWidth + valueLabelWidth)
                .attr('height', gridLabelHeight + gridChartOffset + data.length * barHeight);
            
            // grid line labels
            var gridContainer = chart.append('g')
                .attr('transform', 'translate(' + barLabelWidth + ',' + gridLabelHeight + ')');
            gridContainer.selectAll("text").data(x.ticks(10)).enter().append("text")
                .attr("x", x)
                .attr("dy", -3)
                .attr("text-anchor", "middle")
                .text(String);
            
            // vertical grid lines
            gridContainer.selectAll("line").data(x.ticks(10)).enter().append("line")
                .attr("x1", x)
                .attr("x2", x)
                .attr("y1", 0)
                .attr("y2", yScale.rangeExtent()[1] + gridChartOffset)
                .style("stroke", "#ccc");
            
            // bar labels
            var labelsContainer = chart.append('g')
                .attr('transform', 'translate(' + (barLabelWidth - barLabelPadding) + ',' + (gridLabelHeight + gridChartOffset) + ')');
            labelsContainer.selectAll('text').data(data).enter().append('text')
                .attr('y', yText)
                .attr('stroke', 'none')
                .attr('fill', 'black')
                .attr("dy", ".35em") // vertical-align: middle
                .attr('text-anchor', 'end')
                .text(barLabel);
            
            // bars
            var barsContainer = chart.append('g')
                .attr('transform', 'translate(' + barLabelWidth + ',' + (gridLabelHeight + gridChartOffset) + ')');
            barsContainer.selectAll("rect").data(data).enter().append("rect")
                .attr('y', y)
                .attr('height', yScale.rangeBand() - 5)
                .attr('width', function(d) { return x(barValue(d)); })
                .attr('stroke', 'white')
                .attr('fill', '#3ab2d5');
            
            // bar value labels
            barsContainer.selectAll("text").data(data).enter().append("text")
                .attr("x", function(d) { return x(barValue(d)); })
                .attr("y", yText)
                .attr("dx", 3) // padding-left
                .attr("dy", ".35em") // vertical-align: middle
                .attr("text-anchor", "start") // text-align: right
                .attr("fill", "black")
                .attr("stroke", "none")
                .text(function(d) { return d3.round(barValue(d), 2); });
            
            // start line
            barsContainer.append("line")
                .attr("y1", -gridChartOffset)
                .attr("y2", yScale.rangeExtent()[1] + gridChartOffset)
                .style("stroke", "#000");

        };

    }
}());