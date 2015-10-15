describe('$md083forkDialog', function() {

  beforeEach(module('material.083fork.components.dialog', 'ngAnimateMock'));

  beforeEach(inject(function spyOnMdEffects($$q, $animate) {
    spyOn($animate, 'leave').andCallFake(function(element) {
      element.remove();
      return $$q.when();
    });
    spyOn($animate, 'enter').andCallFake(function(element, parent) {
      parent.append(element);
      return $$q.when();
    });
  }));

  describe('#alert()', function() {
    hasConfigurationMethods('alert', [
      'title', 'content', 'ariaLabel',
      'ok', 'targetEvent', 'theme'
    ]);

    it('shows a basic alert dialog', inject(function($animate, $rootScope, $md083forkDialog, $md083forkConstant) {
      var parent = angular.element('<div>');
      var resolved = false;
      $md083forkDialog.show(
        $md083forkDialog.alert({
          parent: parent
        })
          .title('Title')
          .content('Hello world')
          .theme('some-theme')
          .ok('Next')
      ).then(function() {
        resolved = true;
      });
      $rootScope.$apply();
      $animate.triggerCallbacks();
      var container = angular.element(parent[0].querySelector('.md-dialog-container'));
      container.find('md083fork-dialog').triggerHandler('transitionend');
      $rootScope.$apply();

      var title = angular.element(parent[0].querySelector('h2'));
      expect(title.text()).toBe('Title');
      var content = parent.find('p');
      expect(content.text()).toBe('Hello world');
      var buttons = parent.find('md083fork-button');
      expect(buttons.length).toBe(1);
      expect(buttons.eq(0).text()).toBe('Next');
      var theme = parent.find('md083fork-dialog').attr('md-theme');
      expect(theme).toBe('some-theme');


      buttons.eq(0).triggerHandler('click');
      $rootScope.$apply();
      parent.find('md083fork-dialog').triggerHandler('transitionend');
      $rootScope.$apply();
      expect(parent.find('h2').length).toBe(0);
      expect(resolved).toBe(true);
    }));
  });

  describe('#confirm()', function() {
    hasConfigurationMethods('confirm', [
      'title', 'content', 'ariaLabel',
      'ok', 'cancel', 'targetEvent', 'theme'
    ]);

    it('shows a basic confirm dialog', inject(function($rootScope, $md083forkDialog, $animate, $md083forkConstant) {
      var parent = angular.element('<div>');
      var rejected = false;
      $md083forkDialog.show(
        $md083forkDialog.confirm({
          parent: parent
        })
          .title('Title')
          .content('Hello world')
          .ok('Next')
          .cancel('Forget it')
      ).catch(function() {
        rejected = true;
      });

      $rootScope.$apply();
      $animate.triggerCallbacks();
      var container = angular.element(parent[0].querySelector('.md-dialog-container'));
      container.find('md083fork-dialog').triggerHandler('transitionend');
      $rootScope.$apply();
      $animate.triggerCallbacks();

      var title = parent.find('h2');
      expect(title.text()).toBe('Title');
      var content = parent.find('p');
      expect(content.text()).toBe('Hello world');
      var buttons = parent.find('md083fork-button');
      expect(buttons.length).toBe(2);
      expect(buttons.eq(0).text()).toBe('Next');
      expect(buttons.eq(1).text()).toBe('Forget it');

      buttons.eq(1).triggerHandler('click');
      $rootScope.$digest();
      $animate.triggerCallbacks();
      parent.find('md083fork-dialog').triggerHandler('transitionend');
      $rootScope.$digest();
      $animate.triggerCallbacks();
      expect(parent.find('h2').length).toBe(0);
      expect(rejected).toBe(true);
    }));
  });

  describe('#build()', function() {
    it('should support onComplete callbacks within `show()`', inject(function($md083forkDialog, $rootScope, $timeout, $md083forkConstant) {

      var template = '<md083fork-dialog>Hello</md083fork-dialog>';
      var parent = angular.element('<div>');
      var ready = false;

      $md083forkDialog.show({
        template: template,
        parent: parent,
        onComplete: function(scope, element, options) {
          expect( arguments.length ).toEqual( 3 );
          ready = true;
        }
      });
      $rootScope.$apply();

      expect(ready).toBe( false );

      var container = angular.element(parent[0].querySelector('.md-dialog-container'));
      parent.find('md083fork-dialog').triggerHandler('transitionend');
      $rootScope.$apply();

      container = angular.element(parent[0].querySelector('.md-dialog-container'));
      expect(container.length).toBe(1);
      expect(ready).toBe( true );
    }));

    it('should append dialog with container', inject(function($md083forkDialog, $rootScope) {

      var template = '<md083fork-dialog>Hello</md083fork-dialog>';
      var parent = angular.element('<div>');

      $md083forkDialog.show({
        template: template,
        parent: parent
      });

      $rootScope.$apply();

      var container = parent[0].querySelectorAll('.md-dialog-container');
      expect(container.length).toBe(1);
    }));

    it('should escapeToClose == true', inject(function($md083forkDialog, $rootScope, $rootElement, $timeout, $animate, $md083forkConstant) {
      var parent = angular.element('<div>');
      $md083forkDialog.show({
        template: '<md083fork-dialog>',
        parent: parent,
        escapeToClose: true
      });
      $rootScope.$apply();

      var container = angular.element(parent[0].querySelector('.md-dialog-container'));
      parent.find('md083fork-dialog').triggerHandler('transitionend');
      $rootScope.$apply();

      expect(parent.find('md083fork-dialog').length).toBe(1);

      $rootElement.triggerHandler({type: 'keyup',
        keyCode: $md083forkConstant.KEY_CODE.ESCAPE
      });

      $timeout.flush();
      parent.find('md083fork-dialog').triggerHandler('transitionend');
      $rootScope.$apply();
      expect(parent.find('md083fork-dialog').length).toBe(0);
    }));

    it('should escapeToClose == false', inject(function($md083forkDialog, $rootScope, $rootElement, $timeout, $animate, $md083forkConstant) {
      var parent = angular.element('<div>');
      $md083forkDialog.show({
        template: '<md083fork-dialog>',
        parent: parent,
        escapeToClose: false
      });
      $rootScope.$apply();

      var container = angular.element(parent[0].querySelector('.md-dialog-container'));
      container.triggerHandler('transitionend');
      $rootScope.$apply();

      expect(parent.find('md083fork-dialog').length).toBe(1);

      $rootElement.triggerHandler({ type: 'keyup', keyCode: $md083forkConstant.KEY_CODE.ESCAPE });

      $timeout.flush();
      $animate.triggerCallbacks();
      expect(parent.find('md083fork-dialog').length).toBe(1);
    }));

    it('should clickOutsideToClose == true', inject(function($md083forkDialog, $rootScope, $timeout, $animate, $md083forkConstant) {

      var parent = angular.element('<div>');
      $md083forkDialog.show({
        template: '<md083fork-dialog>',
        parent: parent,
        clickOutsideToClose: true
      });
      $rootScope.$apply();

      var container = angular.element(parent[0].querySelector('.md-dialog-container'));
      parent.find('md083fork-dialog').triggerHandler('transitionend');
      $rootScope.$apply();

      expect(parent.find('md083fork-dialog').length).toBe(1);

      container.triggerHandler({
        type: 'click',
        target: container[0]
      });
      $timeout.flush();
      parent.find('md083fork-dialog').triggerHandler('transitionend');
      $rootScope.$apply();

      expect(parent.find('md083fork-dialog').length).toBe(0);
    }));

    it('should clickOutsideToClose == false', inject(function($md083forkDialog, $rootScope, $timeout, $animate) {

      var parent = angular.element('<div>');
      $md083forkDialog.show({
        template: '<md083fork-dialog>',
        parent: parent,
        clickOutsideToClose: false
      });

      $rootScope.$apply();
      expect(parent.find('md083fork-dialog').length).toBe(1);

      var container = angular.element(parent[0].querySelector('.md-dialog-container'));

      container.triggerHandler('click');
      $timeout.flush();
      $animate.triggerCallbacks();

      expect(parent[0].querySelectorAll('md083fork-dialog').length).toBe(1);
    }));

    it('should disableParentScroll == true', inject(function($md083forkDialog, $animate, $rootScope) {
      var parent = angular.element('<div>');
      $md083forkDialog.show({
        template: '<md083fork-dialog>',
        parent: parent,
        disableParentScroll: true
      });
      $rootScope.$apply();
      $animate.triggerCallbacks();
      $rootScope.$apply();
      expect(parent.css('overflow')).toBe('hidden');
    }));

    it('should hasBackdrop == true', inject(function($md083forkDialog, $animate, $rootScope) {
      var parent = angular.element('<div>');
      $md083forkDialog.show({
        template: '<md083fork-dialog>',
        parent: parent,
        hasBackdrop: true
      });

      $rootScope.$apply();
      $animate.triggerCallbacks();
      $rootScope.$apply();
      expect(parent.find('md083fork-dialog').length).toBe(1);
      expect(parent.find('md083fork-backdrop').length).toBe(1);
    }));

    it('should hasBackdrop == false', inject(function($md083forkDialog, $rootScope) {
      var parent = angular.element('<div>');
      $md083forkDialog.show({
        template: '<md083fork-dialog>',
        parent: parent,
        hasBackdrop: false
      });

      $rootScope.$apply();
      expect(parent[0].querySelectorAll('md083fork-dialog').length).toBe(1);
      expect(parent[0].querySelectorAll('md083fork-backdrop').length).toBe(0);
    }));

    it('should focus `md083fork-button.dialog-close` on open', inject(function($md083forkDialog, $rootScope, $document, $timeout, $md083forkConstant) {
      TestUtil.mockElementFocus(this);

      var parent = angular.element('<div>');
      $md083forkDialog.show({
        template:
          '<md083fork-dialog>' +
            '<div class="md-actions">' +
              '<button class="dialog-close">Close</button>' +
            '</div>' +
            '</md083fork-dialog>',
        parent: parent
      });

      $rootScope.$apply();
      $timeout.flush();
      var container = angular.element(parent[0].querySelector('.md-dialog-container'));
      container.triggerHandler('transitionend');
      $rootScope.$apply();
      parent.find('md083fork-dialog').triggerHandler('transitionend');
      $rootScope.$apply();


      expect($document.activeElement).toBe(parent[0].querySelector('.dialog-close'));
    }));

    it('should focus the last `md083fork-button` in md-actions open if no `.dialog-close`', inject(function($md083forkDialog, $rootScope, $document, $timeout, $md083forkConstant) {
      TestUtil.mockElementFocus(this);

      var parent = angular.element('<div>');
      $md083forkDialog.show({
        template:
          '<md083fork-dialog>' +
            '<div class="md-actions">' +
              '<button id="a">A</md083fork-button>' +
              '<button id="focus-target">B</md083fork-button>' +
            '</div>' +
          '</md083fork-dialog>',
        parent: parent
      });

      $rootScope.$apply();
      $timeout.flush();

      var container = angular.element(parent[0].querySelector('.md-dialog-container'));
      container.triggerHandler('transitionend');
      $rootScope.$apply();
      parent.find('md083fork-dialog').triggerHandler('transitionend');
      $rootScope.$apply();

      expect($document.activeElement).toBe(parent[0].querySelector('#focus-target'));
    }));

    it('should only allow one open at a time', inject(function($md083forkDialog, $rootScope, $animate) {
      var parent = angular.element('<div>');
      $md083forkDialog.show({
        template: '<md083fork-dialog class="one">',
        parent: parent
      });
      $rootScope.$apply();
      $animate.triggerCallbacks();

      expect(parent[0].querySelectorAll('md083fork-dialog.one').length).toBe(1);
      expect(parent[0].querySelectorAll('md083fork-dialog.two').length).toBe(0);

      $md083forkDialog.show({
        template: '<md083fork-dialog class="two">',
        parent: parent
      });
      $rootScope.$apply();
      $animate.triggerCallbacks();
      parent.find('md083fork-dialog').triggerHandler('transitionend');
      $rootScope.$apply();
      $animate.triggerCallbacks();

      parent.find('md083fork-dialog').triggerHandler('transitionend');
      $rootScope.$apply();
      $animate.triggerCallbacks();
      $rootScope.$apply();
      $animate.triggerCallbacks();
      expect(parent[0].querySelectorAll('md083fork-dialog.one').length).toBe(0);
      expect(parent[0].querySelectorAll('md083fork-dialog.two').length).toBe(1);
    }));

    it('should have the dialog role', inject(function($md083forkDialog, $rootScope) {
      var template = '<md083fork-dialog>Hello</md083fork-dialog>';
      var parent = angular.element('<div>');

      $md083forkDialog.show({
        template: template,
        parent: parent
      });

      $rootScope.$apply();

      var dialog = angular.element(parent[0].querySelectorAll('md083fork-dialog'));
      expect(dialog.attr('role')).toBe('dialog');
    }));

    it('should create an ARIA label if one is missing', inject(function($md083forkDialog, $rootScope) {
      var template = '<md083fork-dialog>Hello</md083fork-dialog>';
      var parent = angular.element('<div>');

      $md083forkDialog.show({
        template: template,
        parent: parent
      });

      $rootScope.$apply();
      angular.element(parent[0].querySelector('.md-dialog-container')).triggerHandler('transitionend');
      $rootScope.$apply();

      var dialog = angular.element(parent[0].querySelector('md083fork-dialog'));
      expect(dialog.attr('aria-label')).toEqual(dialog.text());
    }));

    it('should not modify an existing ARIA label', inject(function($md083forkDialog, $rootScope){
      var template = '<md083fork-dialog aria-label="Some Other Thing">Hello</md083fork-dialog>';
      var parent = angular.element('<div>');

      $md083forkDialog.show({
        template: template,
        parent: parent
      });

      $rootScope.$apply();

      var dialog = angular.element(parent[0].querySelector('md083fork-dialog'));
      expect(dialog.attr('aria-label')).not.toEqual(dialog.text());
      expect(dialog.attr('aria-label')).toEqual('Some Other Thing');
    }));
  });

  function hasConfigurationMethods(preset, methods) {
    angular.forEach(methods, function(method) {
      return it('supports config method #' + method, inject(function($md083forkDialog) {
        var dialog = $md083forkDialog[preset]();
        expect(typeof dialog[method]).toBe('function');
        expect(dialog[method]()).toEqual(dialog);
      }));
    });
  }
});

