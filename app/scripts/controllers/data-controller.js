'use strict';

angular.module('discretionaryFunds')
.controller('dataController', ['$scope', 'FundRecords', function($scope, FundRecords){
	$scope.partiesMultiSelectModel = []
	$scope.filteredPartiesMultiSelectModel = [];
	
	$scope.sectorsMultiSelectModel = [];
	$scope.filteredSectorsMultiSelectModel = [];

	$scope.regionsMultiSelectModel = [];
	$scope.filteredRegionsMultiSelectModel = [];
	
	$scope.constituenciesMultiSelectModel = [];
	$scope.filteredConstituenciesMultiSelectModel = [];

	$scope.FundRecords = FundRecords.getAll().then(function(data){
		// Initializations

		// Populating Multi Select Models
		$scope.partiesMultiSelectModel = FundRecords.getPartiesMultiSelectModel();
		$scope.sectorsMultiSelectModel = FundRecords.getFilteredSectorsMultiSelectModel();
		$scope.regionsMultiSelectModel = FundRecords.getRegionsMultiSelectModel();
		$scope.constituenciesMultiSelectModel = FundRecords.getConstituenciesMultiSelectModel();
	});
}]);