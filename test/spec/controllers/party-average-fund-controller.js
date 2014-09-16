'use strict';

describe('Controller: PartyAverageFundControllerCtrl', function () {

  // load the controller's module
  beforeEach(module('angulargisApp'));

  var PartyAverageFundControllerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PartyAverageFundControllerCtrl = $controller('PartyAverageFundControllerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
