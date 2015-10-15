describe('$md083forkAria service', function() {
  beforeEach(module('material.083fork.core'));

  describe('expecting attributes', function(){
    it('should warn if element is missing text', inject(function($compile, $rootScope, $log, $md083forkAria) {
      spyOn($log, 'warn');
      var button = $compile('<button><md083fork-icon></md083fork-icon></button>')($rootScope);

      $md083forkAria.expect(button, 'aria-label');

      expect($log.warn).toHaveBeenCalled();
    }));

    it('should not warn if child element has attribute', inject(function($compile, $rootScope, $log, $md083forkAria) {
      spyOn($log, 'warn');
      var button = $compile('<button><md083fork-icon aria-label="text"></md083fork-icon></button>')($rootScope);

      $md083forkAria.expect(button, 'aria-label');

      expect($log.warn).not.toHaveBeenCalled();
    }));

    it('should warn if child with attribute is hidden', inject(function($compile, $rootScope, $log, $md083forkAria) {
      spyOn($log, 'warn');
      var container = angular.element(document.body);
      var button = $compile('<button><md083fork-icon aria-label="text" style="display:none;"></md083fork-icon></button>')($rootScope);

      container.append(button);

      $md083forkAria.expect(button, 'aria-label');

      expect($log.warn).toHaveBeenCalled();

      button.remove();

    }));
  });

});
