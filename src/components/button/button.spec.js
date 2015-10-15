describe('md083fork-button', function() {

  beforeEach(module('material.083fork.components.button'));

  it('should convert attributes on an md083fork-button to attributes on the generated button', inject(function($compile, $rootScope) {
    var button = $compile('<md083fork-button hide hide-sm></md083fork-button>')($rootScope);
    $rootScope.$apply();
    expect(button[0].hasAttribute('hide')).toBe(true);
    expect(button[0].hasAttribute('hide-sm')).toBe(true);
  }));

  it('should only have one ripple container when a custom ripple color is set', inject(function ($compile, $rootScope, $timeout) {
    var button = $compile('<md083fork-button md-ink-ripple="#f00">button</md083fork-button>')($rootScope);

    button.triggerHandler({ type: '$md.pressdown', pointer: { x: 0, y: 0 } });
    expect(button[0].getElementsByClassName('md-ripple-container').length).toBe(1);
  }));


  it('should expect an aria-label if element has no text', inject(function($compile, $rootScope, $log) {
    spyOn($log, 'warn');
    var button = $compile('<md083fork-button><md083fork-icon></md083fork-icon></md083fork-button>')($rootScope);
    $rootScope.$apply();
    expect($log.warn).toHaveBeenCalled();

    $log.warn.reset();
    button = $compile('<md083fork-button aria-label="something"><md083fork-icon></md083fork-icon></md083fork-button>')($rootScope);
    $rootScope.$apply();
    expect($log.warn).not.toHaveBeenCalled();
  }));

  it('should allow attribute directive syntax', inject(function($compile, $rootScope) {
    var button = $compile('<a md083fork-button href="https://google.com">google</a>')($rootScope.$new());
    expect(button.hasClass('md083fork-button')).toBe(true);
  }));


  describe('with href or ng-href', function() {

    it('should be anchor if href attr', inject(function($compile, $rootScope) {
      var button = $compile('<md083fork-button href="/link">')($rootScope.$new());
      $rootScope.$apply();
      expect(button[0].tagName.toLowerCase()).toEqual('a');
    }));

    it('should be anchor if ng-href attr', inject(function($compile, $rootScope) {
      var button = $compile('<md083fork-button ng-href="/link">')($rootScope.$new());
      $rootScope.$apply();
      expect(button[0].tagName.toLowerCase()).toEqual('a');
    }));

    it('should be button otherwise', inject(function($compile, $rootScope) {
      var button = $compile('<md083fork-button>')($rootScope.$new());
      $rootScope.$apply();
      expect(button[0].tagName.toLowerCase()).toEqual('button');
    }));

  });


  describe('with ng-disabled', function() {

    it('should not set `tabindex` when used without anchor attributes', inject(function ($compile, $rootScope, $timeout) {
      var scope = angular.extend( $rootScope.$new(), { isDisabled : true } );
      var button = $compile('<md083fork-button ng-disabled="isDisabled">button</md083fork-button>')(scope);
      $rootScope.$apply();

      expect(button[0].hasAttribute('tabindex')).toBe(false);
    }));

    it('should set `tabindex == -1` when used with href', inject(function ($compile, $rootScope, $timeout) {
      var scope = angular.extend( $rootScope.$new(), { isDisabled : true } );
      var button = $compile('<md083fork-button ng-disabled="isDisabled" href="#nowhere">button</md083fork-button>')(scope);

      $rootScope.$apply();
      expect(button.attr('tabindex')).toBe("-1");

      $rootScope.$apply(function(){
        scope.isDisabled = false;
      });
      expect(button.attr('tabindex')).toBe("0");

    }));

    it('should set `tabindex == -1` when used with ng-href', inject(function ($compile, $rootScope, $timeout) {
      var scope = angular.extend( $rootScope.$new(), { isDisabled : true, url : "http://material.angularjs.org" });
      var button = $compile('<md083fork-button ng-disabled="isDisabled" ng-href="url">button</md083fork-button>')(scope);
      $rootScope.$apply();

      expect(button.attr('tabindex')).toBe("-1");
    }));

  });

});
