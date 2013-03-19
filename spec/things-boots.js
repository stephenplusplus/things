describe('boots', function() {
  it('should register and execute one boot function', function() {
    var bootFunctionCalled = false;

    module.boots(function() {
      bootFunctionCalled = true;
    });

    expect(bootFunctionCalled).toBeTruthy();
  });

  it('should register and execute multiple boot functions', function() {
    var bootFunctionCalledTimes = 0;

    module
      .boots(function() {
        bootFunctionCalledTimes++;
      })
      .boots(function() {
        bootFunctionCalledTimes++;
      })
      .boots(function() {
        bootFunctionCalledTimes++;
      });

    expect(bootFunctionCalledTimes).toEqual(3);
  });
});
