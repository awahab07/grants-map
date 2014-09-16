'use strict';

angular
  .module('grantsApp', [
    'ngResource',
    'ngRoute',
    'multi-select',
    'ui.bootstrap',
    'openlayers-directive'
  ])
  /*.config(function ($routeProvider) {
    $routeProvider
      .when('/party-average-funds', {
        templateUrl: 'views/party-average-funds.html',
        controller: 'partyAverageFundController'
      })

      .when('/constituency-average-funds', {
        templateUrl: 'views/constituency-average-funds.html',
        controller: 'constituencyAverageFundsController'
      })
      
      .when('/member-funds', {
        templateUrl: 'views/member-funds.html',
        controller: 'memberFundsController'
      })
      .otherwise({
        redirectTo: '/party-average-funds'
      });
  })*/;
