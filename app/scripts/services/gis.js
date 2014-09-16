'use strict';

angular.module('grantsApp')
	.constant('grantsJsonUrl', 'data/grants.json')
	.service('GISDataService', ['$http', '$q', 'grantsJsonUrl', function($http, $q, grantsJsonUrl){
			// AngularJS will instantiate a singleton by calling "new" on this function
		var GISDataService = {};
		GISDataService.grantsRequestSent = false;
	
		
		GISDataService.grantRecords = [];
		
		GISDataService.getAllGrants = function(){
			if(!angular.isUndefined(GISDataService.deferredgrantRecordsRequest)){
				return GISDataService.deferredgrantRecordsRequest.promise;
			}
			
			GISDataService.deferredgrantRecordsRequest = $q.defer();

			if(!GISDataService.grantRecords.length > 0){
				GISDataService.grantsRequestSent = true;
				$http.get(discretionaryFundsCsvUrl)
				.success(function(data){
					GISDataService.grantRecords = csvParser.csvToArray(data, ",");

					// Extracting Headers
					GISDataService.headers = GISDataService.grantRecords.splice(0, 1);

					GISDataService.deferredgrantRecordsRequest.resolve(data);
				});
			}else{
				GISDataService.deferredgrantRecordsRequest.resolve(GISDataService.grantRecords);
			}
			return GISDataService.deferredgrantRecordsRequest.promise;
		}

		return GISDataService;
	}]);