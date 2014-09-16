'use strict';

angular.module('discretionaryFunds')
	// Pie Chart Visualization
	.directive('fafenChart', function () {
		return {
			require: 'ngModel',
			link: function postLink(scope, element, attrs, controller) {
				var chartSettings = {
					is3D: true
				}

				var getDataTable = function(){
					return controller.$viewValue;
				}
				
				var getOptions = function() {
	                return angular.extend({ }, chartSettings, scope.$eval(attrs.chartOptions));
	            };
				
				var initializeChart = function(dataTableArray){
					var chartOptions = getOptions();
					var dataTableArray = getDataTable();

					if(controller){
						if(angular.isArray(dataTableArray)){
							var dataTable = google.visualization.arrayToDataTable(dataTableArray);
							
							var drawVisualization = function() {
							  // Create and draw the visualization.
							  if(!angular.isUndefined(attrs.chartType)){
							  	switch(attrs.chartType){
							  		case 'bar':
							  			new google.visualization.BarChart(element[0]).draw(dataTable, chartOptions);
							  		break;

							  		default:
							  			new google.visualization.PieChart(element[0]).draw(dataTable, chartOptions);
							  	}
							  }else{
								new google.visualization.PieChart(element[0]).draw(dataTable, chartOptions);
							  }
							}

							controller.$render = function() {
		                        drawVisualization();
		                    };
						}

						controller.$render();
					}
				}

				scope.$watch(getDataTable, initializeChart);
			}
		};
	})
