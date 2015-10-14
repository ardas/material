(function() {
'use strict';

/**
 * @ngdoc module
 * @name material.components.toast
 * @description
 * Toast
 */
angular.module('material.083fork.components.toast', [
  'material.083fork.core',
  'material.083fork.components.button'
])
  .directive('md083forkToast', MdToastDirective)
  .provider('$md083forkToast', MdToastProvider);

function MdToastDirective() {
  return {
    restrict: 'E'
  };
}

/**
 * @ngdoc service
 * @name $md083forkToast
 * @module material.components.toast
 *
 * @description
 * `$md083forkToast` is a service to build a toast nofication on any position
 * on the screen with an optional duration, and provides a simple promise API.
 *
 *
 * ## Restrictions on custom toasts
 * - The toast's template must have an outer `<md083fork-toast>` element.
 * - For a toast action, use element with class `md-action`.
 * - Add the class `md-capsule` for curved corners.
 *
 * @usage
 * <hljs lang="html">
 * <div ng-controller="MyController">
 *   <md-button ng-click="openToast()">
 *     Open a Toast!
 *   </md-button>
 * </div>
 * </hljs>
 *
 * <hljs lang="js">
 * var app = angular.module('app', ['ngMaterial']);
 * app.controller('MyController', function($scope, $md083forkToast) {
 *   $scope.openToast = function($event) {
 *     $md083forkToast.show($md083forkToast.simple().content('Hello!'));
 *     // Could also do $md083forkToast.showSimple('Hello');
 *   };
 * });
 * </hljs>
 */

/**
 * @ngdoc method
 * @name $md083forkToast#showSimple
 * 
 * @description
 * Convenience method which builds and shows a simple toast.
 *
 * @returns {promise} A promise that can be resolved with `$md083forkToast.hide()` or
 * rejected with `$md083forkToast.cancel()`.
 *
 */

 /**
 * @ngdoc method
 * @name $md083forkToast#simple
 *
 * @description
 * Builds a preconfigured toast.
 *
 * @returns {obj} a `$md083forkToastPreset` with the chainable configuration methods:
 *
 * - $md083forkToastPreset#content(string) - sets toast content to string
 * - $md083forkToastPreset#action(string) - adds an action button, which resolves the promise returned from `show()` if clicked.
 * - $md083forkToastPreset#highlightAction(boolean) - sets action button to be highlighted
 * - $md083forkToastPreset#capsule(boolean) - adds 'md-capsule' class to the toast (curved corners)
 * - $md083forkToastPreset#theme(boolean) - sets the theme on the toast to theme (default is `$md083forkThemingProvider`'s default theme)
 */

/**
 * @ngdoc method
 * @name $md083forkToast#updateContent
 * 
 * @description
 * Updates the content of an existing toast. Useful for updating things like counts, etc.
 *
 */

 /**
 * @ngdoc method
 * @name $md083forkToast#build
 *
 * @description
 * Creates a custom `$md083forkToastPreset` that you can configure.
 *
 * @returns {obj} a `$md083forkToastPreset` with the chainable configuration methods for shows' options (see below).
 */

 /**
 * @ngdoc method
 * @name $md083forkToast#show
 *
 * @description Shows the toast.
 *
 * @param {object} optionsOrPreset Either provide an `$md083forkToastPreset` returned from `simple()`
 * and `build()`, or an options object with the following properties:
 *
 *   - `templateUrl` - `{string=}`: The url of an html template file that will
 *     be used as the content of the toast. Restrictions: the template must
 *     have an outer `md083fork-toast` element.
 *   - `template` - `{string=}`: Same as templateUrl, except this is an actual
 *     template string.
 *   - `scope` - `{object=}`: the scope to link the template / controller to. If none is specified, it will create a new child scope.
 *     This scope will be destroyed when the toast is removed unless `preserveScope` is set to true.
 *   - `preserveScope` - `{boolean=}`: whether to preserve the scope when the element is removed. Default is false
 *   - `hideDelay` - `{number=}`: How many milliseconds the toast should stay
 *     active before automatically closing.  Set to 0 or false to have the toast stay open until
 *     closed manually. Default: 3000.
 *   - `position` - `{string=}`: Where to place the toast. Available: any combination
 *     of 'bottom', 'left', 'top', 'right', 'fit'. Default: 'bottom left'.
 *   - `controller` - `{string=}`: The controller to associate with this toast.
 *     The controller will be injected the local `$hideToast`, which is a function
 *     used to hide the toast.
 *   - `locals` - `{string=}`: An object containing key/value pairs. The keys will
 *     be used as names of values to inject into the controller. For example,
 *     `locals: {three: 3}` would inject `three` into the controller with the value
 *     of 3.
 *   - `bindToController` - `bool`: bind the locals to the controller, instead of passing them in. These values will not be available until after initialization.
 *   - `resolve` - `{object=}`: Similar to locals, except it takes promises as values
 *     and the toast will not open until the promises resolve.
 *   - `controllerAs` - `{string=}`: An alias to assign the controller to on the scope.
 *   - `parent` - `{element=}`: The element to append the toast to. Defaults to appending
 *     to the root element of the application.
 *
 * @returns {promise} A promise that can be resolved with `$md083forkToast.hide()` or
 * rejected with `$md083forkToast.cancel()`.
 */

/**
 * @ngdoc method
 * @name $md083forkToast#hide
 *
 * @description
 * Hide an existing toast and resolve the promise returned from `$md083forkToast.show()`.
 *
 * @param {*=} response An argument for the resolved promise.
 *
 * @returns {promise} a promise that is called when the existing element is removed from the DOM
 *
 */

/**
 * @ngdoc method
 * @name $md083forkToast#cancel
 *
 * @description
 * Hide the existing toast and reject the promise returned from
 * `$md083forkToast.show()`.
 *
 * @param {*=} response An argument for the rejected promise.
 *
 * @returns {promise} a promise that is called when the existing element is removed from the DOM
 *
 */

function MdToastProvider($$083forkInterimElementProvider) {
  var activeToastContent;
  var $md083forkToast = $$083forkInterimElementProvider('$md083forkToast')
    .setDefaults({
      methods: ['position', 'hideDelay', 'capsule'],
      options: toastDefaultOptions
    })
    .addPreset('simple', {
      argOption: 'content',
      methods: ['content', 'action', 'highlightAction', 'theme'],
      options: /* @ngInject */ function($md083forkToast, $md083forkTheming) {
        var opts = {
          template: [
            '<md083fork-toast md-theme="{{ toast.theme }}" ng-class="{\'md-capsule\': toast.capsule}">',
              '<span flex>{{ toast.content }}</span>',
              '<md-button class="md-action" ng-if="toast.action" ng-click="toast.resolve()" ng-class="{\'md-highlight\': toast.highlightAction}">',
                '{{ toast.action }}',
              '</md-button>',
            '</md083fork-toast>'
          ].join(''),
          controller: /* @ngInject */ function mdToastCtrl($scope) {
            var self = this;
            $scope.$watch(function() { return activeToastContent; }, function() {
              self.content = activeToastContent;
            });
            this.resolve = function() {
              $md083forkToast.hide();
            };
          },
          theme: $md083forkTheming.defaultTheme(),
          controllerAs: 'toast',
          bindToController: true
        };
        return opts;
      }
    })
    .addMethod('updateContent', function(newContent) {
      activeToastContent = newContent;
    });

    return $md083forkToast;

  /* @ngInject */
  function toastDefaultOptions($timeout, $animate, $md083forkToast) {
    return {
      onShow: onShow,
      onRemove: onRemove,
      position: 'bottom left',
      themable: true,
      hideDelay: 3000
    };

    function onShow(scope, element, options) {
      // 'top left' -> 'md-top md-left'
      activeToastContent = options.content;
      element.addClass(options.position.split(' ').map(function(pos) {
        return 'md-' + pos;
      }).join(' '));
      options.parent.addClass(toastOpenClass(options.position));

      options.onSwipe = function(ev, gesture) {
        //Add swipeleft/swiperight class to element so it can animate correctly
        element.addClass('md-' + ev.type.replace('$md.',''));
        $timeout($md083forkToast.cancel);
      };
      element.on('$md.swipeleft $md.swiperight', options.onSwipe);
      return $animate.enter(element, options.parent);
    }

    function onRemove(scope, element, options) {
      element.off('$md.swipeleft $md.swiperight', options.onSwipe);
      options.parent.removeClass(toastOpenClass(options.position));
      return $animate.leave(element);
    }

    function toastOpenClass(position) {
      return 'md-toast-open-' +
        (position.indexOf('top') > -1 ? 'top' : 'bottom');
    }
  }

}

})();
