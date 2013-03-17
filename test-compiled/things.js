describe('things', function() {
  it('should define things function on window scope', function() {
    expect(typeof things).toEqual('function');
  });

  it('should expose correct API', function() {
    expect(typeof module.route).toEqual('function');
    expect(typeof module.service).toEqual('function');
    expect(typeof module.thing).toEqual('function');
    expect(typeof module.boots).toEqual('function');
    expect(typeof module.goTo).toEqual('function');
  });
});
