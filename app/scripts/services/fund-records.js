'use strict';

angular.module('discretionaryFunds')
	.constant('discretionaryFundsCsvUrl', 'data/discretionary-funds.csv')
	.service('FundRecords', ['$http', '$q', 'discretionaryFundsCsvUrl', 'csvParser', 'MultiSelectModelHelper', function($http, $q, discretionaryFundsCsvUrl, csvParser, modelHelper){
			// AngularJS will instantiate a singleton by calling "new" on this function
		var FundRecordsService = {};
		FundRecordsService.recordsRequestSent = false;
		FundRecordsService.headers = [];
		FundRecordsService.attributeIndices = {'region': 6, 'constituency_id': 7, 'constituency': 8, 'memberType': 9, 'memberName': 11, 'partyShortName': 13, 'fund': 14, 'fundStatus': 15, 'program': 16, 'sector': 17, 'projectDistrict': 18, 'projectArea': 19};
		
		FundRecordsService.records = [];
		FundRecordsService.parties = [];
		FundRecordsService.fiscalYears = [];
		FundRecordsService.constituencies = [];
		
		FundRecordsService.partiesMultiSelectModel = null;
		FundRecordsService.sectorsMultiSelectModel = null;
		FundRecordsService.regionsMultiSelectModel = null;
		FundRecordsService.constituenciesMultiSelectModel = null;
		FundRecordsService.membersMultiSelectModel = null;
		
		FundRecordsService.getAll = function(){
			if(!angular.isUndefined(FundRecordsService.deferredRecordsRequest)){
				return FundRecordsService.deferredRecordsRequest.promise;
			}
			
			FundRecordsService.deferredRecordsRequest = $q.defer();

			if(!FundRecordsService.records.length > 0){
				FundRecordsService.recordsRequestSent = true;
				$http.get(discretionaryFundsCsvUrl)
				.success(function(data){
					FundRecordsService.records = csvParser.csvToArray(data, ",");

					// Extracting Headers
					FundRecordsService.headers = FundRecordsService.records.splice(0, 1);

					FundRecordsService.deferredRecordsRequest.resolve(data);
				});
			}else{
				FundRecordsService.deferredRecordsRequest.resolve(FundRecordsService.records);
			}
			return FundRecordsService.deferredRecordsRequest.promise;
		}

		FundRecordsService.getPartyAveragesPerFiscalYear = function(queryFiscalYear, filteredPartyModels, filteredSectorModels, filteredRegionModels, filteredConstituencyModels){
			var allFiscalYears = FundRecordsService.getFiscalYears();
			if(!angular.isString(queryFiscalYear) || allFiscalYears.indexOf(queryFiscalYear) < 0){
				queryFiscalYear = allFiscalYears[allFiscalYears.length - 1];
			}
			
			if(!FundRecordsService.records.length > 0){
				FundRecordsService.getAll();
			}

			// Applying Filter Arrays
			var filteredMainRecords = modelHelper.applyModelFilter(FundRecordsService.records, 13, filteredPartyModels, "party");
			filteredMainRecords = modelHelper.applyModelFilter(filteredMainRecords, 17, filteredSectorModels, "sector");
			filteredMainRecords = modelHelper.applyModelFilter(filteredMainRecords, this.attributeIndices.region, filteredRegionModels, "region");
			filteredMainRecords = modelHelper.applyModelFilter(filteredMainRecords, this.attributeIndices.constituency_id, filteredConstituencyModels, "constituency_id");

			var uniquePartyFiscalYears = {};
			angular.forEach(filteredMainRecords, function(record){
				var partyShortName = record[13];
				var fiscalYear = record[4];
				if(queryFiscalYear == fiscalYear){
					var fund = parseFloat(record[14]);

					if(typeof uniquePartyFiscalYears[partyShortName] == 'undefined'){
						uniquePartyFiscalYears[partyShortName] = [];
					}

					// Inserting Fund
					uniquePartyFiscalYears[partyShortName].push(fund);
				}
			});

			var partyAverageFundsPerFiscalYearWithHeaders = [['Party', 'Average Fund (Million PKR)']];
			angular.forEach(uniquePartyFiscalYears, function(funds, party){
				var totalFund = 0.0;
				angular.forEach(funds, function(fund){
					totalFund += fund;
				});
				var averageFund = totalFund / funds.length;

				if (party != "undefined" && angular.isNumber(averageFund))
					partyAverageFundsPerFiscalYearWithHeaders.push([party, averageFund]);
			});

			return partyAverageFundsPerFiscalYearWithHeaders;
		}

		FundRecordsService.getBarChartDataTableArray = function(filteredPartyModels, filteredSectorModels, filteredRegionModels, filteredConstituencyModels){
			if(!FundRecordsService.records.length > 0){
				FundRecordsService.getAll();
			}

			var allFiscalYears = FundRecordsService.getFiscalYears();

			// Applying Filter Arrays
			var filteredMainRecords = modelHelper.applyModelFilter(FundRecordsService.records, 13, filteredPartyModels, "party");
			filteredMainRecords = modelHelper.applyModelFilter(filteredMainRecords, 17, filteredSectorModels, "sector");
			filteredMainRecords = modelHelper.applyModelFilter(filteredMainRecords, this.attributeIndices.region, filteredRegionModels, "region");
			filteredMainRecords = modelHelper.applyModelFilter(filteredMainRecords, this.attributeIndices.constituency, filteredConstituencyModels, "constituency");
			
			var uniquePartyFiscalYears = {};
			var allAvailableParties = [];
			angular.forEach(filteredMainRecords, function(record){
				// Filters
				var partyShortName = record[13];
				var sector = record[17];
				var fiscalYear = record[4];
				var fund = parseFloat(record[14]);

				if( typeof uniquePartyFiscalYears[fiscalYear] == 'undefined'){
					uniquePartyFiscalYears[fiscalYear] = {};
				}
				
				if( typeof uniquePartyFiscalYears[fiscalYear][partyShortName] == 'undefined'){
					uniquePartyFiscalYears[fiscalYear][partyShortName] = [];
				}

				// Available Parties
				if( allAvailableParties.indexOf(partyShortName) < 0 && !angular.isUndefined(partyShortName && partyShortName != "undefined")){
					allAvailableParties.push(partyShortName);
				}

				// Inserting Fund
				uniquePartyFiscalYears[fiscalYear][partyShortName].push(fund);
			});

			var partyAverageFundsBarChartDataTableArray = [];
			// Inserting Header
			var headerRow = ["Fiscal Year"];
			angular.forEach(allAvailableParties, function(availableParty){
				headerRow.push(availableParty);
			});
			partyAverageFundsBarChartDataTableArray.push(headerRow);
			
			// Inserting average fund values per fiscal year
			angular.forEach(uniquePartyFiscalYears, function(parties, fiscalYear){
				var fiscalYearRow = [fiscalYear];
				angular.forEach(allAvailableParties, function(availableParty){
					var totalFund = 0.0;
					var partyYearFunds = uniquePartyFiscalYears[fiscalYear][availableParty];
					angular.forEach(partyYearFunds, function(fund){
						totalFund += fund;
					});
					if(angular.isUndefined(partyYearFunds))
						fiscalYearRow.push( 0.0 );
					else
						fiscalYearRow.push( totalFund / partyYearFunds.length );
				});
				partyAverageFundsBarChartDataTableArray.push(fiscalYearRow);
			});

			return partyAverageFundsBarChartDataTableArray;
		}

		FundRecordsService.getBarChartConstituenciesArray = function(filteredPartyModels, filteredSectorModels, filteredRegionModels, filteredConstituencyModels){
			if(!FundRecordsService.records.length > 0){
				FundRecordsService.getAll();
			}

			var allFiscalYears = FundRecordsService.getFiscalYears();

			// Applying Filter Arrays
			var filteredMainRecords = modelHelper.applyModelFilter(FundRecordsService.records, 13, filteredPartyModels, "party");
			filteredMainRecords = modelHelper.applyModelFilter(filteredMainRecords, 17, filteredSectorModels, "sector");
			filteredMainRecords = modelHelper.applyModelFilter(filteredMainRecords, this.attributeIndices.region, filteredRegionModels, "region");
			filteredMainRecords = modelHelper.applyModelFilter(filteredMainRecords, this.attributeIndices.constituency, filteredConstituencyModels, "constituency");
			
			var uniqueConstituencyFiscalYears = {};
			var allAvailableConstituencies = [];
			angular.forEach(filteredMainRecords, function(record){
				// Filters
				var partyShortName = record[13];
				var sector = record[17];
				var fiscalYear = record[4];
				var fund = parseFloat(record[14]);
				var constituency = record[FundRecordsService.attributeIndices.constituency];

				if( typeof uniqueConstituencyFiscalYears[fiscalYear] == 'undefined'){
					uniqueConstituencyFiscalYears[fiscalYear] = {};
				}
				
				if( typeof uniqueConstituencyFiscalYears[fiscalYear][constituency] == 'undefined'){
					uniqueConstituencyFiscalYears[fiscalYear][constituency] = [];
				}

				// Available Parties
				if( allAvailableConstituencies.indexOf(constituency) < 0 && !angular.isUndefined(constituency && constituency != "undefined")){
					allAvailableConstituencies.push(constituency);
				}

				// Inserting Fund
				uniqueConstituencyFiscalYears[fiscalYear][constituency].push(fund);
			});

			var constituencyAverageFundsBarChartDataTableArray = [];
			// Inserting Header
			var headerRow = ["Fiscal Year"];
			angular.forEach(allAvailableConstituencies, function(availableConstituency){
				headerRow.push(availableConstituency);
			});
			constituencyAverageFundsBarChartDataTableArray.push(headerRow);
			
			// Inserting average fund values per fiscal year
			angular.forEach(uniqueConstituencyFiscalYears, function(constituencies, fiscalYear){
				var fiscalYearRow = [fiscalYear];
				angular.forEach(allAvailableConstituencies, function(availableConstituency){
					var totalFund = 0.0;
					var constituencyYearFunds = uniqueConstituencyFiscalYears[fiscalYear][availableConstituency];
					angular.forEach(constituencyYearFunds, function(fund){
						totalFund += fund;
					});
					if(angular.isUndefined(constituencyYearFunds))
						fiscalYearRow.push( 0.0 );
					else
						fiscalYearRow.push( totalFund / constituencyYearFunds.length );
				});
				constituencyAverageFundsBarChartDataTableArray.push(fiscalYearRow);
			});

			return constituencyAverageFundsBarChartDataTableArray;
		}


		FundRecordsService.getBarChartMembersArray = function(filteredPartyModels, filteredSectorModels, filteredRegionModels, filteredConstituencyModels, filteredMemberModels){
			if(!FundRecordsService.records.length > 0){
				FundRecordsService.getAll();
			}

			var allFiscalYears = FundRecordsService.getFiscalYears();

			// Applying Filter Arrays
			var filteredMainRecords = modelHelper.applyModelFilter(FundRecordsService.records, 13, filteredPartyModels, "party");
			filteredMainRecords = modelHelper.applyModelFilter(filteredMainRecords, 17, filteredSectorModels, "sector");
			filteredMainRecords = modelHelper.applyModelFilter(filteredMainRecords, this.attributeIndices.region, filteredRegionModels, "region");
			filteredMainRecords = modelHelper.applyModelFilter(filteredMainRecords, this.attributeIndices.constituency, filteredConstituencyModels, "constituency");
			filteredMainRecords = modelHelper.applyModelFilter(filteredMainRecords, this.attributeIndices.memberName, filteredMemberModels, "member");
			
			var uniqueEntityFiscalYears = {};
			var allAvailableEntities = [];
			angular.forEach(filteredMainRecords, function(record){
				var fiscalYear = record[4];
				var fund = parseFloat(record[14]);
				var member = record[FundRecordsService.attributeIndices.memberName];

				if( typeof uniqueEntityFiscalYears[fiscalYear] == 'undefined'){
					uniqueEntityFiscalYears[fiscalYear] = {};
				}
				
				if( typeof uniqueEntityFiscalYears[fiscalYear][member] == 'undefined'){
					uniqueEntityFiscalYears[fiscalYear][member] = [];
				}

				// Available Parties
				if( allAvailableEntities.indexOf(member) < 0 && !angular.isUndefined(member && member != "undefined")){
					allAvailableEntities.push(member);
				}

				// Inserting Fund
				uniqueEntityFiscalYears[fiscalYear][member].push(fund);
			});

			var constituencyAverageFundsBarChartDataTableArray = [];
			// Inserting Header
			var headerRow = ["Fiscal Year"];
			angular.forEach(allAvailableEntities, function(availableEntity){
				headerRow.push(availableEntity);
			});
			constituencyAverageFundsBarChartDataTableArray.push(headerRow);
			
			// Inserting average fund values per fiscal year
			angular.forEach(uniqueEntityFiscalYears, function(entities, fiscalYear){
				var fiscalYearRow = [fiscalYear];
				angular.forEach(allAvailableEntities, function(availableEntity){
					var totalFund = 0.0;
					var constituencyYearFunds = uniqueEntityFiscalYears[fiscalYear][availableEntity];
					angular.forEach(constituencyYearFunds, function(fund){
						totalFund += fund;
					});
					if(angular.isUndefined(constituencyYearFunds))
						fiscalYearRow.push( 0.0 );
					else
						fiscalYearRow.push( totalFund / constituencyYearFunds.length );
				});
				constituencyAverageFundsBarChartDataTableArray.push(fiscalYearRow);
			});

			return constituencyAverageFundsBarChartDataTableArray;
		}
		//------  getters  ------//				
		FundRecordsService.getParties = function(){
			if(!FundRecordsService.records.length > 0){
				FundRecordsService.getAll();
			}

			if(FundRecordsService.parties.length){
				return FundRecordsService.parties;
			}else{
				var uniqueParties = [];
				angular.forEach(FundRecordsService.records, function(record){
					var partyShortName = record[13];
					if(uniqueParties.indexOf(partyShortName) < 0){
						uniqueParties.push(partyShortName);
					}
				});
				FundRecordsService.parties = uniqueParties;
				return uniqueParties;
			}
		}

		FundRecordsService.getPartiesMultiSelectModel = function(){
			if(!FundRecordsService.records.length > 0){
				FundRecordsService.getAll();
			}

			if(FundRecordsService.partiesMultiSelectModel){
				return FundRecordsService.partiesMultiSelectModel;
			}else{
				var uniqueParties = [];
				var multiSelectObjects = []
				angular.forEach(FundRecordsService.records, function(record){
					var partyShortName = record[13];
					if(uniqueParties.indexOf(partyShortName) < 0 && angular.isString(partyShortName)){
						multiSelectObjects.push({party: partyShortName, partyFullName: record[12], selected: true});
						uniqueParties.push(partyShortName);
					}
				});
				FundRecordsService.partiesMultiSelectModel = multiSelectObjects;
				return multiSelectObjects;
			}
		}
		
		// Return Model for Sectors Multi Select
		FundRecordsService.getFilteredSectorsMultiSelectModel = function(){
			if(!FundRecordsService.records.length > 0){
				FundRecordsService.getAll();
			}

			if(FundRecordsService.sectorsMultiSelectModel){
				return FundRecordsService.sectorsMultiSelectModel;
			}else{
				var uniqueSectors = [];
				var multiSelectObjects = []
				angular.forEach(FundRecordsService.records, function(record){
					var sector = record[17];
					if(uniqueSectors.indexOf(sector) < 0 && angular.isString(sector)){
						multiSelectObjects.push({sector: sector, selected: true});
						uniqueSectors.push(sector);
					}
				});
				FundRecordsService.sectorsMultiSelectModel = multiSelectObjects;
				return multiSelectObjects;
			}
		}

		// Return Model for Regions Multi Select
		FundRecordsService.getRegionsMultiSelectModel = function(){
			if(!FundRecordsService.records.length > 0){
				FundRecordsService.getAll();
			}

			if(FundRecordsService.regionsMultiSelectModel){
				return FundRecordsService.regionsMultiSelectModel;
			}else{
				var uniqueRegions = [];
				var multiSelectObjects = []
				angular.forEach(FundRecordsService.records, function(record){
					var region = record[FundRecordsService.attributeIndices.region];
					if(uniqueRegions.indexOf(region) < 0 && angular.isString(region)){
						multiSelectObjects.push({region: region, selected: true});
						uniqueRegions.push(region);
					}
				});
				FundRecordsService.sectorsMultiSelectModel = multiSelectObjects;
				return multiSelectObjects;
			}
		}		
		
		FundRecordsService.getFiscalYears = function(){
			if(!FundRecordsService.records.length > 0){
				FundRecordsService.getAll();
			}

			if(FundRecordsService.fiscalYears.length){
				return FundRecordsService.fiscalYears;
			}else{
				var uniqueFiscalYears = [];
				angular.forEach(FundRecordsService.records, function(record){
					var fiscalYear = record[4];
					if(uniqueFiscalYears.indexOf(fiscalYear) < 0 && angular.isString(fiscalYear)){
						uniqueFiscalYears.push(fiscalYear);
					}
				});
				FundRecordsService.fiscalYears = uniqueFiscalYears;
				return uniqueFiscalYears;
			}
		}

		FundRecordsService.getLatestFiscalYear = function()		{
			if(!FundRecordsService.fiscalYears.length > 0){
				FundRecordsService.getFiscalYears();
			}
			return this.fiscalYears[this.fiscalYears.length - 1];
		}

		FundRecordsService.getConstituencies = function(){
			if(!FundRecordsService.records.length > 0){
				FundRecordsService.getAll();
			}

			if(FundRecordsService.constituencies.length){
				return FundRecordsService.constituencies;
			}else{
				var uniqueConstituencies = modelHelper.getUniqueFromRecords(FundRecordsService.records, FundRecordsService.attributeIndices.constituency);
				FundRecordsService.constituencies = uniqueConstituencies;
				return uniqueConstituencies;
			}
		}

		FundRecordsService.getConstituenciesMultiSelectModel = function(preSelectCount){
			if(!FundRecordsService.records.length > 0){
				FundRecordsService.getAll();
			}

			// if preSelectCount is provided, don't use the cached
			if(FundRecordsService.constituenciesMultiSelectModel && ( angular.isUndefined(preSelectCount) || !preSelectCount)){ 
				return FundRecordsService.constituenciesMultiSelectModel;
			}else{
				var uniqueConstituencies = [];
				var multiSelectObjects = [];
				var preSelectCount = angular.isNumber(preSelectCount) ? parseInt(preSelectCount) : false;
				angular.forEach(FundRecordsService.records, function(record){
					var constituency = record[FundRecordsService.attributeIndices.constituency];
					var constituency_id = record[FundRecordsService.attributeIndices.constituency_id];
					if(uniqueConstituencies.indexOf(constituency) < 0 && angular.isString(constituency)){
						multiSelectObjects.push({constituency: constituency, constituency_id: constituency_id, selected: ( (preSelectCount === false) ? true : (preSelectCount-- > 0) )});
						uniqueConstituencies.push(constituency);
					}
				});
				FundRecordsService.sectorsMultiSelectModel = multiSelectObjects;
				return multiSelectObjects;
			}
		}

		FundRecordsService.getMembersMultiSelectModel = function(preSelectCount){
			if(!FundRecordsService.records.length > 0){
				FundRecordsService.getAll();
			}

			// if preSelectCount is provided, don't use the cached
			if(FundRecordsService.membersMultiSelectModel && ( angular.isUndefined(preSelectCount) || !preSelectCount)){ 
				return FundRecordsService.membersMultiSelectModel;
			}else{
				var uniqueEntities = [];
				var multiSelectObjects = [];
				var preSelectCount = angular.isNumber(preSelectCount) ? parseInt(preSelectCount) : false;
				angular.forEach(FundRecordsService.records, function(record){
					var entity = record[FundRecordsService.attributeIndices.memberName];
					var partyShortName = record[FundRecordsService.attributeIndices.partyShortName];
					if(uniqueEntities.indexOf(entity) < 0 && angular.isString(entity)){
						multiSelectObjects.push({member: entity, party: partyShortName, selected: ( (preSelectCount === false) ? true : (preSelectCount-- > 0) )});
						uniqueEntities.push(entity);
					}
				});
				FundRecordsService.sectorsMultiSelectModel = multiSelectObjects;
				return multiSelectObjects;
			}
		}				

		return FundRecordsService;
	}])

	.factory('csvParser', ['$log', function($log){
		return {
			csvToArray: function( strData, strDelimiter ){
	        // Check to see if the delimiter is defined. If not,
	        // then default to comma.
	        strDelimiter = (strDelimiter || ",");

	        // Create a regular expression to parse the CSV values.
	        var objPattern = new RegExp(
	            (
	                // Delimiters.
	                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

	                // Quoted fields.
	                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

	                // Standard fields.
	                "([^\"\\" + strDelimiter + "\\r\\n]*))"
	            ),
	            "gi"
	            );


	        // Create an array to hold our data. Give the array
	        // a default empty first row.
	        var arrData = [[]];

	        // Create an array to hold our individual pattern
	        // matching groups.
	        var arrMatches = null;


	        // Keep looping over the regular expression matches
	        // until we can no longer find a match.
	        while (arrMatches = objPattern.exec( strData )){

	            // Get the delimiter that was found.
	            var strMatchedDelimiter = arrMatches[ 1 ];

	            // Check to see if the given delimiter has a length
	            // (is not the start of string) and if it matches
	            // field delimiter. If id does not, then we know
	            // that this delimiter is a row delimiter.
	            if (
	                strMatchedDelimiter.length &&
	                strMatchedDelimiter !== strDelimiter
	                ){

	                // Since we have reached a new row of data,
	                // add an empty row to our data array.
	                arrData.push( [] );

	            }

	            var strMatchedValue;

	            // Now that we have our delimiter out of the way,
	            // let's check to see which kind of value we
	            // captured (quoted or unquoted).
	            if (arrMatches[ 2 ]){

	                // We found a quoted value. When we capture
	                // this value, unescape any double quotes.
	                strMatchedValue = arrMatches[ 2 ].replace(
	                    new RegExp( "\"\"", "g" ),
	                    "\""
	                    );

	            } else {

	                // We found a non-quoted value.
	                strMatchedValue = arrMatches[ 3 ];

	            }


	            // Now that we have our value string, let's add
	            // it to the data array.
	            arrData[ arrData.length - 1 ].push( strMatchedValue );
	        }

	        // Return the parsed data.
	        return( arrData );
	    }
		};
	}])
	
	.factory('MultiSelectModelHelper', ['$log', function($log){
		return {
			modelsToArray: function( modelArray, attributeName ){
				var outPutArray = [];
				angular.forEach(modelArray, function(modelObj){
					outPutArray.push(modelObj[attributeName]);
				});
				return outPutArray;
	    	},

	    	applyModelFilter: function(records, recordIndex, filteredModels, attributeName){
	    		var filteredArray = this.modelsToArray(filteredModels, attributeName);
	    		var filteredRecords = [];
	    		angular.forEach(records, function(record){
	    			var attributeValue = record[recordIndex];
	    			if(filteredArray.indexOf(attributeValue) > -1){
	    				filteredRecords.push(record);
	    			}
	    		});
	    		return filteredRecords;
	    	},

	    	getUniqueFromRecords: function(records, recordIndex){
				var uniques = [];
				angular.forEach(records, function(record){
					var attributeValue = record[recordIndex];
					if(uniques.indexOf(attributeValue) < 0 && angular.isString(attributeValue)){
						uniques.push(attributeValue);
					}
				});
				return uniques;	    		
	    	}
		};
	}]);