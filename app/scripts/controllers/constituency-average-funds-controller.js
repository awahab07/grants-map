'use strict';

angular.module('discretionaryFunds')
	.controller('constituencyAverageFundsController', ['$scope', 'FundRecords', function($scope, FundRecords){
		$scope.filteredBarChartDataTableArray = [];

		$scope.constituenciesMultiSelectModel = [];
		$scope.filteredConstituenciesMultiSelectModel = [];
		
		$scope.FundRecords = FundRecords.getAll().then(function(data){
			// Local Constituencies Multi Select Model
			$scope.constituenciesMultiSelectModel = FundRecords.getConstituenciesMultiSelectModel(10); // With pre select 10 elements
		});

		// Will be used to avoid frequent service calls
		var serviceCalledAt = null;
		function isAppropriateToCallService(){
			if(!serviceCalledAt){
				serviceCalledAt = new Date().getTime();
				return true;
			}else if( (new Date().getTime() - serviceCalledAt) >= 500){
				return true;
			}
			return false;
		}

		$scope.updateFilteredDataTableArrays = function(){
			// Party Bar Chart
			if(isAppropriateToCallService())
			if(angular.isArray($scope.filteredPartiesMultiSelectModel) && $scope.filteredSectorsMultiSelectModel.length && angular.isArray($scope.filteredRegionsMultiSelectModel) && angular.isArray($scope.filteredConstituenciesMultiSelectModel)){
				$scope.filteredBarChartDataTableArray = FundRecords.getBarChartConstituenciesArray( 
					$scope.filteredPartiesMultiSelectModel,
					$scope.filteredSectorsMultiSelectModel,
					$scope.filteredRegionsMultiSelectModel,
					$scope.filteredConstituenciesMultiSelectModel
				);
			}
		}

		// Watches
		// Parties Filtering and Fiscal year Selectlion Watches
		$scope.$watch('filteredPartiesMultiSelectModel', $scope.updateFilteredDataTableArrays);
		$scope.$watch('filteredSectorsMultiSelectModel', $scope.updateFilteredDataTableArrays);
		$scope.$watch('filteredRegionsMultiSelectModel', $scope.updateFilteredDataTableArrays);
		$scope.$watch('filteredConstituenciesMultiSelectModel', $scope.updateFilteredDataTableArrays);
	}]);
