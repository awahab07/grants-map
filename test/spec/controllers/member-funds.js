'use strict';

describe('Controller: MemberFundsCtrl', function () {

  // load the controller's module
  beforeEach(module('angulargisApp'));

  var MemberFundsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MemberFundsCtrl = $controller('MemberFundsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
