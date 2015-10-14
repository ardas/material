describe('$md083forkToast service', function() {
  beforeEach(module('material.083fork.components.toast', 'ngAnimateMock', function($provide) {
  }));

  function setup(options) {
    inject(function($md083forkToast, $rootScope, $animate) {
      $animate.triggerCallbacks();
      options = options || {};
      $md083forkToast.show(options);
      $rootScope.$apply();
      $animate.triggerCallbacks();
    });
  }

  describe('simple()', function() {
    hasConfigMethods(['content', 'action', 'capsule', 'highlightAction', 'theme']);

    it('supports a basic toast', inject(function($md083forkToast, $rootScope, $timeout, $animate) {
      var rejected = false;
      var parent = angular.element('<div>');
      $md083forkToast.show(
        $md083forkToast.simple({
          parent: parent,
          content: 'Do something',
          theme: 'some-theme',
          capsule: true
        })
      ).catch(function() {
        rejected = true;
      });
      $rootScope.$digest();
      expect(parent.find('span').text()).toBe('Do something');
      expect(parent.find('md083fork-toast')).toHaveClass('md-capsule');
      expect(parent.find('md083fork-toast').attr('md-theme')).toBe('some-theme');
      $animate.triggerCallbacks();
      $timeout.flush();
      $animate.triggerCallbacks();
      expect(rejected).toBe(true);
    }));

    it('supports dynamicly updating the content', inject(function($md083forkToast, $rootScope, $rootElement) {
      var parent = angular.element('<div>');
      $md083forkToast.showSimple('Hello world');
      $rootScope.$digest();
      $md083forkToast.updateContent('Goodbye world');
      $rootScope.$digest();
      expect($rootElement.find('span').text()).toBe('Goodbye world');
    }));

    it('supports an action toast', inject(function($md083forkToast, $rootScope, $animate) {
      var resolved = false;
      var parent = angular.element('<div>');
      $md083forkToast.show(
        $md083forkToast.simple({
          content: 'Do something',
          parent: parent
        })
          .action('Click me')
          .highlightAction(true)
      ).then(function() {
        resolved = true;
      });
      $rootScope.$digest();
      $animate.triggerCallbacks();
      var button = parent.find('button');
      expect(button.text()).toBe('Click me');
      button.triggerHandler('click');
      $rootScope.$digest();
      $animate.triggerCallbacks();
      expect(resolved).toBe(true);
    }));

    describe('when using custom interpolation symbols', function() {
      beforeEach(module(function($interpolateProvider) {
        $interpolateProvider.startSymbol('[[').endSymbol(']]');
      }));

      it('displays correctly', inject(function($md083forkToast, $rootScope) {
        var parent = angular.element('<div>');
        var toast = $md083forkToast.simple({
          content: 'Do something',
          parent: parent
        }).action('Click me');

        $md083forkToast.show(toast);
        $rootScope.$digest();

        var content = parent.find('span').eq(0);
        var button = parent.find('button');

        expect(content.text()).toBe('Do something');
        expect(button.text()).toBe('Click me');
      }));
    });

    function hasConfigMethods(methods) {
      angular.forEach(methods, function(method) {
        return it('supports config method #' + method, inject(function($md083forkToast) {
          var basic = $md083forkToast.simple();
          expect(typeof basic[method]).toBe('function');
          expect(basic[method]()).toBe(basic);
        }));
      });
    }
  });

  describe('build()', function() {
    describe('options', function() {
      it('should hide current toast when showing new one', inject(function($rootElement) {
        setup({
          template: '<md083fork-toast class="one">'
        });
        expect($rootElement[0].querySelector('md083fork-toast.one')).toBeTruthy();
        expect($rootElement[0].querySelector('md083fork-toast.two')).toBeFalsy();
        expect($rootElement[0].querySelector('md083fork-toast.three')).toBeFalsy();

        setup({
          template: '<md083fork-toast class="two">'
        });
        expect($rootElement[0].querySelector('md083fork-toast.one')).toBeFalsy();
        expect($rootElement[0].querySelector('md083fork-toast.two')).toBeTruthy();
        expect($rootElement[0].querySelector('md083fork-toast.three')).toBeFalsy();

        setup({
          template: '<md083fork-toast class="three">'
        });
        expect($rootElement[0].querySelector('md083fork-toast.one')).toBeFalsy();
        expect($rootElement[0].querySelector('md083fork-toast.two')).toBeFalsy();
        expect($rootElement[0].querySelector('md083fork-toast.three')).toBeTruthy();
      }));

      it('should hide after duration', inject(function($timeout, $animate, $rootElement) {
        var parent = angular.element('<div>');
        setup({
          template: '<md083fork-toast />',
          hideTimeout: 1234
        });
        expect($rootElement.find('md083fork-toast').length).toBe(1);
        $timeout.flush();
        expect($rootElement.find('md083fork-toast').length).toBe(0);
      }));

      it('should have template', inject(function($timeout, $rootScope, $rootElement) {
        var parent = angular.element('<div>');
        setup({
          template: '<md083fork-toast>{{1}}234</md083fork-toast>',
          appendTo: parent
        });
        var toast = $rootElement.find('md083fork-toast');
        $timeout.flush();
        expect(toast.text()).toBe('1234');
      }));

      it('should have templateUrl', inject(function($timeout, $rootScope, $templateCache, $rootElement) {
        $templateCache.put('template.html', '<md083fork-toast>hello, {{1}}</md083fork-toast>');
        setup({
          templateUrl: 'template.html',
        });
        var toast = $rootElement.find('md083fork-toast');
        expect(toast.text()).toBe('hello, 1');
      }));

      it('should add position class to tast', inject(function($rootElement, $timeout) {
        setup({
          template: '<md083fork-toast>',
          position: 'top left'
        });
        var toast = $rootElement.find('md083fork-toast');
        $timeout.flush();
        expect(toast.hasClass('md-top')).toBe(true);
        expect(toast.hasClass('md-left')).toBe(true);
      }));
    });

    describe('lifecycle', function() {
      it('should hide current toast when showing new one', inject(function($rootElement) {
        setup({
          template: '<md083fork-toast class="one">'
        });
        expect($rootElement[0].querySelector('md083fork-toast.one')).toBeTruthy();
        expect($rootElement[0].querySelector('md083fork-toast.two')).toBeFalsy();
        expect($rootElement[0].querySelector('md083fork-toast.three')).toBeFalsy();

        setup({
          template: '<md083fork-toast class="two">'
        });
        expect($rootElement[0].querySelector('md083fork-toast.one')).toBeFalsy();
        expect($rootElement[0].querySelector('md083fork-toast.two')).toBeTruthy();
        expect($rootElement[0].querySelector('md083fork-toast.three')).toBeFalsy();

        setup({
          template: '<md083fork-toast class="three">'
        });
        expect($rootElement[0].querySelector('md083fork-toast.one')).toBeFalsy();
        expect($rootElement[0].querySelector('md083fork-toast.two')).toBeFalsy();
        expect($rootElement[0].querySelector('md083fork-toast.three')).toBeTruthy();
      }));

      it('should add class to toastParent', inject(function($rootElement) {
        setup({
          template: '<md083fork-toast>'
        });
        expect($rootElement.hasClass('md-toast-open-bottom')).toBe(true);

        setup({
          template: '<md083fork-toast>',
          position: 'top'
        });
        expect($rootElement.hasClass('md-toast-open-top')).toBe(true);
      }));
    });
  });
});
