'use strict';

describe('Directive: fafenPieChart', function () {

  // load the directive's module
  beforeEach(module('angulargisApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<fafen-pie-chart></fafen-pie-chart>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the fafenPieChart directive');
  }));
});
