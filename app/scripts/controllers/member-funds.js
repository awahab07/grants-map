'use strict';

angular.module('discretionaryFunds')
	.controller('memberFundsController', ['$scope', 'FundRecords', function($scope, FundRecords){
		$scope.filteredBarChartDataTableArray = [];

		$scope.membersMultiSelectModel = [];
		$scope.filteredMembersMultiSelectModel = [];
		
		$scope.FundRecords = FundRecords.getAll().then(function(data){
			// Local Constituencies Multi Select Model
			$scope.membersMultiSelectModel = FundRecords.getMembersMultiSelectModel(10); // With pre select 10 elements
		});

		// Will be used to avoid frequent service calls beause of multiple watches
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
				$scope.filteredBarChartDataTableArray = FundRecords.getBarChartMembersArray( 
					$scope.filteredPartiesMultiSelectModel,
					$scope.filteredSectorsMultiSelectModel,
					$scope.filteredRegionsMultiSelectModel,
					$scope.filteredConstituenciesMultiSelectModel,
					$scope.filteredMembersMultiSelectModel
				);
			}
		}

		// Watches
		// Parties Filtering and Fiscal year Selectlion Watches
		$scope.$watch('filteredPartiesMultiSelectModel', $scope.updateFilteredDataTableArrays);
		$scope.$watch('filteredSectorsMultiSelectModel', $scope.updateFilteredDataTableArrays);
		$scope.$watch('filteredRegionsMultiSelectModel', $scope.updateFilteredDataTableArrays);
		$scope.$watch('filteredConstituenciesMultiSelectModel', $scope.updateFilteredDataTableArrays);
		$scope.$watch('filteredMembersMultiSelectModel', $scope.updateFilteredDataTableArrays);
  }]);
