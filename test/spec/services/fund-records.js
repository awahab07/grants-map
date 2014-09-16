'use strict';

describe('Service: fundRecords', function () {

  // load the service's module
  beforeEach(module('angulargisApp'));

  // instantiate service
  var fundRecords;
  beforeEach(inject(function (_fundRecords_) {
    fundRecords = _fundRecords_;
  }));

  it('should do something', function () {
    expect(!!fundRecords).toBe(true);
  });

});
