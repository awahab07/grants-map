'use strict';

describe('Service: gis', function () {

  // load the service's module
  beforeEach(module('angulargisApp'));

  // instantiate service
  var gis;
  beforeEach(inject(function (_gis_) {
    gis = _gis_;
  }));

  it('should do something', function () {
    expect(!!gis).toBe(true);
  });

});