describe('$md083forkDialog with custom interpolation symbols', function() {
  beforeEach(module('material.083fork.components.dialog', 'ngAnimateMock'));

  beforeEach(module(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
  }));

  it('displays #alert() correctly', inject(function($md083forkDialog, $rootScope) {
    var parent = angular.element('<div>');
    var dialog = $md083forkDialog.
        alert({parent: parent}).
        ariaLabel('test alert').
        title('Title').
        content('Hello, world !').
        ok('OK');

    $md083forkDialog.show(dialog);
    $rootScope.$digest();

    var mdContainer = angular.element(parent[0].querySelector('.md-dialog-container'));
    var mdDialog = mdContainer.find('md083fork-dialog');
    var mdContent = mdDialog.find('md083fork-content');
    var title = mdContent.find('h2');
    var content = mdContent.find('p');
    var mdActions = angular.element(mdDialog[0].querySelector('.md-actions'));
    var buttons = mdActions.find('md083fork-button');

    expect(mdDialog.attr('aria-label')).toBe('test alert');
    expect(title.text()).toBe('Title');
    expect(content.text()).toBe('Hello, world !');
    expect(buttons.eq(0).text()).toBe('OK');
  }));

  it('displays #confirm() correctly', inject(function($md083forkDialog, $rootScope) {
    var parent = angular.element('<div>');
    var dialog = $md083forkDialog.
        confirm({parent: parent}).
        ariaLabel('test alert').
        title('Title').
        content('Hello, world !').
        cancel('CANCEL').
        ok('OK');

    $md083forkDialog.show(dialog);
    $rootScope.$digest();

    var mdContainer = angular.element(parent[0].querySelector('.md-dialog-container'));
    var mdDialog = mdContainer.find('md083fork-dialog');
    var mdContent = mdDialog.find('md083fork-content');
    var title = mdContent.find('h2');
    var content = mdContent.find('p');
    var mdActions = angular.element(mdDialog[0].querySelector('.md-actions'));
    var buttons = mdActions.find('md083fork-button');

    expect(mdDialog.attr('aria-label')).toBe('test alert');
    expect(title.text()).toBe('Title');
    expect(content.text()).toBe('Hello, world !');
    expect(buttons.eq(0).text()).toBe('CANCEL');
    expect(buttons.eq(1).text()).toBe('OK');
  }));
});

