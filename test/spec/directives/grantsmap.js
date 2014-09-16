'use strict';

describe('Directive: grantsMap', function () {

  // load the directive's module
  beforeEach(module('angulargisApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<grants-map></grants-map>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the grantsMap directive');
  }));
});
