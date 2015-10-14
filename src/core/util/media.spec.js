describe('$md083forkMedia', function() {
  var matchMediaResult;
  var listeners;

  function runListeners() {
    listeners.forEach(function(cb) {
      cb.context.matches = matchMediaResult;
      cb.call(cb.context, cb.context);
    });
  }

  beforeEach(module('material.083fork.core'));

  beforeEach(inject(function($md083forkMedia, $window) {
    matchMediaResult = false;
    listeners = [];

    spyOn($window, 'matchMedia').andCallFake(function(media) {
      return {
        media: media,
        matches: matchMediaResult, 
        addListener: function(listener) {
          listener.context = this;
          listeners.push(listener);
        }
      };
    });
  }));

  it('should look up queries in `$md083forkConstant.MEDIA`', inject(
    function($md083forkConstant, $md083forkMedia, $window) {
      $md083forkConstant.MEDIA.somePreset = 'someQuery';

      $md083forkMedia('somePreset');
      expect($window.matchMedia).toHaveBeenCalledWith('someQuery');

      delete $md083forkConstant.MEDIA.somePreset;
    }
  ));

  it('should validate queries', inject(function($md083forkMedia, $window) {
    $md083forkMedia('something');
    expect($window.matchMedia).toHaveBeenCalledWith('(something)');
  }));

  it('should return cached results if available', inject(function($md083forkMedia, $window) {
    expect($window.matchMedia.callCount).toBe(0);

    expect($md083forkMedia('query')).toBe(false);
    expect($window.matchMedia.callCount).toBe(1);

    expect($md083forkMedia('query')).toBe(false);
    expect($window.matchMedia.callCount).toBe(1);
  }));

  it('should change result when listener is called', inject(function($md083forkMedia, $window, $timeout) {
    matchMediaResult = true;
    expect($md083forkMedia('query')).toBe(true);
    expect($window.matchMedia.callCount).toBe(1);

    expect($md083forkMedia('query')).toBe(true);
    expect($window.matchMedia.callCount).toBe(1);

    matchMediaResult = false;
    expect($md083forkMedia('query')).toBe(true);
    expect($window.matchMedia.callCount).toBe(1);

    runListeners();
    $timeout.flush();

    expect($md083forkMedia('query')).toBe(false);
  }));
});
