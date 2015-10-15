describe('$md083forkComponentRegistry Service', function() {
  beforeEach(module( 'material.083fork.core', 'material.083fork.components.sidenav' ));

  /**
   * SideNav element construction macro
   */
  function setup(attrs) {
    var el;
    inject(function($compile, $rootScope) {
      var parent = angular.element('<div>');
      el = angular.element('<md083fork-sidenav ' + (attrs||'') + '>');
      parent.append(el);
      $compile(parent)($rootScope);
      $rootScope.$apply();
    });
    return el;
  }

  describe('registration', function() {
    var $md083forkComponentRegistry, $timeout;

    beforeEach( inject(function(_$md083forkComponentRegistry_, _$timeout_) {
      $md083forkComponentRegistry = _$md083forkComponentRegistry_;
      $timeout = _$timeout_;
    }));

    it('should print error on no handle', inject(function($log) {
      spyOn($log, 'error');
      $md083forkComponentRegistry.notFoundError('badHandle');
      expect($log.error).toHaveBeenCalled();
    }));

    it('Should register handle', function() {
      $md083forkComponentRegistry.register({needle: true}, 'test');
      var instance = $md083forkComponentRegistry.get('test');
      expect(instance).toBeTruthy();
      expect(instance.needle).not.toBe(undefined);
      expect($md083forkComponentRegistry.getInstances().length).toBe(1);
    });

    it('Should deregister', function() {
      var deregister = $md083forkComponentRegistry.register({needle: true}, 'test');
      expect($md083forkComponentRegistry.getInstances().length).toBe(1);
      deregister();
      expect($md083forkComponentRegistry.getInstances().length).toBe(0);
    });

    it('should register component when element is created', function() {
      var el = setup('md-component-id="left"');
      var instance = $md083forkComponentRegistry.get('left');

      expect(instance).toNotBe(null);
    });

    it('should deregister component when element is destroyed', function() {
      var el = setup('md-component-id="left"');
      el.triggerHandler('$destroy');

      var instance = $md083forkComponentRegistry.get('left');
      expect(instance).toBe(null);
    });

    it('should wait for component registration', function() {
      var promise = $md083forkComponentRegistry.when('left');
      var el = setup('md-component-id="left"');
      var instance = $md083forkComponentRegistry.get('left');
      var resolved = false;

      promise.then(function(inst){   resolved = inst;  });
      $timeout.flush();

      expect(instance).toBe(resolved);
    });

    it('should wait for next component registration', function() {
      var resolved;
      var count = 0;
      var promise = $md083forkComponentRegistry.when('left');
      var el = setup('md-component-id="left"');

      promise.then(function(inst){ count += 1; });
      $timeout.flush();

      el.triggerHandler('$destroy');

      el = setup('md-component-id="left"');
      promise = $md083forkComponentRegistry.when('left');
      promise.then(function(inst){
        resolved = inst;
        count += 1;
      });

      $timeout.flush();

      expect(resolved).toBeDefined();
      expect(count).toBe(2);

    });

  });

  describe('component ids', function() {
    var $md083forkComponentRegistry, $timeout;

    beforeEach( inject(function(_$md083forkComponentRegistry_, _$timeout_) {
      $md083forkComponentRegistry = _$md083forkComponentRegistry_;
      $timeout = _$timeout_;
    }));

    it('should not find a component without an id', function() {
      var el = setup();

      var resolved;
      var count = 0;
      var promise = $md083forkComponentRegistry.when('left');
      var instance = $md083forkComponentRegistry.get('left');

      promise.then(function(inst){ resolved = inst; count += 1; });
      $timeout.flush();

      expect(count).toBe(0);
      expect(instance).toBe(null);
      expect(resolved).toBeUndefined();

    });

    it('should not wait for a component with an invalid id', function() {
      var el = setup();
      var fail, componentID;
      var onFail = function() { fail = true;};


      fail = false;
      $md083forkComponentRegistry.when(componentID = undefined).catch( onFail );
      $timeout.flush();

      expect(fail).toBe(true);

      fail = false;
      $md083forkComponentRegistry.when(componentID = "").catch( onFail );
      $timeout.flush();

      expect(fail).toBe(true);

    });

    it('should properly destroy without a id', function() {
      var el = setup();
      el.triggerHandler('$destroy');
    });

  });

});
