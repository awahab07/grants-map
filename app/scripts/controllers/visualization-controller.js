'use strict';

angular.module('discretionaryFunds')
	.controller('visualizationController', ['$scope', '$location', 'FundRecords', function($scope, $location, FundRecords){
		$scope.isVisualizationNavActive = function(currentRoute){
			return {
				'active': $location.path() == currentRoute
			}
		}
	}]);
