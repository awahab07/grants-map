'use strict';

angular.module('grantsApp')
	.controller('mainController', ['$scope', '$location', 'GISDataService', function($scope, $location, GISDataService){
		angular.extend($scope, {
            london: {
                lat: 51.505,
                lon: -0.09,
                zoom: 3
            },
            layers: {
                openstreetmap: {
                    type: 'tile',
                    opacity: 0.5,
                    source: {
                        type: 'OSM'
                    }
                },
                mapbox_geographyclass: {
                    type: 'tile',
                    opacity: 0.5,
                    source: {
                        type: 'TileJSON',
                        url: 'http://api.tiles.mapbox.com/v3/mapbox.geography-class.jsonp'
                    }
                }
            }
        });
	}]);