describe('radioButton', function() {
  var CHECKED_CSS = 'md-checked';

  beforeEach(module('material.083fork.components.radioButton'));

  it('should set checked css class', inject(function($compile, $rootScope) {
    var element = $compile('<md083fork-radio-group ng-model="color">' +
                            '<md083fork-radio-button value="blue"></md083fork-radio-button>' +
                            '<md083fork-radio-button value="green"></md083fork-radio-button>' +
                          '</md083fork-radio-group>')($rootScope);

    $rootScope.$apply(function(){
      $rootScope.color = 'green';
    });

    var rbElements = element.find('md083fork-radio-button');

    expect(rbElements.eq(0).hasClass(CHECKED_CSS)).toEqual(false);
    expect(rbElements.eq(1).hasClass(CHECKED_CSS)).toEqual(true);
  }));

  it('should support mixed values', inject(function($compile, $rootScope) {
    var element = $compile('<md083fork-radio-group ng-model="value">' +
                            '<md083fork-radio-button value="1"></md083fork-radio-button>' +
                            '<md083fork-radio-button value="2"></md083fork-radio-button>' +
                          '</md083fork-radio-group>')($rootScope);

    $rootScope.$apply(function(){
      $rootScope.value = 1;
    });

    var rbElements = element.find('md083fork-radio-button');
    expect(rbElements.eq(0).hasClass(CHECKED_CSS)).toEqual(true);
  }));

  it('should set roles', inject(function($compile, $rootScope) {

    var element = $compile('<md083fork-radio-group ng-model="color">' +
                            '<md083fork-radio-button value="blue"></md083fork-radio-button>' +
                            '<md083fork-radio-button value="green"></md083fork-radio-button>' +
                          '</md083fork-radio-group>')($rootScope);

    var rbGroupElement = element;
    expect(rbGroupElement.eq(0).attr('role')).toEqual('radiogroup');
    expect(rbGroupElement.find('md083fork-radio-button').eq(0).attr('role')).toEqual('radio');
  }));

  it('should set aria states', inject(function($compile, $rootScope) {
    var element = $compile('<md083fork-radio-group ng-model="color">' +
                            '<md083fork-radio-button value="blue"></md083fork-radio-button>' +
                            '<md083fork-radio-button value="green"></md083fork-radio-button>' +
                          '</md083fork-radio-group>')($rootScope);

    $rootScope.$apply(function(){
      $rootScope.color = 'green';
    });

    var rbElements = element.find('md083fork-radio-button');

    expect(rbElements.eq(0).attr('aria-checked')).toEqual('false');
    expect(rbElements.eq(1).attr('aria-checked')).toEqual('true');

    expect(element.attr('aria-activedescendant')).toEqual(rbElements.eq(1).attr('id'));
    expect(element.attr('aria-activedescendant')).not.toEqual(rbElements.eq(0).attr('id'));
  }));

  it('should warn developers they need a label', inject(function($compile, $rootScope, $log){
    spyOn($log, "warn");
    var element = $compile('<md083fork-radio-group ng-model="color">' +
                            '<md083fork-radio-button value="blue"></md083fork-radio-button>' +
                            '<md083fork-radio-button value="green"></md083fork-radio-button>' +
                          '</md083fork-radio-group>')($rootScope);

    expect($log.warn).toHaveBeenCalled();
  }));

  it('should create an aria label from provided text', inject(function($compile, $rootScope) {
    var element = $compile('<md083fork-radio-group ng-model="color">' +
                            '<md083fork-radio-button value="blue">Blue</md083fork-radio-button>' +
                            '<md083fork-radio-button value="green">Green</md083fork-radio-button>' +
                          '</md083fork-radio-group>')($rootScope);

    var rbElements = element.find('md083fork-radio-button');
    expect(rbElements.eq(0).attr('aria-label')).toEqual('Blue');
  }));

  it('should preserve tabindex', inject(function($compile, $rootScope, $md083forkConstant) {
    var element = $compile('<md083fork-radio-group ng-model="color" tabindex="3">' +
                            '<md083fork-radio-button value="blue"></md083fork-radio-button>' +
                            '<md083fork-radio-button value="green"></md083fork-radio-button>' +
                          '</md083fork-radio-group>')($rootScope);

    var rbGroupElement = element.eq(0);
    expect(rbGroupElement.attr('tabindex')).toEqual('3');
  }));

  it('should be operable via arrow keys', inject(function($compile, $rootScope, $md083forkConstant) {
    var element = $compile('<md083fork-radio-group ng-model="color">' +
                            '<md083fork-radio-button value="blue"></md083fork-radio-button>' +
                            '<md083fork-radio-button value="green"></md083fork-radio-button>' +
                          '</md083fork-radio-group>')($rootScope);
    $rootScope.$apply(function(){
      $rootScope.color = 'blue';
    });

    var rbGroupElement = element.eq(0);
    rbGroupElement.triggerHandler({
      type: 'keydown',
      keyCode: $md083forkConstant.KEY_CODE.RIGHT_ARROW
    });

    expect($rootScope.color).toEqual('green');
  }));

  describe('ng core radio button tests', function() {

    it('should noop with no model', inject(function($compile, $rootScope) {
      var el;
      expect(function() {
        el = $compile('<md083fork-radio-group>' +
                              '<md083fork-radio-button value="white">' +
                              '</md083fork-radio-group>')($rootScope);
      }).not.toThrow();
      var rbElements = el.find('md083fork-radio-button');

      // Fire off the render function with no ngModel, make sure nothing
      // goes unexpectedly.
      expect(function() {
        rbElements.eq(0).triggerHandler('click');
      }).not.toThrow();
    }));

    it('should update the model', inject(function($compile, $rootScope) {
      var element = $compile('<md083fork-radio-group ng-model="color">' +
                              '<md083fork-radio-button value="white"></md083fork-radio-button>' +
                              '<md083fork-radio-button value="red"></md083fork-radio-button>' +
                              '<md083fork-radio-button value="blue"></md083fork-radio-button>' +
                            '</md083fork-radio-group>')($rootScope);
      var rbElements = element.find('md083fork-radio-button');

      $rootScope.$apply("color = 'white'");
      expect(rbElements.eq(0).hasClass(CHECKED_CSS)).toBe(true);
      expect(rbElements.eq(1).hasClass(CHECKED_CSS)).toBe(false);
      expect(rbElements.eq(2).hasClass(CHECKED_CSS)).toBe(false);

      $rootScope.$apply("color = 'red'");
      expect(rbElements.eq(0).hasClass(CHECKED_CSS)).toBe(false);
      expect(rbElements.eq(1).hasClass(CHECKED_CSS)).toBe(true);
      expect(rbElements.eq(2).hasClass(CHECKED_CSS)).toBe(false);

      rbElements.eq(2).triggerHandler('click');

      expect($rootScope.color).toBe('blue');
    }));

    it('should trigger a submit', inject(function($compile, $rootScope, $md083forkConstant) {

      $rootScope.testValue = false;
      $rootScope.submitFn = function(){
        $rootScope.testValue = true;
      };
      var element = $compile('<div><form ng-submit="submitFn()">' +
                              '<md083fork-radio-group ng-model="color">' +
                              '<md083fork-radio-button value="white"></md083fork-radio-button>' +
                              '</md083fork-radio-group>' +
                            '</form></div>')($rootScope);

      var formElement = element.find('form'),
          rbGroupElement = element.find('md083fork-radio-group');

      rbGroupElement.triggerHandler({
        type: 'keydown',
        keyCode: $md083forkConstant.KEY_CODE.ENTER
      });

      expect($rootScope.testValue).toBe(true);
    }));

    it('should be disabled', inject(function($compile, $rootScope) {
      var element = $compile('<md083fork-radio-group ng-model="color">' +
                              '<md083fork-radio-button value="white" ng-disabled="isDisabled"></md083fork-radio-button>' +
                              '</md083fork-radio-group>')($rootScope);
      var radio = element.find('md083fork-radio-button');

      $rootScope.$apply('isDisabled = true');
      $rootScope.$apply('color = null');
      radio.triggerHandler('click');
      expect($rootScope.color).toBe(null);

      $rootScope.$apply('isDisabled = false');
      radio.triggerHandler('click');
      expect($rootScope.color).toBe('white');
    }));

    it('should skip disabled on arrow key', inject(function($compile, $rootScope, $md083forkConstant) {
      var element = $compile(
        '<md083fork-radio-group ng-model="color">' +
        '  <md083fork-radio-button value="red"   ></md083fork-radio-button>' +
        '  <md083fork-radio-button value="white" ng-disabled="isDisabled"></md083fork-radio-button>' +
        '  <md083fork-radio-button value="blue" ></md083fork-radio-button>' +
        '</md083fork-radio-group>'
      )($rootScope);
      var rbGroupElement = element.eq(0);

      $rootScope.$apply('isDisabled = true');
      $rootScope.$apply('color = "red"');
      expect($rootScope.color).toBe("red");


      rightArrow();   expect($rootScope.color).toEqual('blue');
      rightArrow();   expect($rootScope.color).toEqual('red');
      rightArrow();   expect($rootScope.color).toEqual('blue');


      $rootScope.$apply('isDisabled = false');

      rightArrow();
      rightArrow();   expect($rootScope.color).toEqual('white');
      rightArrow();   expect($rootScope.color).toEqual('blue');

      function rightArrow() {
          rbGroupElement.triggerHandler({
            type: 'keydown',
            keyCode: $md083forkConstant.KEY_CODE.RIGHT_ARROW
          });
        }
    }));


    it('should allow {{expr}} as value', inject(function($compile, $rootScope) {
      $rootScope.some = 11;
      var element = $compile('<md083fork-radio-group ng-model="value">' +
          '<md083fork-radio-button value="{{some}}"></md083fork-radio-button>' +
          '<md083fork-radio-button value="{{other}}"></<md083fork-radio-button>' +
          '</md083fork-radio-group>')($rootScope);
      var rbElements = element.find('md083fork-radio-button');

      $rootScope.$apply(function() {
        $rootScope.value = 'blue';
        $rootScope.some = 'blue';
        $rootScope.other = 'red';
      });

      expect(rbElements.eq(0).hasClass(CHECKED_CSS)).toBe(true);
      expect(rbElements.eq(1).hasClass(CHECKED_CSS)).toBe(false);

      rbElements.eq(1).triggerHandler('click');
      expect($rootScope.value).toBe('red');

      $rootScope.$apply("other = 'non-red'");

      expect(rbElements.eq(0).hasClass(CHECKED_CSS)).toBe(false);
      expect(rbElements.eq(1).hasClass(CHECKED_CSS)).toBe(false);
    }));

  });
});
