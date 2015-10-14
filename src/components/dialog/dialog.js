(function() {
'use strict';

/**
 * @ngdoc module
 * @name material.components.dialog
 */
angular.module('material.083fork.components.dialog', [
  'material.083fork.core',
  'material.083fork.components.backdrop'
])
  .directive('md083forkDialog', MdDialogDirective)
  .provider('$md083forkDialog', MdDialogProvider);

function MdDialogDirective($$rAF, $md083forkTheming) {
  return {
    restrict: 'E',
    link: function(scope, element, attr) {
      $md083forkTheming(element);
      $$rAF(function() {
        var content = element[0].querySelector('md-content');
        if (content && content.scrollHeight > content.clientHeight) {
          element.addClass('md-content-overflow');
        }
      });
    }
  };
}

/**
 * @ngdoc service
 * @name $md083forkDialog
 * @module material.components.dialog
 *
 * @description
 * `$md083forkDialog` opens a dialog over the app to inform users about critical information or require
 *  them to make decisions. There are two approaches for setup: a simple promise API
 *  and regular object syntax.
 *
 * ## Restrictions
 *
 * - The dialog is always given an isolate scope.
 * - The dialog's template must have an outer `<md083fork-dialog>` element.
 *   Inside, use an `<md-content>` element for the dialog's content, and use
 *   an element with class `md-actions` for the dialog's actions.
 *
 * @usage
 * ### HTML
 *
 * <hljs lang="html">
 * <div  ng-app="demoApp" ng-controller="EmployeeController">
 *   <md083fork-button ng-click="showAlert()" class="md-raised md-warn">
 *     Employee Alert!
 *   </md083fork-button>
 *   <md083fork-button ng-click="showDialog($event)" class="md-raised">
 *     Custom Dialog
 *   </md083fork-button>
 *   <md083fork-button ng-click="closeAlert()" ng-disabled="!hasAlert()" class="md-raised">
 *     Close Alert
 *   </md083fork-button>
 *   <md083fork-button ng-click="showGreeting($event)" class="md-raised md-primary" >
 *     Greet Employee
 *   </md083fork-button>
 * </div>
 * </hljs>
 *
 * ### JavaScript: object syntax
 * <hljs lang="js">
 * (function(angular, undefined){
 *   "use strict";
 *
 *   angular
 *    .module('demoApp', ['ngMaterial'])
 *    .controller('AppCtrl', AppController);
 *
 *   function AppController($scope, $md083forkDialog) {
 *     var alert;
 *     $scope.showAlert = showAlert;
 *     $scope.showDialog = showDialog;
 *     $scope.items = [1, 2, 3];
 *
 *     // Internal method
 *     function showAlert() {
 *       alert = $md083forkDialog.alert({
 *         title: 'Attention',
 *         content: 'This is an example of how easy dialogs can be!',
 *         ok: 'Close'
 *       });
 *
 *       $md083forkDialog
 *         .show( alert )
 *         .finally(function() {
 *           alert = undefined;
 *         });
 *     }
 *
 *     function showDialog($event) {
 *        var parentEl = angular.element(document.body);
 *        $md083forkDialog.show({
 *          parent: parentEl,
 *          targetEvent: $event,
 *          template:
 *            '<md083fork-dialog aria-label="List dialog">' +
 *            '  <md-content>'+
 *            '    <md-list>'+
 *            '      <md-item ng-repeat="item in items">'+
 *            '       <p>Number {{item}}</p>' +
 *            '      </md-item>'+
 *            '    </md-list>'+
 *            '  </md-content>' +
 *            '  <div class="md-actions">' +
 *            '    <md083fork-button ng-click="closeDialog()">' +
 *            '      Close Dialog' +
 *            '    </md083fork-button>' +
 *            '  </div>' +
 *            '</md083fork-dialog>',
 *          locals: {
 *            items: $scope.items
 *          },
 *          controller: DialogController
 *       });
 *       function DialogController(scope, $md083forkDialog, items) {
 *         scope.items = items;
 *         scope.closeDialog = function() {
 *           $md083forkDialog.hide();
 *         }
 *       }
 *     }
 *
 * })(angular);
 * </hljs>
 *
 * ### JavaScript: promise API syntax, custom dialog template
 * <hljs lang="js">
 * (function(angular, undefined){
 *   "use strict";
 *
 *   angular
 *     .module('demoApp', ['ngMaterial'])
 *     .controller('EmployeeController', EmployeeEditor)
 *     .controller('GreetingController', GreetingController);
 *
 *   // Fictitious Employee Editor to show how to use simple and complex dialogs.
 *
 *   function EmployeeEditor($scope, $md083forkDialog) {
 *     var alert;
 *
 *     $scope.showAlert = showAlert;
 *     $scope.closeAlert = closeAlert;
 *     $scope.showGreeting = showCustomGreeting;
 *
 *     $scope.hasAlert = function() { return !!alert };
 *     $scope.userName = $scope.userName || 'Bobby';
 *
 *     // Dialog #1 - Show simple alert dialog and cache
 *     // reference to dialog instance
 *
 *     function showAlert() {
 *       alert = $md083forkDialog.alert()
 *         .title('Attention, ' + $scope.userName)
 *         .content('This is an example of how easy dialogs can be!')
 *         .ok('Close');
 *
 *       $md083forkDialog
 *           .show( alert )
 *           .finally(function() {
 *             alert = undefined;
 *           });
 *     }
 *
 *     // Close the specified dialog instance and resolve with 'finished' flag
 *     // Normally this is not needed, just use '$md083forkDialog.hide()' to close
 *     // the most recent dialog popup.
 *
 *     function closeAlert() {
 *       $md083forkDialog.hide( alert, "finished" );
 *       alert = undefined;
 *     }
 *
 *     // Dialog #2 - Demonstrate more complex dialogs construction and popup.
 *
 *     function showCustomGreeting($event) {
 *         $md083forkDialog.show({
 *           targetEvent: $event,
 *           template:
 *             '<md083fork-dialog>' +
 *
 *             '  <md-content>Hello {{ employee }}!</md-content>' +
 *
 *             '  <div class="md-actions">' +
 *             '    <md083fork-button ng-click="closeDialog()">' +
 *             '      Close Greeting' +
 *
 *             '    </md083fork-button>' +
 *             '  </div>' +
 *             '</md083fork-dialog>',
 *           controller: 'GreetingController',
 *           onComplete: afterShowAnimation,
 *           locals: { employee: $scope.userName }
 *         });
 *
 *         // When the 'enter' animation finishes...
 *
 *         function afterShowAnimation(scope, element, options) {
 *            // post-show code here: DOM element focus, etc.
 *         }
 *     }
 *   }
 *
 *   // Greeting controller used with the more complex 'showCustomGreeting()' custom dialog
 *
 *   function GreetingController($scope, $md083forkDialog, employee) {
 *     // Assigned from construction <code>locals</code> options...
 *     $scope.employee = employee;
 *
 *     $scope.closeDialog = function() {
 *       // Easily hides most recent dialog shown...
 *       // no specific instance reference is needed.
 *       $md083forkDialog.hide();
 *     };
 *   }
 *
 * })(angular);
 * </hljs>
 */

 /**
 * @ngdoc method
 * @name $md083forkDialog#alert
 *
 * @description
 * Builds a preconfigured dialog with the specified message.
 *
 * @returns {obj} an `$md083forkDialogPreset` with the chainable configuration methods:
 *
 * - $md083forkDialogPreset#title(string) - sets title to string
 * - $md083forkDialogPreset#content(string) - sets content / message to string
 * - $md083forkDialogPreset#ok(string) - sets okay button text to string
 * - $md083forkDialogPreset#theme(string) - sets the theme of the dialog
 *
 */

 /**
 * @ngdoc method
 * @name $md083forkDialog#confirm
 *
 * @description
 * Builds a preconfigured dialog with the specified message. You can call show and the promise returned
 * will be resolved only if the user clicks the confirm action on the dialog.
 *
 * @returns {obj} an `$md083forkDialogPreset` with the chainable configuration methods:
 *
 * Additionally, it supports the following methods:
 *
 * - $md083forkDialogPreset#title(string) - sets title to string
 * - $md083forkDialogPreset#content(string) - sets content / message to string
 * - $md083forkDialogPreset#ok(string) - sets okay button text to string
 * - $md083forkDialogPreset#cancel(string) - sets cancel button text to string
 * - $md083forkDialogPreset#theme(string) - sets the theme of the dialog
 *
 */

/**
 * @ngdoc method
 * @name $md083forkDialog#show
 *
 * @description
 * Show a dialog with the specified options.
 *
 * @param {object} optionsOrPreset Either provide an `$md083forkDialogPreset` returned from `alert()`, and
 * `confirm()`, or an options object with the following properties:
 *   - `templateUrl` - `{string=}`: The url of a template that will be used as the content
 *   of the dialog.
 *   - `template` - `{string=}`: Same as templateUrl, except this is an actual template string.
 *   - `targetEvent` - `{DOMClickEvent=}`: A click's event object. When passed in as an option,
 *     the location of the click will be used as the starting point for the opening animation
 *     of the the dialog.
 *   - `scope` - `{object=}`: the scope to link the template / controller to. If none is specified, it will create a new isolate scope.
 *     This scope will be destroyed when the dialog is removed unless `preserveScope` is set to true.
 *   - `preserveScope` - `{boolean=}`: whether to preserve the scope when the element is removed. Default is false
 *   - `disableParentScroll` - `{boolean=}`: Whether to disable scrolling while the dialog is open.
 *     Default true.
 *   - `hasBackdrop` - `{boolean=}`: Whether there should be an opaque backdrop behind the dialog.
 *     Default true.
 *   - `clickOutsideToClose` - `{boolean=}`: Whether the user can click outside the dialog to
 *     close it. Default true.
 *   - `escapeToClose` - `{boolean=}`: Whether the user can press escape to close the dialog.
 *     Default true.
 *   - `controller` - `{string=}`: The controller to associate with the dialog. The controller
 *     will be injected with the local `$md083forkDialog`, which passes along a scope for the dialog.
 *   - `locals` - `{object=}`: An object containing key/value pairs. The keys will be used as names
 *     of values to inject into the controller. For example, `locals: {three: 3}` would inject
 *     `three` into the controller, with the value 3. If `bindToController` is true, they will be
 *     copied to the controller instead. 
 *   - `bindToController` - `bool`: bind the locals to the controller, instead of passing them in. These values will not be available until after initialization.
 *   - `resolve` - `{object=}`: Similar to locals, except it takes promises as values, and the
 *     dialog will not open until all of the promises resolve.
 *   - `controllerAs` - `{string=}`: An alias to assign the controller to on the scope.
 *   - `parent` - `{element=}`: The element to append the dialog to. Defaults to appending
 *     to the root element of the application.
 *   - `onComplete` `{function=}`: Callback function used to announce when the show() action is
 *     finished.
 *
 * @returns {promise} A promise that can be resolved with `$md083forkDialog.hide()` or
 * rejected with `$md083forkDialog.cancel()`.
 */

/**
 * @ngdoc method
 * @name $md083forkDialog#hide
 *
 * @description
 * Hide an existing dialog and resolve the promise returned from `$md083forkDialog.show()`.
 *
 * @param {*=} response An argument for the resolved promise.
 */

/**
 * @ngdoc method
 * @name $md083forkDialog#cancel
 *
 * @description
 * Hide an existing dialog and reject the promise returned from `$md083forkDialog.show()`.
 *
 * @param {*=} response An argument for the rejected promise.
 */

function MdDialogProvider($$083forkInterimElementProvider) {

  var alertDialogMethods = ['title', 'content', 'ariaLabel', 'ok'];

  return $$083forkInterimElementProvider('$md083forkDialog')
    .setDefaults({
      methods: ['disableParentScroll', 'hasBackdrop', 'clickOutsideToClose', 'escapeToClose', 'targetEvent'],
      options: dialogDefaultOptions
    })
    .addPreset('alert', {
      methods: ['title', 'content', 'ariaLabel', 'ok', 'theme'],
      options: advancedDialogOptions
    })
    .addPreset('confirm', {
      methods: ['title', 'content', 'ariaLabel', 'ok', 'cancel', 'theme'],
      options: advancedDialogOptions
    });

  /* @ngInject */
  function advancedDialogOptions($md083forkDialog, $md083forkTheming) {
    return {
      template: [
        '<md083fork-dialog md-theme="{{ dialog.theme }}" aria-label="{{ dialog.ariaLabel }}">',
          '<md-content>',
            '<h2>{{ dialog.title }}</h2>',
            '<p>{{ dialog.content }}</p>',
          '</md-content>',
          '<div class="md-actions">',
            '<md083fork-button ng-if="dialog.$type == \'confirm\'" ng-click="dialog.abort()">',
              '{{ dialog.cancel }}',
            '</md083fork-button>',
            '<md083fork-button ng-click="dialog.hide()" class="md-primary">',
              '{{ dialog.ok }}',
            '</md083fork-button>',
          '</div>',
        '</md083fork-dialog>'
      ].join(''),
      controller: function mdDialogCtrl() {
        this.hide = function() {
          $md083forkDialog.hide(true);
        };
        this.abort = function() {
          $md083forkDialog.cancel();
        };
      },
      controllerAs: 'dialog',
      bindToController: true,
      theme: $md083forkTheming.defaultTheme()
    };
  }

  /* @ngInject */
  function dialogDefaultOptions($timeout, $rootElement, $compile, $animate, $md083forkAria, $document,
                                $md083forkUtil, $md083forkConstant, $md083forkTheming, $$rAF, $q, $md083forkDialog) {
    return {
      hasBackdrop: true,
      isolateScope: true,
      onShow: onShow,
      onRemove: onRemove,
      clickOutsideToClose: true,
      escapeToClose: true,
      targetEvent: null,
      disableParentScroll: true,
      transformTemplate: function(template) {
        return '<div class="md-dialog-container">' + template + '</div>';
      }
    };


    // On show method for dialogs
    function onShow(scope, element, options) {
      // Incase the user provides a raw dom element, always wrap it in jqLite
      options.parent = angular.element(options.parent);

      options.popInTarget = angular.element((options.targetEvent || {}).target);
      var closeButton = findCloseButton();

      configureAria(element.find('md083fork-dialog'));

      if (options.hasBackdrop) {
        // Fix for IE 10
        var computeFrom = (options.parent[0] == $document[0].body && $document[0].documentElement 
                           && $document[0].scrollTop) ? angular.element($document[0].documentElement) : options.parent;
        var parentOffset = computeFrom.prop('scrollTop');
        options.backdrop = angular.element('<md-backdrop class="md-dialog-backdrop md-opaque">');
        $md083forkTheming.inherit(options.backdrop, options.parent);
        $animate.enter(options.backdrop, options.parent);
        element.css('top', parentOffset +'px');
      }

      if (options.disableParentScroll) {
        options.lastOverflow = options.parent.css('overflow');
        options.parent.css('overflow', 'hidden');
      }

      return dialogPopIn(
        element,
        options.parent,
        options.popInTarget && options.popInTarget.length && options.popInTarget
      )
      .then(function() {
        if (options.escapeToClose) {
          options.rootElementKeyupCallback = function(e) {
            if (e.keyCode === $md083forkConstant.KEY_CODE.ESCAPE) {
              $timeout($md083forkDialog.cancel);
            }
          };
          $rootElement.on('keyup', options.rootElementKeyupCallback);
        }

        if (options.clickOutsideToClose) {
          options.dialogClickOutsideCallback = function(ev) {
            // Only close if we click the flex container outside the backdrop
            if (ev.target === element[0]) {
              $timeout($md083forkDialog.cancel);
            }
          };
          element.on('click', options.dialogClickOutsideCallback);
        }
        closeButton.focus();
      });


      function findCloseButton() {
        //If no element with class dialog-close, try to find the last
        //button child in md-actions and assume it is a close button
        var closeButton = element[0].querySelector('.dialog-close');
        if (!closeButton) {
          var actionButtons = element[0].querySelectorAll('.md-actions button');
          closeButton = actionButtons[ actionButtons.length - 1 ];
        }
        return angular.element(closeButton);
      }

    }

    // On remove function for all dialogs
    function onRemove(scope, element, options) {

      if (options.backdrop) {
        $animate.leave(options.backdrop);
      }
      if (options.disableParentScroll) {
        options.parent.css('overflow', options.lastOverflow);
        delete options.lastOverflow;
      }
      if (options.escapeToClose) {
        $rootElement.off('keyup', options.rootElementKeyupCallback);
      }
      if (options.clickOutsideToClose) {
        element.off('click', options.dialogClickOutsideCallback);
      }
      return dialogPopOut(
        element,
        options.parent,
        options.popInTarget && options.popInTarget.length && options.popInTarget
      ).then(function() {
        options.scope.$destroy();
        element.remove();
        options.popInTarget && options.popInTarget.focus();
      });

    }

    /**
     * Inject ARIA-specific attributes appropriate for Dialogs
     */
    function configureAria(element) {
      element.attr({
        'role': 'dialog'
      });

      var dialogContent = element.find('md-content');
      if (dialogContent.length === 0){
        dialogContent = element;
      }
      $md083forkAria.expectAsync(element, 'aria-label', function() {
        var words = dialogContent.text().split(/\s+/);
        if (words.length > 3) words = words.slice(0,3).concat('...');
        return words.join(' ');
      });
    }

    function dialogPopIn(container, parentElement, clickElement) {
      var dialogEl = container.find('md083fork-dialog');

      parentElement.append(container);
      transformToClickElement(dialogEl, clickElement);

      $$rAF(function() {
        dialogEl.addClass('transition-in')
          .css($md083forkConstant.CSS.TRANSFORM, '');
      });

      return $md083forkUtil.transitionEndPromise(dialogEl);
    }

    function dialogPopOut(container, parentElement, clickElement) {
      var dialogEl = container.find('md083fork-dialog');

      dialogEl.addClass('transition-out').removeClass('transition-in');
      transformToClickElement(dialogEl, clickElement);

      return $md083forkUtil.transitionEndPromise(dialogEl);
    }

    function transformToClickElement(dialogEl, clickElement) {
      if (clickElement) {
        var clickRect = clickElement[0].getBoundingClientRect();
        var dialogRect = dialogEl[0].getBoundingClientRect();

        var scaleX = Math.min(0.5, clickRect.width / dialogRect.width);
        var scaleY = Math.min(0.5, clickRect.height / dialogRect.height);

        dialogEl.css($md083forkConstant.CSS.TRANSFORM, 'translate3d(' +
          (-dialogRect.left + clickRect.left + clickRect.width/2 - dialogRect.width/2) + 'px,' +
          (-dialogRect.top + clickRect.top + clickRect.height/2 - dialogRect.height/2) + 'px,' +
          '0) scale(' + scaleX + ',' + scaleY + ')'
        );
      }
    }

    function dialogTransitionEnd(dialogEl) {
      var deferred = $q.defer();
      dialogEl.on($md083forkConstant.CSS.TRANSITIONEND, finished);
      function finished(ev) {
        //Make sure this transitionend didn't bubble up from a child
        if (ev.target === dialogEl[0]) {
          dialogEl.off($md083forkConstant.CSS.TRANSITIONEND, finished);
          deferred.resolve();
        }
      }
      return deferred.promise;
    }

  }
}

})();
