'use strict';

describe('Controller: ConstituencyAverageFundsControllerCtrl', function () {

  // load the controller's module
  beforeEach(module('angulargisApp'));

  var ConstituencyAverageFundsControllerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConstituencyAverageFundsControllerCtrl = $controller('ConstituencyAverageFundsControllerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
