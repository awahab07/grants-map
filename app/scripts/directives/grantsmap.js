'use strict';

/**
 * @ngdoc directive
 * @name angulargisApp.directive:grantsMap
 * @description
 * # grantsMap
 */
angular.module('grantsApp')
  .directive('grantsMap', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the grantsMap directive');
      }
    };
  });
