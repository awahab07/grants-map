'use strict';

describe('Controller: DataControllerCtrl', function () {

  // load the controller's module
  beforeEach(module('angulargisApp'));

  var DataControllerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DataControllerCtrl = $controller('DataControllerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
