(function() {
'use strict';

/**
 * @ngdoc module
 * @name material.components.button
 * @description
 *
 * Button
 */
angular.module('material.083fork.components.button', [
  'material.083fork.core'
])
  .directive('md083forkButton', MdButtonDirective);

/**
 * @ngdoc directive
 * @name md083forkButton
 * @module material.components.button
 *
 * @restrict E
 *
 * @description
 * `<md083fork-button>` is a button directive with optional ink ripples (default enabled).
 *
 * If you supply a `href` or `ng-href` attribute, it will become an `<a>` element. Otherwise, it will
 * become a `<button>` element.
 *
 * As per the [material design spec](http://www.google.com/design/spec/style/color.html#color-ui-color-application)
 * the FAB button is in the accent color by default. The primary color palette may be used with
 * the `md-primary` class.
 *
 * @param {boolean=} md-no-ink If present, disable ripple ink effects.
 * @param {expression=} ng-disabled En/Disable based on the expression
 * @param {string=} md-ripple-size Overrides the default ripple size logic. Options: `full`, `partial`, `auto`
 * @param {string=} aria-label Adds alternative text to button for accessibility, useful for icon buttons.
 * If no default text is found, a warning will be logged.
 *
 * @usage
 * <hljs lang="html">
 *  <md083fork-button>
 *    Button
 *  </md083fork-button>
 *  <md083fork-button href="http://google.com" class="md083fork-button-colored">
 *    I'm a link
 *  </md083fork-button>
 *  <md083fork-button ng-disabled="true" class="md-colored">
 *    I'm a disabled button
 *  </md083fork-button>
 * </hljs>
 */
function MdButtonDirective($md083forkInkRipple$mdInkRipple, $md083forkTheming, $md083forkAria) {

  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    template: getTemplate,
    link: postLink
  };

  function isAnchor(attr) {
    return angular.isDefined(attr.href) || angular.isDefined(attr.ngHref);
  }
  
  function getTemplate(element, attr) {
    return isAnchor(attr) ?
           '<a class="md083fork-button" ng-transclude></a>' :
           '<button class="md083fork-button" ng-transclude></button>';
  }

  function postLink(scope, element, attr) {
    var node = element[0];
    $md083forkTheming(element);
    $md083forkInkRipple$mdInkRipple.attachButtonBehavior(scope, element);

    var elementHasText = node.textContent.trim();
    if (!elementHasText) {
      $md083forkAria.expect(element, 'aria-label');
    }

    // For anchor elements, we have to set tabindex manually when the 
    // element is disabled
    if (isAnchor(attr) && angular.isDefined(attr.ngDisabled) ) {
      scope.$watch(attr.ngDisabled, function(isDisabled) {
        element.attr('tabindex', isDisabled ? -1 : 0);
      });
    }
  }

}
})();
