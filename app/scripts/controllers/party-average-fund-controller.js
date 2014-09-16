'use strict';

angular.module('discretionaryFunds')
	.controller('partyAverageFundController', ['$scope', 'FundRecords', function($scope, FundRecords){
		$scope.filteredBarChartDataTableArray = [];
		$scope.filteredDataTableArray = [];
		$scope.FundRecords = FundRecords.getAll().then(function(data){
			// Fiscal Years
			$scope.currentFiscalYear = FundRecords.getLatestFiscalYear();
			$scope.availableFiscalYears = FundRecords.getFiscalYears();

			// Pie Chart Data Table
			$scope.dataTableArray = FundRecords.getPartyAveragesPerFiscalYear($scope.currentFiscalYear, $scope.filteredPartiesMultiSelectModel, $scope.filteredSectorsMultiSelectModel);

			// Party Average Funds Bar Chart
			$scope.filteredBarChartDataTableArray = FundRecords.getBarChartDataTableArray();
		});

		// Fiscal Year Change Functionality
		$scope.isPillActive = function(fiscalYear){
			return{
				active: angular.isUndefined($scope.currentFiscalYear) ? fiscalYear == '2012-13' : fiscalYear == $scope.currentFiscalYear
			}
		}
		
		$scope.changeFiscalYear = function(fiscalYear){
			$scope.currentFiscalYear = fiscalYear;
		}

		// Fiscal Year Watch
		$scope.$watch('currentFiscalYear', function(changedFiscalYear){
			if(angular.isString(changedFiscalYear))
				$scope.dataTableArray = FundRecords.getPartyAveragesPerFiscalYear(changedFiscalYear, $scope.filteredPartiesMultiSelectModel, $scope.filteredSectorsMultiSelectModel);
		});
		// END - Fiscal Year Change Functionality

		$scope.updateFilteredDataTableArrays = function(){
			// Party Pie Chart
			if(angular.isArray($scope.filteredPartiesMultiSelectModel) && angular.isString($scope.currentFiscalYear) && $scope.filteredSectorsMultiSelectModel.length){
				$scope.filteredDataTableArray = FundRecords.getPartyAveragesPerFiscalYear( 
					$scope.currentFiscalYear, 
					$scope.filteredPartiesMultiSelectModel,
					$scope.filteredSectorsMultiSelectModel,
					$scope.filteredRegionsMultiSelectModel,
					$scope.filteredConstituenciesMultiSelectModel
				);
			}

			// Party Bar Chart
			if(angular.isArray($scope.filteredPartiesMultiSelectModel) && $scope.filteredSectorsMultiSelectModel.length){
				$scope.filteredBarChartDataTableArray = FundRecords.getBarChartDataTableArray( 
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
		$scope.$watch('dataTableArray', $scope.updateFilteredDataTableArrays);
	}]);
