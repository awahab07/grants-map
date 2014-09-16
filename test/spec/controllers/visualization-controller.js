'use strict';

describe('Controller: VisualizationControllerCtrl', function () {

  // load the controller's module
  beforeEach(module('angulargisApp'));

  var VisualizationControllerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VisualizationControllerCtrl = $controller('VisualizationControllerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
