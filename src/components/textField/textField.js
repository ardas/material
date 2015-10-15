(function() {
'use strict';

/**
 * @ngdoc module
 * @name material.components.textField
 * @description
 * Form
 */
angular.module('material.083fork.components.textField', [
  'material.083fork.core'
])
  .directive('md083forkInputGroup', mdInputGroupDirective)
  .directive('md083forkInput', mdInputDirective)
  .directive('md083forkTextFloat', mdTextFloatDirective);


function mdTextFloatDirective($md083forkTheming, $md083forkUtil, $parse, $log) {
  return {
    restrict: 'E',
    replace: true,
    scope : {
      fid : '@?mdFid',
      label : '@?',
      value : '=ngModel'
    },
    compile : function(element, attr) {

      $log.warn('<md083fork-text-float> is deprecated. Please use `<md083fork-input-container>` and `<input>`.' +
                'More information at http://material.angularjs.org/#/api/material.components.input/directive/md083forkInputContainer');

      if ( angular.isUndefined(attr.mdFid) ) {
        attr.mdFid = $md083forkUtil.nextUid();
      }

      return {
        pre : function(scope, element, attrs) {
          var disabledParsed = $parse(attrs.ngDisabled);
          scope.isDisabled = function() {
            return disabledParsed(scope.$parent);
          };

          scope.inputType = attrs.type || "text";
        },
        post: $md083forkTheming
      };
    },
    template:
    '<md083fork-input-group tabindex="-1">' +
    ' <label for="{{fid}}" >{{label}}</label>' +
    ' <md083fork-input id="{{fid}}" ng-disabled="isDisabled()" ng-model="value" type="{{inputType}}"></md083fork-input>' +
    '</md083fork-input-group>'
  };
}

function mdInputGroupDirective($log) {
  return {
    restrict: 'CE',
    controller: ['$element', function($element) {

      $log.warn('<md083fork-input-group> is deprecated. Please use `<md083fork-input-container>` and `<input>`.' +
                'More information at http://material.angularjs.org/#/api/material.components.input/directive/md083forkInputContainer');
      this.setFocused = function(isFocused) {
        $element.toggleClass('md-input-focused', !!isFocused);
      };
      this.setHasValue = function(hasValue) {
        $element.toggleClass('md-input-has-value', hasValue );
      };
    }]
  };

}

function mdInputDirective($md083forkUtil, $log) {
  return {
    restrict: 'E',
    replace: true,
    template: '<input >',
    require: ['^?md083forkInputGroup', '?ngModel'],
    link: function(scope, element, attr, ctrls) {
      if ( !ctrls[0] ) return;

      $log.warn('<md083fork-input> is deprecated. Please use `<md083fork-input-container>` and `<input>`.' +
                'More information at http://material.angularjs.org/#/api/material.components.input/directive/md083forkInputContainer');

      var inputGroupCtrl = ctrls[0];
      var ngModelCtrl = ctrls[1];

      scope.$watch(scope.isDisabled, function(isDisabled) {
        element.attr('aria-disabled', !!isDisabled);
        element.attr('tabindex', !!isDisabled);
      });
      element.attr('type', attr.type || element.parent().attr('type') || "text");

      // When the input value changes, check if it "has" a value, and
      // set the appropriate class on the input group
      if (ngModelCtrl) {
        //Add a $formatter so we don't use up the render function
        ngModelCtrl.$formatters.push(function(value) {
          inputGroupCtrl.setHasValue( isNotEmpty(value) );
          return value;
        });
      }

      element
        .on('input', function() {
          inputGroupCtrl.setHasValue( isNotEmpty() );
        })
        .on('focus', function(e) {
          // When the input focuses, add the focused class to the group
          inputGroupCtrl.setFocused(true);
        })
        .on('blur', function(e) {
          // When the input blurs, remove the focused class from the group
          inputGroupCtrl.setFocused(false);
          inputGroupCtrl.setHasValue( isNotEmpty() );
        });

      scope.$on('$destroy', function() {
        inputGroupCtrl.setFocused(false);
        inputGroupCtrl.setHasValue(false);
      });


      function isNotEmpty(value) {
        value = angular.isUndefined(value) ? element.val() : value;
        return (angular.isDefined(value) && (value!==null) &&
               (value.toString().trim() !== ""));
      }
    }
  };
}

})();
