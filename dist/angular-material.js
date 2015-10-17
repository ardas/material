/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
angular.module('ngMaterial083Fork', ["ng","ngAnimate","ngAria","material.083fork.core","material.083fork.core.theming.palette","material.083fork.core.theming","material.083fork.components.autocomplete","material.083fork.components.backdrop","material.083fork.components.button","material.083fork.components.checkbox","material.083fork.components.content","material.083fork.components.dialog","material.083fork.components.icon","material.083fork.components.input","material.083fork.components.radioButton","material.083fork.components.select","material.083fork.components.sidenav","material.083fork.components.slider","material.083fork.components.swipe","material.083fork.components.tabs","material.083fork.components.textField","material.083fork.components.toast"]);
/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';

/**
 * Initialization function that validates environment
 * requirements.
 */
angular
  .module('material.083fork.core', [ 'material.083fork.core.theming' ])
  .config( MdCoreConfigure );


function MdCoreConfigure($provide, $md083forkThemingProvider) {

  $provide.decorator('$$rAF', ["$delegate", rAFDecorator]);

  $md083forkThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('pink')
    .warnPalette('red')
    .backgroundPalette('grey');
}
MdCoreConfigure.$inject = ["$provide", "$md083forkThemingProvider"];

function rAFDecorator( $delegate ) {
  /**
   * Use this to throttle events that come in often.
   * The throttled function will always use the *last* invocation before the
   * coming frame.
   *
   * For example, window resize events that fire many times a second:
   * If we set to use an raf-throttled callback on window resize, then
   * our callback will only be fired once per frame, with the last resize
   * event that happened before that frame.
   *
   * @param {function} callback function to debounce
   */
  $delegate.throttle = function(cb) {
    var queueArgs, alreadyQueued, queueCb, context;
    return function debounced() {
      queueArgs = arguments;
      context = this;
      queueCb = cb;
      if (!alreadyQueued) {
        alreadyQueued = true;
        $delegate(function() {
          queueCb.apply(context, queueArgs);
          alreadyQueued = false;
        });
      }
    };
  };
  return $delegate;
}

})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';

angular.module('material.083fork.core')
.factory('$md083forkConstant', MdConstantFactory);

function MdConstantFactory($$rAF, $sniffer) {

  var webkit = /webkit/i.test($sniffer.vendorPrefix);
  function vendorProperty(name) {
    return webkit ?  ('webkit' + name.charAt(0).toUpperCase() + name.substring(1)) : name;
  }

  return {
    KEY_CODE: {
      ENTER: 13,
      ESCAPE: 27,
      SPACE: 32,
      LEFT_ARROW : 37,
      UP_ARROW : 38,
      RIGHT_ARROW : 39,
      DOWN_ARROW : 40,
      TAB : 9
    },
    CSS: {
      /* Constants */
      TRANSITIONEND: 'transitionend' + (webkit ? ' webkitTransitionEnd' : ''),
      ANIMATIONEND: 'animationend' + (webkit ? ' webkitAnimationEnd' : ''),

      TRANSFORM: vendorProperty('transform'),
      TRANSFORM_ORIGIN: vendorProperty('transformOrigin'),
      TRANSITION: vendorProperty('transition'),
      TRANSITION_DURATION: vendorProperty('transitionDuration'),
      ANIMATION_PLAY_STATE: vendorProperty('animationPlayState'),
      ANIMATION_DURATION: vendorProperty('animationDuration'),
      ANIMATION_NAME: vendorProperty('animationName'),
      ANIMATION_TIMING: vendorProperty('animationTimingFunction'),
      ANIMATION_DIRECTION: vendorProperty('animationDirection')
    },
    MEDIA: {
      'sm': '(max-width: 600px)',
      'gt-sm': '(min-width: 600px)',
      'md': '(min-width: 600px) and (max-width: 960px)',
      'gt-md': '(min-width: 960px)',
      'lg': '(min-width: 960px) and (max-width: 1200px)',
      'gt-lg': '(min-width: 1200px)'
    },
    MEDIA_PRIORITY: [
      'gt-lg',
      'lg',
      'gt-md',
      'md',
      'gt-sm',
      'sm'
    ]
  };
}
MdConstantFactory.$inject = ["$$rAF", "$sniffer"];

})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function(){

  angular
    .module('material.083fork.core')
    .config( ["$provide", function($provide){
       $provide.decorator('$md083forkUtil', ['$delegate', function ($delegate){
           /**
            * Inject the iterator facade to easily support iteration and accessors
            * @see iterator below
            */
           $delegate.iterator = Iterator;

           return $delegate;
         }
       ]);
     }]);

  /**
   * iterator is a list facade to easily support iteration and accessors
   *
   * @param items Array list which this iterator will enumerate
   * @param reloop Boolean enables iterator to consider the list as an endless reloop
   */
  function Iterator(items, reloop) {
    var trueFn = function() { return true; };

    if (items && !angular.isArray(items)) {
      items = Array.prototype.slice.call(items);
    }

    reloop = !!reloop;
    var _items = items || [ ];

    // Published API
    return {
      items: getItems,
      count: count,

      inRange: inRange,
      contains: contains,
      indexOf: indexOf,
      itemAt: itemAt,

      findBy: findBy,

      add: add,
      remove: remove,

      first: first,
      last: last,
      next: angular.bind(null, findSubsequentItem, false),
      previous: angular.bind(null, findSubsequentItem, true),

      hasPrevious: hasPrevious,
      hasNext: hasNext

    };

    /**
     * Publish copy of the enumerable set
     * @returns {Array|*}
     */
    function getItems() {
      return [].concat(_items);
    }

    /**
     * Determine length of the list
     * @returns {Array.length|*|number}
     */
    function count() {
      return _items.length;
    }

    /**
     * Is the index specified valid
     * @param index
     * @returns {Array.length|*|number|boolean}
     */
    function inRange(index) {
      return _items.length && ( index > -1 ) && (index < _items.length );
    }

    /**
     * Can the iterator proceed to the next item in the list; relative to
     * the specified item.
     *
     * @param item
     * @returns {Array.length|*|number|boolean}
     */
    function hasNext(item) {
      return item ? inRange(indexOf(item) + 1) : false;
    }

    /**
     * Can the iterator proceed to the previous item in the list; relative to
     * the specified item.
     *
     * @param item
     * @returns {Array.length|*|number|boolean}
     */
    function hasPrevious(item) {
      return item ? inRange(indexOf(item) - 1) : false;
    }

    /**
     * Get item at specified index/position
     * @param index
     * @returns {*}
     */
    function itemAt(index) {
      return inRange(index) ? _items[index] : null;
    }

    /**
     * Find all elements matching the key/value pair
     * otherwise return null
     *
     * @param val
     * @param key
     *
     * @return array
     */
    function findBy(key, val) {
      return _items.filter(function(item) {
        return item[key] === val;
      });
    }

    /**
     * Add item to list
     * @param item
     * @param index
     * @returns {*}
     */
    function add(item, index) {
      if ( !item ) return -1;

      if (!angular.isNumber(index)) {
        index = _items.length;
      }

      _items.splice(index, 0, item);

      return indexOf(item);
    }

    /**
     * Remove item from list...
     * @param item
     */
    function remove(item) {
      if ( contains(item) ){
        _items.splice(indexOf(item), 1);
      }
    }

    /**
     * Get the zero-based index of the target item
     * @param item
     * @returns {*}
     */
    function indexOf(item) {
      return _items.indexOf(item);
    }

    /**
     * Boolean existence check
     * @param item
     * @returns {boolean}
     */
    function contains(item) {
      return item && (indexOf(item) > -1);
    }

    /**
     * Return first item in the list
     * @returns {*}
     */
    function first() {
      return _items.length ? _items[0] : null;
    }

    /**
     * Return last item in the list...
     * @returns {*}
     */
    function last() {
      return _items.length ? _items[_items.length - 1] : null;
    }

    /**
     * Find the next item. If reloop is true and at the end of the list, it will go back to the
     * first item. If given, the `validate` callback will be used to determine whether the next item
     * is valid. If not valid, it will try to find the next item again.
     *
     * @param {boolean} backwards Specifies the direction of searching (forwards/backwards)
     * @param {*} item The item whose subsequent item we are looking for
     * @param {Function=} validate The `validate` function
     * @param {integer=} limit The recursion limit
     *
     * @returns {*} The subsequent item or null
     */
    function findSubsequentItem(backwards, item, validate, limit) {
      validate = validate || trueFn;

      var curIndex = indexOf(item);
      while (true) {
        if (!inRange(curIndex)) return null;

        var nextIndex = curIndex + (backwards ? -1 : 1);
        var foundItem = null;
        if (inRange(nextIndex)) {
          foundItem = _items[nextIndex];
        } else if (reloop) {
          foundItem = backwards ? last() : first();
          nextIndex = indexOf(foundItem);
        }

        if ((foundItem === null) || (nextIndex === limit)) return null;
        if (validate(foundItem)) return foundItem;

        if (angular.isUndefined(limit)) limit = nextIndex;

        curIndex = nextIndex;
      }
    }
  }

})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function(){

angular.module('material.083fork.core')
.factory('$md083forkMedia', mdMediaFactory);

/**
 * @ngdoc service
 * @name $md083forkMedia
 * @module material.083fork.core
 *
 * @description
 * `$md083forkMedia` is used to evaluate whether a given media query is true or false given the
 * current device's screen / window size. The media query will be re-evaluated on resize, allowing
 * you to register a watch.
 *
 * `$md083forkMedia` also has pre-programmed support for media queries that match the layout breakpoints.
 *  (`sm`, `gt-sm`, `md`, `gt-md`, `lg`, `gt-lg`).
 *
 * @returns {boolean} a boolean representing whether or not the given media query is true or false.
 *
 * @usage
 * <hljs lang="js">
 * app.controller('MyController', function($md083forkMedia, $scope) {
 *   $scope.$watch(function() { return $md083forkMedia('lg'); }, function(big) {
 *     $scope.bigScreen = big;
 *   });
 *
 *   $scope.screenIsSmall = $md083forkMedia('sm');
 *   $scope.customQuery = $md083forkMedia('(min-width: 1234px)');
 *   $scope.anotherCustom = $md083forkMedia('max-width: 300px');
 * });
 * </hljs>
 */

function mdMediaFactory($md083forkConstant, $rootScope, $window) {
  var queries = {};
  var mqls = {};
  var results = {};
  var normalizeCache = {};

  $md083forkMedia.getResponsiveAttribute = getResponsiveAttribute;
  $md083forkMedia.getQuery = getQuery;
  $md083forkMedia.watchResponsiveAttributes = watchResponsiveAttributes;

  return $md083forkMedia;

  function $md083forkMedia(query) {
    var validated = queries[query];
    if (angular.isUndefined(validated)) {
      validated = queries[query] = validate(query);
    }

    var result = results[validated];
    if (angular.isUndefined(result)) {
      result = add(validated);
    }

    return result;
  }

  function validate(query) {
    return $md083forkConstant.MEDIA[query] ||
           ((query.charAt(0) !== '(') ? ('(' + query + ')') : query);
  }

  function add(query) {
    var result = mqls[query] = $window.matchMedia(query);
    result.addListener(onQueryChange);
    return (results[result.media] = !!result.matches);
  }

  function onQueryChange(query) {
    $rootScope.$evalAsync(function() {
      results[query.media] = !!query.matches;
    });
  }

  function getQuery(name) {
    return mqls[name];
  }

  function getResponsiveAttribute(attrs, attrName) {
    for (var i = 0; i < $md083forkConstant.MEDIA_PRIORITY.length; i++) {
      var mediaName = $md083forkConstant.MEDIA_PRIORITY[i];
      if (!mqls[queries[mediaName]].matches) {
        continue;
      }

      var normalizedName = getNormalizedName(attrs, attrName + '-' + mediaName);
      if (attrs[normalizedName]) {
        return attrs[normalizedName];
      }
    }

    // fallback on unprefixed
    return attrs[getNormalizedName(attrs, attrName)];
  }

  function watchResponsiveAttributes(attrNames, attrs, watchFn) {
    var unwatchFns = [];
    attrNames.forEach(function(attrName) {
      var normalizedName = getNormalizedName(attrs, attrName);
      if (attrs[normalizedName]) {
        unwatchFns.push(
            attrs.$observe(normalizedName, angular.bind(void 0, watchFn, null)));
      }

      for (var mediaName in $md083forkConstant.MEDIA) {
        normalizedName = getNormalizedName(attrs, attrName + '-' + mediaName);
        if (!attrs[normalizedName]) {
          return;
        }

        unwatchFns.push(attrs.$observe(normalizedName, angular.bind(void 0, watchFn, mediaName)));
      }
    });

    return function unwatch() {
      unwatchFns.forEach(function(fn) { fn(); })
    };
  }

  // Improves performance dramatically
  function getNormalizedName(attrs, attrName) {
    return normalizeCache[attrName] ||
        (normalizeCache[attrName] = attrs.$normalize(attrName));
  }
}
mdMediaFactory.$inject = ["$md083forkConstant", "$rootScope", "$window"];


})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';

/*
 * This var has to be outside the angular factory, otherwise when
 * there are multiple material apps on the same page, each app
 * will create its own instance of this array and the app's IDs
 * will not be unique.
 */
var nextUniqueId = ['0','0','0'];

angular.module('material.083fork.core')
.factory('$md083forkUtil', ["$cacheFactory", "$document", "$timeout", "$q", "$window", "$md083forkConstant", function($cacheFactory, $document, $timeout, $q, $window, $md083forkConstant) {
  var Util;

  function getNode(el) {
    return el[0] || el;
  }

  return Util = {
    now: window.performance ?
      angular.bind(window.performance, window.performance.now) : 
      Date.now,

    clientRect: function(element, offsetParent, isOffsetRect) {
      var node = getNode(element);
      offsetParent = getNode(offsetParent || node.offsetParent || document.body);
      var nodeRect = node.getBoundingClientRect();

      // The user can ask for an offsetRect: a rect relative to the offsetParent,
      // or a clientRect: a rect relative to the page
      var offsetRect = isOffsetRect ?
        offsetParent.getBoundingClientRect() : 
        { left: 0, top: 0, width: 0, height: 0 };
      return {
        left: nodeRect.left - offsetRect.left + offsetParent.scrollLeft,
        top: nodeRect.top - offsetRect.top + offsetParent.scrollTop,
        width: nodeRect.width,
        height: nodeRect.height
      };
    },
    offsetRect: function(element, offsetParent) {
      return Util.clientRect(element, offsetParent, true);
    },

    floatingScrollbars: function() {
      if (this.floatingScrollbars.cached === undefined) {
        var tempNode = angular.element('<div style="z-index: -1; position: absolute; height: 1px; overflow-y: scroll"><div style="height: 2px;"></div></div>');
        $document[0].body.appendChild(tempNode[0]);
        this.floatingScrollbars.cached = (tempNode[0].offsetWidth == tempNode[0].childNodes[0].offsetWidth);
        tempNode.remove();
      }
      return this.floatingScrollbars.cached;
    },

    // Mobile safari only allows you to set focus in click event listeners...
    forceFocus: function(element) {
      var node = element[0] || element;

      document.addEventListener('click', function focusOnClick(ev) {
        if (ev.target === node && ev.$focus) {
          node.focus();
          ev.stopImmediatePropagation();
          ev.preventDefault();
          node.removeEventListener('click', focusOnClick);
        }
      }, true);

      var newEvent = document.createEvent('MouseEvents');
      newEvent.initMouseEvent('click', false, true, window, {}, 0, 0, 0, 0,
                       false, false, false, false, 0, null);
      newEvent.$material = true;
      newEvent.$focus = true;
      node.dispatchEvent(newEvent);
    },

    transitionEndPromise: function(element, opts) {
      opts = opts || {};
      var deferred = $q.defer();
      element.on($md083forkConstant.CSS.TRANSITIONEND, finished);
      function finished(ev) {
        // Make sure this transitionend didn't bubble up from a child
        if (!ev || ev.target === element[0]) {
          element.off($md083forkConstant.CSS.TRANSITIONEND, finished);
          deferred.resolve();
        }
      }
      if (opts.timeout) $timeout(finished, opts.timeout);
      return deferred.promise;
    },

    fakeNgModel: function() {
      return {
        $fake: true,
        $setTouched : angular.noop,
        $setViewValue: function(value) {
          this.$viewValue = value;
          this.$render(value);
          this.$viewChangeListeners.forEach(function(cb) { cb(); });
        },
        $isEmpty: function(value) {
          return (''+value).length === 0;
        },
        $parsers: [],
        $formatters: [],
        $viewChangeListeners: [],
        $render: angular.noop
      };
    },

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds.
    // @param wait Integer value of msecs to delay (since last debounce reset); default value 10 msecs
    // @param invokeApply should the $timeout trigger $digest() dirty checking
    debounce: function (func, wait, scope, invokeApply) {
      var timer;

      return function debounced() {
        var context = scope,
          args = Array.prototype.slice.call(arguments);

        $timeout.cancel(timer);
        timer = $timeout(function() {

          timer = undefined;
          func.apply(context, args);

        }, wait || 10, invokeApply );
      };
    },

    // Returns a function that can only be triggered every `delay` milliseconds.
    // In other words, the function will not be called unless it has been more
    // than `delay` milliseconds since the last call.
    throttle: function throttle(func, delay) {
      var recent;
      return function throttled() {
        var context = this;
        var args = arguments;
        var now = Util.now();

        if (!recent || (now - recent > delay)) {
          func.apply(context, args);
          recent = now;
        }
      };
    },

    /**
     * Measures the number of milliseconds taken to run the provided callback
     * function. Uses a high-precision timer if available.
     */
    time: function time(cb) {
      var start = Util.now();
      cb();
      return Util.now() - start;
    },

    /**
     * nextUid, from angular.js.
     * A consistent way of creating unique IDs in angular. The ID is a sequence of alpha numeric
     * characters such as '012ABC'. The reason why we are not using simply a number counter is that
     * the number string gets longer over time, and it can also overflow, where as the nextId
     * will grow much slower, it is a string, and it will never overflow.
     *
     * @returns an unique alpha-numeric string
     */
    nextUid: function() {
      var index = nextUniqueId.length;
      var digit;

      while(index) {
        index--;
        digit = nextUniqueId[index].charCodeAt(0);
        if (digit == 57 /*'9'*/) {
          nextUniqueId[index] = 'A';
          return nextUniqueId.join('');
        }
        if (digit == 90  /*'Z'*/) {
          nextUniqueId[index] = '0';
        } else {
          nextUniqueId[index] = String.fromCharCode(digit + 1);
          return nextUniqueId.join('');
        }
      }
      nextUniqueId.unshift('0');
      return nextUniqueId.join('');
    },

    // Stop watchers and events from firing on a scope without destroying it,
    // by disconnecting it from its parent and its siblings' linked lists.
    disconnectScope: function disconnectScope(scope) {
      if (!scope) return;

      // we can't destroy the root scope or a scope that has been already destroyed
      if (scope.$root === scope) return;
      if (scope.$$destroyed ) return;

      var parent = scope.$parent;
      scope.$$disconnected = true;

      // See Scope.$destroy
      if (parent.$$childHead === scope) parent.$$childHead = scope.$$nextSibling;
      if (parent.$$childTail === scope) parent.$$childTail = scope.$$prevSibling;
      if (scope.$$prevSibling) scope.$$prevSibling.$$nextSibling = scope.$$nextSibling;
      if (scope.$$nextSibling) scope.$$nextSibling.$$prevSibling = scope.$$prevSibling;

      scope.$$nextSibling = scope.$$prevSibling = null;

    },

    // Undo the effects of disconnectScope above.
    reconnectScope: function reconnectScope(scope) {
      if (!scope) return;

      // we can't disconnect the root node or scope already disconnected
      if (scope.$root === scope) return;
      if (!scope.$$disconnected) return;

      var child = scope;

      var parent = child.$parent;
      child.$$disconnected = false;
      // See Scope.$new for this logic...
      child.$$prevSibling = parent.$$childTail;
      if (parent.$$childHead) {
        parent.$$childTail.$$nextSibling = child;
        parent.$$childTail = child;
      } else {
        parent.$$childHead = parent.$$childTail = child;
      }
    },
  /*
   * getClosest replicates jQuery.closest() to walk up the DOM tree until it finds a matching nodeName
   *
   * @param el Element to start walking the DOM from
   * @param tagName Tag name to find closest to el, such as 'form'
   */
    getClosest: function getClosest(el, tagName) {
      tagName = tagName.toUpperCase();
      do {
        if (el.nodeName === tagName) {
          return el;
        }
      } while (el = el.parentNode);
      return null;
    }
  };

}]);

/*
 * Since removing jQuery from the demos, some code that uses `element.focus()` is broken.
 *
 * We need to add `element.focus()`, because it's testable unlike `element[0].focus`.
 *
 * TODO(ajoslin): This should be added in a better place later.
 */

angular.element.prototype.focus = angular.element.prototype.focus || function() {
  if (this.length) {
    this[0].focus();
  }
  return this;
};
angular.element.prototype.blur = angular.element.prototype.blur || function() {
  if (this.length) {
    this[0].blur();
  }
  return this;
};

})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';

angular.module('material.083fork.core')
  .service('$md083forkAria', AriaService);

function AriaService($$rAF, $log, $window) {

  return {
    expect: expect,
    expectAsync: expectAsync,
    expectWithText: expectWithText
  };

  /**
   * Check if expected attribute has been specified on the target element or child
   * @param element
   * @param attrName
   * @param {optional} defaultValue What to set the attr to if no value is found
   */
  function expect(element, attrName, defaultValue) {
    var node = element[0];

    if (!node.hasAttribute(attrName) && !childHasAttribute(node, attrName)) {

      defaultValue = angular.isString(defaultValue) ? defaultValue.trim() : '';
      if (defaultValue.length) {
        element.attr(attrName, defaultValue);
      } else {
        $log.warn('ARIA: Attribute "', attrName, '", required for accessibility, is missing on node:', node);
      }

    }
  }

  function expectAsync(element, attrName, defaultValueGetter) {
    // Problem: when retrieving the element's contents synchronously to find the label,
    // the text may not be defined yet in the case of a binding.
    // There is a higher chance that a binding will be defined if we wait one frame.
    $$rAF(function() {
      expect(element, attrName, defaultValueGetter());
    });
  }

  function expectWithText(element, attrName) {
    expectAsync(element, attrName, function() {
      return getText(element);
    });
  }

  function getText(element) {
    return element.text().trim();
  }

  function childHasAttribute(node, attrName) {
    var hasChildren = node.hasChildNodes(),
        hasAttr = false;

    function isHidden(el) {
      var style = el.currentStyle ? el.currentStyle : $window.getComputedStyle(el);
      return (style.display === 'none');
    }

    if(hasChildren) {
      var children = node.childNodes;
      for(var i=0; i<children.length; i++){
        var child = children[i];
        if(child.nodeType === 1 && child.hasAttribute(attrName)) {
          if(!isHidden(child)){
            hasAttr = true;
          }
        }
      }
    }
    return hasAttr;
  }
}
AriaService.$inject = ["$$rAF", "$log", "$window"];
})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';

angular.module('material.083fork.core')
  .service('$md083forkCompiler', mdCompilerService);

function mdCompilerService($q, $http, $injector, $compile, $controller, $templateCache) {
  /* jshint validthis: true */

  /*
   * @ngdoc service
   * @name $md083forkCompiler
   * @module material.083fork.core
   * @description
   * The $md083forkCompiler service is an abstraction of angular's compiler, that allows the developer
   * to easily compile an element with a templateUrl, controller, and locals.
   *
   * @usage
   * <hljs lang="js">
   * $md083forkCompiler.compile({
   *   templateUrl: 'modal.html',
   *   controller: 'ModalCtrl',
   *   locals: {
   *     modal: myModalInstance;
   *   }
   * }).then(function(compileData) {
   *   compileData.element; // modal.html's template in an element
   *   compileData.link(myScope); //attach controller & scope to element
   * });
   * </hljs>
   */

   /*
    * @ngdoc method
    * @name $md083forkCompiler#compile
    * @description A helper to compile an HTML template/templateUrl with a given controller,
    * locals, and scope.
    * @param {object} options An options object, with the following properties:
    *
    *    - `controller` - `{(string=|function()=}` Controller fn that should be associated with
    *      newly created scope or the name of a registered controller if passed as a string.
    *    - `controllerAs` - `{string=}` A controller alias name. If present the controller will be
    *      published to scope under the `controllerAs` name.
    *    - `template` - `{string=}` An html template as a string.
    *    - `templateUrl` - `{string=}` A path to an html template.
    *    - `transformTemplate` - `{function(template)=}` A function which transforms the template after
    *      it is loaded. It will be given the template string as a parameter, and should
    *      return a a new string representing the transformed template.
    *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
    *      be injected into the controller. If any of these dependencies are promises, the compiler
    *      will wait for them all to be resolved, or if one is rejected before the controller is
    *      instantiated `compile()` will fail..
    *      * `key` - `{string}`: a name of a dependency to be injected into the controller.
    *      * `factory` - `{string|function}`: If `string` then it is an alias for a service.
    *        Otherwise if function, then it is injected and the return value is treated as the
    *        dependency. If the result is a promise, it is resolved before its value is 
    *        injected into the controller.
    *
    * @returns {object=} promise A promise, which will be resolved with a `compileData` object.
    * `compileData` has the following properties: 
    *
    *   - `element` - `{element}`: an uncompiled element matching the provided template.
    *   - `link` - `{function(scope)}`: A link function, which, when called, will compile
    *     the element and instantiate the provided controller (if given).
    *   - `locals` - `{object}`: The locals which will be passed into the controller once `link` is
    *     called. If `bindToController` is true, they will be coppied to the ctrl instead
    *   - `bindToController` - `bool`: bind the locals to the controller, instead of passing them in. These values will not be available until after initialization.
    */
  this.compile = function(options) {
    var templateUrl = options.templateUrl;
    var template = options.template || '';
    var controller = options.controller;
    var controllerAs = options.controllerAs;
    var resolve = options.resolve || {};
    var locals = options.locals || {};
    var transformTemplate = options.transformTemplate || angular.identity;
    var bindToController = options.bindToController;

    // Take resolve values and invoke them.  
    // Resolves can either be a string (value: 'MyRegisteredAngularConst'),
    // or an invokable 'factory' of sorts: (value: function ValueGetter($dependency) {})
    angular.forEach(resolve, function(value, key) {
      if (angular.isString(value)) {
        resolve[key] = $injector.get(value);
      } else {
        resolve[key] = $injector.invoke(value);
      }
    });
    //Add the locals, which are just straight values to inject
    //eg locals: { three: 3 }, will inject three into the controller
    angular.extend(resolve, locals);

    if (templateUrl) {
      resolve.$template = $http.get(templateUrl, {cache: $templateCache})
        .then(function(response) {
          return response.data;
        });
    } else {
      resolve.$template = $q.when(template);
    }

    // Wait for all the resolves to finish if they are promises
    return $q.all(resolve).then(function(locals) {

      var template = transformTemplate(locals.$template);
      var element = options.element || angular.element('<div>').html(template.trim()).contents();
      var linkFn = $compile(element);

      //Return a linking function that can be used later when the element is ready
      return {
        locals: locals,
        element: element,
        link: function link(scope) {
          locals.$scope = scope;

          //Instantiate controller if it exists, because we have scope
          if (controller) {
            var ctrl = $controller(controller, locals);
            if (bindToController) {
              angular.extend(ctrl, locals);
            }
            //See angular-route source for this logic
            element.data('$ngControllerController', ctrl);
            element.children().data('$ngControllerController', ctrl);

            if (controllerAs) {
              scope[controllerAs] = ctrl;
            }
          }
          return linkFn(scope);
        }
      };
    });

  };
}
mdCompilerService.$inject = ["$q", "$http", "$injector", "$compile", "$controller", "$templateCache"];
})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';

/*
 * TODO: Add support for multiple fingers on the `pointer` object (enables pinch gesture)
 */

var START_EVENTS = 'mousedown touchstart pointerdown';
var MOVE_EVENTS = 'mousemove touchmove pointermove';
var END_EVENTS = 'mouseup mouseleave touchend touchcancel pointerup pointercancel';
var HANDLERS;

document.contains || (document.contains = function(node) {
  return document.body.contains(node);
});

// TODO add windows phone to this
var userAgent = navigator.userAgent || navigator.vendor || window.opera;
var isIos = userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i);
var isAndroid = userAgent.match(/Android/i);
var shouldHijackClicks = isIos || isAndroid;

if (shouldHijackClicks) {
  document.addEventListener('click', function(ev) {
    // Space/enter on a button, and submit events, can send clicks
    var isKeyClick = ev.clientX === 0 && ev.clientY === 0;
    if (window.jQuery || isKeyClick || ev.$material) return;

    // Prevent clicks unless they're sent by material
    ev.preventDefault();
    ev.stopPropagation();
  }, true);
}

angular.element(document)
  .on(START_EVENTS, gestureStart)
  .on(MOVE_EVENTS, gestureMove)
  .on(END_EVENTS, gestureEnd)
  // For testing
  .on('$$md083forkGestureReset', function() {
    lastPointer = pointer = null;
  });

// The state of the current and previous 'pointer' (user's hand)
var pointer, lastPointer;

function runHandlers(handlerEvent, event) {
  var handler;
  for (var handlerName in HANDLERS) {
    handler = HANDLERS[handlerName];
    if (handlerEvent === 'start') {
      // Run cancel to reset any handlers' state
      handler.cancel();
    }
    handler[handlerEvent](event, pointer);
  }
}

function gestureStart(ev) {
  // If we're already touched down, abort
  if (pointer) return;

  var now = +Date.now();

  // iOS & old android bug: after a touch event, a click event is sent 350 ms later.
  // If <400ms have passed, don't allow an event of a different type than the previous event
  if (lastPointer && !typesMatch(ev, lastPointer) && (now - lastPointer.endTime < 1500)) {
    return;
  }

  pointer = makeStartPointer(ev);

  runHandlers('start', ev);
}

function gestureMove(ev) {
  if (!pointer || !typesMatch(ev, pointer)) return;

  updatePointerState(ev, pointer);
  runHandlers('move', ev);
}

function gestureEnd(ev) {
  if (!pointer || !typesMatch(ev, pointer)) return;

  updatePointerState(ev, pointer);
  pointer.endTime = +Date.now();

  runHandlers('end', ev);

  lastPointer = pointer;
  pointer = null;
}

/******** Helpers *********/
function typesMatch(ev, pointer) {
  return ev && pointer && ev.type.charAt(0) === pointer.type;
}

function getEventPoint(ev) {
  ev = ev.originalEvent || ev; // support jQuery events
  return (ev.touches && ev.touches[0]) ||
    (ev.changedTouches && ev.changedTouches[0]) ||
    ev;
}

function updatePointerState(ev, pointer) {
  var point = getEventPoint(ev);
  var x = pointer.x = point.pageX;
  var y = pointer.y = point.pageY;

  pointer.distanceX = x - pointer.startX;
  pointer.distanceY = y - pointer.startY;
  pointer.distance = Math.sqrt(
    pointer.distanceX * pointer.distanceX + pointer.distanceY * pointer.distanceY
  );

  pointer.directionX = pointer.distanceX > 0 ? 'right' : pointer.distanceX < 0 ? 'left' : '';
  pointer.directionY = pointer.distanceY > 0 ? 'up' : pointer.distanceY < 0 ? 'down' : '';

  pointer.duration = +Date.now() - pointer.startTime;
  pointer.velocityX = pointer.distanceX / pointer.duration;
  pointer.velocityY = pointer.distanceY / pointer.duration;
}


function makeStartPointer(ev) {
  var point = getEventPoint(ev);
  var startPointer = {
    startTime: +Date.now(),
    target: ev.target,
    // 'p' for pointer, 'm' for mouse, 't' for touch
    type: ev.type.charAt(0)
  };
  startPointer.startX = startPointer.x = point.pageX;
  startPointer.startY = startPointer.y = point.pageY;
  return startPointer;
}

angular.module('material.083fork.core')
.run(["$md083forkGesture", function($md083forkGesture) {}]) // make sure $md083forkGesture is always instantiated
.factory('$md083forkGesture', ["$$md083forkGestureHandler", "$$rAF", "$timeout", function($$md083forkGestureHandler, $$rAF, $timeout) {
  HANDLERS = {};

  if (shouldHijackClicks) {
    addHandler('click', {
      options: {
        maxDistance: 6
      },
      onEnd: function(ev, pointer) {
        if (pointer.distance < this.state.options.maxDistance) {
          this.dispatchEvent(ev, 'click');
        }
      }
    });
  }

  addHandler('press', {
    onStart: function(ev, pointer) {
      this.dispatchEvent(ev, '$md083fork.pressdown');
    },
    onEnd: function(ev, pointer) {
      this.dispatchEvent(ev, '$md083fork.pressup');
    }
  });


  addHandler('hold', {
    options: {
      // If the user keeps his finger within the same <maxDistance> area for
      // <delay> ms, dispatch a hold event.
      maxDistance: 6,
      delay: 500
    },
    onCancel: function() {
      $timeout.cancel(this.state.timeout);
    },
    onStart: function(ev, pointer) {
      // For hold, require a parent to be registered with $md083forkGesture.register()
      // Because we prevent scroll events, this is necessary.
      if (!this.state.registeredParent) return this.cancel();

      this.state.pos = {x: pointer.x, y: pointer.y};
      this.state.timeout = $timeout(angular.bind(this, function holdDelayFn() {
        this.dispatchEvent(ev, '$md083fork.hold');
        this.cancel(); //we're done!
      }), this.state.options.delay, false);
    },
    onMove: function(ev, pointer) {
      // Don't scroll while waiting for hold
      ev.preventDefault();
      var dx = this.state.pos.x - pointer.x;
      var dy = this.state.pos.y - pointer.y;
      if (Math.sqrt(dx*dx + dy*dy) > this.options.maxDistance) {
        this.cancel();
      }
    },
    onEnd: function() { this.onCancel(); }
  });

  addHandler('drag', {
    options: {
      minDistance: 6,
      horizontal: true
    },
    onStart: function(ev) {
      // For drag, require a parent to be registered with $md083forkGesture.register()
      if (!this.state.registeredParent) this.cancel();
    },
    onMove: function(ev, pointer) {
      var shouldStartDrag, shouldCancel;
      // Don't allow touch events to scroll while we're dragging or
      // deciding if this touchmove is a proper drag
      ev.preventDefault();

      if (!this.state.dragPointer) {
        if (this.state.options.horizontal) {
          shouldStartDrag = Math.abs(pointer.distanceX) > this.state.options.minDistance;
          shouldCancel = Math.abs(pointer.distanceY) > this.state.options.minDistance * 1.5;
        } else {
          shouldStartDrag = Math.abs(pointer.distanceY) > this.state.options.minDistance;
          shouldCancel = Math.abs(pointer.distanceX) > this.state.options.minDistance * 1.5;
        }

        if (shouldStartDrag) {
          // Create a new pointer, starting at this point where the drag started.
          this.state.dragPointer = makeStartPointer(ev);
          updatePointerState(ev, this.state.dragPointer);
          this.dispatchEvent(ev, '$md083fork.dragstart', this.state.dragPointer);

        } else if (shouldCancel) {
          this.cancel();
        }
      } else {
        this.dispatchDragMove(ev);
      }
    },
    // Only dispatch these every frame; any more is unnecessray
    dispatchDragMove: $$rAF.throttle(function(ev) {
      // Make sure the drag didn't stop while waiting for the next frame
      if (this.state.isRunning) {
        updatePointerState(ev, this.state.dragPointer);
        this.dispatchEvent(ev, '$md083fork.drag', this.state.dragPointer);
      }
    }),
    onEnd: function(ev, pointer) {
      if (this.state.dragPointer) {
        updatePointerState(ev, this.state.dragPointer);
        this.dispatchEvent(ev, '$md083fork.dragend', this.state.dragPointer);
      }
    }
  });

  addHandler('swipe', {
    options: {
      minVelocity: 0.65,
      minDistance: 10
    },
    onEnd: function(ev, pointer) {
      if (Math.abs(pointer.velocityX) > this.state.options.minVelocity &&
          Math.abs(pointer.distanceX) > this.state.options.minDistance) {
        var eventType = pointer.directionX == 'left' ? '$md083fork.swipeleft' : '$md083fork.swiperight';
        this.dispatchEvent(ev, eventType);
      }
    }
  });

  var self;
  return self = {
    handler: addHandler,
    register: register
  };

  function addHandler(name, definition) {
    var handler = new $$md083forkGestureHandler(name);
    angular.extend(handler, definition);
    HANDLERS[name] = handler;
    return self;
  }

  function register(element, handlerName, options) {
    var handler = HANDLERS[ handlerName.replace(/^\$md./, '') ];
    if (!handler) {
      throw new Error('Failed to register element with handler ' + handlerName + '. ' +
                      'Available handlers: ' + Object.keys(HANDLERS).join(', '));
    }
    return handler.registerElement(element, options);
  }
}])
.factory('$$md083forkGestureHandler', ["$$rAF", function($$rAF) {

  function GestureHandler(name) {
    this.name = name;
    this.state = {};
  }
  GestureHandler.prototype = {
    onStart: angular.noop,
    onMove: angular.noop,
    onEnd: angular.noop,
    onCancel: angular.noop,
    options: {},

    dispatchEvent: typeof window.jQuery !== 'undefined' && angular.element === window.jQuery ?
      jQueryDispatchEvent :
      nativeDispatchEvent,

    start: function(ev, pointer) {
      if (this.state.isRunning) return;
      var parentTarget = this.getNearestParent(ev.target);
      var parentTargetOptions = parentTarget && parentTarget.$md083forkGesture[this.name] || {};

      this.state = {
        isRunning: true,
        options: angular.extend({}, this.options, parentTargetOptions),
        registeredParent: parentTarget
      };
      this.onStart(ev, pointer);
    },
    move: function(ev, pointer) {
      if (!this.state.isRunning) return;
      this.onMove(ev, pointer);
    },
    end: function(ev, pointer) {
      if (!this.state.isRunning) return;
      this.onEnd(ev, pointer);
      this.state.isRunning = false;
    },
    cancel: function(ev, pointer) {
      this.onCancel(ev, pointer);
      this.state = {};
    },

    // Find and return the nearest parent element that has been registered via
    // $md083forkGesture.register(element, 'handlerName').
    getNearestParent: function(node) {
      var current = node;
      while (current) {
        if ( (current.$md083forkGesture || {})[this.name] ) {
          return current;
        }
        current = current.parentNode;
      }
    },

    registerElement: function(element, options) {
      var self = this;
      element[0].$md083forkGesture = element[0].$md083forkGesture || {};
      element[0].$md083forkGesture[this.name] = options || {};
      element.on('$destroy', onDestroy);

      return onDestroy;

      function onDestroy() {
        delete element[0].$md083forkGesture[self.name];
        element.off('$destroy', onDestroy);
      }
    }
  };

  function jQueryDispatchEvent(srcEvent, eventType, eventPointer) {
    eventPointer = eventPointer || pointer;
    var eventObj = new angular.element.Event(eventType);

    eventObj.$material = true;
    eventObj.pointer = eventPointer;
    eventObj.srcEvent = srcEvent;

    angular.extend(eventObj, {
      clientX: eventPointer.x,
      clientY: eventPointer.y,
      screenX: eventPointer.x,
      screenY: eventPointer.y,
      pageX: eventPointer.x,
      pageY: eventPointer.y,
      ctrlKey: srcEvent.ctrlKey,
      altKey: srcEvent.altKey,
      shiftKey: srcEvent.shiftKey,
      metaKey: srcEvent.metaKey
    });
    angular.element(eventPointer.target).trigger(eventObj);
  }

  /*
   * NOTE: nativeDispatchEvent is very performance sensitive.
   */
  function nativeDispatchEvent(srcEvent, eventType, eventPointer) {
    eventPointer = eventPointer || pointer;
    var eventObj;

    if (eventType === 'click') {
      eventObj = document.createEvent('MouseEvents');
      eventObj.initMouseEvent(
        'click', true, true, window, srcEvent.detail,
        eventPointer.x, eventPointer.y, eventPointer.x, eventPointer.y,
        srcEvent.ctrlKey, srcEvent.altKey, srcEvent.shiftKey, srcEvent.metaKey,
        srcEvent.button, srcEvent.relatedTarget || null
      );

    } else {
      eventObj = document.createEvent('CustomEvent');
      eventObj.initCustomEvent(eventType, true, true, {});
    }
    eventObj.$material = true;
    eventObj.pointer = eventPointer;
    eventObj.srcEvent = srcEvent;
    eventPointer.target.dispatchEvent(eventObj);
  }

  return GestureHandler;
}]);

})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';

angular.module('material.083fork.core')
  .provider('$$083forkInterimElement', InterimElementProvider);

/*
 * @ngdoc service
 * @name $$083forkInterimElement
 * @module material.083fork.core
 *
 * @description
 *
 * Factory that contructs `$$083forkInterimElement.$service` services.
 * Used internally in material design for elements that appear on screen temporarily.
 * The service provides a promise-like API for interacting with the temporary
 * elements.
 *
 * ```js
 * app.service('$md083forkToast', function($$083forkInterimElement) {
 *   var $md083forkToast = $$083forkInterimElement(toastDefaultOptions);
 *   return $md083forkToast;
 * });
 * ```
 * @param {object=} defaultOptions Options used by default for the `show` method on the service.
 *
 * @returns {$$083forkInterimElement.$service}
 *
 */

function InterimElementProvider() {
  createInterimElementProvider.$get = InterimElementFactory;
  InterimElementFactory.$inject = ["$document", "$q", "$rootScope", "$timeout", "$rootElement", "$animate", "$interpolate", "$md083forkCompiler", "$md083forkTheming"];
  return createInterimElementProvider;

  /**
   * Returns a new provider which allows configuration of a new interimElement
   * service. Allows configuration of default options & methods for options,
   * as well as configuration of 'preset' methods (eg dialog.basic(): basic is a preset method)
   */
  function createInterimElementProvider(interimFactoryName) {
    var EXPOSED_METHODS = ['onHide', 'onShow', 'onRemove'];

    var customMethods = {};
    var providerConfig = {
      presets: {}
    };

    var provider = {
      setDefaults: setDefaults,
      addPreset: addPreset,
      addMethod: addMethod,
      $get: factory
    };

    /**
     * all interim elements will come with the 'build' preset
     */
    provider.addPreset('build', {
      methods: ['controller', 'controllerAs', 'resolve',
        'template', 'templateUrl', 'themable', 'transformTemplate', 'parent']
    });

    factory.$inject = ["$$083forkInterimElement", "$animate", "$injector"];
    return provider;

    /**
     * Save the configured defaults to be used when the factory is instantiated
     */
    function setDefaults(definition) {
      providerConfig.optionsFactory = definition.options;
      providerConfig.methods = (definition.methods || []).concat(EXPOSED_METHODS);
      return provider;
    }

    /**
     * Add a method to the factory that isn't specific to any interim element operations
     */

    function addMethod(name, fn) {
      customMethods[name] = fn;
      return provider;
    }

    /**
     * Save the configured preset to be used when the factory is instantiated
     */
    function addPreset(name, definition) {
      definition = definition || {};
      definition.methods = definition.methods || [];
      definition.options = definition.options || function() { return {}; };

      if (/^cancel|hide|show$/.test(name)) {
        throw new Error("Preset '" + name + "' in " + interimFactoryName + " is reserved!");
      }
      if (definition.methods.indexOf('_options') > -1) {
        throw new Error("Method '_options' in " + interimFactoryName + " is reserved!");
      }
      providerConfig.presets[name] = {
        methods: definition.methods.concat(EXPOSED_METHODS),
        optionsFactory: definition.options,
        argOption: definition.argOption
      };
      return provider;
    }

    /**
     * Create a factory that has the given methods & defaults implementing interimElement
     */
    /* @ngInject */
    function factory($$083forkInterimElement, $animate, $injector) {
      var defaultMethods;
      var defaultOptions;
      var interimElementService = $$083forkInterimElement();

      /*
       * publicService is what the developer will be using.
       * It has methods hide(), cancel(), show(), build(), and any other
       * presets which were set during the config phase.
       */
      var publicService = {
        hide: interimElementService.hide,
        cancel: interimElementService.cancel,
        show: showInterimElement
      };

      defaultMethods = providerConfig.methods || [];
      // This must be invoked after the publicService is initialized
      defaultOptions = invokeFactory(providerConfig.optionsFactory, {});

      // Copy over the simple custom methods
      angular.forEach(customMethods, function(fn, name) {
        publicService[name] = fn;
      });

      angular.forEach(providerConfig.presets, function(definition, name) {
        var presetDefaults = invokeFactory(definition.optionsFactory, {});
        var presetMethods = (definition.methods || []).concat(defaultMethods);

        // Every interimElement built with a preset has a field called `$type`,
        // which matches the name of the preset.
        // Eg in preset 'confirm', options.$type === 'confirm'
        angular.extend(presetDefaults, { $type: name });

        // This creates a preset class which has setter methods for every
        // method given in the `.addPreset()` function, as well as every
        // method given in the `.setDefaults()` function.
        //
        // @example
        // .setDefaults({
        //   methods: ['hasBackdrop', 'clickOutsideToClose', 'escapeToClose', 'targetEvent'],
        //   options: dialogDefaultOptions
        // })
        // .addPreset('alert', {
        //   methods: ['title', 'ok'],
        //   options: alertDialogOptions
        // })
        //
        // Set values will be passed to the options when interimElemnt.show() is called.
        function Preset(opts) {
          this._options = angular.extend({}, presetDefaults, opts);
        }
        angular.forEach(presetMethods, function(name) {
          Preset.prototype[name] = function(value) {
            this._options[name] = value;
            return this;
          };
        });

        // Create shortcut method for one-linear methods
        if (definition.argOption) {
          var methodName = 'show' + name.charAt(0).toUpperCase() + name.slice(1);
          publicService[methodName] = function(arg) {
            var config = publicService[name](arg);
            return publicService.show(config);
          };
        }

        // eg $md083forkDialog.alert() will return a new alert preset
        publicService[name] = function(arg) {
          // If argOption is supplied, eg `argOption: 'content'`, then we assume
          // if the argument is not an options object then it is the `argOption` option.
          //
          // @example `$md083forkToast.simple('hello')` // sets options.content to hello
          //                                     // because argOption === 'content'
          if (arguments.length && definition.argOption && !angular.isObject(arg) &&
              !angular.isArray(arg)) {
            return (new Preset())[definition.argOption](arg);
          } else {
            return new Preset(arg);
          }

        };
      });

      return publicService;

      function showInterimElement(opts) {
        // opts is either a preset which stores its options on an _options field,
        // or just an object made up of options
        if (opts && opts._options) opts = opts._options;
        return interimElementService.show(
          angular.extend({}, defaultOptions, opts)
        );
      }

      /**
       * Helper to call $injector.invoke with a local of the factory name for
       * this provider.
       * If an $md083forkDialog is providing options for a dialog and tries to inject
       * $md083forkDialog, a circular dependency error will happen.
       * We get around that by manually injecting $md083forkDialog as a local.
       */
      function invokeFactory(factory, defaultVal) {
        var locals = {};
        locals[interimFactoryName] = publicService;
        return $injector.invoke(factory || function() { return defaultVal; }, {}, locals);
      }

    }

  }

  /* @ngInject */
  function InterimElementFactory($document, $q, $rootScope, $timeout, $rootElement, $animate,
                                 $interpolate, $md083forkCompiler, $md083forkTheming ) {
    var startSymbol = $interpolate.startSymbol(),
        endSymbol = $interpolate.endSymbol(),
        usesStandardSymbols = ((startSymbol === '{{') && (endSymbol === '}}')),
        processTemplate  = usesStandardSymbols ? angular.identity : replaceInterpolationSymbols;

    return function createInterimElementService() {
      /*
       * @ngdoc service
       * @name $$083forkInterimElement.$service
       *
       * @description
       * A service used to control inserting and removing an element into the DOM.
       *
       */
      var stack = [];
      var service;
      return service = {
        show: show,
        hide: hide,
        cancel: cancel
      };

      /*
       * @ngdoc method
       * @name $$083forkInterimElement.$service#show
       * @kind function
       *
       * @description
       * Adds the `$interimElement` to the DOM and returns a promise that will be resolved or rejected
       * with hide or cancel, respectively.
       *
       * @param {*} options is hashMap of settings
       * @returns a Promise
       *
       */
      function show(options) {
        if (stack.length) {
          return service.cancel().then(function() {
            return show(options);
          });
        } else {
          var interimElement = new InterimElement(options);
          stack.push(interimElement);
          return interimElement.show().then(function() {
            return interimElement.deferred.promise;
          });
        }
      }

      /*
       * @ngdoc method
       * @name $$083forkInterimElement.$service#hide
       * @kind function
       *
       * @description
       * Removes the `$interimElement` from the DOM and resolves the promise returned from `show`
       *
       * @param {*} resolveParam Data to resolve the promise with
       * @returns a Promise that will be resolved after the element has been removed.
       *
       */
      function hide(response) {
        var interimElement = stack.shift();
        return interimElement && interimElement.remove().then(function() {
          interimElement.deferred.resolve(response);
        });
      }

      /*
       * @ngdoc method
       * @name $$083forkInterimElement.$service#cancel
       * @kind function
       *
       * @description
       * Removes the `$interimElement` from the DOM and rejects the promise returned from `show`
       *
       * @param {*} reason Data to reject the promise with
       * @returns Promise that will be resolved after the element has been removed.
       *
       */
      function cancel(reason) {
        var interimElement = stack.shift();
        return $q.when(interimElement && interimElement.remove().then(function() {
          interimElement.deferred.reject(reason);
        }));
      }


      /*
       * Internal Interim Element Object
       * Used internally to manage the DOM element and related data
       */
      function InterimElement(options) {
        var self;
        var hideTimeout, element, showDone, removeDone;

        options = options || {};
        options = angular.extend({
          preserveScope: false,
          scope: options.scope || $rootScope.$new(options.isolateScope),
          onShow: function(scope, element, options) {
            return $animate.enter(element, options.parent);
          },
          onRemove: function(scope, element, options) {
            // Element could be undefined if a new element is shown before
            // the old one finishes compiling.
            return element && $animate.leave(element) || $q.when();
          }
        }, options);

        if (options.template) {
          options.template = processTemplate(options.template);
        }

        return self = {
          options: options,
          deferred: $q.defer(),
          show: function() {
            var compilePromise;
            if (options.skipCompile) {
              compilePromise = $q(function(resolve) { 
                resolve({
                  locals: {},
                  link: function() { return options.element; }
                });
              });
            } else {
              compilePromise = $md083forkCompiler.compile(options);
            }

            return showDone = compilePromise.then(function(compileData) {
              angular.extend(compileData.locals, self.options);

              element = compileData.link(options.scope);

              // Search for parent at insertion time, if not specified
              if (angular.isFunction(options.parent)) {
                options.parent = options.parent(options.scope, element, options);
              } else if (angular.isString(options.parent)) {
                options.parent = angular.element($document[0].querySelector(options.parent));
              }

              // If parent querySelector/getter function fails, or it's just null,
              // find a default.
              if (!(options.parent || {}).length) {
                options.parent = $rootElement.find('body');
                if (!options.parent.length) options.parent = $rootElement;
              }

              if (options.themable) $md083forkTheming(element);
              var ret = options.onShow(options.scope, element, options);
              return $q.when(ret)
                .then(function(){
                  // Issue onComplete callback when the `show()` finishes
                  (options.onComplete || angular.noop)(options.scope, element, options);
                  startHideTimeout();
                });

              function startHideTimeout() {
                if (options.hideDelay) {
                  hideTimeout = $timeout(service.cancel, options.hideDelay) ;
                }
              }
            }, function(reason) { showDone = true; self.deferred.reject(reason); });
          },
          cancelTimeout: function() {
            if (hideTimeout) {
              $timeout.cancel(hideTimeout);
              hideTimeout = undefined;
            }
          },
          remove: function() {
            self.cancelTimeout();
            return removeDone = $q.when(showDone).then(function() {
              var ret = element ? options.onRemove(options.scope, element, options) : true;
              return $q.when(ret).then(function() {
                if (!options.preserveScope) options.scope.$destroy();
                removeDone = true;
              });
            });
          }
        };
      }
    };

    /*
     * Replace `{{` and `}}` in a string (usually a template) with the actual start-/endSymbols used
     * for interpolation. This allows pre-defined templates (for components such as dialog, toast etc)
     * to continue to work in apps that use custom interpolation start-/endSymbols.
     *
     * @param {string} text The text in which to replace `{{` / `}}`
     * @returns {string} The modified string using the actual interpolation start-/endSymbols
     */
    function replaceInterpolationSymbols(text) {
      if (!text || !angular.isString(text)) return text;
      return text.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol);
    }
  }

}

})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
  'use strict';

  /**
   * @ngdoc module
   * @name material.083fork.core.componentRegistry
   *
   * @description
   * A component instance registration service.
   * Note: currently this as a private service in the SideNav component.
   */
  angular.module('material.083fork.core')
    .factory('$md083forkComponentRegistry', ComponentRegistry);

  /*
   * @private
   * @ngdoc factory
   * @name ComponentRegistry
   * @module material.083fork.core.componentRegistry
   *
   */
  function ComponentRegistry($log, $q) {

    var self;
    var instances = [ ];
    var pendings = { };

    return self = {
      /**
       * Used to print an error when an instance for a handle isn't found.
       */
      notFoundError: function(handle) {
        $log.error('No instance found for handle', handle);
      },
      /**
       * Return all registered instances as an array.
       */
      getInstances: function() {
        return instances;
      },

      /**
       * Get a registered instance.
       * @param handle the String handle to look up for a registered instance.
       */
      get: function(handle) {
        if ( !isValidID(handle) ) return null;

        var i, j, instance;
        for(i = 0, j = instances.length; i < j; i++) {
          instance = instances[i];
          if(instance.$$mdHandle === handle) {
            return instance;
          }
        }
        return null;
      },

      /**
       * Register an instance.
       * @param instance the instance to register
       * @param handle the handle to identify the instance under.
       */
      register: function(instance, handle) {
        if ( !handle ) return angular.noop;

        instance.$$mdHandle = handle;
        instances.push(instance);
        resolveWhen();

        return deregister;

        /**
         * Remove registration for an instance
         */
        function deregister() {
          var index = instances.indexOf(instance);
          if (index !== -1) {
            instances.splice(index, 1);
          }
        }

        /**
         * Resolve any pending promises for this instance
         */
        function resolveWhen() {
          var dfd = pendings[handle];
          if ( dfd ) {
            dfd.resolve( instance );
            delete pendings[handle];
          }
        }
      },

      /**
       * Async accessor to registered component instance
       * If not available then a promise is created to notify
       * all listeners when the instance is registered.
       */
      when : function(handle) {
        if ( isValidID(handle) ) {
          var deferred = $q.defer();
          var instance = self.get(handle);

          if ( instance )  {
            deferred.resolve( instance );
          } else {
            pendings[handle] = deferred;
          }

          return deferred.promise;
        }
        return $q.reject("Invalid `md-component-id` value.");
      }

    };

    function isValidID(handle){
      return handle && (handle !== "");
    }

  }
  ComponentRegistry.$inject = ["$log", "$q"];


})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';

angular.module('material.083fork.core')
  .factory('$md083forkInkRipple$mdInkRipple', InkRippleService)
  .directive('mdInkRipple', InkRippleDirective)
  .directive('mdNoInk', attrNoDirective())
  .directive('mdNoBar', attrNoDirective())
  .directive('mdNoStretch', attrNoDirective());

function InkRippleDirective($md083forkInkRipple$mdInkRipple) {
  return {
    controller: angular.noop,
    link: function (scope, element, attr) {
      if (attr.hasOwnProperty('mdInkRippleCheckbox')) {
        $md083forkInkRipple$mdInkRipple.attachCheckboxBehavior(scope, element);
      } else {
        $md083forkInkRipple$mdInkRipple.attachButtonBehavior(scope, element);
      }
    }
  };
}
InkRippleDirective.$inject = ["$md083forkInkRipple$mdInkRipple"];

function InkRippleService($window, $timeout) {

  return {
    attachButtonBehavior: attachButtonBehavior,
    attachCheckboxBehavior: attachCheckboxBehavior,
    attachTabBehavior: attachTabBehavior,
    attach: attach
  };

  function attachButtonBehavior(scope, element, options) {
    return attach(scope, element, angular.extend({
      fullRipple: true,
      isMenuItem: element.hasClass('md-menu-item'),
      center: false,
      dimBackground: true
    }, options));
  }

  function attachCheckboxBehavior(scope, element, options) {
    return attach(scope, element, angular.extend({
      center: true,
      dimBackground: false,
      fitRipple: true
    }, options));
  }

  function attachTabBehavior(scope, element, options) {
    return attach(scope, element, angular.extend({
      center: false,
      dimBackground: true,
      outline: false,
      rippleSize: 'full'
    }, options));
  }

  function attach(scope, element, options) {
    if (element.controller('mdNoInk')) return angular.noop;

    options = angular.extend({
      colorElement: element,
      mousedown: true,
      hover: true,
      focus: true,
      center: false,
      mousedownPauseTime: 150,
      dimBackground: false,
      outline: false,
      fullRipple: true,
      isMenuItem: false,
      fitRipple: false
    }, options);

    var rippleSize,
        controller = element.controller('mdInkRipple') || {},
        counter = 0,
        ripples = [],
        states = [],
        isActiveExpr = element.attr('md-highlight'),
        isActive = false,
        isHeld = false,
        node = element[0],
        rippleSizeSetting = element.attr('md-ripple-size'),
        color = parseColor(element.attr('md-ink-ripple')) || parseColor($window.getComputedStyle(options.colorElement[0]).color || 'rgb(0, 0, 0)');

    switch (rippleSizeSetting) {
      case 'full':
        options.fullRipple = true;
        break;
      case 'partial':
        options.fullRipple = false;
        break;
    }

    // expose onInput for ripple testing
    if (options.mousedown) {
      element.on('$md083fork.pressdown', onPressDown)
        .on('$md083fork.pressup', onPressUp);
    }

    controller.createRipple = createRipple;

    if (isActiveExpr) {
      scope.$watch(isActiveExpr, function watchActive(newValue) {
        isActive = newValue;
        if (isActive && !ripples.length) {
          $timeout(function () { createRipple(0, 0); }, 0, false);
        }
        angular.forEach(ripples, updateElement);
      });
    }

    // Publish self-detach method if desired...
    return function detach() {
      element.off('$md083fork.pressdown', onPressDown)
        .off('$md083fork.pressup', onPressUp);
      getRippleContainer().remove();
    };

    /**
     * Gets the current ripple container
     * If there is no ripple container, it creates one and returns it
     *
     * @returns {angular.element} ripple container element
     */
    function getRippleContainer() {
      var container = element.data('$mdRippleContainer');
      if (container) return container;
      container = angular.element('<div class="md-ripple-container">');
      element.append(container);
      element.data('$mdRippleContainer', container);
      return container;
    }

    function parseColor(color) {
      if (!color) return;
      if (color.indexOf('rgba') === 0) return color.replace(/\d?\.?\d*\s*\)\s*$/, '0.1)');
      if (color.indexOf('rgb')  === 0) return rgbToRGBA(color);
      if (color.indexOf('#')    === 0) return hexToRGBA(color);

      /**
       * Converts a hex value to an rgba string
       *
       * @param {string} hex value (3 or 6 digits) to be converted
       *
       * @returns {string} rgba color with 0.1 alpha
       */
      function hexToRGBA(color) {
        var hex = color.charAt(0) === '#' ? color.substr(1) : color,
          dig = hex.length / 3,
          red = hex.substr(0, dig),
          grn = hex.substr(dig, dig),
          blu = hex.substr(dig * 2);
        if (dig === 1) {
          red += red;
          grn += grn;
          blu += blu;
        }
        return 'rgba(' + parseInt(red, 16) + ',' + parseInt(grn, 16) + ',' + parseInt(blu, 16) + ',0.1)';
      }

      /**
       * Converts rgb value to rgba string
       *
       * @param {string} rgb color string
       *
       * @returns {string} rgba color with 0.1 alpha
       */
      function rgbToRGBA(color) {
        return color.replace(')', ', 0.1)').replace('(', 'a(');
      }

    }

    function removeElement(elem, wait) {
      ripples.splice(ripples.indexOf(elem), 1);
      if (ripples.length === 0) {
        getRippleContainer().css({ backgroundColor: '' });
      }
      $timeout(function () { elem.remove(); }, wait, false);
    }

    function updateElement(elem) {
      var index = ripples.indexOf(elem),
          state = states[index] || {},
          elemIsActive = ripples.length > 1 ? false : isActive,
          elemIsHeld   = ripples.length > 1 ? false : isHeld;
      if (elemIsActive || state.animating || elemIsHeld) {
        elem.addClass('md-ripple-visible');
      } else if (elem) {
        elem.removeClass('md-ripple-visible');
        if (options.outline) {
          elem.css({
            width: rippleSize + 'px',
            height: rippleSize + 'px',
            marginLeft: (rippleSize * -1) + 'px',
            marginTop: (rippleSize * -1) + 'px'
          });
        }
        removeElement(elem, options.outline ? 450 : 650);
      }
    }

    /**
     * Creates a ripple at the provided coordinates
     *
     * @param {number} left cursor position
     * @param {number} top cursor position
     *
     * @returns {angular.element} the generated ripple element
     */
    function createRipple(left, top) {

      color = parseColor(element.attr('md-ink-ripple')) || parseColor($window.getComputedStyle(options.colorElement[0]).color || 'rgb(0, 0, 0)');

      var container = getRippleContainer(),
          size = getRippleSize(left, top),
          css = getRippleCss(size, left, top),
          elem = getRippleElement(css),
          index = ripples.indexOf(elem),
          state = states[index] || {};

      rippleSize = size;

      state.animating = true;

      $timeout(function () {
        if (options.dimBackground) {
          container.css({ backgroundColor: color });
        }
        elem.addClass('md-ripple-placed md-ripple-scaled');
        if (options.outline) {
          elem.css({
            borderWidth: (size * 0.5) + 'px',
            marginLeft: (size * -0.5) + 'px',
            marginTop: (size * -0.5) + 'px'
          });
        } else {
          elem.css({ left: '50%', top: '50%' });
        }
        updateElement(elem);
        $timeout(function () {
          state.animating = false;
          updateElement(elem);
        }, (options.outline ? 450 : 225), false);
      }, 0, false);

      return elem;

      /**
       * Creates the ripple element with the provided css
       *
       * @param {object} css properties to be applied
       *
       * @returns {angular.element} the generated ripple element
       */
      function getRippleElement(css) {
        var elem = angular.element('<div class="md-ripple" data-counter="' + counter++ + '">');
        ripples.unshift(elem);
        states.unshift({ animating: true });
        container.append(elem);
        css && elem.css(css);
        return elem;
      }

      /**
       * Calculate the ripple size
       *
       * @returns {number} calculated ripple diameter
       */
      function getRippleSize(left, top) {
        var width = container.prop('offsetWidth'),
            height = container.prop('offsetHeight'),
            multiplier, size, rect;
        if (options.isMenuItem) {
          size = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        } else if (options.outline) {
          rect = node.getBoundingClientRect();
          left -= rect.left;
          top -= rect.top;
          width = Math.max(left, width - left);
          height = Math.max(top, height - top);
          size = 2 * Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        } else {
          multiplier = options.fullRipple ? 1.1 : 0.8;
          size = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) * multiplier;
          if (options.fitRipple) {
            size = Math.min(height, width, size);
          }
        }
        return size;
      }

      /**
       * Generates the ripple css
       *
       * @param {number} the diameter of the ripple
       * @param {number} the left cursor offset
       * @param {number} the top cursor offset
       *
       * @returns {{backgroundColor: string, borderColor: string, width: string, height: string}}
       */
      function getRippleCss(size, left, top) {
        var rect,
            css = {
              backgroundColor: rgbaToRGB(color),
              borderColor: rgbaToRGB(color),
              width: size + 'px',
              height: size + 'px'
            };

        if (options.outline) {
          css.width = 0;
          css.height = 0;
        } else {
          css.marginLeft = css.marginTop = (size * -0.5) + 'px';
        }

        if (options.center) {
          css.left = css.top = '50%';
        } else {
          rect = node.getBoundingClientRect();
          css.left = Math.round((left - rect.left) / container.prop('offsetWidth') * 100) + '%';
          css.top = Math.round((top - rect.top) / container.prop('offsetHeight') * 100) + '%';
        }

        return css;

        /**
         * Converts rgba string to rgb, removing the alpha value
         *
         * @param {string} rgba color
         *
         * @returns {string} rgb color
         */
        function rgbaToRGB(color) {
          return color.replace('rgba', 'rgb').replace(/,[^\),]+\)/, ')');
        }
      }
    }

    /**
     * Handles user input start and stop events
     *
     */
    function onPressDown(ev) {
      if (!isRippleAllowed()) return;

      createRipple(ev.pointer.x, ev.pointer.y);
      isHeld = true;
    }
    function onPressUp() {
      isHeld = false;
      var ripple = ripples[ ripples.length - 1 ];
      $timeout(function () { updateElement(ripple); }, 0, false);
    }

    /**
     * Determines if the ripple is allowed
     *
     * @returns {boolean} true if the ripple is allowed, false if not
     */
    function isRippleAllowed() {
      var parent = node.parentNode;
      var grandparent = parent && parent.parentNode;
      var ancestor = grandparent && grandparent.parentNode;
      return !isDisabled(node) && !isDisabled(parent) && !isDisabled(grandparent) && !isDisabled(ancestor);
      function isDisabled (elem) {
        return elem && elem.hasAttribute && elem.hasAttribute('disabled');
      }
    }

  }
}
InkRippleService.$inject = ["$window", "$timeout"];

/**
 * noink/nobar/nostretch directive: make any element that has one of
 * these attributes be given a controller, so that other directives can
 * `require:` these and see if there is a `no<xxx>` parent attribute.
 *
 * @usage
 * <hljs lang="html">
 * <parent md-no-ink>
 *   <child detect-no>
 *   </child>
 * </parent>
 * </hljs>
 *
 * <hljs lang="js">
 * myApp.directive('detectNo', function() {
 *   return {
 *     require: ['^?mdNoInk', ^?mdNoBar'],
 *     link: function(scope, element, attr, ctrls) {
 *       var noinkCtrl = ctrls[0];
 *       var nobarCtrl = ctrls[1];
 *       if (noInkCtrl) {
 *         alert("the md-no-ink flag has been specified on an ancestor!");
 *       }
 *       if (nobarCtrl) {
 *         alert("the md-no-bar flag has been specified on an ancestor!");
 *       }
 *     }
 *   };
 * });
 * </hljs>
 */
function attrNoDirective() {
  return function() {
    return {
      controller: angular.noop
    };
  };
}
})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';

angular.module('material.083fork.core.theming.palette', [])
.constant('$mdColorPalette', {
  'red': {
    '50': '#ffebee',
    '100': '#ffcdd2',
    '200': '#ef9a9a',
    '300': '#e57373',
    '400': '#ef5350',
    '500': '#f44336',
    '600': '#e53935',
    '700': '#d32f2f',
    '800': '#c62828',
    '900': '#b71c1c',
    'A100': '#ff8a80',
    'A200': '#ff5252',
    'A400': '#ff1744',
    'A700': '#d50000',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 400 A100',
    'contrastStrongLightColors': '500 600 700 A200 A400 A700'
  },
  'pink': {
    '50': '#fce4ec',
    '100': '#f8bbd0',
    '200': '#f48fb1',
    '300': '#f06292',
    '400': '#ec407a',
    '500': '#e91e63',
    '600': '#d81b60',
    '700': '#c2185b',
    '800': '#ad1457',
    '900': '#880e4f',
    'A100': '#ff80ab',
    'A200': '#ff4081',
    'A400': '#f50057',
    'A700': '#c51162',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 400 A100',
    'contrastStrongLightColors': '500 600 A200 A400 A700'
  },
  'purple': {
    '50': '#f3e5f5',
    '100': '#e1bee7',
    '200': '#ce93d8',
    '300': '#ba68c8',
    '400': '#ab47bc',
    '500': '#9c27b0',
    '600': '#8e24aa',
    '700': '#7b1fa2',
    '800': '#6a1b9a',
    '900': '#4a148c',
    'A100': '#ea80fc',
    'A200': '#e040fb',
    'A400': '#d500f9',
    'A700': '#aa00ff',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 A100',
    'contrastStrongLightColors': '300 400 A200 A400 A700'
  },
  'deep-purple': {
    '50': '#ede7f6',
    '100': '#d1c4e9',
    '200': '#b39ddb',
    '300': '#9575cd',
    '400': '#7e57c2',
    '500': '#673ab7',
    '600': '#5e35b1',
    '700': '#512da8',
    '800': '#4527a0',
    '900': '#311b92',
    'A100': '#b388ff',
    'A200': '#7c4dff',
    'A400': '#651fff',
    'A700': '#6200ea',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 A100',
    'contrastStrongLightColors': '300 400 A200'
  },
  'indigo': {
    '50': '#e8eaf6',
    '100': '#c5cae9',
    '200': '#9fa8da',
    '300': '#7986cb',
    '400': '#5c6bc0',
    '500': '#3f51b5',
    '600': '#3949ab',
    '700': '#303f9f',
    '800': '#283593',
    '900': '#1a237e',
    'A100': '#8c9eff',
    'A200': '#536dfe',
    'A400': '#3d5afe',
    'A700': '#304ffe',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 A100',
    'contrastStrongLightColors': '300 400 A200 A400'
  },
  'blue': {
    '50': '#e3f2fd',
    '100': '#bbdefb',
    '200': '#90caf9',
    '300': '#64b5f6',
    '400': '#42a5f5',
    '500': '#2196f3',
    '600': '#1e88e5',
    '700': '#1976d2',
    '800': '#1565c0',
    '900': '#0d47a1',
    'A100': '#82b1ff',
    'A200': '#448aff',
    'A400': '#2979ff',
    'A700': '#2962ff',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '100 200 300 400 A100',
    'contrastStrongLightColors': '500 600 700 A200 A400 A700'
  },
  'light-blue': {
    '50': '#e1f5fe',
    '100': '#b3e5fc',
    '200': '#81d4fa',
    '300': '#4fc3f7',
    '400': '#29b6f6',
    '500': '#03a9f4',
    '600': '#039be5',
    '700': '#0288d1',
    '800': '#0277bd',
    '900': '#01579b',
    'A100': '#80d8ff',
    'A200': '#40c4ff',
    'A400': '#00b0ff',
    'A700': '#0091ea',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '500 600 700 800 900 A700',
    'contrastStrongLightColors': '500 600 700 800 A700'
  },
  'cyan': {
    '50': '#e0f7fa',
    '100': '#b2ebf2',
    '200': '#80deea',
    '300': '#4dd0e1',
    '400': '#26c6da',
    '500': '#00bcd4',
    '600': '#00acc1',
    '700': '#0097a7',
    '800': '#00838f',
    '900': '#006064',
    'A100': '#84ffff',
    'A200': '#18ffff',
    'A400': '#00e5ff',
    'A700': '#00b8d4',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '500 600 700 800 900',
    'contrastStrongLightColors': '500 600 700 800'
  },
  'teal': {
    '50': '#e0f2f1',
    '100': '#b2dfdb',
    '200': '#80cbc4',
    '300': '#4db6ac',
    '400': '#26a69a',
    '500': '#009688',
    '600': '#00897b',
    '700': '#00796b',
    '800': '#00695c',
    '900': '#004d40',
    'A100': '#a7ffeb',
    'A200': '#64ffda',
    'A400': '#1de9b6',
    'A700': '#00bfa5',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '500 600 700 800 900',
    'contrastStrongLightColors': '500 600 700'
  },
  'green': {
    '50': '#e8f5e9',
    '100': '#c8e6c9',
    '200': '#a5d6a7',
    '300': '#81c784',
    '400': '#66bb6a',
    '500': '#4caf50',
    '600': '#43a047',
    '700': '#388e3c',
    '800': '#2e7d32',
    '900': '#1b5e20',
    'A100': '#b9f6ca',
    'A200': '#69f0ae',
    'A400': '#00e676',
    'A700': '#00c853',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '500 600 700 800 900',
    'contrastStrongLightColors': '500 600 700'
  },
  'light-green': {
    '50': '#f1f8e9',
    '100': '#dcedc8',
    '200': '#c5e1a5',
    '300': '#aed581',
    '400': '#9ccc65',
    '500': '#8bc34a',
    '600': '#7cb342',
    '700': '#689f38',
    '800': '#558b2f',
    '900': '#33691e',
    'A100': '#ccff90',
    'A200': '#b2ff59',
    'A400': '#76ff03',
    'A700': '#64dd17',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '800 900',
    'contrastStrongLightColors': '800 900'
  },
  'lime': {
    '50': '#f9fbe7',
    '100': '#f0f4c3',
    '200': '#e6ee9c',
    '300': '#dce775',
    '400': '#d4e157',
    '500': '#cddc39',
    '600': '#c0ca33',
    '700': '#afb42b',
    '800': '#9e9d24',
    '900': '#827717',
    'A100': '#f4ff81',
    'A200': '#eeff41',
    'A400': '#c6ff00',
    'A700': '#aeea00',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '900',
    'contrastStrongLightColors': '900'
  },
  'yellow': {
    '50': '#fffde7',
    '100': '#fff9c4',
    '200': '#fff59d',
    '300': '#fff176',
    '400': '#ffee58',
    '500': '#ffeb3b',
    '600': '#fdd835',
    '700': '#fbc02d',
    '800': '#f9a825',
    '900': '#f57f17',
    'A100': '#ffff8d',
    'A200': '#ffff00',
    'A400': '#ffea00',
    'A700': '#ffd600',
    'contrastDefaultColor': 'dark'
  },
  'amber': {
    '50': '#fff8e1',
    '100': '#ffecb3',
    '200': '#ffe082',
    '300': '#ffd54f',
    '400': '#ffca28',
    '500': '#ffc107',
    '600': '#ffb300',
    '700': '#ffa000',
    '800': '#ff8f00',
    '900': '#ff6f00',
    'A100': '#ffe57f',
    'A200': '#ffd740',
    'A400': '#ffc400',
    'A700': '#ffab00',
    'contrastDefaultColor': 'dark'
  },
  'orange': {
    '50': '#fff3e0',
    '100': '#ffe0b2',
    '200': '#ffcc80',
    '300': '#ffb74d',
    '400': '#ffa726',
    '500': '#ff9800',
    '600': '#fb8c00',
    '700': '#f57c00',
    '800': '#ef6c00',
    '900': '#e65100',
    'A100': '#ffd180',
    'A200': '#ffab40',
    'A400': '#ff9100',
    'A700': '#ff6d00',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '800 900',
    'contrastStrongLightColors': '800 900'
  },
  'deep-orange': {
    '50': '#fbe9e7',
    '100': '#ffccbc',
    '200': '#ffab91',
    '300': '#ff8a65',
    '400': '#ff7043',
    '500': '#ff5722',
    '600': '#f4511e',
    '700': '#e64a19',
    '800': '#d84315',
    '900': '#bf360c',
    'A100': '#ff9e80',
    'A200': '#ff6e40',
    'A400': '#ff3d00',
    'A700': '#dd2c00',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 400 A100 A200',
    'contrastStrongLightColors': '500 600 700 800 900 A400 A700'
  },
  'brown': {
    '50': '#efebe9',
    '100': '#d7ccc8',
    '200': '#bcaaa4',
    '300': '#a1887f',
    '400': '#8d6e63',
    '500': '#795548',
    '600': '#6d4c41',
    '700': '#5d4037',
    '800': '#4e342e',
    '900': '#3e2723',
    'A100': '#d7ccc8',
    'A200': '#bcaaa4',
    'A400': '#8d6e63',
    'A700': '#5d4037',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200',
    'contrastStrongLightColors': '300 400'
  },
  'grey': {
    '0': '#ffffff',
    '50': '#fafafa',
    '100': '#f5f5f5',
    '200': '#eeeeee',
    '300': '#e0e0e0',
    '400': '#bdbdbd',
    '500': '#9e9e9e',
    '600': '#757575',
    '700': '#616161',
    '800': '#424242',
    '900': '#212121',
    '1000': '#000000',
    'A100': '#ffffff',
    'A200': '#eeeeee',
    'A400': '#bdbdbd',
    'A700': '#616161',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '600 700 800 900'
  },
  'blue-grey': {
    '50': '#eceff1',
    '100': '#cfd8dc',
    '200': '#b0bec5',
    '300': '#90a4ae',
    '400': '#78909c',
    '500': '#607d8b',
    '600': '#546e7a',
    '700': '#455a64',
    '800': '#37474f',
    '900': '#263238',
    'A100': '#cfd8dc',
    'A200': '#b0bec5',
    'A400': '#78909c',
    'A700': '#455a64',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300',
    'contrastStrongLightColors': '400 500'
  }
});
})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';

angular.module('material.083fork.core.theming', ['material.083fork.core.theming.palette'])
  .directive('mdTheme', ThemingDirective)
  .directive('mdThemable', ThemableDirective)
  .provider('$md083forkTheming', ThemingProvider)
  .run(generateThemes);

/**
 * @ngdoc provider
 * @name $md083forkThemingProvider
 * @module material.083fork.core
 *
 * @description Provider to configure the `$md083forkTheming` service.
 */

/**
 * @ngdoc method
 * @name $md083forkThemingProvider#setDefaultTheme
 * @param {string} themeName Default theme name to be applied to elements. Default value is `default`.
 */

/**
 * @ngdoc method
 * @name $md083forkThemingProvider#alwaysWatchTheme
 * @param {boolean} watch Whether or not to always watch themes for changes and re-apply
 * classes when they change. Default is `false`. Enabling can reduce performance.
 */

// In memory storage of defined themes and color palettes (both loaded by CSS, and user specified)
var PALETTES;
var THEMES;
var themingProvider;
var generationIsDone;

var DARK_FOREGROUND = {
  name: 'dark',
  '1': 'rgba(0,0,0,0.87)',
  '2': 'rgba(0,0,0,0.54)',
  '3': 'rgba(0,0,0,0.26)',
  '4': 'rgba(0,0,0,0.12)'
};
var LIGHT_FOREGROUND = {
  name: 'light',
  '1': 'rgba(255,255,255,1.0)',
  '2': 'rgba(255,255,255,0.7)',
  '3': 'rgba(255,255,255,0.3)',
  '4': 'rgba(255,255,255,0.12)'
};

var DARK_SHADOW = '1px 1px 0px rgba(0,0,0,0.4), -1px -1px 0px rgba(0,0,0,0.4)';
var LIGHT_SHADOW = '';

var DARK_CONTRAST_COLOR = colorToRgbaArray('rgba(0,0,0,0.87)');
var LIGHT_CONTRAST_COLOR = colorToRgbaArray('rgba(255,255,255,0.87');
var STRONG_LIGHT_CONTRAST_COLOR = colorToRgbaArray('rgb(255,255,255)');

var THEME_COLOR_TYPES = ['primary', 'accent', 'warn', 'background'];
var DEFAULT_COLOR_TYPE = 'primary';

// A color in a theme will use these hues by default, if not specified by user.
var LIGHT_DEFAULT_HUES = {
  'accent': {
    'default': 'A200',
    'hue-1': 'A100',
    'hue-2': 'A400',
    'hue-3': 'A700'
  }
};
var DARK_DEFAULT_HUES = {
  'background': {
    'default': '500',
    'hue-1': '300',
    'hue-2': '600',
    'hue-3': '800'
  }
};
THEME_COLOR_TYPES.forEach(function(colorType) {
  // Color types with unspecified default hues will use these default hue values
  var defaultDefaultHues = {
    'default': '500',
    'hue-1': '300',
    'hue-2': '800',
    'hue-3': 'A100'
  };
  if (!LIGHT_DEFAULT_HUES[colorType]) LIGHT_DEFAULT_HUES[colorType] = defaultDefaultHues;
  if (!DARK_DEFAULT_HUES[colorType]) DARK_DEFAULT_HUES[colorType] = defaultDefaultHues;
});

var VALID_HUE_VALUES = [
  '50', '100', '200', '300', '400', '500', '600',
  '700', '800', '900', 'A100', 'A200', 'A400', 'A700'
];

function ThemingProvider($mdColorPalette) {
  PALETTES = {};
  THEMES = {};
  var defaultTheme = 'default';
  var alwaysWatchTheme = false;

  // Load JS Defined Palettes
  angular.extend(PALETTES, $mdColorPalette);

  // Default theme defined in core.js

  ThemingService.$inject = ["$rootScope", "$log"];
  return themingProvider = {
    definePalette: definePalette,
    extendPalette: extendPalette,
    theme: registerTheme,

    setDefaultTheme: function(theme) {
      defaultTheme = theme;
    },
    alwaysWatchTheme: function(alwaysWatch) {
      alwaysWatchTheme = alwaysWatch;
    },
    $get: ThemingService,
    _LIGHT_DEFAULT_HUES: LIGHT_DEFAULT_HUES,
    _DARK_DEFAULT_HUES: DARK_DEFAULT_HUES,
    _PALETTES: PALETTES,
    _THEMES: THEMES,
    _parseRules: parseRules,
    _rgba: rgba
  };

  // Example: $md083forkThemingProvider.definePalette('neonRed', { 50: '#f5fafa', ... });
  function definePalette(name, map) {
    map = map || {};
    PALETTES[name] = checkPaletteValid(name, map);
    return themingProvider;
  }

  // Returns an new object which is a copy of a given palette `name` with variables from
  // `map` overwritten
  // Example: var neonRedMap = $md083forkThemingProvider.extendPalette('red', { 50: '#f5fafafa' });
  function extendPalette(name, map) {
    return checkPaletteValid(name,  angular.extend({}, PALETTES[name] || {}, map) );
  }

  // Make sure that palette has all required hues
  function checkPaletteValid(name, map) {
    var missingColors = VALID_HUE_VALUES.filter(function(field) {
      return !map[field];
    });
    if (missingColors.length) {
      throw new Error("Missing colors %1 in palette %2!"
                      .replace('%1', missingColors.join(', '))
                      .replace('%2', name));
    }

    return map;
  }

  // Register a theme (which is a collection of color palettes to use with various states
  // ie. warn, accent, primary )
  // Optionally inherit from an existing theme
  // $md083forkThemingProvider.theme('custom-theme').primaryPalette('red');
  function registerTheme(name, inheritFrom) {
    inheritFrom = inheritFrom || 'default';
    if (THEMES[name]) return THEMES[name];

    var parentTheme = typeof inheritFrom === 'string' ? THEMES[inheritFrom] : inheritFrom;
    var theme = new Theme(name);

    if (parentTheme) {
      angular.forEach(parentTheme.colors, function(color, colorType) {
        theme.colors[colorType] = {
          name: color.name,
          // Make sure a COPY of the hues is given to the child color,
          // not the same reference.
          hues: angular.extend({}, color.hues)
        };
      });
    }
    THEMES[name] = theme;

    return theme;
  }

  function Theme(name) {
    var self = this;
    self.name = name;
    self.colors = {};

    self.dark = setDark;
    setDark(false);

    function setDark(isDark) {
      isDark = arguments.length === 0 ? true : !!isDark;

      // If no change, abort
      if (isDark === self.isDark) return;

      self.isDark = isDark;

      self.foregroundPalette = self.isDark ? LIGHT_FOREGROUND : DARK_FOREGROUND;
      self.foregroundShadow = self.isDark ? DARK_SHADOW : LIGHT_SHADOW;
      
      // Light and dark themes have different default hues.
      // Go through each existing color type for this theme, and for every
      // hue value that is still the default hue value from the previous light/dark setting,
      // set it to the default hue value from the new light/dark setting.
      var newDefaultHues = self.isDark ? DARK_DEFAULT_HUES : LIGHT_DEFAULT_HUES;
      var oldDefaultHues = self.isDark ? LIGHT_DEFAULT_HUES : DARK_DEFAULT_HUES;
      angular.forEach(newDefaultHues, function(newDefaults, colorType) {
        var color = self.colors[colorType];
        var oldDefaults = oldDefaultHues[colorType];
        if (color) {
          for (var hueName in color.hues) {
            if (color.hues[hueName] === oldDefaults[hueName]) {
              color.hues[hueName] = newDefaults[hueName];
            }
          }
        }
      });

      return self;
    }

    THEME_COLOR_TYPES.forEach(function(colorType) {
      var defaultHues = (self.isDark ? DARK_DEFAULT_HUES : LIGHT_DEFAULT_HUES)[colorType];
      self[colorType + 'Palette'] = function setPaletteType(paletteName, hues) {
        var color = self.colors[colorType] = {
          name: paletteName,
          hues: angular.extend({}, defaultHues, hues)
        };

        Object.keys(color.hues).forEach(function(name) {
          if (!defaultHues[name]) {
            throw new Error("Invalid hue name '%1' in theme %2's %3 color %4. Available hue names: %4"
              .replace('%1', name)
              .replace('%2', self.name)
              .replace('%3', paletteName)
              .replace('%4', Object.keys(defaultHues).join(', '))
            );
          }
        });
        Object.keys(color.hues).map(function(key) {
          return color.hues[key];
        }).forEach(function(hueValue) {
          if (VALID_HUE_VALUES.indexOf(hueValue) == -1) {
            throw new Error("Invalid hue value '%1' in theme %2's %3 color %4. Available hue values: %5"
              .replace('%1', hueValue)
              .replace('%2', self.name)
              .replace('%3', colorType)
              .replace('%4', paletteName)
              .replace('%5', VALID_HUE_VALUES.join(', '))
            );
          }
        });
        return self;
      };

      self[colorType + 'Color'] = function() {
        var args = Array.prototype.slice.call(arguments);
        console.warn('$md083forkThemingProviderTheme.' + colorType + 'Color() has been deprecated. ' +
                     'Use $md083forkThemingProviderTheme.' + colorType + 'Palette() instead.');
        return self[colorType + 'Palette'].apply(self, args);
      };
    });
  }

  /**
   * @ngdoc service
   * @name $md083forkTheming
   *
   * @description
   *
   * Service that makes an element apply theming related classes to itself.
   *
   * ```js
   * app.directive('myFancyDirective', function($md083forkTheming) {
   *   return {
   *     restrict: 'e',
   *     link: function(scope, el, attrs) {
   *       $md083forkTheming(el);
   *     }
   *   };
   * });
   * ```
   * @param {el=} element to apply theming to
   */
  /* @ngInject */
  function ThemingService($rootScope, $log) {
    applyTheme.inherit = function(el, parent) {
      var ctrl = parent.controller('mdTheme');

      var attrThemeValue = el.attr('md-theme-watch');
      if ( (alwaysWatchTheme || angular.isDefined(attrThemeValue)) && attrThemeValue != 'false') {
        var deregisterWatch = $rootScope.$watch(function() {
          return ctrl && ctrl.$mdTheme || defaultTheme;
        }, changeTheme);
        el.on('$destroy', deregisterWatch);
      } else {
        var theme = ctrl && ctrl.$mdTheme || defaultTheme;
        changeTheme(theme);
      }

      function changeTheme(theme) {
        if (!registered(theme)) {
          $log.warn('Attempted to use unregistered theme \'' + theme + '\'. ' +
                    'Register it with $md083forkThemingProvider.theme().');
        }
        var oldTheme = el.data('$mdThemeName');
        if (oldTheme) el.removeClass('md-' + oldTheme +'-theme');
        el.addClass('md-' + theme + '-theme');
        el.data('$mdThemeName', theme);
      }
    };

    applyTheme.registered = registered;
    applyTheme.defaultTheme = function() {
      return defaultTheme;
    };

    return applyTheme;

    function registered(theme) {
      if (theme === undefined || theme === '') return true;
      return THEMES[theme] !== undefined;
    }

    function applyTheme(scope, el) {
      // Allow us to be invoked via a linking function signature.
      if (el === undefined) {
        el = scope;
        scope = undefined;
      }
      if (scope === undefined) {
        scope = $rootScope;
      }
      applyTheme.inherit(el, el);
    }
  }
}
ThemingProvider.$inject = ["$mdColorPalette"];

function ThemingDirective($md083forkTheming, $interpolate, $log) {
  return {
    priority: 100,
    link: {
      pre: function(scope, el, attrs) {
        var ctrl = {
          $setTheme: function(theme) {
            if (!$md083forkTheming.registered(theme)) {
              $log.warn('attempted to use unregistered theme \'' + theme + '\'');
            }
            ctrl.$mdTheme = theme;
          }
        };
        el.data('$mdThemeController', ctrl);
        ctrl.$setTheme($interpolate(attrs.mdTheme)(scope));
        attrs.$observe('mdTheme', ctrl.$setTheme);
      }
    }
  };
}
ThemingDirective.$inject = ["$md083forkTheming", "$interpolate", "$log"];

function ThemableDirective($md083forkTheming) {
  return $md083forkTheming;
}
ThemableDirective.$inject = ["$md083forkTheming"];

function parseRules(theme, colorType, rules) {
  checkValidPalette(theme, colorType);

  rules = rules.replace(/THEME_NAME/g, theme.name);
  var generatedRules = [];
  var color = theme.colors[colorType];

  var themeNameRegex = new RegExp('.md-' + theme.name + '-theme', 'g');
  // Matches '{{ primary-color }}', etc
  var hueRegex = new RegExp('(\'|")?{{\\s*(' + colorType + ')-(color|contrast)-?(\\d\\.?\\d*)?\\s*}}(\"|\')?','g');
  var simpleVariableRegex = /'?"?\{\{\s*([a-zA-Z]+)-(A?\d+|hue\-[0-3]|shadow)-?(\d\.?\d*)?\s*\}\}'?"?/g;
  var palette = PALETTES[color.name];

  // find and replace simple variables where we use a specific hue, not angentire palette
  // eg. "{{primary-100}}"
  //\(' + THEME_COLOR_TYPES.join('\|') + '\)'
  rules = rules.replace(simpleVariableRegex, function(match, colorType, hue, opacity) {
    if (colorType === 'foreground') {
      if (hue == 'shadow') {
        return theme.foregroundShadow;
      } else {
        return theme.foregroundPalette[hue] || theme.foregroundPalette['1'];
      }
    }
    if (hue.indexOf('hue') === 0) {
      hue = theme.colors[colorType].hues[hue];
    }
    return rgba( (PALETTES[ theme.colors[colorType].name ][hue] || '').value, opacity );
  });

  // For each type, generate rules for each hue (ie. default, md-hue-1, md-hue-2, md-hue-3)
  angular.forEach(color.hues, function(hueValue, hueName) {
    var newRule = rules
      .replace(hueRegex, function(match, _, colorType, hueType, opacity) {
        return rgba(palette[hueValue][hueType === 'color' ? 'value' : 'contrast'], opacity);
      });
    if (hueName !== 'default') {
      newRule = newRule.replace(themeNameRegex, '.md-' + theme.name + '-theme.md-' + hueName);
    }
    generatedRules.push(newRule);
  });

  return generatedRules.join('');
}

// Generate our themes at run time given the state of THEMES and PALETTES
function generateThemes($injector) {
  var themeCss = $injector.has('$MD_THEME_CSS') ? $injector.get('$MD_THEME_CSS') : '';

  // MD_THEME_CSS is a string generated by the build process that includes all the themable
  // components as templates

  // Expose contrast colors for palettes to ensure that text is always readable
  angular.forEach(PALETTES, sanitizePalette);

  // Break the CSS into individual rules
  var rules = themeCss.split(/\}(?!(\}|'|"|;))/)
    .filter(function(rule) { return rule && rule.length; })
    .map(function(rule) { return rule.trim() + '}'; });

  var rulesByType = {};
  THEME_COLOR_TYPES.forEach(function(type) {
    rulesByType[type] = '';
  });
  var ruleMatchRegex = new RegExp('md-(' + THEME_COLOR_TYPES.join('|') + ')', 'g');

  // Sort the rules based on type, allowing us to do color substitution on a per-type basis
  rules.forEach(function(rule) {
    var match = rule.match(ruleMatchRegex);
    // First: test that if the rule has '.md-accent', it goes into the accent set of rules
    for (var i = 0, type; type = THEME_COLOR_TYPES[i]; i++) {
      if (rule.indexOf('.md-' + type) > -1) {
        return rulesByType[type] += rule;
      }
    }

    // If no eg 'md-accent' class is found, try to just find 'accent' in the rule and guess from
    // there
    for (i = 0; type = THEME_COLOR_TYPES[i]; i++) {
      if (rule.indexOf(type) > -1) {
        return rulesByType[type] += rule;
      }
    }

    // Default to the primary array
    return rulesByType[DEFAULT_COLOR_TYPE] += rule;
  });

  var styleString = '';

  // For each theme, use the color palettes specified for `primary`, `warn` and `accent`
  // to generate CSS rules.
  angular.forEach(THEMES, function(theme) {
    THEME_COLOR_TYPES.forEach(function(colorType) {
      styleString += parseRules(theme, colorType, rulesByType[colorType] + '');
    });
    if (theme.colors.primary.name == theme.colors.accent.name) {
      console.warn("$md083forkThemingProvider: Using the same palette for primary and" +
                   " accent. This violates the material design spec.");
    }
  });

  // Insert our newly minted styles into the DOM
  if (!generationIsDone) {
    var style = document.createElement('style');
    style.innerHTML = styleString;
    var head = document.getElementsByTagName('head')[0];
    head.insertBefore(style, head.firstElementChild);
    generationIsDone = true;
  }

  // The user specifies a 'default' contrast color as either light or dark,
  // then explicitly lists which hues are the opposite contrast (eg. A100 has dark, A200 has light)
  function sanitizePalette(palette) {
    var defaultContrast = palette.contrastDefaultColor;
    var lightColors = palette.contrastLightColors || [];
    var strongLightColors = palette.contrastStrongLightColors || [];
    var darkColors = palette.contrastDarkColors || [];

    // These colors are provided as space-separated lists
    if (typeof lightColors === 'string') lightColors = lightColors.split(' ');
    if (typeof strongLightColors === 'string') strongLightColors = strongLightColors.split(' ');
    if (typeof darkColors === 'string') darkColors = darkColors.split(' ');

    // Cleanup after ourselves
    delete palette.contrastDefaultColor;
    delete palette.contrastLightColors;
    delete palette.contrastStrongLightColors;
    delete palette.contrastDarkColors;

    // Change { 'A100': '#fffeee' } to { 'A100': { value: '#fffeee', contrast:DARK_CONTRAST_COLOR }
    angular.forEach(palette, function(hueValue, hueName) {
      if (angular.isObject(hueValue)) return; // Already converted
      // Map everything to rgb colors
      var rgbValue = colorToRgbaArray(hueValue);
      if (!rgbValue) {
        throw new Error("Color %1, in palette %2's hue %3, is invalid. Hex or rgb(a) color expected."
                        .replace('%1', hueValue)
                        .replace('%2', palette.name)
                        .replace('%3', hueName));
      }

      palette[hueName] = {
        value: rgbValue,
        contrast: getContrastColor()
      };
      function getContrastColor() {
        if (defaultContrast === 'light') {
          if (darkColors.indexOf(hueName) > -1) {
            return DARK_CONTRAST_COLOR;
          } else {
            return strongLightColors.indexOf(hueName) > -1 ? STRONG_LIGHT_CONTRAST_COLOR 
              : LIGHT_CONTRAST_COLOR;
          }
        } else {
          if (lightColors.indexOf(hueName) > -1) {
            return strongLightColors.indexOf(hueName) > -1 ? STRONG_LIGHT_CONTRAST_COLOR 
              : LIGHT_CONTRAST_COLOR;
          } else {
            return DARK_CONTRAST_COLOR;
          }
        }
      }
    });
  }

}
generateThemes.$inject = ["$injector"];

function checkValidPalette(theme, colorType) {
  // If theme attempts to use a palette that doesnt exist, throw error
  if (!PALETTES[ (theme.colors[colorType] || {}).name ]) {
    throw new Error(
      "You supplied an invalid color palette for theme %1's %2 palette. Available palettes: %3"
                    .replace('%1', theme.name)
                    .replace('%2', colorType)
                    .replace('%3', Object.keys(PALETTES).join(', '))
    );
  }
}

function colorToRgbaArray(clr) {
  if (angular.isArray(clr) && clr.length == 3) return clr;
  if (/^rgb/.test(clr)) {
    return clr.replace(/(^\s*rgba?\(|\)\s*$)/g, '').split(',').map(function(value, i) {
      return i == 3 ? parseFloat(value, 10) : parseInt(value, 10);
    });
  }
  if (clr.charAt(0) == '#') clr = clr.substring(1);
  if (!/^([a-fA-F0-9]{3}){1,2}$/g.test(clr)) return;

  var dig = clr.length / 3;
  var red = clr.substr(0, dig);
  var grn = clr.substr(dig, dig);
  var blu = clr.substr(dig * 2);
  if (dig === 1) {
    red += red;
    grn += grn;
    blu += blu;
  }
  return [parseInt(red, 16), parseInt(grn, 16), parseInt(blu, 16)];
}

function rgba(rgbArray, opacity) {
  if (rgbArray.length == 4) {
    rgbArray = angular.copy(rgbArray);
    opacity ? rgbArray.pop() : opacity = rgbArray.pop();
  }
  return opacity && (typeof opacity == 'number' || (typeof opacity == 'string' && opacity.length)) ?
    'rgba(' + rgbArray.join(',') + ',' + opacity + ')' :
    'rgb(' + rgbArray.join(',') + ')';
}

})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function () {
  'use strict';
  /**
   * @ngdoc module
   * @name material.components.autocomplete
   */
  /*
   * @see js folder for autocomplete implementation
   */
  angular.module('material.083fork.components.autocomplete', [
    'material.083fork.core',
    'material.083fork.components.icon'
  ]);
})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';

/*
 * @ngdoc module
 * @name material.components.backdrop
 * @description Backdrop
 */

/**
 * @ngdoc directive
 * @name md083forkBackdrop
 * @module material.components.backdrop
 *
 * @restrict E
 *
 * @description
 * `<md083fork-backdrop>` is a backdrop element used by other coponents, such as dialog and bottom sheet.
 * Apply class `opaque` to make the backdrop use the theme backdrop color.
 *
 */

angular.module('material.083fork.components.backdrop', [
  'material.083fork.core'
])
  .directive('md083forkBackdrop', BackdropDirective);

function BackdropDirective($md083forkTheming) {
  return $md083forkTheming;
}
BackdropDirective.$inject = ["$md083forkTheming"];
})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
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
MdButtonDirective.$inject = ["$md083forkInkRipple$mdInkRipple", "$md083forkTheming", "$md083forkAria"];
})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';

/**
 * @ngdoc module
 * @name material.components.checkbox
 * @description Checkbox module!
 */
angular.module('material.083fork.components.checkbox', [
  'material.083fork.core'
])
  .directive('md083forkCheckbox', MdCheckboxDirective);

/**
 * @ngdoc directive
 * @name md083forkCheckbox
 * @module material.components.checkbox
 * @restrict E
 *
 * @description
 * The checkbox directive is used like the normal [angular checkbox](https://docs.angularjs.org/api/ng/input/input%5Bcheckbox%5D).
 *
 * As per the [material design spec](http://www.google.com/design/spec/style/color.html#color-ui-color-application)
 * the checkbox is in the accent color by default. The primary color palette may be used with
 * the `md-primary` class.
 *
 * @param {string} ng-model Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {expression=} ng-true-value The value to which the expression should be set when selected.
 * @param {expression=} ng-false-value The value to which the expression should be set when not selected.
 * @param {string=} ng-change Angular expression to be executed when input changes due to user interaction with the input element.
 * @param {boolean=} md-no-ink Use of attribute indicates use of ripple ink effects
 * @param {string=} aria-label Adds label to checkbox for accessibility.
 * Defaults to checkbox's text. If no default text is found, a warning will be logged.
 *
 * @usage
 * <hljs lang="html">
 * <md083fork-checkbox ng-model="isChecked" aria-label="Finished?">
 *   Finished ?
 * </md083fork-checkbox>
 *
 * <md083fork-checkbox md-no-ink ng-model="hasInk" aria-label="No Ink Effects">
 *   No Ink Effects
 * </md083fork-checkbox>
 *
 * <md083fork-checkbox ng-disabled="true" ng-model="isDisabled" aria-label="Disabled">
 *   Disabled
 * </md083fork-checkbox>
 *
 * </hljs>
 *
 */
function MdCheckboxDirective(inputDirective, $md083forkInkRipple$mdInkRipple, $md083forkAria, $md083forkConstant, $md083forkTheming, $md083forkUtil) {
  inputDirective = inputDirective[0];
  var CHECKED_CSS = 'md-checked';

  return {
    restrict: 'E',
    transclude: true,
    require: '?ngModel',
    template: 
      '<div class="md-container" md-ink-ripple md-ink-ripple-checkbox>' +
        '<div class="md083fork-icon"></div>' +
      '</div>' +
      '<div ng-transclude class="md-label"></div>',
    compile: compile
  };

  // **********************************************************
  // Private Methods
  // **********************************************************

  function compile (tElement, tAttrs) {

    tAttrs.type = 'checkbox';
    tAttrs.tabIndex = 0;
    tElement.attr('role', tAttrs.type);

    return function postLink(scope, element, attr, ngModelCtrl) {
      ngModelCtrl = ngModelCtrl || $md083forkUtil.fakeNgModel();
      var checked = false;
      $md083forkTheming(element);

      if (attr.ngChecked) {
        scope.$watch(
            scope.$eval.bind(scope, attr.ngChecked),
            ngModelCtrl.$setViewValue.bind(ngModelCtrl)
        );
      }

      $md083forkAria.expectWithText(element, 'aria-label');

      // Reuse the original input[type=checkbox] directive from Angular core.
      // This is a bit hacky as we need our own event listener and own render
      // function.
      inputDirective.link.pre(scope, {
        on: angular.noop,
        0: {}
      }, attr, [ngModelCtrl]);

      element.on('click', listener)
        .on('keypress', keypressHandler);
      ngModelCtrl.$render = render;

      function keypressHandler(ev) {
        if(ev.which === $md083forkConstant.KEY_CODE.SPACE) {
          ev.preventDefault();
          listener(ev);
        }
      }
      function listener(ev) {
        if (element[0].hasAttribute('disabled')) return;

        scope.$apply(function() {
          checked = !checked;
          ngModelCtrl.$setViewValue(checked, ev && ev.type);
          ngModelCtrl.$render();
        });
      }

      function render() {
        checked = ngModelCtrl.$viewValue;
        if(checked) {
          element.addClass(CHECKED_CSS);
        } else {
          element.removeClass(CHECKED_CSS);
        }
      }
    };
  }
}
MdCheckboxDirective.$inject = ["inputDirective", "$md083forkInkRipple$mdInkRipple", "$md083forkAria", "$md083forkConstant", "$md083forkTheming", "$md083forkUtil"];

})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';

/**
 * @ngdoc module
 * @name material.components.content
 *
 * @description
 * Scrollable content
 */
angular.module('material.083fork.components.content', [
  'material.083fork.core'
])
  .directive('md083forkContent', mdContentDirective);

/**
 * @ngdoc directive
 * @name md083forkContent
 * @module material.components.content
 *
 * @restrict E
 *
 * @description
 * The `<md083fork-content>` directive is a container element useful for scrollable content
 *
 * ### Restrictions
 *
 * - Add the `md-padding` class to make the content padded.
 *
 * @usage
 * <hljs lang="html">
 *  <md083fork-content class="md-padding">
 *      Lorem ipsum dolor sit amet, ne quod novum mei.
 *  </md083fork-content>
 * </hljs>
 *
 */

function mdContentDirective($md083forkTheming) {
  return {
    restrict: 'E',
    controller: ['$scope', '$element', ContentController],
    link: function(scope, element, attr) {
      var node = element[0];

      $md083forkTheming(element);
      scope.$broadcast('$md083forkContentLoaded', element);

      iosScrollFix(element[0]);
    }
  };

  function ContentController($scope, $element) {
    this.$scope = $scope;
    this.$element = $element;
  }
}
mdContentDirective.$inject = ["$md083forkTheming"];

function iosScrollFix(node) {
  // IOS FIX:
  // If we scroll where there is no more room for the webview to scroll,
  // by default the webview itself will scroll up and down, this looks really
  // bad.  So if we are scrolling to the very top or bottom, add/subtract one
  angular.element(node).on('$md083fork.pressdown', function(ev) {
    // Only touch events
    if (ev.pointer.type !== 't') return;
    // Don't let a child content's touchstart ruin it for us.
    if (ev.$materialScrollFixed) return;
    ev.$materialScrollFixed = true;

    if (node.scrollTop === 0) {
      node.scrollTop = 1;
    } else if (node.scrollHeight === node.scrollTop + node.offsetHeight) {
      node.scrollTop -= 1;
    }
  });
}
})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
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
        var content = element[0].querySelector('md083fork-content');
        if (content && content.scrollHeight > content.clientHeight) {
          element.addClass('md-content-overflow');
        }
      });
    }
  };
}
MdDialogDirective.$inject = ["$$rAF", "$md083forkTheming"];

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
 *   Inside, use an `<md083fork-content>` element for the dialog's content, and use
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
 *            '  <md083fork-content>'+
 *            '    <md-list>'+
 *            '      <md-item ng-repeat="item in items">'+
 *            '       <p>Number {{item}}</p>' +
 *            '      </md-item>'+
 *            '    </md-list>'+
 *            '  </md083fork-content>' +
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
 *             '  <md083fork-content>Hello {{ employee }}!</md083fork-content>' +
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

  advancedDialogOptions.$inject = ["$md083forkDialog", "$md083forkTheming"];
  dialogDefaultOptions.$inject = ["$timeout", "$rootElement", "$compile", "$animate", "$md083forkAria", "$document", "$md083forkUtil", "$md083forkConstant", "$md083forkTheming", "$$rAF", "$q", "$md083forkDialog"];
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
          '<md083fork-content>',
            '<h2>{{ dialog.title }}</h2>',
            '<p>{{ dialog.content }}</p>',
          '</md083fork-content>',
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
        options.backdrop = angular.element('<md083fork-backdrop class="md-dialog-backdrop md-opaque">');
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

      var dialogContent = element.find('md083fork-content');
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
MdDialogProvider.$inject = ["$$083forkInterimElementProvider"];

})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';

/**
 * @ngdoc module
 * @name material.components.icon
 * @description
 * Icon
 */
angular.module('material.083fork.components.icon', [
    'material.083fork.core'
  ])
  .directive('md083forkIcon', mdIconDirective);

/**
 * @ngdoc directive
 * @name md083forkIcon
 * @module material.components.icon
 *
 * @restrict E
 *
 * @description
 * The `md083fork-icon` directive is an markup element useful for showing an icon based on a font-face
 * or a SVG. Both external SVGs (via URLs) or cached SVG from icon sets can be
 * easily loaded and used.
 *
 * @param {string} md-svg-src String URL [or expression ] used to load, cache, and display an external SVG.
 * @param {string} md-svg-icon String name used for lookup of the icon from the internal cache; interpolated strings or
 * expressions may also be used. Specific set names can be used with the syntax `<set name>:<icon name>`.<br/><br/>
 * To use icon sets, developers are required to pre-register the sets using the `$md083forkIconProvider` service.
 * @param {string} md-font-icon String name of CSS icon associated with the font-face will be used
 * to render the icon. Requires the fonts and the named CSS styles to be preloaded.
 * @param {string=} alt Labels icon for accessibility. If an empty string is provided, icon
 * will be hidden from accessibility layer with `aria-hidden="true"`. If there's no alt on the icon
 * nor a label on the parent element, a warning will be logged to the console.
 *
 * @usage
 * <hljs lang="html">
 *  <md083fork-icon md-font-icon="android"          alt="android " ></md083fork-icon>
 *  <md083fork-icon md-svg-icon="action:android"    alt="android " ></md083fork-icon>
 *  <md083fork-icon md-svg-src="/android.svg"       alt="android " ></md083fork-icon>
 *  <md083fork-icon md-svg-src="{{ getAndroid() }}" alt="android " ></md083fork-icon>
 * </hljs>
 */
function mdIconDirective($md083forkIcon, $md083forkTheming, $md083forkAria ) {
  return {
    scope: {
      fontIcon: '@mdFontIcon',
      svgIcon: '@mdSvgIcon',
      svgSrc: '@mdSvgSrc'
    },
    restrict: 'E',
    template: getTemplate,
    link: postLink
  };

  function getTemplate(element, attr) {
    return attr.mdFontIcon ? '<span class="md-font" ng-class="fontIcon"></span>' : '';
  }

  /**
   * Directive postLink
   * Supports embedded SVGs, font-icons, & external SVGs
   */
  function postLink(scope, element, attr) {
    $md083forkTheming(element);

    var ariaLabel = attr.alt || scope.fontIcon || scope.svgIcon;
    var attrName = attr.$normalize(attr.$attr.mdSvgIcon || attr.$attr.mdSvgSrc || '');

    if (attr.alt != '' && !parentsHaveText()) {
      $md083forkAria.expect(element, 'aria-label', ariaLabel);
      $md083forkAria.expect(element, 'role', 'img');
    } else {
      // Hide from the accessibility layer.
      $md083forkAria.expect(element, 'aria-hidden', 'true');
    }

    if (attrName) {
      // Use either pre-configured SVG or URL source, respectively.
      attr.$observe(attrName, function(attrVal) {

        element.empty();
        if (attrVal) {
          $md083forkIcon(attrVal).then(function(svg) {
            element.append(svg);
          });
        }

      });
    }
    function parentsHaveText() {
      var parent = element.parent();
      if (parent.attr('aria-label') || parent.text()) {
        return true;
      }
      else if(parent.parent().attr('aria-label') || parent.parent().text()) {
        return true;
      }
      return false;
    }
  }
}
mdIconDirective.$inject = ["$md083forkIcon", "$md083forkTheming", "$md083forkAria"];

})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
  'use strict';

  angular
    .module('material.083fork.components.icon' )
    .provider('$md083forkIcon', MdIconProvider);

  /**
    * @ngdoc service
    * @name $md083forkIconProvider
    * @module material.components.icon
    *
    * @description
    * `$md083forkIconProvider` is used only to register icon IDs with URLs. These configuration features allow
    * icons and icon sets to be pre-registered and associated with source URLs **before** the `<md083fork-icon />`
    * directives are compiled.
    *
    * Loading of the actual svg files are deferred to on-demand requests and are loaded
    * internally by the `$md083forkIcon` service using the `$http` service. When an SVG is requested by name/ID,
    * the `$md083forkIcon` service searches its registry for the associated source URL;
    * that URL is used to on-demand load and parse the SVG dynamically.
    *
    * <hljs lang="js">
    *   app.config(function($md083forkIconProvider) {
    *
    *     // Configure URLs for icons specified by [set:]id.
    *
    *     $md083forkIconProvider
    *          .defaultIconSet('my/app/icons.svg')       // Register a default set of SVG icons
    *          .iconSet('social', 'my/app/social.svg')   // Register a named icon set of SVGs
    *          .icon('android', 'my/app/android.svg')    // Register a specific icon (by name)
    *          .icon('work:chair', 'my/app/chair.svg');  // Register icon in a specific set
    *   });
    * </hljs>
    *
    * SVG icons and icon sets can be easily pre-loaded and cached using either (a) a build process or (b) a runtime
    * **startup** process (shown below):
    *
    * <hljs lang="js">
    *   app.config(function($md083forkIconProvider) {
    *
    *     // Register a default set of SVG icon definitions
    *     $md083forkIconProvider.defaultIconSet('my/app/icons.svg')
    *
    *   })
    *   .run(function($http, $templateCache){
    *
    *     // Pre-fetch icons sources by URL and cache in the $templateCache...
    *     // subsequent $http calls will look there first.
    *
    *     var urls = [ 'imy/app/icons.svg', 'img/icons/android.svg'];
    *
    *     angular.forEach(urls, function(url) {
    *       $http.get(url, {cache: $templateCache});
    *     });
    *
    *   });
    *
    * </hljs>
    *
    * NOTE: the loaded SVG data is subsequently cached internally for future requests.
    *
    */

   /**
    * @ngdoc method
    * @name $md083forkIconProvider#icon
    *
    * @description
    * Register a source URL for a specific icon name; the name may include optional 'icon set' name prefix.
    * These icons  will later be retrieved from the cache using `$md083forkIcon( <icon name> )`
    *
    * @param {string} id Icon name/id used to register the icon
    * @param {string} url specifies the external location for the data file. Used internally by `$http` to load the
    * data or as part of the lookup in `$templateCache` if pre-loading was configured.
    * @param {string=} iconSize Number indicating the width and height of the icons in the set. All icons
    * in the icon set must be the same size. Default size is 24.
    *
    * @returns {obj} an `$md083forkIconProvider` reference; used to support method call chains for the API
    *
    * @usage
    * <hljs lang="js">
    *   app.config(function($md083forkIconProvider) {
    *
    *     // Configure URLs for icons specified by [set:]id.
    *
    *     $md083forkIconProvider
    *          .icon('android', 'my/app/android.svg')    // Register a specific icon (by name)
    *          .icon('work:chair', 'my/app/chair.svg');  // Register icon in a specific set
    *   });
    * </hljs>
    *
    */
   /**
    * @ngdoc method
    * @name $md083forkIconProvider#iconSet
    *
    * @description
    * Register a source URL for a 'named' set of icons; group of SVG definitions where each definition
    * has an icon id. Individual icons can be subsequently retrieved from this cached set using
    * `$md083forkIcon( <icon set name>:<icon name> )`
    *
    * @param {string} id Icon name/id used to register the iconset
    * @param {string} url specifies the external location for the data file. Used internally by `$http` to load the
    * data or as part of the lookup in `$templateCache` if pre-loading was configured.
    * @param {string=} iconSize Number indicating the width and height of the icons in the set. All icons
    * in the icon set must be the same size. Default size is 24.
    *
    * @returns {obj} an `$md083forkIconProvider` reference; used to support method call chains for the API
    *
    *
    * @usage
    * <hljs lang="js">
    *   app.config(function($md083forkIconProvider) {
    *
    *     // Configure URLs for icons specified by [set:]id.
    *
    *     $md083forkIconProvider
    *          .iconSet('social', 'my/app/social.svg')   // Register a named icon set
    *   });
    * </hljs>
    *
    */
   /**
    * @ngdoc method
    * @name $md083forkIconProvider#defaultIconSet
    *
    * @description
    * Register a source URL for the default 'named' set of icons. Unless explicitly registered,
    * subsequent lookups of icons will failover to search this 'default' icon set.
    * Icon can be retrieved from this cached, default set using `$md083forkIcon( <icon name> )`
    *
    * @param {string} url specifies the external location for the data file. Used internally by `$http` to load the
    * data or as part of the lookup in `$templateCache` if pre-loading was configured.
    * @param {string=} iconSize Number indicating the width and height of the icons in the set. All icons
    * in the icon set must be the same size. Default size is 24.
    *
    * @returns {obj} an `$md083forkIconProvider` reference; used to support method call chains for the API
    *
    * @usage
    * <hljs lang="js">
    *   app.config(function($md083forkIconProvider) {
    *
    *     // Configure URLs for icons specified by [set:]id.
    *
    *     $md083forkIconProvider
    *          .defaultIconSet( 'my/app/social.svg' )   // Register a default icon set
    *   });
    * </hljs>
    *
    */
   /**
    * @ngdoc method
    * @name $md083forkIconProvider#defaultIconSize
    *
    * @description
    * While `<md083fork-icon />` markup can also be style with sizing CSS, this method configures
    * the default width **and** height used for all icons; unless overridden by specific CSS.
    * The default sizing is (24px, 24px).
    *
    * @param {string} iconSize Number indicating the width and height of the icons in the set. All icons
    * in the icon set must be the same size. Default size is 24.
    *
    * @returns {obj} an `$md083forkIconProvider` reference; used to support method call chains for the API
    *
    * @usage
    * <hljs lang="js">
    *   app.config(function($md083forkIconProvider) {
    *
    *     // Configure URLs for icons specified by [set:]id.
    *
    *     $md083forkIconProvider
    *          .defaultIconSize(36)   // Register a default icon size (width == height)
    *   });
    * </hljs>
    *
    */

 var config = {
   defaultIconSize: 24
 };

 function MdIconProvider() { }

 MdIconProvider.prototype = {
   icon : function icon(id, url, iconSize) {
     if ( id.indexOf(':') == -1 ) id = '$default:' + id;

     config[id] = new ConfigurationItem(url, iconSize );
     return this;
   },

   iconSet : function iconSet(id, url, iconSize) {
     config[id] = new ConfigurationItem(url, iconSize );
     return this;
   },

   defaultIconSet : function defaultIconSet(url, iconSize) {
     var setName = '$default';

     if ( !config[setName] ) {
       config[setName] = new ConfigurationItem(url, iconSize );
     }

     config[setName].iconSize = iconSize || config.defaultIconSize;

     return this;
   },

   defaultIconSize : function defaultIconSize(iconSize) {
     config.defaultIconSize = iconSize;
     return this;
   },

   preloadIcons: function ($templateCache) {
     var iconProvider = this;
     var svgRegistry = [
       {
         id : 'tabs-arrow',
         url: 'tabs-arrow.svg',
         svg: '<svg version="1.1" x="0px" y="0px" viewBox="0 0 24 24"><g id="tabs-arrow"><polygon points="15.4,7.4 14,6 8,12 14,18 15.4,16.6 10.8,12 "/></g></svg>'
       },
       {
         id : 'close',
         url: 'close.svg',
         svg: '<svg version="1.1" x="0px" y="0px" viewBox="0 0 24 24"><g id="close"><path d="M19 6.41l-1.41-1.41-5.59 5.59-5.59-5.59-1.41 1.41 5.59 5.59-5.59 5.59 1.41 1.41 5.59-5.59 5.59 5.59 1.41-1.41-5.59-5.59z"/></g></svg>'
       },
       {
         id:  'cancel',
         url: 'cancel.svg',
         svg: '<svg version="1.1" x="0px" y="0px" viewBox="0 0 24 24"><g id="cancel"><path d="M12 2c-5.53 0-10 4.47-10 10s4.47 10 10 10 10-4.47 10-10-4.47-10-10-10zm5 13.59l-1.41 1.41-3.59-3.59-3.59 3.59-1.41-1.41 3.59-3.59-3.59-3.59 1.41-1.41 3.59 3.59 3.59-3.59 1.41 1.41-3.59 3.59 3.59 3.59z"/></g></svg>'
       }
     ];

     svgRegistry.forEach(function(asset){
       iconProvider.icon(asset.id,  asset.url);
       $templateCache.put(asset.url, asset.svg);
     });

   },

   $get : ['$http', '$q', '$log', '$templateCache', function($http, $q, $log, $templateCache) {
     this.preloadIcons($templateCache);
     return new MdIconService(config, $http, $q, $log, $templateCache);
   }]
 };

   /**
    *  Configuration item stored in the Icon registry; used for lookups
    *  to load if not already cached in the `loaded` cache
    */
   function ConfigurationItem(url, iconSize) {
     this.url = url;
     this.iconSize = iconSize || config.defaultIconSize;
   }

 /**
  * @ngdoc service
  * @name $md083forkIcon
  * @module material.components.icon
  *
  * @description
  * The `$md083forkIcon` service is a function used to lookup SVG icons.
  *
  * @param {string} id Query value for a unique Id or URL. If the argument is a URL, then the service will retrieve the icon element
  * from its internal cache or load the icon and cache it first. If the value is not a URL-type string, then an ID lookup is
  * performed. The Id may be a unique icon ID or may include an iconSet ID prefix.
  *
  * For the **id** query to work properly, this means that all id-to-URL mappings must have been previously configured
  * using the `$md083forkIconProvider`.
  *
  * @returns {obj} Clone of the initial SVG DOM element; which was created from the SVG markup in the SVG data file.
  *
  * @usage
  * <hljs lang="js">
  * function SomeDirective($md083forkIcon) {
  *
  *   // See if the icon has already been loaded, if not
  *   // then lookup the icon from the registry cache, load and cache
  *   // it for future requests.
  *   // NOTE: ID queries require configuration with $md083forkIconProvider
  *
  *   $md083forkIcon('android').then(function(iconEl)    { element.append(iconEl); });
  *   $md083forkIcon('work:chair').then(function(iconEl) { element.append(iconEl); });
  *
  *   // Load and cache the external SVG using a URL
  *
  *   $md083forkIcon('img/icons/android.svg').then(function(iconEl) {
  *     element.append(iconEl);
  *   });
  * };
  * </hljs>
  *
  * NOTE: The `md083fork-icon` directive internally uses the `$md083forkIcon` service to query, loaded, and instantiate
  * SVG DOM elements.
  */
 function MdIconService(config, $http, $q, $log, $templateCache) {
   var iconCache = {};
   var urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/i;

   Icon.prototype = { clone : cloneSVG, prepare: prepareAndStyle };

   return function getIcon(id) {
     id = id || '';

     // If already loaded and cached, use a clone of the cached icon.
     // Otherwise either load by URL, or lookup in the registry and then load by URL, and cache.

     if ( iconCache[id]         ) return $q.when( iconCache[id].clone() );
     if ( urlRegex.test(id)     ) return loadByURL(id).then( cacheIcon(id) );
     if ( id.indexOf(':') == -1 ) id = '$default:' + id;

     return loadByID(id)
         .catch(loadFromIconSet)
         .catch(announceIdNotFound)
         .catch(announceNotFound)
         .then( cacheIcon(id) );
   };

   /**
    * Prepare and cache the loaded icon for the specified `id`
    */
   function cacheIcon( id ) {

     return function updateCache( icon ) {
       iconCache[id] = isIcon(icon) ? icon : new Icon(icon, config[id]);

       return iconCache[id].clone();
     };
   }

   /**
    * Lookup the configuration in the registry, if !registered throw an error
    * otherwise load the icon [on-demand] using the registered URL.
    *
    */
   function loadByID(id) {
     var iconConfig = config[id];

     return !iconConfig ? $q.reject(id) : loadByURL(iconConfig.url).then(function(icon) {
       return new Icon(icon, iconConfig);
     });
   }

   /**
    *    Loads the file as XML and uses querySelector( <id> ) to find
    *    the desired node...
    */
   function loadFromIconSet(id) {
     var setName = id.substring(0, id.lastIndexOf(':')) || '$default';
     var iconSetConfig = config[setName];

     return !iconSetConfig ? $q.reject(id) : loadByURL(iconSetConfig.url).then(extractFromSet);

     function extractFromSet(set) {
       var iconName = id.slice(id.lastIndexOf(':') + 1);
       var icon = set.querySelector('#' + iconName);
       return !icon ? $q.reject(id) : new Icon(icon, iconSetConfig);
     }
   }

   /**
    * Load the icon by URL (may use the $templateCache).
    * Extract the data for later conversion to Icon
    */
   function loadByURL(url) {
     return $http
       .get(url, { cache: $templateCache })
       .then(function(response) {
         var els = angular.element(response.data);
         // Iterate to find first svg node, allowing for comments in loaded SVG (common with auto-generated SVGs)
         for (var i = 0; i < els.length; ++i) {
           if (els[i].nodeName == 'svg') {
             return els[i];
           }
         }
       });
   }

   /**
    * User did not specify a URL and the ID has not been registered with the $md083forkIcon
    * registry
    */
   function announceIdNotFound(id) {
     var msg;

     if (angular.isString(id)) {
       msg = 'icon ' + id + ' not found';
       $log.warn(msg);
     }

     return $q.reject(msg || id);
   }

   /**
    * Catch HTTP or generic errors not related to incorrect icon IDs.
    */
   function announceNotFound(err) {
     var msg = angular.isString(err) ? err : (err.message || err.data || err.statusText);
     $log.warn(msg);

     return $q.reject(msg);
   }

   /**
    * Check target signature to see if it is an Icon instance.
    */
   function isIcon(target) {
     return angular.isDefined(target.element) && angular.isDefined(target.config);
   }

   /**
    *  Define the Icon class
    */
   function Icon(el, config) {
     if (el.tagName != 'svg') {
       el = angular.element('<svg xmlns="http://www.w3.org/2000/svg">').append(el)[0];
     }
     el = angular.element(el);

     // Inject the namespace if not available...
     if ( !el.attr('xmlns') ) {
       el.attr('xmlns', "http://www.w3.org/2000/svg");
     }

     this.element = el;
     this.config = config;
     this.prepare();
   }

   /**
    *  Prepare the DOM element that will be cached in the
    *  loaded iconCache store.
    */
   function prepareAndStyle() {
     var iconSize = this.config ? this.config.iconSize : config.defaultIconSize;
     var svg = angular.element( this.element );
         svg.attr({
           'fit'   : '',
           'height': '100%',
           'width' : '100%',
           'preserveAspectRatio': 'xMidYMid meet',
           'viewBox' : svg.attr('viewBox') || ('0 0 ' + iconSize + ' ' + iconSize)
         })
         .css( {
           'pointer-events' : 'none',
           'display' : 'block'
         });

     this.element = svg;
   }

   /**
    * Clone the Icon DOM element; which is stored as an angular.element()
    */
   function cloneSVG(){
     return angular.element( this.element[0].cloneNode(true) );
   }

 }

})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {

/**
 * @ngdoc module
 * @name material.components.input
 */

angular.module('material.083fork.components.input', [
  'material.083fork.core'
])
  .directive('md083forkInputContainer', mdInputContainerDirective)
  .directive('label', labelDirective)
  .directive('input', inputTextareaDirective)
  .directive('textarea', inputTextareaDirective)
  .directive('mdMaxlength', mdMaxlengthDirective)
  .directive('placeholder', placeholderDirective);

/**
 * @ngdoc directive
 * @name md083forkInputContainer
 * @module material.components.input
 *
 * @restrict E
 *
 * @description
 * `<md083fork-input-container>` is the parent of any input or textarea element.
 *
 * Input and textarea elements will not behave properly unless the md083fork-input-container
 * parent is provided.
 *
 * @param md-is-error {expression=} When the given expression evaluates to true, the input container will go into error state. Defaults to erroring if the input has been touched and is invalid.
 * @param md-no-float {boolean=} When present, placeholders will not be converted to floating labels
 *
 * @usage
 * <hljs lang="html">
 *
 * <md083fork-input-container>
 *   <label>Username</label>
 *   <input type="text" ng-model="user.name">
 * </md083fork-input-container>
 *
 * <md083fork-input-container>
 *   <label>Description</label>
 *   <textarea ng-model="user.description"></textarea>
 * </md083fork-input-container>
 *
 * </hljs>
 */
function mdInputContainerDirective($md083forkTheming, $parse) {
  ContainerCtrl.$inject = ["$scope", "$element", "$attrs"];
  return {
    restrict: 'E',
    link: postLink,
    controller: ContainerCtrl
  };

  function postLink(scope, element, attr) {
    $md083forkTheming(element);
  }
  function ContainerCtrl($scope, $element, $attrs) {
    var self = this;

    self.isErrorGetter = $attrs.mdIsError && $parse($attrs.mdIsError);

    self.element = $element;
    self.setFocused = function(isFocused) {
      $element.toggleClass('md-input-focused', !!isFocused);
    };
    self.setHasValue = function(hasValue) {
      $element.toggleClass('md-input-has-value', !!hasValue);
    };
    self.setInvalid = function(isInvalid) {
      $element.toggleClass('md-input-invalid', !!isInvalid);
    };
    $scope.$watch(function() {
      return self.label && self.input;
    }, function(hasLabelAndInput) {
      if (hasLabelAndInput && !self.label.attr('for')) {
        self.label.attr('for', self.input.attr('id'));
      }
    });
  }
}
mdInputContainerDirective.$inject = ["$md083forkTheming", "$parse"];

function labelDirective() {
  return {
    restrict: 'E',
    require: '^?md083forkInputContainer',
    link: function(scope, element, attr, containerCtrl) {
      if (!containerCtrl || attr.mdNoFloat) return;

      containerCtrl.label = element;
      scope.$on('$destroy', function() {
        containerCtrl.label = null;
      });
    }
  };
}

/**
 * @ngdoc directive
 * @name md083forkInput
 * @restrict E
 * @module material.components.input
 *
 * @description
 * Use the `<input>` or the  `<textarea>` as a child of an `<md083fork-input-container>`.
 *
 * @param {number=} md-maxlength The maximum number of characters allowed in this input. If this is specified, a character counter will be shown underneath the input.<br/><br/>
 * The purpose of **`md-maxength`** is exactly to show the max length counter text. If you don't want the counter text and only need "plain" validation, you can use the "simple" `ng-maxlength` or maxlength attributes.
 *
 * @usage
 * <hljs lang="html">
 * <md083fork-input-container>
 *   <label>Color</label>
 *   <input type="text" ng-model="color" required md-maxlength="10">
 * </md083fork-input-container>
 * </hljs>
 * <h3>With Errors (uses [ngMessages](https://docs.angularjs.org/api/ngMessages))</h3>
 * <hljs lang="html">
 * <form name="userForm">
 *   <md083fork-input-container>
 *     <label>Last Name</label>
 *     <input name="lastName" ng-model="lastName" required md-maxlength="10" minlength="4">
 *     <div ng-messages="userForm.lastName.$error" ng-show="userForm.bio.$dirty">
 *       <div ng-message="required">This is required!</div>
 *       <div ng-message="md-maxlength">That's too long!</div>
 *       <div ng-message="minlength">That's too short!</div>
 *     </div>
 *   </md083fork-input-container>
 *   <md083fork-input-container>
 *     <label>Biography</label>
 *     <textarea name="bio" ng-model="biography" required md-maxlength="150"></textarea>
 *     <div ng-messages="userForm.bio.$error" ng-show="userForm.bio.$dirty">
 *       <div ng-message="required">This is required!</div>
 *       <div ng-message="md-maxlength">That's too long!</div>
 *     </div>
 *   </md083fork-input-container>
 * </form>
 * </hljs>
 *
 * Behaves like the [AngularJS input directive](https://docs.angularjs.org/api/ng/directive/input).
 *
 */

function inputTextareaDirective($md083forkUtil, $window) {
  return {
    restrict: 'E',
    require: ['^?md083forkInputContainer', '?ngModel'],
    link: postLink
  };

  function postLink(scope, element, attr, ctrls) {

    var containerCtrl = ctrls[0];
    var ngModelCtrl = ctrls[1] || $md083forkUtil.fakeNgModel();
    var isReadonly = angular.isDefined(attr.readonly);

    if ( !containerCtrl ) return;
    if (containerCtrl.input) {
      throw new Error("<md083fork-input-container> can only have *one* <input> or <textarea> child element!");
    }
    containerCtrl.input = element;

    element.addClass('md083fork-input');
    if (!element.attr('id')) {
      element.attr('id', 'input_' + $md083forkUtil.nextUid());
    }

    if (element[0].tagName.toLowerCase() === 'textarea') {
      setupTextarea();
    }

    var touched = false;
    var isErrorGetter = containerCtrl.isErrorGetter || function() {
      return ngModelCtrl.$invalid && (touched || ngModelCtrl.$touched);
    };
    scope.$watch(isErrorGetter, containerCtrl.setInvalid);

    ngModelCtrl.$parsers.push(ngModelPipelineCheckValue);
    ngModelCtrl.$formatters.push(ngModelPipelineCheckValue);

    element.on('input', inputCheckValue);

    if (!isReadonly) {
      element
        .on('focus', function(ev) {
          touched = true;
          containerCtrl.setFocused(true);
          scope.$evalAsync();
        })
        .on('blur', function(ev) {
          containerCtrl.setFocused(false);
          inputCheckValue();
        });

    }

    scope.$on('$destroy', function() {
      containerCtrl.setFocused(false);
      containerCtrl.setHasValue(false);
      containerCtrl.input = null;
    });

    /**
     *
     */
    function ngModelPipelineCheckValue(arg) {
      containerCtrl.setHasValue(!ngModelCtrl.$isEmpty(arg));
      return arg;
    }
    function inputCheckValue() {
      // An input's value counts if its length > 0,
      // or if the input's validity state says it has bad input (eg string in a number input)
      containerCtrl.setHasValue(element.val().length > 0 || (element[0].validity||{}).badInput);
    }

    function setupTextarea() {
      var node = element[0];
      var onChangeTextarea = $md083forkUtil.debounce(growTextarea, 1);

      function pipelineListener(value) {
        onChangeTextarea();
        return value;
      }

      if (ngModelCtrl) {
        ngModelCtrl.$formatters.push(pipelineListener);
        ngModelCtrl.$viewChangeListeners.push(pipelineListener);
      } else {
        onChangeTextarea();
      }
      element.on('keydown input', onChangeTextarea);
      element.on('scroll', onScroll);
      angular.element($window).on('resize', onChangeTextarea);

      scope.$on('$destroy', function() {
        angular.element($window).off('resize', onChangeTextarea);
      });

      function growTextarea() {
        node.style.height = "auto";
        node.scrollTop = 0;
        var height = getHeight();
        if (height) node.style.height = height + 'px';
      }

      function getHeight () {
        var line = node.scrollHeight - node.offsetHeight;
        return node.offsetHeight + (line > 0 ? line : 0);
      }

      function onScroll(e) {
        node.scrollTop = 0;
        // for smooth new line adding
        var line = node.scrollHeight - node.offsetHeight;
        var height = node.offsetHeight + line;
        node.style.height = height + 'px';
      }
    }
  }
}
inputTextareaDirective.$inject = ["$md083forkUtil", "$window"];

function mdMaxlengthDirective($animate) {
  return {
    restrict: 'A',
    require: ['ngModel', '^md083forkInputContainer'],
    link: postLink
  };

  function postLink(scope, element, attr, ctrls) {
    var maxlength;
    var ngModelCtrl = ctrls[0];
    var containerCtrl = ctrls[1];
    var charCountEl = angular.element('<div class="md-char-counter">');

    // Stop model from trimming. This makes it so whitespace
    // over the maxlength still counts as invalid.
    attr.$set('ngTrim', 'false');
    containerCtrl.element.append(charCountEl);

    ngModelCtrl.$formatters.push(renderCharCount);
    ngModelCtrl.$viewChangeListeners.push(renderCharCount);
    element.on('input keydown', function() {
      renderCharCount(); //make sure it's called with no args
    });

    scope.$watch(attr.mdMaxlength, function(value) {
      maxlength = value;
      if (angular.isNumber(value) && value > 0) {
        if (!charCountEl.parent().length) {
          $animate.enter(charCountEl, containerCtrl.element,
                         angular.element(containerCtrl.element[0].lastElementChild));
        }
        renderCharCount();
      } else {
        $animate.leave(charCountEl);
      }
    });

    ngModelCtrl.$validators['md-maxlength'] = function(modelValue, viewValue) {
      if (!angular.isNumber(maxlength) || maxlength < 0) {
        return true;
      }
      return ( modelValue || element.val() || viewValue || '' ).length <= maxlength;
    };

    function renderCharCount(value) {
      charCountEl.text( ( element.val() || value || '' ).length + '/' + maxlength );
      return value;
    }
  }
}
mdMaxlengthDirective.$inject = ["$animate"];

function placeholderDirective() {
  return {
    restrict: 'A',
    require: '^^?md083forkInputContainer',
    link: postLink
  };

  function postLink(scope, element, attr, inputContainer) {
    if (!inputContainer) return;
    if (angular.isDefined(inputContainer.element.attr('md-no-float'))) return;

    var placeholderText = attr.placeholder;
    element.removeAttr('placeholder');

    inputContainer.element.append('<div class="md-placeholder">' + placeholderText + '</div>');
  }
}

})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';


/**
 * @ngdoc module
 * @name material.components.radioButton
 * @description radioButton module!
 */
angular.module('material.083fork.components.radioButton', [
  'material.083fork.core'
])
  .directive('md083forkRadioGroup', mdRadioGroupDirective)
  .directive('md083forkRadioButton', mdRadioButtonDirective);

/**
 * @ngdoc directive
 * @module material.components.radioButton
 * @name md083forkRadioGroup
 *
 * @restrict E
 *
 * @description
 * The `<md083fork-radio-group>` directive identifies a grouping
 * container for the 1..n grouped radio buttons; specified using nested
 * `<md083fork-radio-button>` tags.
 *
 * As per the [material design spec](http://www.google.com/design/spec/style/color.html#color-ui-color-application)
 * the radio button is in the accent color by default. The primary color palette may be used with
 * the `md-primary` class.
 *
 * Note: `<md083fork-radio-group>` and `<md083fork-radio-button>` handle tabindex differently
 * than the native `<input type='radio'>` controls. Whereas the native controls
 * force the user to tab through all the radio buttons, `<md083fork-radio-group>`
 * is focusable, and by default the `<md083fork-radio-button>`s are not.
 *
 * @param {string} ng-model Assignable angular expression to data-bind to.
 * @param {boolean=} md-no-ink Use of attribute indicates flag to disable ink ripple effects.
 *
 * @usage
 * <hljs lang="html">
 * <md083fork-radio-group ng-model="selected">
 *
 *   <md083fork-radio-button
 *        ng-repeat="d in colorOptions"
 *        ng-value="d.value" aria-label="{{ d.label }}">
 *
 *          {{ d.label }}
 *
 *   </md083fork-radio-button>
 *
 * </md083fork-radio-group>
 * </hljs>
 *
 */
function mdRadioGroupDirective($md083forkUtil, $md083forkConstant, $md083forkTheming) {
  RadioGroupController.prototype = createRadioGroupControllerProto();

  return {
    restrict: 'E',
    controller: ['$element', RadioGroupController],
    require: ['md083forkRadioGroup', '?ngModel'],
    link: { pre: linkRadioGroup }
  };

  function linkRadioGroup(scope, element, attr, ctrls) {
    $md083forkTheming(element);
    var rgCtrl = ctrls[0];
    var ngModelCtrl = ctrls[1] || $md083forkUtil.fakeNgModel();

    function keydownListener(ev) {
      switch(ev.keyCode) {
        case $md083forkConstant.KEY_CODE.LEFT_ARROW:
        case $md083forkConstant.KEY_CODE.UP_ARROW:
          ev.preventDefault();
          rgCtrl.selectPrevious();
          break;

        case $md083forkConstant.KEY_CODE.RIGHT_ARROW:
        case $md083forkConstant.KEY_CODE.DOWN_ARROW:
          ev.preventDefault();
          rgCtrl.selectNext();
          break;

        case $md083forkConstant.KEY_CODE.ENTER:
          var form = angular.element($md083forkUtil.getClosest(element[0], 'form'));
          if (form.length > 0) {
            form.triggerHandler('submit');
          }
          break;
      }
    }

    rgCtrl.init(ngModelCtrl);

    element.attr({
              'role': 'radiogroup',
              'tabIndex': element.attr('tabindex') || '0'
            })
            .on('keydown', keydownListener);

  }

  function RadioGroupController($element) {
    this._radioButtonRenderFns = [];
    this.$element = $element;
  }

  function createRadioGroupControllerProto() {
    return {
      init: function(ngModelCtrl) {
        this._ngModelCtrl = ngModelCtrl;
        this._ngModelCtrl.$render = angular.bind(this, this.render);
      },
      add: function(rbRender) {
        this._radioButtonRenderFns.push(rbRender);
      },
      remove: function(rbRender) {
        var index = this._radioButtonRenderFns.indexOf(rbRender);
        if (index !== -1) {
          this._radioButtonRenderFns.splice(index, 1);
        }
      },
      render: function() {
        this._radioButtonRenderFns.forEach(function(rbRender) {
          rbRender();
        });
      },
      setViewValue: function(value, eventType) {
        this._ngModelCtrl.$setViewValue(value, eventType);
        // update the other radio buttons as well
        this.render();
      },
      getViewValue: function() {
        return this._ngModelCtrl.$viewValue;
      },
      selectNext: function() {
        return changeSelectedButton(this.$element, 1);
      },
      selectPrevious: function() {
        return changeSelectedButton(this.$element, -1);
      },
      setActiveDescendant: function (radioId) {
        this.$element.attr('aria-activedescendant', radioId);
      }
    };
  }
  /**
   * Change the radio group's selected button by a given increment.
   * If no button is selected, select the first button.
   */
  function changeSelectedButton(parent, increment) {
    // Coerce all child radio buttons into an array, then wrap then in an iterator
    var buttons = $md083forkUtil.iterator(parent[0].querySelectorAll('md083fork-radio-button'), true);

    if (buttons.count()) {
      var validate = function (button) {
        // If disabled, then NOT valid
        return !angular.element(button).attr("disabled");
      };
      var selected = parent[0].querySelector('md083fork-radio-button.md-checked');
      var target = buttons[increment < 0 ? 'previous' : 'next'](selected, validate) || buttons.first();
      // Activate radioButton's click listener (triggerHandler won't create a real click event)
      angular.element(target).triggerHandler('click');


    }
  }

}
mdRadioGroupDirective.$inject = ["$md083forkUtil", "$md083forkConstant", "$md083forkTheming"];

/**
 * @ngdoc directive
 * @module material.components.radioButton
 * @name md083forkRadioButton
 *
 * @restrict E
 *
 * @description
 * The `<md083fork-radio-button>`directive is the child directive required to be used within `<md083fork-radio-group>` elements.
 *
 * While similar to the `<input type="radio" ng-model="" value="">` directive,
 * the `<md083fork-radio-button>` directive provides ink effects, ARIA support, and
 * supports use within named radio groups.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} ngChange Angular expression to be executed when input changes due to user
 *    interaction with the input element.
 * @param {string} ngValue Angular expression which sets the value to which the expression should
 *    be set when selected.*
 * @param {string} value The value to which the expression should be set when selected.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {string=} aria-label Adds label to radio button for accessibility.
 * Defaults to radio button's text. If no text content is available, a warning will be logged.
 *
 * @usage
 * <hljs lang="html">
 *
 * <md083fork-radio-button value="1" aria-label="Label 1">
 *   Label 1
 * </md083fork-radio-button>
 *
 * <md083fork-radio-button ng-model="color" ng-value="specialValue" aria-label="Green">
 *   Green
 * </md083fork-radio-button>
 *
 * </hljs>
 *
 */
function mdRadioButtonDirective($md083forkAria, $md083forkUtil, $md083forkTheming) {

  var CHECKED_CSS = 'md-checked';

  return {
    restrict: 'E',
    require: '^md083forkRadioGroup',
    transclude: true,
    template: '<div class="md-container" md-ink-ripple md-ink-ripple-checkbox>' +
                '<div class="md-off"></div>' +
                '<div class="md-on"></div>' +
              '</div>' +
              '<div ng-transclude class="md-label"></div>',
    link: link
  };

  function link(scope, element, attr, rgCtrl) {
    var lastChecked;

    $md083forkTheming(element);
    configureAria(element, scope);

    rgCtrl.add(render);
    attr.$observe('value', render);

    element
      .on('click', listener)
      .on('$destroy', function() {
        rgCtrl.remove(render);
      });

    function listener(ev) {
      if (element[0].hasAttribute('disabled')) return;

      scope.$apply(function() {
        rgCtrl.setViewValue(attr.value, ev && ev.type);
      });
    }

    function render() {
      var checked = (rgCtrl.getViewValue() == attr.value);
      if (checked === lastChecked) {
        return;
      }
      lastChecked = checked;
      element.attr('aria-checked', checked);
      if (checked) {
        element.addClass(CHECKED_CSS);
        rgCtrl.setActiveDescendant(element.attr('id'));
      } else {
        element.removeClass(CHECKED_CSS);
      }
    }
    /**
     * Inject ARIA-specific attributes appropriate for each radio button
     */
    function configureAria( element, scope ){
      scope.ariaId = buildAriaID();

      element.attr({
        'id' :  scope.ariaId,
        'role' : 'radio',
        'aria-checked' : 'false'
      });

      $md083forkAria.expectWithText(element, 'aria-label');

      /**
       * Build a unique ID for each radio button that will be used with aria-activedescendant.
       * Preserve existing ID if already specified.
       * @returns {*|string}
       */
      function buildAriaID() {
        return attr.id || ( 'radio' + "_" + $md083forkUtil.nextUid() );
      }
    }
  }
}
mdRadioButtonDirective.$inject = ["$md083forkAria", "$md083forkUtil", "$md083forkTheming"];

})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';
/**
 * @ngdoc module
 * @name material.components.select
 */

/***************************************************

### TODO ###
**DOCUMENTATION AND DEMOS**

- [ ] ng-model with child mdOptions (basic)
- [ ] ng-model="foo" ng-model-options="{ trackBy: '$value.id' }" for objects
- [ ] md083forkOption with value
- [ ] Usage with input inside
- [ ] Usage with md-multiple

### TODO - POST RC1 ###
- [ ] Abstract placement logic in $md083forkSelect service to $mdMenu service

***************************************************/

var SELECT_EDGE_MARGIN = 8;
var selectNextId = 0;

angular.module('material.083fork.components.select', [
  'material.083fork.core',
  'material.083fork.components.backdrop'
])
.directive('md083forkSelect', SelectDirective)
.directive('md083forkSelectMenu', SelectMenuDirective)
.directive('md083forkOption', OptionDirective)
.directive('md083forkOptgroup', OptgroupDirective)
.provider('$md083forkSelect', SelectProvider);


/**
 * @ngdoc directive
 * @name md083forkSelect
 * @restrict E
 * @module material.components.select
 *
 * @description Displays a select box, bound to an ng-model.
 *
 * @param {expression} ng-model The model!
 * @param {boolean=} multiple Whether it's multiple.
 * @param {string=} placeholder Placeholder hint text.
 *
 * @usage
 * With a placeholder (label is added dynamically)
 * <hljs lang="html">
 *   <md083fork-select
 *     ng-model="someModel"
 *     placeholder="Select a state">
 *     <md083fork-option ng-value="opt" ng-repeat="opt in neighborhoods2">{{ opt }}</md083fork-option>
 *   </md083fork-select>
 * </hljs>
 *
 * With an explicit label
 * <hljs lang="html">
 *   <md083fork-select
 *     ng-model="someModel">
 *     <md083fork-select-label>Select a state</md-select-label>
 *     <md083fork-option ng-value="opt" ng-repeat="opt in neighborhoods2">{{ opt }}</md083fork-option>
 *   </md083fork-select>
 * </hljs>
 */
function SelectDirective($md083forkSelect, $md083forkUtil, $md083forkTheming, $interpolate, $compile, $parse) {
  var intStart = $interpolate.startSymbol();
  var intEnd = $interpolate.endSymbol();

  return {
    restrict: 'E',
    require: ['md083forkSelect', 'ngModel'],
    compile: compile,
    controller: function() { } // empty placeholder controller to be initialized in link
  };

  function compile(element, attr) {
    // The user is allowed to provide a label for the select as md-select-label child
    var labelEl = element.find('md-select-label').remove();

    // If not provided, we automatically make one
    if (!labelEl.length) {
      labelEl = angular.element('<md-select-label><span></span></md-select-label>');
    }
    labelEl.append('<span class="md-select-icon" aria-hidden="true"></span>');
    labelEl.addClass('md-select-label');
    labelEl.attr('id', 'select_label_' + $md083forkUtil.nextUid());

    // There's got to be an md083fork-content inside. If there's not one, let's add it.
    if (!element.find('md083fork-content').length) {
      element.append( angular.element('<md083fork-content>').append(element.contents()) );
    }

    // Add progress spinner for md083fork-options-loading
    if (attr.mdOnOpen) {
      element.find('md083fork-content').prepend(
        angular.element('<md-progress-circular>')
               .attr('md-mode', 'indeterminate')
               .attr('ng-hide', '$$loadingAsyncDone')
               .wrap('<div>')
               .parent()
      );
    }

    // Use everything that's left inside element.contents() as the contents of the menu
    var selectTemplate = '<div class="md-select-menu-container">' +
        '<md083fork-select-menu ' +
        (angular.isDefined(attr.multiple) ? 'multiple' : '') + '>' +
          element.html() +
        '</md083fork-select-menu></div>';

    element.empty().append(labelEl);

    $md083forkTheming(element);

    return function postLink(scope, element, attr, ctrls) {
      var isOpen;

      var mdSelectCtrl = ctrls[0];
      var ngModel = ctrls[1];
      var labelEl = element.find('md-select-label');
      var customLabel = labelEl.text().length !== 0;
      var selectContainer, selectScope;
      createSelect();

      var originalRender = ngModel.$render;

      ngModel.$render = function() {
        originalRender();
        syncLabelText();
      };

      mdSelectCtrl.setLabelText = function(text) {
        if (customLabel) return; // Assume that user is handling it on their own
        mdSelectCtrl.setIsPlaceholder(!text);
        var newText = text || attr.placeholder || '';
        var target = customLabel ? labelEl : labelEl.children().eq(0);
        target.text(newText);
      };

      mdSelectCtrl.setIsPlaceholder = function(val) {
        val ? labelEl.addClass('md-placeholder') : labelEl.removeClass('md-placeholder');
      };

      scope.$$postDigest(syncLabelText);

      function syncLabelText() {
        if (selectContainer) {
          var selectMenuCtrl = selectContainer.find('md083fork-select-menu').controller('md083forkSelectMenu');
          mdSelectCtrl.setLabelText(selectMenuCtrl.selectedLabels());
        }
      }

      attr.$observe('disabled', function(disabled) {
        if (typeof disabled == "string") {
          disabled = true;
        }
        if (disabled) {
          element.attr('tabindex', -1);
          element.off('click', openSelect);
          element.off('keydown', openOnKeypress);
        } else {
          element.attr('tabindex', 0);
          element.on('click', openSelect);
          element.on('keydown', openOnKeypress);
        }
      });
      if (!attr.disabled && !attr.ngDisabled) {
        element.attr('tabindex', 0);
        element.on('click', openSelect);
        element.on('keydown', openOnKeypress);
      }

      element.attr({
        'role': 'combobox',
        'id': 'select_' + $md083forkUtil.nextUid(),
        'aria-haspopup': true,
        'aria-expanded': 'false',
        'aria-labelledby': labelEl.attr('id')
      });

      scope.$on('$destroy', function() {
        if (isOpen) {
          $md083forkSelect.cancel().then(function() {
            selectContainer.remove();
          });
        } else {
          selectContainer.remove();
        }
      });


      // Create a fake select to find out the label value
      function createSelect() {
        selectContainer = angular.element(selectTemplate);
        var selectEl = selectContainer.find('md083fork-select-menu');
        selectEl.data('$ngModelController', ngModel);
        selectEl.data('$md083forkSelectController', mdSelectCtrl);
        selectScope = scope.$new();
        selectContainer = $compile(selectContainer)(selectScope);
      }

      function openOnKeypress(e) {
        var allowedCodes = [32, 13, 38, 40];
        if (allowedCodes.indexOf(e.keyCode) != -1 ) {
          // prevent page scrolling on interaction
          e.preventDefault();
          openSelect(e);
        }
      }

      function openSelect() {
        scope.$evalAsync(function() {
          isOpen = true;
          $md083forkSelect.show({
            scope: selectScope,
            preserveScope: true,
            skipCompile: true,
            element: selectContainer,
            target: element[0],
            hasBackdrop: true,
            loadingAsync: attr.mdOnOpen ? scope.$eval(attr.mdOnOpen) : false,
          }).then(function(selectedText) {
            isOpen = false;
          });
        });
      }
    };
  }
}
SelectDirective.$inject = ["$md083forkSelect", "$md083forkUtil", "$md083forkTheming", "$interpolate", "$compile", "$parse"];

function SelectMenuDirective($parse, $md083forkUtil, $md083forkTheming) {

  SelectMenuController.$inject = ["$scope", "$attrs", "$element"];
  return {
    restrict: 'E',
    require: ['md083forkSelectMenu', '?ngModel'],
    controller: SelectMenuController,
    link: { pre: preLink }
  };

  // We use preLink instead of postLink to ensure that the select is initialized before
  // its child options run postLink.
  function preLink(scope, element, attr, ctrls) {
    var selectCtrl = ctrls[0];
    var ngModel = ctrls[1];

    $md083forkTheming(element);
    element.on('click', clickListener);
    element.on('keypress', keyListener);
    if (ngModel) selectCtrl.init(ngModel);
    configureAria();

    function configureAria() {
      element.attr({
        'id': 'select_menu_' + $md083forkUtil.nextUid(),
        'role': 'listbox',
        'aria-multiselectable': (selectCtrl.isMultiple ? 'true' : 'false')
      });
    }

    function keyListener(e) {
      if (e.keyCode == 13 || e.keyCode == 32) {
        clickListener(e);
      }
    }

    function clickListener(ev) {
      var option = $md083forkUtil.getClosest(ev.target, 'md083fork-option');
      var optionCtrl = option && angular.element(option).data('$md083forkOptionController');
      if (!option || !optionCtrl) return;

      var optionHashKey = selectCtrl.hashGetter(optionCtrl.value);
      var isSelected = angular.isDefined(selectCtrl.selected[optionHashKey]);

      scope.$apply(function() {
        if (selectCtrl.isMultiple) {
          if (isSelected) {
            selectCtrl.deselect(optionHashKey);
          } else {
            selectCtrl.select(optionHashKey, optionCtrl.value);
          }
        } else {
          if (!isSelected) {
            selectCtrl.deselect( Object.keys(selectCtrl.selected)[0] );
            selectCtrl.select( optionHashKey, optionCtrl.value );
          }
        }
        selectCtrl.refreshViewValue();
      });
    }
  }



  function SelectMenuController($scope, $attrs, $element) {
    var self = this;
    self.isMultiple = angular.isDefined($attrs.multiple);
    // selected is an object with keys matching all of the selected options' hashed values
    self.selected = {};
    // options is an object with keys matching every option's hash value,
    // and values matching every option's controller.
    self.options = {};


    self.init = function(ngModel) {
      self.ngModel = ngModel;

      // Allow users to provide `ng-model="foo" ng-model-options="{trackBy: 'foo.id'}"` so
      // that we can properly compare objects set on the model to the available options
      if (ngModel.$options && ngModel.$options.trackBy) {
        var trackByLocals = {};
        var trackByParsed = $parse(ngModel.$options.trackBy);
        self.hashGetter = function(value, valueScope) {
          trackByLocals.$value = value;
          return trackByParsed(valueScope || $scope, trackByLocals);
        };
      // If the user doesn't provide a trackBy, we automatically generate an id for every
      // value passed in
      } else {
        self.hashGetter = function getHashValue(value) {
          if (angular.isObject(value)) {
            return '$$object_' + (value.$$md083forkSelectId || (value.$$md083forkSelectId = ++selectNextId));
          }
          return value;
        };
      }

      if (self.isMultiple) {
        ngModel.$validators['md-multiple'] = validateArray;
        ngModel.$render = renderMultiple;

        // watchCollection on the model because by default ngModel only watches the model's
        // reference. This allowed the developer to also push and pop from their array.
        $scope.$watchCollection($attrs.ngModel, function(value) {
          if (validateArray(value)) renderMultiple(value);
        });
      } else {
        ngModel.$render = renderSingular;
      }

      function validateArray(modelValue, viewValue) {
        // If a value is truthy but not an array, reject it.
        // If value is undefined/falsy, accept that it's an empty array.
        return angular.isArray(modelValue || viewValue || []);
      }
    };

    self.selectedLabels = function() {
      var selectedOptionEls = nodesToArray($element[0].querySelectorAll('md083fork-option[selected]'));
      if (selectedOptionEls.length) {
        return selectedOptionEls.map(function(el) { return el.textContent; }).join(', ');
      } else {
        return '';
      }
    };

    self.select = function(hashKey, hashedValue) {
      var option = self.options[hashKey];
      option && option.setSelected(true);
      self.selected[hashKey] = hashedValue;
    };
    self.deselect = function(hashKey) {
      var option = self.options[hashKey];
      option && option.setSelected(false);
      delete self.selected[hashKey];
    };

    self.addOption = function(hashKey, optionCtrl) {
      if (angular.isDefined(self.options[hashKey])) {
        throw new Error('Duplicate md083fork-option values are not allowed in a select. ' +
                        'Duplicate value "' + optionCtrl.value + '" found.');
      }
      self.options[hashKey] = optionCtrl;

      // If this option's value was already in our ngModel, go ahead and select it.
      if (angular.isDefined(self.selected[hashKey])) {
        self.select(hashKey, optionCtrl.value);
        self.refreshViewValue();
      }
    };
    self.removeOption = function(hashKey) {
      delete self.options[hashKey];
      // Don't deselect an option when it's removed - the user's ngModel should be allowed
      // to have values that do not match a currently available option.
    };

    self.refreshViewValue = function() {
      var values = [];
      var option;
      for (var hashKey in self.selected) {
         // If this hashKey has an associated option, push that option's value to the model.
         if ((option = self.options[hashKey])) {
           values.push(option.value);
         } else {
           // Otherwise, the given hashKey has no associated option, and we got it
           // from an ngModel value at an earlier time. Push the unhashed value of
           // this hashKey to the model.
           // This allows the developer to put a value in the model that doesn't yet have
           // an associated option.
           values.push(self.selected[hashKey]);
         }
      }
      self.ngModel.$setViewValue(self.isMultiple ? values : values[0]);
    };

    function renderMultiple() {
      var newSelectedValues = self.ngModel.$modelValue || self.ngModel.$viewValue;
      if (!angular.isArray(newSelectedValues)) return;

      var oldSelected = Object.keys(self.selected);

      var newSelectedHashes = newSelectedValues.map(self.hashGetter);
      var deselected = oldSelected.filter(function(hash) {
        return newSelectedHashes.indexOf(hash) === -1;
      });

      deselected.forEach(self.deselect);
      newSelectedHashes.forEach(function(hashKey, i) {
        self.select(hashKey, newSelectedValues[i]);
      });
    }
    function renderSingular() {
      var value = self.ngModel.$viewValue || self.ngModel.$modelValue;
      Object.keys(self.selected).forEach(self.deselect);
      self.select( self.hashGetter(value), value );
    }
  }

}
SelectMenuDirective.$inject = ["$parse", "$md083forkUtil", "$md083forkTheming"];

function OptionDirective($md083forkInkRipple$mdInkRipple, $md083forkUtil) {

  OptionController.$inject = ["$element"];
  return {
    restrict: 'E',
    require: ['md083forkOption', '^^md083forkSelectMenu'],
    controller: OptionController,
    compile: compile
  };

  function compile(element, attr) {
    // Manual transclusion to avoid the extra inner <span> that ng-transclude generates
    element.append( angular.element('<div class="md-text">').append(element.contents()) );
    if (attr.tabindex === undefined) element.attr('tabindex', 0);
    return postLink;
  }

  function postLink(scope, element, attr, ctrls) {
    var optionCtrl = ctrls[0];
    var selectCtrl = ctrls[1];

    if (angular.isDefined(attr.ngValue)) {
      scope.$watch(attr.ngValue, setOptionValue);
    } else if (angular.isDefined(attr.value)) {
      setOptionValue(attr.value);
    } else {
      throw new Error("Expected either ngValue or value attr");
    }

    attr.$observe('selected', function(selected) {
      if (!angular.isDefined(selected)) return;
      if (selected) {
        if (!selectCtrl.isMultiple) {
          selectCtrl.deselect( Object.keys(selectCtrl.selected)[0] );
        }
        selectCtrl.select(optionCtrl.hashKey, optionCtrl.value);
      } else {
        selectCtrl.deselect(optionCtrl.hashKey);
      }
      selectCtrl.refreshViewValue();
      selectCtrl.ngModel.$render();
    });

    $md083forkInkRipple$mdInkRipple.attachButtonBehavior(scope, element);
    configureAria();

    function setOptionValue(newValue, oldValue) {
      var oldHashKey = selectCtrl.hashGetter(oldValue, scope);
      var newHashKey = selectCtrl.hashGetter(newValue, scope);

      optionCtrl.hashKey = newHashKey;
      optionCtrl.value = newValue;

      selectCtrl.removeOption(oldHashKey, optionCtrl);
      selectCtrl.addOption(newHashKey, optionCtrl);
    }

    scope.$on('$destroy', function() {
      selectCtrl.removeOption(optionCtrl.hashKey, optionCtrl);
    });

    function configureAria() {
      element.attr({
        'role': 'option',
        'aria-selected': 'false',
        'id': 'select_option_'+ $md083forkUtil.nextUid()
      });
    }
  }

  function OptionController($element) {
    this.selected = false;
    this.setSelected = function(isSelected) {
      if (isSelected && !this.selected) {
        $element.attr({
          'selected': 'selected',
          'aria-selected': 'true'
        });
      } else if (!isSelected && this.selected) {
        $element.removeAttr('selected');
        $element.attr('aria-selected', 'false');
      }
      this.selected = isSelected;
    };
  }

}
OptionDirective.$inject = ["$md083forkInkRipple$mdInkRipple", "$md083forkUtil"];

function OptgroupDirective() {
  return {
    restrict: 'E',
    compile: compile
  };
  function compile(el, attrs) {
    var labelElement = el.find('label');
    if (!labelElement.length) {
      labelElement = angular.element('<label>');
      el.prepend(labelElement);
    }
    if (attrs.label) labelElement.text(attrs.label);
  }
}

function SelectProvider($$083forkInterimElementProvider) {
  selectDefaultOptions.$inject = ["$md083forkSelect", "$md083forkConstant", "$$rAF", "$md083forkUtil", "$md083forkTheming", "$timeout"];
  return $$083forkInterimElementProvider('$md083forkSelect')
    .setDefaults({
      methods: ['target'],
      options: selectDefaultOptions
    });

  /* @ngInject */
  function selectDefaultOptions($md083forkSelect, $md083forkConstant, $$rAF, $md083forkUtil, $md083forkTheming, $timeout) {
    return {
      parent: 'body',
      onShow: onShow,
      onRemove: onRemove,
      hasBackdrop: true,
      disableParentScroll: $md083forkUtil.floatingScrollbars(),
      themable: true
    };

    function onShow(scope, element, opts) {
      if (!opts.target) {
        throw new Error('$md083forkSelect.show() expected a target element in options.target but got ' +
                        '"' + opts.target + '"!');
      }

      angular.extend(opts, {
        isRemoved: false,
        target: angular.element(opts.target), //make sure it's not a naked dom node
        parent: angular.element(opts.parent),
        selectEl: element.find('md083fork-select-menu'),
        contentEl: element.find('md083fork-content'),
        backdrop: opts.hasBackdrop && angular.element('<md083fork-backdrop class="md-select-backdrop">')
      });

      configureAria();

      element.removeClass('md-leave');

      var optionNodes = opts.selectEl[0].getElementsByTagName('md083fork-option');

      if (opts.loadingAsync && opts.loadingAsync.then) {
        opts.loadingAsync.then(function() {
          scope.$$loadingAsyncDone = true;
          // Give ourselves two frames for the progress loader to clear out.
          $$rAF(function() {
            $$rAF(function() {
              // Don't go forward if the select has been removed in this time...
              if (opts.isRemoved) return;
              animateSelect(scope, element, opts);
            });
          });
        });
      }

      if (opts.disableParentScroll) {
        opts.disableTarget = opts.parent.find('md083fork-content');
        if (!opts.disableTarget.length) opts.disableTarget = opts.parent;
        opts.lastOverflow = opts.disableTarget.css('overflow');
        opts.disableTarget.css('overflow', 'hidden');
      }
      // Only activate click listeners after a short time to stop accidental double taps/clicks
      // from clicking the wrong item
      $timeout(activateInteraction, 75, false);

      if (opts.backdrop) {
        $md083forkTheming.inherit(opts.backdrop, opts.parent);
        opts.parent.append(opts.backdrop);
      }
      opts.parent.append(element);

      // Give the select a frame to 'initialize' in the DOM,
      // so we can read its height/width/position
      $$rAF(function() {
        $$rAF(function() {
          if (opts.isRemoved) return;
          animateSelect(scope, element, opts);
        });
      });

      return $md083forkUtil.transitionEndPromise(opts.selectEl, {timeout: 350});

      function configureAria() {
        opts.selectEl.attr('aria-labelledby', opts.target.attr('id'));
        opts.target.attr('aria-owns', opts.selectEl.attr('id'));
        opts.target.attr('aria-expanded', 'true');
      }

      function activateInteraction() {
        if (opts.isRemoved) return;
        var selectCtrl = opts.selectEl.controller('md083forkSelectMenu') || {};
        element.addClass('md-clickable');

        opts.backdrop && opts.backdrop.on('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          opts.restoreFocus = false;
          scope.$apply($md083forkSelect.cancel);
        });

        // Escape to close
        opts.selectEl.on('keydown', function(ev) {
          switch (ev.keyCode) {
            case $md083forkConstant.KEY_CODE.SPACE:
            case $md083forkConstant.KEY_CODE.ENTER:
              var option = $md083forkUtil.getClosest(ev.target, 'md083fork-option');
              if (option) {
                opts.selectEl.triggerHandler({
                  type: 'click',
                  target: option
                });
                ev.preventDefault();
              }
              break;
            case $md083forkConstant.KEY_CODE.TAB:
            case $md083forkConstant.KEY_CODE.ESCAPE:
              ev.preventDefault();
              opts.restoreFocus = true;
              scope.$apply($md083forkSelect.cancel);
          }
        });

        // Cycling of options, and closing on enter
        opts.selectEl.on('keydown', function(ev) {
          switch (ev.keyCode) {
            case $md083forkConstant.KEY_CODE.UP_ARROW: return focusPrevOption();
            case $md083forkConstant.KEY_CODE.DOWN_ARROW: return focusNextOption();
          }
        });

        function focusOption(direction) {
          var optionsArray = nodesToArray(optionNodes);
          var index = optionsArray.indexOf(opts.focusedNode);
          if (index === -1) {
            // We lost the previously focused element, reset to first option
            index = 0;
          } else if (direction === 'next' && index < optionsArray.length - 1) {
            index++;
          } else if (direction === 'prev' && index > 0) {
            index--;
          }
          var newOption = opts.focusedNode = optionsArray[index];
          newOption && newOption.focus();
        }
        function focusNextOption() {
          focusOption('next');
        }
        function focusPrevOption() {
          focusOption('prev');
        }

        if (!selectCtrl.isMultiple) {
          opts.selectEl.on('click', closeMenu);
          opts.selectEl.on('keydown', function(e) {
            if (e.keyCode == 32 || e.keyCode == 13) {
              closeMenu();
            }
          });
        }
        function closeMenu() {
          opts.restoreFocus = true;
          scope.$evalAsync(function() {
            $md083forkSelect.hide(selectCtrl.ngModel.$viewValue);
          });
        }
      }

    }

    function onRemove(scope, element, opts) {
      opts.isRemoved = true;
      element.addClass('md-leave')
        .removeClass('md-clickable');
      opts.target.attr('aria-expanded', 'false');

      if (opts.disableParentScroll && $md083forkUtil.floatingScrollbars()) {
        opts.disableTarget.css('overflow', opts.lastOverflow);
        delete opts.lastOverflow;
        delete opts.disableTarget;
      }

      var mdSelect = opts.selectEl.controller('md083forkSelect');
      if (mdSelect) {
        mdSelect.setLabelText(opts.selectEl.controller('md083forkSelectMenu').selectedLabels());
      }

      return $md083forkUtil.transitionEndPromise(element, { timeout: 350 }).then(function() {
        element.removeClass('md-active');
        opts.parent[0].removeChild(element[0]); // use browser to avoid $destroy event
        opts.backdrop && opts.backdrop.remove();
        if (opts.restoreFocus) opts.target.focus();
      });
    }

    function animateSelect(scope, element, opts) {
      var containerNode = element[0],
          targetNode = opts.target[0],
          parentNode = opts.parent[0],
          selectNode = opts.selectEl[0],
          contentNode = opts.contentEl[0],
          parentRect = parentNode.getBoundingClientRect(),
          targetRect = $md083forkUtil.clientRect(targetNode, parentNode),
          shouldOpenAroundTarget = false,
          bounds = {
            left: parentNode.scrollLeft + SELECT_EDGE_MARGIN,
            top: parentNode.scrollTop + SELECT_EDGE_MARGIN,
            bottom: parentRect.height + parentNode.scrollTop - SELECT_EDGE_MARGIN,
            right: parentRect.width - SELECT_EDGE_MARGIN
          },
          spaceAvailable = {
            top: targetRect.top - bounds.top,
            left: targetRect.left - bounds.left,
            right: bounds.right - (targetRect.left + targetRect.width),
            bottom: bounds.bottom - (targetRect.top + targetRect.height)
          },
          maxWidth = parentRect.width - SELECT_EDGE_MARGIN * 2,
          isScrollable = contentNode.scrollHeight > contentNode.offsetHeight,
          selectedNode = selectNode.querySelector('md083fork-option[selected]'),
          optionNodes = selectNode.getElementsByTagName('md083fork-option'),
          optgroupNodes = selectNode.getElementsByTagName('md083fork-optgroup');


      var centeredNode;
      // If a selected node, center around that
      if (selectedNode) {
        centeredNode = selectedNode;
      // If there are option groups, center around the first option group
      } else if (optgroupNodes.length) {
        centeredNode = optgroupNodes[0];
      // Otherwise, center around the first optionNode
      } else if (optionNodes.length){
        centeredNode = optionNodes[0];
      // In case there are no options, center on whatever's in there... (eg progress indicator)
      } else {
        centeredNode = contentNode.firstElementChild || contentNode;
      }

      if (contentNode.offsetWidth > maxWidth) {
        contentNode.style['max-width'] = maxWidth + 'px';
      }
      if (shouldOpenAroundTarget) {
        contentNode.style['min-width'] = targetRect.width + 'px';
      }

      // Remove padding before we compute the position of the menu
      if (isScrollable) {
        selectNode.classList.add('md-overflow');
      }

      // Get the selectMenuRect *after* max-width is possibly set above
      var selectMenuRect = selectNode.getBoundingClientRect();
      var centeredRect = getOffsetRect(centeredNode);

      if (centeredNode) {
        var centeredStyle = window.getComputedStyle(centeredNode);
        centeredRect.paddingLeft = parseInt(centeredStyle.paddingLeft, 10) || 0;
        centeredRect.paddingRight = parseInt(centeredStyle.paddingRight, 10) || 0;
      }

      var focusedNode = centeredNode;
      if ((focusedNode.tagName || '').toUpperCase() === 'MD083FORK-OPTGROUP') {
        focusedNode = optionNodes[0] || contentNode.firstElementChild || contentNode;
      }
      if (focusedNode) {
        opts.focusedNode = focusedNode;
        focusedNode.focus();
      }

      if (isScrollable) {
        var scrollBuffer = contentNode.offsetHeight / 2;
        contentNode.scrollTop = centeredRect.top + centeredRect.height / 2 - scrollBuffer;

        if (spaceAvailable.top < scrollBuffer) {
          contentNode.scrollTop = Math.min(
            centeredRect.top,
            contentNode.scrollTop + scrollBuffer - spaceAvailable.top
          );
        } else if (spaceAvailable.bottom < scrollBuffer) {
          contentNode.scrollTop = Math.max(
            centeredRect.top + centeredRect.height - selectMenuRect.height,
            contentNode.scrollTop - scrollBuffer + spaceAvailable.bottom
          );
        }
      }

      var left, top, transformOrigin;
      if (shouldOpenAroundTarget) {
        left = targetRect.left;
        top = targetRect.top + targetRect.height;
        transformOrigin = '50% 0';
        if (top + selectMenuRect.height > bounds.bottom) {
          top = targetRect.top - selectMenuRect.height;
          transformOrigin = '50% 100%';
        }
      } else {
        left = targetRect.left + centeredRect.left - centeredRect.paddingLeft;
        top = targetRect.top + targetRect.height / 2 - centeredRect.height / 2 -
          centeredRect.top + contentNode.scrollTop;

        transformOrigin = (centeredRect.left + targetRect.width / 2) + 'px ' +
        (centeredRect.top + centeredRect.height / 2 - contentNode.scrollTop) + 'px 0px';

        containerNode.style.minWidth = targetRect.width + centeredRect.paddingLeft +
          centeredRect.paddingRight + 'px';
      }

      // Keep left and top within the window
      var containerRect = containerNode.getBoundingClientRect();
      containerNode.style.left = clamp(bounds.left, left, bounds.right - containerRect.width) + 'px';
      containerNode.style.top = clamp(bounds.top, top, bounds.bottom - containerRect.height) + 'px';
      selectNode.style[$md083forkConstant.CSS.TRANSFORM_ORIGIN] = transformOrigin;

      selectNode.style[$md083forkConstant.CSS.TRANSFORM] = 'scale(' +
        Math.min(targetRect.width / selectMenuRect.width, 1.0) + ',' +
        Math.min(targetRect.height / selectMenuRect.height, 1.0) +
      ')';

      $$rAF(function() {
        element.addClass('md-active');
        selectNode.style[$md083forkConstant.CSS.TRANSFORM] = '';
      });
    }

  }

  function clamp(min, n, max) {
    return Math.min(max, Math.max(n, min));
  }

  function getOffsetRect(node) {
    return node ? {
      left: node.offsetLeft,
      top: node.offsetTop,
      width: node.offsetWidth,
      height: node.offsetHeight
    } : { left: 0, top: 0, width: 0, height: 0 };
  }
}
SelectProvider.$inject = ["$$083forkInterimElementProvider"];

// Annoying method to copy nodes to an array, thanks to IE
function nodesToArray(nodes) {
  var results = [];
  for (var i = 0; i < nodes.length; ++i) {
    results.push(nodes.item(i));
  }
  return results;
}
})();


/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';

/**
 * @ngdoc module
 * @name material.components.sidenav
 *
 * @description
 * A Sidenav QP component.
 */
angular.module('material.083fork.components.sidenav', [
    'material.083fork.core',
    'material.083fork.components.backdrop'
  ])
  .factory('$md083forkSidenav', SidenavService )
  .directive('md083forkSidenav', SidenavDirective)
  .controller('$md083forkSidenavController', SidenavController);


/**
 * @private
 * @ngdoc service
 * @name $md083forkSidenav
 * @module material.components.sidenav
 *
 * @description
 * `$md083forkSidenav` makes it easy to interact with multiple sidenavs
 * in an app.
 *
 * @usage
 * <hljs lang="js">
 * // Toggle the given sidenav
 * $md083forkSidenav(componentId).toggle();
 * </hljs>
 * <hljs lang="js">
 * // Open the given sidenav
 * $md083forkSidenav(componentId).open();
 * </hljs>
 * <hljs lang="js">
 * // Close the given sidenav
 * $md083forkSidenav(componentId).close();
 * </hljs>
 * <hljs lang="js">
 * // Exposes whether given sidenav is set to be open
 * $md083forkSidenav(componentId).isOpen();
 * </hljs>
 * <hljs lang="js">
 * // Exposes whether given sidenav is locked open
 * // If this is true, the sidenav will be open regardless of isOpen()
 * $md083forkSidenav(componentId).isLockedOpen();
 * </hljs>
 */
function SidenavService($md083forkComponentRegistry, $q) {
  return function(handle) {
    var errorMsg = "SideNav '" + handle + "' is not available!";

    // Lookup the controller instance for the specified sidNav instance
    var instance = $md083forkComponentRegistry.get(handle);
    if(!instance) {
      $md083forkComponentRegistry.notFoundError(handle);
    }

    return {
      isOpen: function() {
        return instance && instance.isOpen();
      },
      isLockedOpen: function() {
        return instance && instance.isLockedOpen();
      },
      toggle: function() {
        return instance ? instance.toggle() : $q.reject(errorMsg);
      },
      open: function() {
        return instance ? instance.open() : $q.reject(errorMsg);
      },
      close: function() {
        return instance ? instance.close() : $q.reject(errorMsg);
      }
    };
  };
}
SidenavService.$inject = ["$md083forkComponentRegistry", "$q"];

/**
 * @ngdoc directive
 * @name md083forkSidenav
 * @module material.components.sidenav
 * @restrict E
 *
 * @description
 *
 * A Sidenav component that can be opened and closed programatically.
 *
 * By default, upon opening it will slide out on top of the main content area.
 *
 * @usage
 * <hljs lang="html">
 * <div layout="row" ng-controller="MyController">
 *   <md083fork-sidenav md-component-id="left" class="md-sidenav-left">
 *     Left Nav!
 *   </md083fork-sidenav>
 *
 *   <md083fork-content>
 *     Center Content
 *     <md083fork-button ng-click="openLeftMenu()">
 *       Open Left Menu
 *     </md083fork-button>
 *   </md083fork-content>
 *
 *   <md083fork-sidenav md-component-id="right"
 *     md-is-locked-open="$md083forkMedia('min-width: 333px')"
 *     class="md-sidenav-right">
 *     Right Nav!
 *   </md083fork-sidenav>
 * </div>
 * </hljs>
 *
 * <hljs lang="js">
 * var app = angular.module('myApp', ['ngMaterial']);
 * app.controller('MyController', function($scope, $md083forkSidenav) {
 *   $scope.openLeftMenu = function() {
 *     $md083forkSidenav('left').toggle();
 *   };
 * });
 * </hljs>
 *
 * @param {expression=} md-is-open A model bound to whether the sidenav is opened.
 * @param {string=} md-component-id componentId to use with $md083forkSidenav service.
 * @param {expression=} md-is-locked-open When this expression evalutes to true,
 * the sidenav 'locks open': it falls into the content's flow instead
 * of appearing over it. This overrides the `is-open` attribute.
 *
 * The $md083forkMedia() service is exposed to the is-locked-open attribute, which
 * can be given a media query or one of the `sm`, `gt-sm`, `md`, `gt-md`, `lg` or `gt-lg` presets.
 * Examples:
 *
 *   - `<md083fork-sidenav md-is-locked-open="shouldLockOpen"></md083fork-sidenav>`
 *   - `<md083fork-sidenav md-is-locked-open="$md083forkMedia('min-width: 1000px')"></md083fork-sidenav>`
 *   - `<md083fork-sidenav md-is-locked-open="$md083forkMedia('sm')"></md083fork-sidenav>` (locks open on small screens)
 */
function SidenavDirective($timeout, $animate, $parse, $log, $md083forkMedia, $md083forkConstant, $compile, $md083forkTheming, $q, $document) {
  return {
    restrict: 'E',
    scope: {
      isOpen: '=?mdIsOpen'
    },
    controller: '$md083forkSidenavController',
    compile: function(element) {
      element.addClass('md-closed');
      element.attr('tabIndex', '-1');
      return postLink;
    }
  };

  /**
   * Directive Post Link function...
   */
  function postLink(scope, element, attr, sidenavCtrl) {
    var triggeringElement = null;
    var promise = $q.when(true);

    var isLockedOpenParsed = $parse(attr.mdIsLockedOpen);
    var isLocked = function() {
      return isLockedOpenParsed(scope.$parent, {
        $media: function(arg) { $log.warn("$media is deprecated for is-locked-open. Use $md083forkMedia instead."); return $md083forkMedia(arg); },
        $md083forkMedia: $md083forkMedia
      });
    };
    var backdrop = $compile(
      '<md083fork-backdrop class="md-sidenav-backdrop md-opaque ng-enter">'
    )(scope);

    element.on('$destroy', sidenavCtrl.destroy);
    $md083forkTheming.inherit(backdrop, element);

    scope.$watch(isLocked, updateIsLocked);
    scope.$watch('isOpen', updateIsOpen);


    // Publish special accessor for the Controller instance
    sidenavCtrl.$toggleOpen = toggleOpen;

    /**
     * Toggle the DOM classes to indicate `locked`
     * @param isLocked
     */
    function updateIsLocked(isLocked, oldValue) {
      scope.isLockedOpen = isLocked;
      if (isLocked === oldValue) {
        element.toggleClass('md-locked-open', !!isLocked);
      } else {
        $animate[isLocked ? 'addClass' : 'removeClass'](element, 'md-locked-open');
      }
      backdrop.toggleClass('md-locked-open', !!isLocked);
    }

    /**
     * Toggle the SideNav view and attach/detach listeners
     * @param isOpen
     */
    function updateIsOpen(isOpen) {
      var parent = element.parent();

      parent[isOpen ? 'on' : 'off']('keydown', onKeyDown);
      backdrop[isOpen ? 'on' : 'off']('click', close);

      if ( isOpen ) {
        // Capture upon opening..
        triggeringElement = $document[0].activeElement;
      }

      return promise = $q.all([
        $animate[isOpen ? 'enter' : 'leave'](backdrop, parent),
        $animate[isOpen ? 'removeClass' : 'addClass'](element, 'md-closed').then(function() {
          // If we opened, and haven't closed again before the animation finished
          if (scope.isOpen) {
            element.focus();
          }
        })
      ]);
    }

    /**
     * Toggle the sideNav view and publish a promise to be resolved when
     * the view animation finishes.
     *
     * @param isOpen
     * @returns {*}
     */
    function toggleOpen( isOpen ) {
      if (scope.isOpen == isOpen ) {

        return $q.when(true);

      } else {
        var deferred = $q.defer();

        // Toggle value to force an async `updateIsOpen()` to run
        scope.isOpen = isOpen;

        $timeout(function() {

          // When the current `updateIsOpen()` animation finishes
          promise.then(function(result){

            if ( !scope.isOpen ) {
              // reset focus to originating element (if available) upon close
              triggeringElement && triggeringElement.focus();
              triggeringElement = null;
            }

            deferred.resolve(result);
          });

        },0,false);

        return deferred.promise;
      }
    }

    /**
     * Auto-close sideNav when the `escape` key is pressed.
     * @param evt
     */
    function onKeyDown(ev) {
      var isEscape = (ev.keyCode === $md083forkConstant.KEY_CODE.ESCAPE);
      return isEscape ? close(ev) : $q.when(true);
    }

    /**
     * With backdrop `clicks` or `escape` key-press, immediately
     * apply the CSS close transition... Then notify the controller
     * to close() and perform its own actions.
     */
    function close(ev) {
      ev.preventDefault();
      ev.stopPropagation();

      return sidenavCtrl.close();
    }

  }
}
SidenavDirective.$inject = ["$timeout", "$animate", "$parse", "$log", "$md083forkMedia", "$md083forkConstant", "$compile", "$md083forkTheming", "$q", "$document"];

/*
 * @private
 * @ngdoc controller
 * @name SidenavController
 * @module material.components.sidenav
 *
 */
function SidenavController($scope, $element, $attrs, $md083forkComponentRegistry, $q) {

  var self = this;

  // Use Default internal method until overridden by directive postLink

  self.$toggleOpen = function() { return $q.when($scope.isOpen); };
  self.isOpen = function() { return !!$scope.isOpen; };
  self.isLockedOpen = function() { return !!$scope.isLockedOpen; };
  self.open   = function() { return self.$toggleOpen( true );  };
  self.close  = function() { return self.$toggleOpen( false ); };
  self.toggle = function() { return self.$toggleOpen( !$scope.isOpen );  };

  self.destroy = $md083forkComponentRegistry.register(self, $attrs.mdComponentId);
}
SidenavController.$inject = ["$scope", "$element", "$attrs", "$md083forkComponentRegistry", "$q"];



})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
  'use strict';

  /**
   * @ngdoc module
   * @name material.components.slider
   */
  angular.module('material.083fork.components.slider', [
    'material.083fork.core'
  ])
  .directive('md083forkSlider', SliderDirective);

/**
 * @ngdoc directive
 * @name md083forkSlider
 * @module material.components.slider
 * @restrict E
 * @description
 * The `<md083fork-slider>` component allows the user to choose from a range of
 * values.
 *
 * As per the [material design spec](http://www.google.com/design/spec/style/color.html#color-ui-color-application)
 * the slider is in the accent color by default. The primary color palette may be used with
 * the `md-primary` class.
 *
 * It has two modes: 'normal' mode, where the user slides between a wide range
 * of values, and 'discrete' mode, where the user slides between only a few
 * select values.
 *
 * To enable discrete mode, add the `md-discrete` attribute to a slider,
 * and use the `step` attribute to change the distance between
 * values the user is allowed to pick.
 *
 * @usage
 * <h4>Normal Mode</h4>
 * <hljs lang="html">
 * <md083fork-slider ng-model="myValue" min="5" max="500">
 * </md083fork-slider>
 * </hljs>
 * <h4>Discrete Mode</h4>
 * <hljs lang="html">
 * <md083fork-slider md-discrete ng-model="myDiscreteValue" step="10" min="10" max="130">
 * </md083fork-slider>
 * </hljs>
 *
 * @param {boolean=} md-discrete Whether to enable discrete mode.
 * @param {number=} step The distance between values the user is allowed to pick. Default 1.
 * @param {number=} min The minimum value the user is allowed to pick. Default 0.
 * @param {number=} max The maximum value the user is allowed to pick. Default 100.
 */
function SliderDirective($$rAF, $window, $md083forkAria, $md083forkUtil, $md083forkConstant, $md083forkTheming, $md083forkGesture, $parse) {
  return {
    scope: {},
    require: '?ngModel',
    template:
      '<div class="md-slider-wrapper">\
        <div class="md-track-container">\
          <div class="md-track"></div>\
          <div class="md-track md-track-fill"></div>\
          <div class="md-track-ticks"></div>\
        </div>\
        <div class="md-thumb-container">\
          <div class="md-thumb"></div>\
          <div class="md-focus-thumb"></div>\
          <div class="md-focus-ring"></div>\
          <div class="md-sign">\
            <span class="md-thumb-text"></span>\
          </div>\
          <div class="md-disabled-thumb"></div>\
        </div>\
      </div>',
    compile: compile
  };

  // **********************************************************
  // Private Methods
  // **********************************************************

  function compile (tElement, tAttrs) {
    tElement.attr({
      tabIndex: 0,
      role: 'slider'
    });

    $md083forkAria.expect(tElement, 'aria-label');

    return postLink;
  }

  function postLink(scope, element, attr, ngModelCtrl) {
    $md083forkTheming(element);
    ngModelCtrl = ngModelCtrl || {
      // Mock ngModelController if it doesn't exist to give us
      // the minimum functionality needed
      $setViewValue: function(val) {
        this.$viewValue = val;
        this.$viewChangeListeners.forEach(function(cb) { cb(); });
      },
      $parsers: [],
      $formatters: [],
      $viewChangeListeners: []
    };

    var isDisabledParsed = attr.ngDisabled && $parse(attr.ngDisabled);
    var isDisabledGetter = isDisabledParsed ?
      function() { return isDisabledParsed(scope.$parent); } :
      angular.noop;
    var thumb = angular.element(element[0].querySelector('.md-thumb'));
    var thumbText = angular.element(element[0].querySelector('.md-thumb-text'));
    var thumbContainer = thumb.parent();
    var trackContainer = angular.element(element[0].querySelector('.md-track-container'));
    var activeTrack = angular.element(element[0].querySelector('.md-track-fill'));
    var tickContainer = angular.element(element[0].querySelector('.md-track-ticks'));
    var throttledRefreshDimensions = $md083forkUtil.throttle(refreshSliderDimensions, 5000);

    // Default values, overridable by attrs
    attr.min ? attr.$observe('min', updateMin) : updateMin(0);
    attr.max ? attr.$observe('max', updateMax) : updateMax(100);
    attr.step ? attr.$observe('step', updateStep) : updateStep(1);

    // We have to manually stop the $watch on ngDisabled because it exists
    // on the parent scope, and won't be automatically destroyed when
    // the component is destroyed.
    var stopDisabledWatch = angular.noop;
    if (attr.ngDisabled) {
      stopDisabledWatch = scope.$parent.$watch(attr.ngDisabled, updateAriaDisabled);
    }

    $md083forkGesture.register(element, 'drag');

    element
      .on('keydown', keydownListener)
      .on('$md083fork.pressdown', onPressDown)
      .on('$md083fork.pressup', onPressUp)
      .on('$md083fork.dragstart', onDragStart)
      .on('$md083fork.drag', onDrag)
      .on('$md083fork.dragend', onDragEnd);

    // On resize, recalculate the slider's dimensions and re-render
    function updateAll() {
      refreshSliderDimensions();
      ngModelRender();
      redrawTicks();
    }
    setTimeout(updateAll);

    var debouncedUpdateAll = $$rAF.throttle(updateAll);
    angular.element($window).on('resize', debouncedUpdateAll);

    scope.$on('$destroy', function() {
      angular.element($window).off('resize', debouncedUpdateAll);
      stopDisabledWatch();
    });

    ngModelCtrl.$render = ngModelRender;
    ngModelCtrl.$viewChangeListeners.push(ngModelRender);
    ngModelCtrl.$formatters.push(minMaxValidator);
    ngModelCtrl.$formatters.push(stepValidator);

    /**
     * Attributes
     */
    var min;
    var max;
    var step;
    function updateMin(value) {
      min = parseFloat(value);
      element.attr('aria-valuemin', value);
      updateAll();
    }
    function updateMax(value) {
      max = parseFloat(value);
      element.attr('aria-valuemax', value);
      updateAll();
    }
    function updateStep(value) {
      step = parseFloat(value);
      redrawTicks();
    }
    function updateAriaDisabled(isDisabled) {
      element.attr('aria-disabled', !!isDisabled);
    }

    // Draw the ticks with canvas.
    // The alternative to drawing ticks with canvas is to draw one element for each tick,
    // which could quickly become a performance bottleneck.
    var tickCanvas, tickCtx;
    function redrawTicks() {
      if (!angular.isDefined(attr.mdDiscrete)) return;

      var numSteps = Math.floor( (max - min) / step );
      if (!tickCanvas) {
        var trackTicksStyle = $window.getComputedStyle(tickContainer[0]);
        tickCanvas = angular.element('<canvas style="position:absolute;">');
        tickCtx = tickCanvas[0].getContext('2d');
        tickCtx.fillStyle = trackTicksStyle.backgroundColor || 'black';
        tickContainer.append(tickCanvas);
      }
      var dimensions = getSliderDimensions();
      tickCanvas[0].width = dimensions.width;
      tickCanvas[0].height = dimensions.height;

      var distance;
      for (var i = 0; i <= numSteps; i++) {
        distance = Math.floor(dimensions.width * (i / numSteps));
        tickCtx.fillRect(distance - 1, 0, 2, dimensions.height);
      }
    }


    /**
     * Refreshing Dimensions
     */
    var sliderDimensions = {};
    refreshSliderDimensions();
    function refreshSliderDimensions() {
      sliderDimensions = trackContainer[0].getBoundingClientRect();
    }
    function getSliderDimensions() {
      throttledRefreshDimensions();
      return sliderDimensions;
    }

    /**
     * left/right arrow listener
     */
    function keydownListener(ev) {
      if(element[0].hasAttribute('disabled')) {
        return;
      }

      var changeAmount;
      if (ev.keyCode === $md083forkConstant.KEY_CODE.LEFT_ARROW) {
        changeAmount = -step;
      } else if (ev.keyCode === $md083forkConstant.KEY_CODE.RIGHT_ARROW) {
        changeAmount = step;
      }
      if (changeAmount) {
        if (ev.metaKey || ev.ctrlKey || ev.altKey) {
          changeAmount *= 4;
        }
        ev.preventDefault();
        ev.stopPropagation();
        scope.$evalAsync(function() {
          setModelValue(ngModelCtrl.$viewValue + changeAmount);
        });
      }
    }

    /**
     * ngModel setters and validators
     */
    function setModelValue(value) {
      ngModelCtrl.$setViewValue( minMaxValidator(stepValidator(value)) );
    }
    function ngModelRender() {
      if (isNaN(ngModelCtrl.$viewValue)) {
        ngModelCtrl.$viewValue = ngModelCtrl.$modelValue;
      }

      var percent = (ngModelCtrl.$viewValue - min) / (max - min);
      scope.modelValue = ngModelCtrl.$viewValue;
      element.attr('aria-valuenow', ngModelCtrl.$viewValue);
      setSliderPercent(percent);
      thumbText.text( ngModelCtrl.$viewValue );
    }

    function minMaxValidator(value) {
      if (angular.isNumber(value)) {
        return Math.max(min, Math.min(max, value));
      }
    }
    function stepValidator(value) {
      if (angular.isNumber(value)) {
        return Math.round(value / step) * step;
      }
    }

    /**
     * @param percent 0-1
     */
    function setSliderPercent(percent) {
      activeTrack.css('width', (percent * 100) + '%');
      thumbContainer.css(
        'left',
        (percent * 100) + '%'
      );
      element.toggleClass('md-min', percent === 0);
    }


    /**
     * Slide listeners
     */
    var isDragging = false;
    var isDiscrete = angular.isDefined(attr.mdDiscrete);

    function onPressDown(ev) {
      if (isDisabledGetter()) return;

      element.addClass('active');
      element[0].focus();
      refreshSliderDimensions();

      var exactVal = percentToValue( positionToPercent( ev.pointer.x ));
      var closestVal = minMaxValidator( stepValidator(exactVal) );
      scope.$apply(function() {
        setModelValue( closestVal );
        setSliderPercent( valueToPercent(closestVal));
      });
    }
    function onPressUp(ev) {
      if (isDisabledGetter()) return;

      element.removeClass('dragging active');

      var exactVal = percentToValue( positionToPercent( ev.pointer.x ));
      var closestVal = minMaxValidator( stepValidator(exactVal) );
      scope.$apply(function() {
        setModelValue(closestVal);
        ngModelRender();
      });
    }
    function onDragStart(ev) {
      if (isDisabledGetter()) return;
      isDragging = true;
      ev.stopPropagation();

      element.addClass('dragging');
      setSliderFromEvent(ev);
    }
    function onDrag(ev) {
      if (!isDragging) return;
      ev.stopPropagation();
      setSliderFromEvent(ev);
    }
    function onDragEnd(ev) {
      if (!isDragging) return;
      ev.stopPropagation();
      isDragging = false;
    }

    function setSliderFromEvent(ev) {
      // While panning discrete, update only the
      // visual positioning but not the model value.
      if ( isDiscrete ) adjustThumbPosition( ev.pointer.x );
      else              doSlide( ev.pointer.x );
    }

    /**
     * Slide the UI by changing the model value
     * @param x
     */
    function doSlide( x ) {
      scope.$evalAsync( function() {
        setModelValue( percentToValue( positionToPercent(x) ));
      });
    }

    /**
     * Slide the UI without changing the model (while dragging/panning)
     * @param x
     */
    function adjustThumbPosition( x ) {
      var exactVal = percentToValue( positionToPercent( x ));
      var closestVal = minMaxValidator( stepValidator(exactVal) );
      setSliderPercent( positionToPercent(x) );
      thumbText.text( closestVal );
    }

    /**
     * Convert horizontal position on slider to percentage value of offset from beginning...
     * @param x
     * @returns {number}
     */
    function positionToPercent( x ) {
      return Math.max(0, Math.min(1, (x - sliderDimensions.left) / (sliderDimensions.width)));
    }

    /**
     * Convert percentage offset on slide to equivalent model value
     * @param percent
     * @returns {*}
     */
    function percentToValue( percent ) {
      return (min + percent * (max - min));
    }

    function valueToPercent( val ) {
      return (val - min)/(max - min);
    }
  }
}
SliderDirective.$inject = ["$$rAF", "$window", "$md083forkAria", "$md083forkUtil", "$md083forkConstant", "$md083forkTheming", "$md083forkGesture", "$parse"];

})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';


/**
 * @ngdoc module
 * @name material.components.swipe
 * @description Swipe module!
 */
/**
 * @ngdoc directive
 * @module material.components.swipe
 * @name mdSwipeLeft
 *
 * @restrict A
 *
 * @description
 * The md-swipe-left directives allows you to specify custom behavior when an element is swiped
 * left.
 *
 * @usage
 * <hljs lang="html">
 * <div md-swipe-left="onSwipeLeft()">Swipe me left!</div>
 * </hljs>
 */

/**
 * @ngdoc directive
 * @module material.components.swipe
 * @name mdSwipeRight
 *
 * @restrict A
 *
 * @description
 * The md-swipe-right directives allows you to specify custom behavior when an element is swiped
 * right.
 *
 * @usage
 * <hljs lang="html">
 * <div md-swipe-right="onSwipeRight()">Swipe me right!</div>
 * </hljs>
 */

var module = angular.module('material.083fork.components.swipe',[]);

['SwipeLeft', 'SwipeRight'].forEach(function(name) {
  var directiveName = 'md083fork' + name;
  var eventName = '$md083fork.' + name.toLowerCase();

  module.directive(directiveName, /*@ngInject*/ ["$parse", function($parse) {
    return {
      restrict: 'A',
      link: postLink
    };

    function postLink(scope, element, attr) {
      var fn = $parse(attr[directiveName]);

      element.on(eventName, function(ev) {
        scope.$apply(function() {
          fn(scope, {
            $event: ev
          });
        });
      });

    }
  }]);
});

})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';

/**
 * @ngdoc module
 * @name material.components.tabs
 * @description
 *
 *  Tabs, created with the `<md083fork-tabs>` directive provide *tabbed* navigation with different styles.
 *  The Tabs component consists of clickable tabs that are aligned horizontally side-by-side.
 *
 *  Features include support for:
 *
 *  - static or dynamic tabs,
 *  - responsive designs,
 *  - accessibility support (ARIA),
 *  - tab pagination,
 *  - external or internal tab content,
 *  - focus indicators and arrow-key navigations,
 *  - programmatic lookup and access to tab controllers, and
 *  - dynamic transitions through different tab contents.
 *
 */
/*
 * @see js folder for tabs implementation
 */
angular.module('material.083fork.components.tabs', [
  'material.083fork.core',
  'material.083fork.components.icon'
]);

})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
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
mdTextFloatDirective.$inject = ["$md083forkTheming", "$md083forkUtil", "$parse", "$log"];

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
mdInputGroupDirective.$inject = ["$log"];

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
mdInputDirective.$inject = ["$md083forkUtil", "$log"];

})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
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
 *   <md083fork-button ng-click="openToast()">
 *     Open a Toast!
 *   </md083fork-button>
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
      options: /* @ngInject */ ["$md083forkToast", "$md083forkTheming", function($md083forkToast, $md083forkTheming) {
        var opts = {
          template: [
            '<md083fork-toast md-theme="{{ toast.theme }}" ng-class="{\'md-capsule\': toast.capsule}">',
              '<span flex>{{ toast.content }}</span>',
              '<md083fork-button class="md-action" ng-if="toast.action" ng-click="toast.resolve()" ng-class="{\'md-highlight\': toast.highlightAction}">',
                '{{ toast.action }}',
              '</md083fork-button>',
            '</md083fork-toast>'
          ].join(''),
          controller: /* @ngInject */ ["$scope", function mdToastCtrl($scope) {
            var self = this;
            $scope.$watch(function() { return activeToastContent; }, function() {
              self.content = activeToastContent;
            });
            this.resolve = function() {
              $md083forkToast.hide();
            };
          }],
          theme: $md083forkTheming.defaultTheme(),
          controllerAs: 'toast',
          bindToController: true
        };
        return opts;
      }]
    })
    .addMethod('updateContent', function(newContent) {
      activeToastContent = newContent;
    });

  toastDefaultOptions.$inject = ["$timeout", "$animate", "$md083forkToast"];
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
        element.addClass('md-' + ev.type.replace('$md083fork.',''));
        $timeout($md083forkToast.cancel);
      };
      element.on('$md083fork.swipeleft $md083fork.swiperight', options.onSwipe);
      return $animate.enter(element, options.parent);
    }

    function onRemove(scope, element, options) {
      element.off('$md083fork.swipeleft $md083fork.swiperight', options.onSwipe);
      options.parent.removeClass(toastOpenClass(options.position));
      return $animate.leave(element);
    }

    function toastOpenClass(position) {
      return 'md-toast-open-' +
        (position.indexOf('top') > -1 ? 'top' : 'bottom');
    }
  }

}
MdToastProvider.$inject = ["$$083forkInterimElementProvider"];

})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function () {
  'use strict';
  angular
      .module('material.083fork.components.autocomplete')
      .controller('Md083forkAutocompleteCtrl', MdAutocompleteCtrl);

  function MdAutocompleteCtrl ($scope, $element, $q, $md083forkUtil, $md083forkConstant) {

    //-- private variables
    var self = this,
        itemParts = $scope.itemsExpr.split(/ in /i),
        itemExpr = itemParts[1],
        elements = {
          main:  $element[0],
          ul:    $element[0].getElementsByTagName('ul')[0],
          input: $element[0].getElementsByTagName('input')[0]
        },
        promise = null,
        cache = {},
        noBlur = false;

    //-- public variables
    self.scope = $scope;
    self.parent = $scope.$parent;
    self.itemName = itemParts[0];
    self.matches = [];
    self.loading = false;
    self.hidden = true;
    self.index = 0;
    self.keydown = keydown;
    self.blur = blur;
    self.clear = clearValue;
    self.select = select;
    self.getCurrentDisplayValue = getCurrentDisplayValue;
    self.fetch = $md083forkUtil.debounce(fetchResults);
    self.messages = [];
    self.update = handleSearchText;
    //-- While the mouse is inside of the dropdown, we don't want to handle input blur
    //-- This is to allow the user to scroll the list without causing it to hide
    self.listEnter = function () { noBlur = true; };
    self.listLeave = function () { noBlur = false; };
    self.mouseUp   = function () { elements.input.focus(); };

    return init();

    //-- start method definitions
    function init () {
      configureWatchers();
      configureAria();
    }

    function configureAria () {
      var ul = angular.element(elements.ul),
          input = angular.element(elements.input),
          id = ul.attr('id') || 'ul_' + $md083forkUtil.nextUid();
      ul.attr('id', id);
      input.attr('aria-owns', id);
    }

    function getItemScope (item) {
      if (!item) return;
      var locals = {};
      if (self.itemName) locals[self.itemName] = item;
      return locals;
    }

    function configureWatchers () {
      var wait = parseInt($scope.delay, 10) || 0;
      $scope.$watch('searchText', wait
          ? $md083forkUtil.debounce(handleSearchText, wait)
          : handleSearchText);
      $scope.$watch('selectedItem', function (selectedItem, previousSelectedItem) {
        if ($scope.itemChange && selectedItem !== previousSelectedItem)
          $scope.itemChange(getItemScope(selectedItem));
      });
    }

    function handleSearchText (searchText, previousSearchText) {
      self.index = -1;
      if (!searchText || searchText.length < Math.max(parseInt($scope.minLength, 10), 1)) {
        self.loading = false;
        self.matches = [];
        self.hidden = shouldHide();
        updateMessages();
        return;
      }
      var term = searchText.toLowerCase();
      if (promise && promise.cancel) {
        promise.cancel();
        promise = null;
      }
      if (!$scope.noCache && cache[term]) {
        self.matches = cache[term];
        updateMessages();
      } else {
        self.fetch(searchText);
      }
      self.hidden = shouldHide();
      if ($scope.textChange && searchText !== previousSearchText)
        $scope.textChange(getItemScope($scope.selectedItem));
    }

    function fetchResults (searchText) {
      var items = $scope.$parent.$eval(itemExpr),
          term = searchText.toLowerCase();
      if (angular.isArray(items)) {
        handleResults(items);
      } else {
        self.loading = true;
        promise = $q.when(items).then(handleResults);
      }
      function handleResults (matches) {
        cache[term] = matches;
        if (searchText !== $scope.searchText) return; //-- just cache the results if old request
        promise = null;
        self.loading = false;
        self.matches = matches;
        self.hidden = shouldHide();
        updateMessages();
      }
    }

    function updateMessages () {
      if (self.hidden) return;
      switch (self.matches.length) {
        case 0:  return self.messages.splice(0);
        case 1:  return self.messages.push({ display: 'There is 1 match available.' });
        default: return self.messages.push({ display: 'There are '
            + self.matches.length
            + ' matches available.' });
      }
    }

    function updateSelectionMessage () {
      self.messages.push({ display: getCurrentDisplayValue() });
    }

    function blur () {
      if (!noBlur) self.hidden = true;
    }

    function keydown (event) {
      switch (event.keyCode) {
        case $md083forkConstant.KEY_CODE.DOWN_ARROW:
            if (self.loading) return;
            event.preventDefault();
            self.index = Math.min(self.index + 1, self.matches.length - 1);
            updateScroll();
            updateSelectionMessage();
            break;
        case $md083forkConstant.KEY_CODE.UP_ARROW:
            if (self.loading) return;
            event.preventDefault();
            self.index = Math.max(0, self.index - 1);
            updateScroll();
            updateSelectionMessage();
            break;
        case $md083forkConstant.KEY_CODE.ENTER:
            if (self.loading || self.index < 0) return;
            event.preventDefault();
            select(self.index);
            break;
        case $md083forkConstant.KEY_CODE.ESCAPE:
            self.matches = [];
            self.hidden = true;
            self.index = -1;
            break;
        case $md083forkConstant.KEY_CODE.TAB:
            break;
        default:
      }
    }

    function clearValue () {
      $scope.searchText = '';
      select(-1);
      elements.input.focus();
    }

    function shouldHide () {
      return self.matches.length === 1 && $scope.searchText === getDisplayValue(self.matches[0]);
    }

    function getCurrentDisplayValue () {
      return getDisplayValue(self.matches[self.index]);
    }

    function getDisplayValue (item) {
      return (item && $scope.itemText) ? $scope.itemText(getItemScope(item)) : item;
    }

    function select (index) {
      $scope.selectedItem = self.matches[index];
      $scope.searchText = getDisplayValue($scope.selectedItem) || $scope.searchText;
      self.hidden = true;
      self.index = -1;
      self.matches = [];
    }

    function updateScroll () {
      var top = 41 * self.index,
          bot = top + 41,
          hgt = 41 * 5.5;
      if (top < elements.ul.scrollTop) {
        elements.ul.scrollTop = top;
      } else if (bot > elements.ul.scrollTop + hgt) {
        elements.ul.scrollTop = bot - hgt;
      }
    }

  }
  MdAutocompleteCtrl.$inject = ["$scope", "$element", "$q", "$md083forkUtil", "$md083forkConstant"];
})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function () {
  'use strict';
  angular
      .module('material.083fork.components.autocomplete')
      .directive('md083forkAutocomplete', MdAutocomplete);

  /**
   * @ngdoc directive
   * @name md083forkAutocomplete
   * @module material.components.autocomplete
   *
   * @description
   * `<md083fork-autocomplete>` is a special input component with a drop-down of all possible matches to a custom query.
   * This component allows you to provide real-time suggestions as the user types in the input area.
   *
   * @param {string=} md-search-text A model to bind the search query text to
   * @param {object=} md-selected-item A model to bind the selected item to
   * @param {expression} md-items An expression in the format of `item in items` to iterate over matches for your search.
   * @param {string=} md-item-text An expression that will convert your object to a single string.
   * @param {string=} placeholder Placeholder text that will be forwarded to the input.
   * @param {boolean=} md-no-cache Disables the internal caching that happens in autocomplete
   * @param {expression} md-selected-item-change An expression to be run each time a new item is selected
   * @param {expression} md-search-text-change An expression to be run each time the search text updates
   * @param {boolean=} ng-disabled Determines whether or not to disable the input field
   * @param {number=} md-min-length Specifies the minimum length of text before autocomplete will make suggestions
   * @param {number=} md-delay Specifies the amount of time (in milliseconds) to wait before looking for results
   *
   * @usage
   * <hljs lang="html">
   *   <md083fork-autocomplete
   *       md-selected-item="selectedItem"
   *       md-search-text="searchText"
   *       md-items="item in getMatches(searchText)"
   *       md-item-text="item.display">
   *     <span md083fork-highlight-text="searchText">{{item.display}}</span>
   *   </md083fork-autocomplete>
   * </hljs>
   */

  function MdAutocomplete () {
    return {
      template:     '\
        <md-autocomplete-wrap role="listbox">\
          <input type="text"\
              ng-disabled="isDisabled"\
              ng-model="searchText"\
              ng-keydown="$mdAutocompleteCtrl.keydown($event)"\
              ng-blur="$mdAutocompleteCtrl.blur()"\
              placeholder="{{placeholder}}"\
              aria-label="{{placeholder}}"\
              aria-autocomplete="list"\
              aria-haspopup="true"\
              aria-activedescendant=""\
              aria-expanded="{{!$mdAutocompleteCtrl.hidden}}"/>\
          <button\
              type="button"\
              ng-if="searchText"\
              ng-click="$mdAutocompleteCtrl.clear()">\
            <md083fork-icon md-svg-icon="cancel"></md083fork-icon>\
            <span class="visually-hidden">Clear</span>\
          </button>\
          <md-progress-linear\
              ng-if="$mdAutocompleteCtrl.loading"\
              md-mode="indeterminate"></md-progress-linear>\
        </md-autocomplete-wrap>\
        <ul role="presentation"\
            ng-mouseenter="$mdAutocompleteCtrl.listEnter()"\
            ng-mouseleave="$mdAutocompleteCtrl.listLeave()"\
            ng-mouseup="$mdAutocompleteCtrl.mouseUp()">\
          <li ng-repeat="(index, item) in $mdAutocompleteCtrl.matches"\
              ng-class="{ selected: index === $mdAutocompleteCtrl.index }"\
              ng-show="searchText && !$mdAutocompleteCtrl.hidden"\
              ng-click="$mdAutocompleteCtrl.select(index)"\
              ng-transclude\
              md083fork-autocomplete-list-item="$mdAutocompleteCtrl.itemName">\
          </li>\
        </ul>\
        <aria-status\
            class="visually-hidden"\
            role="status"\
            aria-live="assertive">\
          <p ng-repeat="message in $mdAutocompleteCtrl.messages">{{message.display}}</p>\
        </aria-status>',
      transclude:   true,
      controller:   'Md083forkAutocompleteCtrl',
      controllerAs: '$mdAutocompleteCtrl',
      scope:        {
        searchText:   '=mdSearchText',
        selectedItem: '=mdSelectedItem',
        itemsExpr:    '@mdItems',
        itemText:     '&mdItemText',
        placeholder:  '@placeholder',
        noCache:      '=mdNoCache',
        itemChange:   '&mdSelectedItemChange',
        textChange:   '&mdSearchTextChange',
        isDisabled:   '=ngDisabled',
        minLength:    '=mdMinLength',
        delay:        '=mdDelay'
      }
    };
  }
})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function () {
  'use strict';
  angular
      .module('material.083fork.components.autocomplete')
      .controller('Md083forkHighlightCtrl', MdHighlightCtrl);

  function MdHighlightCtrl ($scope, $element, $interpolate) {
    var term = $element.attr('md083fork-highlight-text'),
        text = $interpolate($element.text())($scope),
        watcher = $scope.$watch(term, function (term) {
          var regex = new RegExp('^' + sanitize(term), 'i'),
              html = text.replace(regex, '<span class="highlight">$&</span>');
          $element.html(html);
        });
    $element.on('$destroy', function () { watcher(); });

    function sanitize (term) {
      if (!term) return term;
      return term.replace(/[\*\[\]\(\)\{\}\\\^\$]/g, '\\$&');
    }
  }
  MdHighlightCtrl.$inject = ["$scope", "$element", "$interpolate"];

})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function () {
  'use strict';
  angular
      .module('material.083fork.components.autocomplete')
      .directive('md083forkHighlightText', MdHighlight);

  /**
   * @ngdoc directive
   * @name md083forkHighlightText
   * @module material.components.autocomplete
   *
   * @description
   * The `md083fork-highlight-text` directive allows you to specify text that should be highlighted within
   * an element.  Highlighted text will be wrapped in `<span class="highlight"></span>` which can
   * be styled through CSS.  Please note that child elements may not be used with this directive.
   *
   * @param {string=} md083fork-highlight-text A model to be searched for
   *
   * @usage
   * <hljs lang="html">
   * <input placeholder="Enter a search term..." ng-model="searchTerm" type="text" />
   * <ul>
   *   <li ng-repeat="result in results" md083fork-highlight-text="searchTerm">
   *     {{result.text}}
   *   </li>
   * </ul>
   * </hljs>
   */

  function MdHighlight () {
    return {
      terminal: true,
      scope: false,
      controller: 'Md083forkHighlightCtrl'
    };
  }
})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function () {
  'use strict';
  angular
      .module('material.083fork.components.autocomplete')
      .directive('md083forkAutocompleteListItem', MdAutocompleteListItem);

  function MdAutocompleteListItem ($compile, $md083forkUtil) {
    return {
      require: '^?md083forkAutocomplete',
      terminal: true,
      link: link,
      scope: false
    };
    function link (scope, element, attr, ctrl) {
      var newScope = ctrl.parent.$new(false, ctrl.parent),
          itemName = ctrl.scope.$eval(attr.md083forkAutocompleteListItem);
      newScope[itemName] = scope.item;
      $compile(element.contents())(newScope);
      element.attr({ 'role': 'option', 'id': 'item_' + $md083forkUtil.nextUid() });
    }
  }
  MdAutocompleteListItem.$inject = ["$compile", "$md083forkUtil"];
})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';

/**
 * Conditionally configure ink bar animations when the
 * tab selection changes. If `mdNoBar` then do not show the
 * bar nor animate.
 */
angular.module('material.083fork.components.tabs')
  .directive('md083forkTabsInkBar', MdTabInkDirective);

function MdTabInkDirective($$rAF) {

  var lastIndex = 0;

  return {
    restrict: 'E',
    require: ['^?mdNoBar', '^md083forkTabs'],
    link: postLink
  };

  function postLink(scope, element, attr, ctrls) {
    var mdNoBar = !!ctrls[0];

    var tabsCtrl = ctrls[1],
        debouncedUpdateBar = $$rAF.throttle(updateBar);

    tabsCtrl.inkBarElement = element;

    scope.$on('$md083forkTabsPaginationChanged', debouncedUpdateBar);

    function updateBar() {
      var selected = tabsCtrl.getSelectedItem();
      var hideInkBar = !selected || tabsCtrl.count() < 2 || mdNoBar;

      element.css('display', hideInkBar ? 'none' : 'block');

      if (hideInkBar) return;

      if (scope.pagination && scope.pagination.tabData) {
        var index = tabsCtrl.getSelectedIndex();
        var data = scope.pagination.tabData.tabs[index] || { left: 0, right: 0, width: 0 };
        var right = element.parent().prop('offsetWidth') - data.right;
        var classNames = ['md-transition-left', 'md-transition-right', 'md-no-transition'];
        var classIndex = lastIndex > index ? 0 : lastIndex < index ? 1 : 2;

        element
            .removeClass(classNames.join(' '))
            .addClass(classNames[classIndex])
            .css({ left: data.left + 'px', right: right + 'px' });

        lastIndex = index;
      }
    }
  }
}
MdTabInkDirective.$inject = ["$$rAF"];
})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';

angular.module('material.083fork.components.tabs')
    .directive('md083forkTabsPagination', TabPaginationDirective);

function TabPaginationDirective($md083forkConstant, $window, $$rAF, $$q, $timeout, $md083forkMedia) {

  // Must match (2 * width of paginators) in scss
  var PAGINATORS_WIDTH = (8 * 4) * 2;

  return {
    restrict: 'A',
    require: '^md083forkTabs',
    link: postLink
  };

  function postLink(scope, element, attr, tabsCtrl) {

    var tabs = element[0].getElementsByTagName('md083fork-tab');
    var debouncedUpdatePagination = $$rAF.throttle(updatePagination);
    var tabsParent = element.children();
    var locked = false;
    var state = scope.pagination = {
      page: -1,
      active: false,
      clickNext: function() { locked || userChangePage(+1); },
      clickPrevious: function() { locked || userChangePage(-1); }
    };

    scope.$on('$md083forkTabsChanged', debouncedUpdatePagination);
    angular.element($window).on('resize', debouncedUpdatePagination);

    scope.$on('$destroy', function() {
      angular.element($window).off('resize', debouncedUpdatePagination);
    });

    scope.$watch(function() { return tabsCtrl.tabToFocus; }, onTabFocus);

    // Make sure we don't focus an element on the next page
    // before it's in view
    function onTabFocus(tab, oldTab) {
      if (!tab) return;

      var pageIndex = getPageForTab(tab);
      if (!state.active || pageIndex === state.page) {
        tab.element.focus();
      } else {
        // Go to the new page, wait for the page transition to end, then focus.
        oldTab && oldTab.element.blur();
        setPage(pageIndex).then(function() {
          locked = false;
          tab.element.focus();
        });
      }
    }

    // Called when page is changed by a user action (click)
    function userChangePage(increment) {
      var sizeData = state.tabData;
      var newPage = Math.max(0, Math.min(sizeData.pages.length - 1, state.page + increment));
      var newTabIndex = sizeData.pages[newPage][ increment > 0 ? 'firstTabIndex' : 'lastTabIndex' ];
      var newTab = tabsCtrl.itemAt(newTabIndex);
      locked = true;
      onTabFocus(newTab);
    }

    function updatePagination() {
      if (!element.prop('offsetParent')) {
        var watcher = waitForVisible();
        return;
      }

      var tabs = element.find('md083fork-tab');

      disablePagination();

      var sizeData = state.tabData = calculateTabData();
      var needPagination = state.active = sizeData.pages.length > 1;

      if (needPagination) { enablePagination(); }

      scope.$evalAsync(function () { scope.$broadcast('$md083forkTabsPaginationChanged'); });

      function enablePagination() {
        tabsParent.css('width', '9999px');

        //-- apply filler margins
        angular.forEach(sizeData.tabs, function (tab) {
          angular.element(tab.element).css('margin-left', tab.filler + 'px');
        });

        setPage(getPageForTab(tabsCtrl.getSelectedItem()));
      }

      function disablePagination() {
        slideTabButtons(0);
        tabsParent.css('width', '');
        tabs.css('width', '');
        tabs.css('margin-left', '');
        state.page = null;
        state.active = false;
      }

      function waitForVisible() {
        return watcher || scope.$watch(
            function () {
              $timeout(function () {
                if (element[0].offsetParent) {
                  if (angular.isFunction(watcher)) {
                    watcher();
                  }
                  debouncedUpdatePagination();
                  watcher = null;
                }
              }, 0, false);
            }
        );
      }
    }

    function slideTabButtons(x) {
      if (tabsCtrl.pagingOffset === x) {
        // Resolve instantly if no change
        return $$q.when();
      }

      var deferred = $$q.defer();

      tabsCtrl.$$pagingOffset = x;
      tabsParent.css($md083forkConstant.CSS.TRANSFORM, 'translate3d(' + x + 'px,0,0)');
      tabsParent.on($md083forkConstant.CSS.TRANSITIONEND, onTabsParentTransitionEnd);

      return deferred.promise;

      function onTabsParentTransitionEnd(ev) {
        // Make sure this event didn't bubble up from an animation in a child element.
        if (ev.target === tabsParent[0]) {
          tabsParent.off($md083forkConstant.CSS.TRANSITIONEND, onTabsParentTransitionEnd);
          deferred.resolve();
        }
      }
    }

    function shouldStretchTabs() {
      switch (scope.stretchTabs) {
        case 'never':  return false;
        case 'always': return true;
        default:       return $md083forkMedia('sm');
      }
    }

    function calculateTabData(noAdjust) {
      var clientWidth = element.parent().prop('offsetWidth');
      var tabsWidth = clientWidth - PAGINATORS_WIDTH - 1;
      var $tabs = angular.element(tabs);
      var totalWidth = 0;
      var max = 0;
      var tabData = [];
      var pages = [];
      var currentPage;

      $tabs.css('max-width', '');
      angular.forEach(tabs, function (tab, index) {
        var tabWidth = Math.min(tabsWidth, tab.offsetWidth);
        var data = {
          element: tab,
          left: totalWidth,
          width: tabWidth,
          right: totalWidth + tabWidth,
          filler: 0
        };

        //-- This calculates the page for each tab.  The first page will use the clientWidth, which
        //   does not factor in the pagination items.  After the first page, tabsWidth is used
        //   because at this point, we know that the pagination buttons will be shown.
        data.page = Math.ceil(data.right / ( pages.length === 1 && index === tabs.length - 1 ? clientWidth : tabsWidth )) - 1;

        if (data.page >= pages.length) {
          data.filler = (tabsWidth * data.page) - data.left;
          data.right += data.filler;
          data.left += data.filler;
          currentPage = {
            left: data.left,
            firstTabIndex: index,
            lastTabIndex: index,
            tabs: [ data ]
          };
          pages.push(currentPage);
        } else {
          currentPage.lastTabIndex = index;
          currentPage.tabs.push(data);
        }
        totalWidth = data.right;
        max = Math.max(max, tabWidth);
        tabData.push(data);
      });
      $tabs.css('max-width', tabsWidth + 'px');

      if (!noAdjust && shouldStretchTabs()) {
        return adjustForStretchedTabs();
      } else {
        return {
          width: totalWidth,
          max: max,
          tabs: tabData,
          pages: pages,
          tabElements: tabs
        };
      }


      function adjustForStretchedTabs() {
        var canvasWidth = pages.length === 1 ? clientWidth : tabsWidth;
        var tabsPerPage = Math.min(Math.floor(canvasWidth / max), tabs.length);
        var tabWidth    = Math.floor(canvasWidth / tabsPerPage);
        $tabs.css('width', tabWidth + 'px');
        return calculateTabData(true);
      }
    }

    function getPageForTab(tab) {
      var tabIndex = tabsCtrl.indexOf(tab);
      if (tabIndex === -1) return 0;

      var sizeData = state.tabData;

      return sizeData ? sizeData.tabs[tabIndex].page : 0;
    }

    function setPage(page) {
      if (page === state.page) return;

      var lastPage = state.tabData.pages.length - 1;

      if (page < 0) page = 0;
      if (page > lastPage) page = lastPage;

      state.hasPrev = page > 0;
      state.hasNext = page < lastPage;

      state.page = page;

      scope.$broadcast('$md083forkTabsPaginationChanged');

      return slideTabButtons(-state.tabData.pages[page].left);
    }
  }

}
TabPaginationDirective.$inject = ["$md083forkConstant", "$window", "$$rAF", "$$q", "$timeout", "$md083forkMedia"];
})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';


angular.module('material.083fork.components.tabs')
  .controller('$md083forkTab', TabItemController);

function TabItemController($scope, $element, $attrs, $compile, $animate, $md083forkUtil, $parse, $timeout) {
  var self = this;
  var tabsCtrl = $element.controller('md083forkTabs');

  // Properties
  self.contentContainer = angular.element('<div class="md-tab-content ng-hide">');
  self.element = $element;

  // Methods
  self.isDisabled = isDisabled;
  self.onAdd = onAdd;
  self.onRemove = onRemove;
  self.onSelect = onSelect;
  self.onDeselect = onDeselect;

  var disabledParsed = $parse($attrs.ngDisabled);
  function isDisabled() {
    return disabledParsed($scope.$parent);
  }
  
  /**
   * Add the tab's content to the DOM container area in the tabs,
   * @param contentArea the contentArea to add the content of the tab to
   */
  function onAdd(contentArea, shouldDisconnectScope) {
    if (self.content.length) {
      self.contentContainer.append(self.content);
      self.contentScope = $scope.$parent.$new();
      contentArea.append(self.contentContainer);

      $compile(self.contentContainer)(self.contentScope);
      if (shouldDisconnectScope === true) {
        $timeout(function () {
          $md083forkUtil.disconnectScope(self.contentScope);
        }, 0, false);
      }
    }
  }

  function onRemove() {
    $animate.leave(self.contentContainer).then(function() {
      self.contentScope && self.contentScope.$destroy();
      self.contentScope = null;
    });
  }

  function toggleAnimationClass(rightToLeft) {
    self.contentContainer[rightToLeft ? 'addClass' : 'removeClass']('md-transition-rtl');
  }

  function onSelect(rightToLeft) {
    // Resume watchers and events firing when tab is selected
    $md083forkUtil.reconnectScope(self.contentScope);

    $element
      .addClass('active')
      .attr({
        'aria-selected': true,
        'tabIndex': 0
      })
      .on('$md083fork.swipeleft $md083fork.swiperight', onSwipe);

    toggleAnimationClass(rightToLeft);
    $animate.removeClass(self.contentContainer, 'ng-hide');

    $scope.onSelect();
  }

  function onDeselect(rightToLeft) {
    // Stop watchers & events from firing while tab is deselected
    $md083forkUtil.disconnectScope(self.contentScope);

    $element
      .removeClass('active')
      .attr({
        'aria-selected': false,
        'tabIndex': -1
      })
      .off('$md083fork.swipeleft $md083fork.swiperight', onSwipe);

    toggleAnimationClass(rightToLeft);
    $animate.addClass(self.contentContainer, 'ng-hide');

    $scope.onDeselect();
  }

  ///// Private functions

  function onSwipe(ev) {
    $scope.$apply(function() {
      if (/left/.test(ev.type)) {
        tabsCtrl.select(tabsCtrl.next());
      } else {
        tabsCtrl.select(tabsCtrl.previous());
      }
    });
  }
 

}
TabItemController.$inject = ["$scope", "$element", "$attrs", "$compile", "$animate", "$md083forkUtil", "$parse", "$timeout"];

})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';

angular.module('material.083fork.components.tabs')
  .directive('md083forkTab', MdTabDirective);

/**
 * @ngdoc directive
 * @name md083forkTab
 * @module material.components.tabs
 *
 * @restrict E
 *
 * @description
 * Use the `<md083fork-tab>` a nested directive used within `<md083fork-tabs>` to specify a tab with a **label** and optional *view content*.
 *
 * If the `label` attribute is not specified, then an optional `<md-tab-label>` tag can be used to specify more
 * complex tab header markup. If neither the **label** nor the **md-tab-label** are specified, then the nested
 * markup of the `<md083fork-tab>` is used as the tab header markup.
 *
 * If a tab **label** has been identified, then any **non-**`<md-tab-label>` markup
 * will be considered tab content and will be transcluded to the internal `<div class="md-tabs-content">` container.
 *
 * This container is used by the TabsController to show/hide the active tab's content view. This synchronization is
 * automatically managed by the internal TabsController whenever the tab selection changes. Selection changes can
 * be initiated via data binding changes, programmatic invocation, or user gestures.
 *
 * @param {string=} label Optional attribute to specify a simple string as the tab label
 * @param {boolean=} md-active When evaluteing to true, selects the tab.
 * @param {boolean=} disabled If present, disabled tab selection.
 * @param {expression=} md-on-deselect Expression to be evaluated after the tab has been de-selected.
 * @param {expression=} md-on-select Expression to be evaluated after the tab has been selected.
 *
 *
 * @usage
 *
 * <hljs lang="html">
 * <md083fork-tab label="" disabled="" md-on-select="" md-on-deselect="" >
 *   <h3>My Tab content</h3>
 * </md083fork-tab>
 *
 * <md083fork-tab >
 *   <md-tab-label>
 *     <h3>My Tab content</h3>
 *   </md-tab-label>
 *   <p>
 *     Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
 *     totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
 *     dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
 *     sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
 *   </p>
 * </md083fork-tab>
 * </hljs>
 *
 */
function MdTabDirective($md083forkInkRipple$mdInkRipple, $compile, $md083forkUtil, $md083forkConstant, $timeout) {
  return {
    restrict: 'E',
    require: ['md083forkTab', '^md083forkTabs'],
    controller: '$md083forkTab',
    scope: {
      onSelect: '&mdOnSelect',
      onDeselect: '&mdOnDeselect',
      label: '@'
    },
    compile: compile
  };

  function compile(element, attr) {
    var tabLabel = element.find('md-tab-label');

    if (tabLabel.length) {
      // If a tab label element is found, remove it for later re-use.
      tabLabel.remove();

    } else if (angular.isDefined(attr.label)) {
      // Otherwise, try to use attr.label as the label
      tabLabel = angular.element('<md-tab-label>').html(attr.label);

    } else {
      // If nothing is found, use the tab's content as the label
      tabLabel = angular.element('<md-tab-label>')
                        .append(element.contents().remove());
    }

    // Everything that's left as a child is the tab's content.
    var tabContent = element.contents().remove();

    return function postLink(scope, element, attr, ctrls) {

      var tabItemCtrl = ctrls[0]; // Controller for THIS tabItemCtrl
      var tabsCtrl = ctrls[1]; // Controller for ALL tabs

      $timeout(element.addClass.bind(element, 'md-tab-themed'), 0, false);

      scope.$watch(
          function () { return attr.label; },
          function () { $timeout(function () { tabsCtrl.scope.$broadcast('$md083forkTabsChanged'); }, 0, false); }
      );

      transcludeTabContent();
      configureAria();

      $md083forkInkRipple$mdInkRipple.attachTabBehavior(scope, element, {
        colorElement: tabsCtrl.inkBarElement
      });
      tabsCtrl.add(tabItemCtrl);
      scope.$on('$destroy', function() {
        tabsCtrl.remove(tabItemCtrl);
      });
      element.on('$destroy', function () {
        //-- wait for item to be removed from the dom
        $timeout(function () {
          tabsCtrl.scope.$broadcast('$md083forkTabsChanged');
        }, 0, false);
      });

      if (!angular.isDefined(attr.ngClick)) {
        element.on('click', defaultClickListener);
      }
      element.on('keydown', keydownListener);

      if (angular.isNumber(scope.$parent.$index)) {
        watchNgRepeatIndex();
      }
      if (angular.isDefined(attr.mdActive)) {
        watchActiveAttribute();
      }
      watchDisabled();

      function transcludeTabContent() {
        // Clone the label we found earlier, and $compile and append it
        var label = tabLabel.clone();
        element.append(label);
        $compile(label)(scope.$parent);

        // Clone the content we found earlier, and mark it for later placement into
        // the proper content area.
        tabItemCtrl.content = tabContent.clone();
      }

      //defaultClickListener isn't applied if the user provides an ngClick expression.
      function defaultClickListener() {
        scope.$apply(function() {
          tabsCtrl.select(tabItemCtrl);
          tabsCtrl.focus(tabItemCtrl);
        });
      }
      function keydownListener(ev) {
        if (ev.keyCode == $md083forkConstant.KEY_CODE.SPACE || ev.keyCode == $md083forkConstant.KEY_CODE.ENTER ) {
          // Fire the click handler to do normal selection if space is pressed
          element.triggerHandler('click');
          ev.preventDefault();
        } else if (ev.keyCode === $md083forkConstant.KEY_CODE.LEFT_ARROW) {
          scope.$evalAsync(function() {
            tabsCtrl.focus(tabsCtrl.previous(tabItemCtrl));
          });
        } else if (ev.keyCode === $md083forkConstant.KEY_CODE.RIGHT_ARROW) {
          scope.$evalAsync(function() {
            tabsCtrl.focus(tabsCtrl.next(tabItemCtrl));
          });
        }
      }

      // If tabItemCtrl is part of an ngRepeat, move the tabItemCtrl in our internal array
      // when its $index changes
      function watchNgRepeatIndex() {
        // The tabItemCtrl has an isolate scope, so we watch the $index on the parent.
        scope.$watch('$parent.$index', function $indexWatchAction(newIndex) {
          tabsCtrl.move(tabItemCtrl, newIndex);
        });
      }

      function watchActiveAttribute() {
        var unwatch = scope.$parent.$watch('!!(' + attr.mdActive + ')', activeWatchAction);
        scope.$on('$destroy', unwatch);

        function activeWatchAction(isActive) {
          var isSelected = tabsCtrl.getSelectedItem() === tabItemCtrl;

          if (isActive && !isSelected) {
            tabsCtrl.select(tabItemCtrl);
          } else if (!isActive && isSelected) {
            tabsCtrl.deselect(tabItemCtrl);
          }
        }
      }

      function watchDisabled() {
        scope.$watch(tabItemCtrl.isDisabled, disabledWatchAction);

        function disabledWatchAction(isDisabled) {
          element.attr('aria-disabled', isDisabled);

          // Auto select `next` tab when disabled
          var isSelected = (tabsCtrl.getSelectedItem() === tabItemCtrl);
          if (isSelected && isDisabled) {
            tabsCtrl.select(tabsCtrl.next() || tabsCtrl.previous());
          }

        }
      }

      function configureAria() {
        // Link together the content area and tabItemCtrl with an id
        var tabId = attr.id || ('tab_' + $md083forkUtil.nextUid());

        element.attr({
          id: tabId,
          role: 'tab',
          tabIndex: -1 //this is also set on select/deselect in tabItemCtrl
        });

        // Only setup the contentContainer's aria attributes if tab content is provided
        if (tabContent.length) {
          var tabContentId = 'content_' + tabId;
          if (!element.attr('aria-controls')) {
            element.attr('aria-controls', tabContentId);
          }
          tabItemCtrl.contentContainer.attr({
            id: tabContentId,
            role: 'tabpanel',
            'aria-labelledby': tabId
          });
        }
      }

    };

  }

}
MdTabDirective.$inject = ["$md083forkInkRipple$mdInkRipple", "$compile", "$md083forkUtil", "$md083forkConstant", "$timeout"];

})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';

angular.module('material.083fork.components.tabs')
  .controller('$md083forkTabs', MdTabsController);

function MdTabsController($scope, $element, $md083forkUtil, $timeout) {

  var tabsList = $md083forkUtil.iterator([], false);
  var self = this;

  // Properties
  self.$element = $element;
  self.scope = $scope;
  // The section containing the tab content $elements
  var contentArea = self.contentArea = angular.element($element[0].querySelector('.md-tabs-content'));

  // Methods from iterator
  var inRange = self.inRange = tabsList.inRange;
  var indexOf = self.indexOf = tabsList.indexOf;
  var itemAt = self.itemAt = tabsList.itemAt;
  self.count = tabsList.count;

  self.getSelectedItem = getSelectedItem;
  self.getSelectedIndex = getSelectedIndex;
  self.add = add;
  self.remove = remove;
  self.move = move;
  self.select = select;
  self.focus = focus;
  self.deselect = deselect;

  self.next = next;
  self.previous = previous;

  $scope.$on('$destroy', function() {
    deselect(getSelectedItem());
    for (var i = tabsList.count() - 1; i >= 0; i--) {
      remove(tabsList[i], true);
    }
  });

  // Get the selected tab
  function getSelectedItem() {
    return itemAt($scope.selectedIndex);
  }

  function getSelectedIndex() {
    return $scope.selectedIndex;
  }

  // Add a new tab.
  // Returns a method to remove the tab from the list.
  function add(tab, index) {
    tabsList.add(tab, index);

    // Select the new tab if we don't have a selectedIndex, or if the
    // selectedIndex we've been waiting for is this tab
    if (!angular.isDefined(tab.element.attr('md-active')) && ($scope.selectedIndex === -1 || !angular.isNumber($scope.selectedIndex) ||
        $scope.selectedIndex === self.indexOf(tab))) {
      tab.onAdd(self.contentArea, false);
      self.select(tab);
    } else {
      tab.onAdd(self.contentArea, true);
    }

    $scope.$broadcast('$md083forkTabsChanged');
  }

  function remove(tab, noReselect) {
    if (!tabsList.contains(tab)) return;
    if (noReselect) return;
    var isSelectedItem = getSelectedItem() === tab,
        newTab = previous() || next();

    deselect(tab);
    tabsList.remove(tab);
    tab.onRemove();

    $scope.$broadcast('$md083forkTabsChanged');

    if (isSelectedItem) { select(newTab); }
  }

  // Move a tab (used when ng-repeat order changes)
  function move(tab, toIndex) {
    var isSelected = getSelectedItem() === tab;

    tabsList.remove(tab);
    tabsList.add(tab, toIndex);
    if (isSelected) select(tab);

    $scope.$broadcast('$md083forkTabsChanged');
  }

  function select(tab, rightToLeft) {
    if (!tab || tab.isSelected || tab.isDisabled()) return;
    if (!tabsList.contains(tab)) return;

    if (!angular.isDefined(rightToLeft)) {
      rightToLeft = indexOf(tab) < $scope.selectedIndex;
    }
    deselect(getSelectedItem(), rightToLeft);

    $scope.selectedIndex = indexOf(tab);
    tab.isSelected = true;
    tab.onSelect(rightToLeft);

    $scope.$broadcast('$md083forkTabsChanged');
  }

  function focus(tab) {
    // this variable is watched by pagination
    self.tabToFocus = tab;
  }

  function deselect(tab, rightToLeft) {
    if (!tab || !tab.isSelected) return;
    if (!tabsList.contains(tab)) return;

    $scope.selectedIndex = -1;
    tab.isSelected = false;
    tab.onDeselect(rightToLeft);
  }

  function next(tab, filterFn) {
    return tabsList.next(tab || getSelectedItem(), filterFn || isTabEnabled);
  }
  function previous(tab, filterFn) {
    return tabsList.previous(tab || getSelectedItem(), filterFn || isTabEnabled);
  }

  function isTabEnabled(tab) {
    return tab && !tab.isDisabled();
  }

}
MdTabsController.$inject = ["$scope", "$element", "$md083forkUtil", "$timeout"];
})();

/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.8.3
 */
(function() {
'use strict';

angular.module('material.083fork.components.tabs')
  .directive('md083forkTabs', TabsDirective);

/**
 * @ngdoc directive
 * @name md083forkTabs
 * @module material.components.tabs
 *
 * @restrict E
 *
 * @description
 * The `<md083fork-tabs>` directive serves as the container for 1..n `<md083fork-tab>` child directives to produces a Tabs components.
 * In turn, the nested `<md083fork-tab>` directive is used to specify a tab label for the **header button** and a [optional] tab view
 * content that will be associated with each tab button.
 *
 * Below is the markup for its simplest usage:
 *
 *  <hljs lang="html">
 *  <md083fork-tabs>
 *    <md083fork-tab label="Tab #1"></md083fork-tab>
 *    <md083fork-tab label="Tab #2"></md083fork-tab>
 *    <md083fork-tab label="Tab #3"></md083fork-tab>
 *  </md083fork-tabs>
 *  </hljs>
 *
 * Tabs supports three (3) usage scenarios:
 *
 *  1. Tabs (buttons only)
 *  2. Tabs with internal view content
 *  3. Tabs with external view content
 *
 * **Tab-only** support is useful when tab buttons are used for custom navigation regardless of any other components, content, or views.
 * **Tabs with internal views** are the traditional usages where each tab has associated view content and the view switching is managed internally by the Tabs component.
 * **Tabs with external view content** is often useful when content associated with each tab is independently managed and data-binding notifications announce tab selection changes.
 *
 * > As a performance bonus, if the tab content is managed internally then the non-active (non-visible) tab contents are temporarily disconnected from the `$scope.$digest()` processes; which restricts and optimizes DOM updates to only the currently active tab.
 *
 * Additional features also include:
 *
 * *  Content can include any markup.
 * *  If a tab is disabled while active/selected, then the next tab will be auto-selected.
 * *  If the currently active tab is the last tab, then next() action will select the first tab.
 * *  Any markup (other than **`<md083fork-tab>`** tags) will be transcluded into the tab header area BEFORE the tab buttons.
 *
 * ### Explanation of tab stretching
 *
 * Initially, tabs will have an inherent size.  This size will either be defined by how much space is needed to accommodate their text or set by the user through CSS.  Calculations will be based on this size.
 *
 * On mobile devices, tabs will be expanded to fill the available horizontal space.  When this happens, all tabs will become the same size.
 *
 * On desktops, by default, stretching will never occur.
 *
 * This default behavior can be overridden through the `md-stretch-tabs` attribute.  Here is a table showing when stretching will occur:
 *
 * `md-stretch-tabs` | mobile    | desktop
 * ------------------|-----------|--------
 * `auto`            | stretched | ---
 * `always`          | stretched | stretched
 * `never`           | ---       | ---
 *
 * @param {integer=} md-selected Index of the active/selected tab
 * @param {boolean=} md-no-ink If present, disables ink ripple effects.
 * @param {boolean=} md-no-bar If present, disables the selection ink bar.
 * @param {string=}  md-align-tabs Attribute to indicate position of tab buttons: `bottom` or `top`; default is `top`
 * @param {string=} md-stretch-tabs Attribute to indicate whether or not to stretch tabs: `auto`, `always`, or `never`; default is `auto`
 *
 * @usage
 * <hljs lang="html">
 * <md083fork-tabs md-selected="selectedIndex" >
 *   <img ng-src="img/angular.png" class="centered">
 *
 *   <md083fork-tab
 *      ng-repeat="tab in tabs | orderBy:predicate:reversed"
 *      md-on-select="onTabSelected(tab)"
 *      md-on-deselect="announceDeselected(tab)"
 *      disabled="tab.disabled" >
 *
 *       <md-tab-label>
 *           {{tab.title}}
 *           <img src="img/removeTab.png"
 *                ng-click="removeTab(tab)"
 *                class="delete" >
 *       </md-tab-label>
 *
 *       {{tab.content}}
 *
 *   </md083fork-tab>
 *
 * </md083fork-tabs>
 * </hljs>
 *
 */
function TabsDirective($md083forkTheming) {
  return {
    restrict: 'E',
    controller: '$md083forkTabs',
    require: 'md083forkTabs',
    transclude: true,
    scope: {
      selectedIndex: '=?mdSelected'
    },
    template:
      '<section class="md-header" ' +
        'ng-class="{\'md-paginating\': pagination.active}">' +

        '<button class="md-paginator md-prev" ' +
          'ng-if="pagination.active && pagination.hasPrev" ' +
          'ng-click="pagination.clickPrevious()" ' +
          'aria-hidden="true">' +
          '<md083fork-icon md-svg-icon="tabs-arrow"></md083fork-icon>' +
        '</button>' +

        // overflow: hidden container when paginating
        '<div class="md-header-items-container" md083fork-tabs-pagination>' +
          // flex container for <md083fork-tab> elements
          '<div class="md-header-items">' +
            '<md083fork-tabs-ink-bar></md083fork-tabs-ink-bar>' +
          '</div>' +
        '</div>' +

        '<button class="md-paginator md-next" ' +
          'ng-if="pagination.active && pagination.hasNext" ' +
          'ng-click="pagination.clickNext()" ' +
          'aria-hidden="true">' +
          '<md083fork-icon md-svg-icon="tabs-arrow"></md083fork-icon>' +
        '</button>' +

      '</section>' +
      '<section class="md-tabs-content"></section>',
    link: postLink
  };

  function postLink(scope, element, attr, tabsCtrl, transclude) {

    scope.stretchTabs = attr.hasOwnProperty('mdStretchTabs') ? attr.mdStretchTabs || 'always' : 'auto';

    $md083forkTheming(element);
    configureAria();
    watchSelected();

    transclude(scope.$parent, function(clone) {
      angular.element(element[0].querySelector('.md-header-items')).append(clone);
    });

    function configureAria() {
      element.attr('role', 'tablist');
    }

    function watchSelected() {
      scope.$watch('selectedIndex', function watchSelectedIndex(newIndex, oldIndex) {
        if (oldIndex == newIndex) return;
        var rightToLeft = oldIndex > newIndex;
        tabsCtrl.deselect(tabsCtrl.itemAt(oldIndex), rightToLeft);

        if (tabsCtrl.inRange(newIndex)) {
          var newTab = tabsCtrl.itemAt(newIndex);
          while (newTab && newTab.isDisabled()) {
            newTab = newIndex > oldIndex 
                ? tabsCtrl.next(newTab)
                : tabsCtrl.previous(newTab);
          }
          tabsCtrl.select(newTab, rightToLeft);
        }
      });
    }
  }
}
TabsDirective.$inject = ["$md083forkTheming"];
})();

(function(){ 
 angular.module("material.083fork.core").constant("$MD_THEME_CSS", "md083fork-autocomplete {  background: '{{background-50}}'; }  md083fork-autocomplete button md083fork-icon path {    fill: '{{background-600}}'; }  md083fork-autocomplete button:after {    background: '{{background-600-0.3}}'; }  md083fork-autocomplete ul {    background: '{{background-50}}'; }    md083fork-autocomplete ul li {      border-top: 1px solid '{{background-400}}';      color: '{{background-900}}'; }      md083fork-autocomplete ul li .highlight {        color: '{{background-600}}'; }      md083fork-autocomplete ul li:hover, md083fork-autocomplete ul li.selected {        background: '{{background-200}}'; }md083fork-backdrop.md-opaque.md-THEME_NAME-theme {  background-color: '{{foreground-4-0.5}}'; }md-toolbar .md083fork-button.md-THEME_NAME-theme.md-fab {  background-color: white; }.md083fork-button.md-THEME_NAME-theme {  border-radius: 3px; }  .md083fork-button.md-THEME_NAME-theme:not([disabled]):hover, .md083fork-button.md-THEME_NAME-theme:not([disabled]):focus {    background-color: '{{background-500-0.2}}'; }  .md083fork-button.md-THEME_NAME-theme.md-primary {    color: '{{primary-color}}'; }    .md083fork-button.md-THEME_NAME-theme.md-primary.md-raised, .md083fork-button.md-THEME_NAME-theme.md-primary.md-fab {      color: '{{primary-contrast}}';      background-color: '{{primary-color}}'; }      .md083fork-button.md-THEME_NAME-theme.md-primary.md-raised:not([disabled]):hover, .md083fork-button.md-THEME_NAME-theme.md-primary.md-raised:not([disabled]):focus, .md083fork-button.md-THEME_NAME-theme.md-primary.md-fab:not([disabled]):hover, .md083fork-button.md-THEME_NAME-theme.md-primary.md-fab:not([disabled]):focus {        background-color: '{{primary-600}}'; }  .md083fork-button.md-THEME_NAME-theme.md-fab {    border-radius: 50%;    background-color: '{{accent-color}}';    color: '{{accent-contrast}}'; }    .md083fork-button.md-THEME_NAME-theme.md-fab:not([disabled]):hover, .md083fork-button.md-THEME_NAME-theme.md-fab:not([disabled]):focus {      background-color: '{{accent-A700}}'; }  .md083fork-button.md-THEME_NAME-theme.md-raised {    color: '{{background-contrast}}';    background-color: '{{background-50}}'; }    .md083fork-button.md-THEME_NAME-theme.md-raised:not([disabled]):hover, .md083fork-button.md-THEME_NAME-theme.md-raised:not([disabled]):focus {      background-color: '{{background-200}}'; }  .md083fork-button.md-THEME_NAME-theme.md-warn {    color: '{{warn-color}}'; }    .md083fork-button.md-THEME_NAME-theme.md-warn.md-raised, .md083fork-button.md-THEME_NAME-theme.md-warn.md-fab {      color: '{{warn-contrast}}';      background-color: '{{warn-color}}'; }      .md083fork-button.md-THEME_NAME-theme.md-warn.md-raised:not([disabled]):hover, .md083fork-button.md-THEME_NAME-theme.md-warn.md-raised:not([disabled]):focus, .md083fork-button.md-THEME_NAME-theme.md-warn.md-fab:not([disabled]):hover, .md083fork-button.md-THEME_NAME-theme.md-warn.md-fab:not([disabled]):focus {        background-color: '{{warn-700}}'; }  .md083fork-button.md-THEME_NAME-theme.md-accent {    color: '{{accent-color}}'; }    .md083fork-button.md-THEME_NAME-theme.md-accent.md-raised, .md083fork-button.md-THEME_NAME-theme.md-accent.md-fab {      color: '{{accent-contrast}}';      background-color: '{{accent-color}}'; }      .md083fork-button.md-THEME_NAME-theme.md-accent.md-raised:not([disabled]):hover, .md083fork-button.md-THEME_NAME-theme.md-accent.md-raised:not([disabled]):focus, .md083fork-button.md-THEME_NAME-theme.md-accent.md-fab:not([disabled]):hover, .md083fork-button.md-THEME_NAME-theme.md-accent.md-fab:not([disabled]):focus {        background-color: '{{accent-700}}'; }  .md083fork-button.md-THEME_NAME-theme[disabled], .md083fork-button.md-THEME_NAME-theme.md-raised[disabled], .md083fork-button.md-THEME_NAME-theme.md-fab[disabled] {    color: '{{foreground-3}}';    background-color: transparent;    cursor: not-allowed; }md083fork-checkbox.md-THEME_NAME-theme .md-ripple {  color: '{{accent-600}}'; }md083fork-checkbox.md-THEME_NAME-theme.md-checked .md-ripple {  color: '{{background-600}}'; }md083fork-checkbox.md-THEME_NAME-theme .md083fork-icon {  border-color: '{{foreground-2}}'; }md083fork-checkbox.md-THEME_NAME-theme.md-checked .md083fork-icon {  background-color: '{{accent-color-0.87}}'; }md083fork-checkbox.md-THEME_NAME-theme.md-checked .md083fork-icon:after {  border-color: '{{background-200}}'; }md083fork-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary .md-ripple {  color: '{{primary-600}}'; }md083fork-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-ripple {  color: '{{background-600}}'; }md083fork-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary .md083fork-icon {  border-color: '{{foreground-2}}'; }md083fork-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md083fork-icon {  background-color: '{{primary-color-0.87}}'; }md083fork-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md083fork-icon:after {  border-color: '{{background-200}}'; }md083fork-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn .md-ripple {  color: '{{warn-600}}'; }md083fork-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn .md083fork-icon {  border-color: '{{foreground-2}}'; }md083fork-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked .md083fork-icon {  background-color: '{{warn-color-0.87}}'; }md083fork-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked .md083fork-icon:after {  border-color: '{{background-200}}'; }md083fork-checkbox.md-THEME_NAME-theme[disabled] .md083fork-icon {  border-color: '{{foreground-3}}'; }md083fork-checkbox.md-THEME_NAME-theme[disabled].md-checked .md083fork-icon {  background-color: '{{foreground-3}}'; }md083fork-content.md-THEME_NAME-theme {  background-color: '{{background-hue-3}}'; }md083fork-dialog.md-THEME_NAME-theme {  border-radius: 4px;  background-color: '{{background-hue-3}}'; }  md083fork-dialog.md-THEME_NAME-theme.md-content-overflow .md-actions {    border-top-color: '{{foreground-4}}'; }md083fork-icon.md-THEME_NAME-theme.md-primary {  color: '{{primary-color}}'; }md083fork-icon.md-THEME_NAME-theme.md-accent {  color: '{{accent-color}}'; }md083fork-icon.md-THEME_NAME-theme.md-warn {  color: '{{warn-color}}'; }md083fork-icon.md-THEME_NAME-theme.md-danger {  color: '{{danger-color}}'; }md083fork-input-container.md-THEME_NAME-theme .md083fork-input {  color: '{{foreground-1}}';  border-color: '{{foreground-4}}';  text-shadow: '{{foreground-shadow}}'; }  md083fork-input-container.md-THEME_NAME-theme .md083fork-input::-webkit-input-placeholder, md083fork-input-container.md-THEME_NAME-theme .md083fork-input::-moz-placeholder, md083fork-input-container.md-THEME_NAME-theme .md083fork-input:-moz-placeholder, md083fork-input-container.md-THEME_NAME-theme .md083fork-input:-ms-input-placeholder {    color: '{{foreground-3}}'; }md083fork-input-container.md-THEME_NAME-theme > md083fork-icon {  fill: '{{foreground-1}}'; }md083fork-input-container.md-THEME_NAME-theme label, md083fork-input-container.md-THEME_NAME-theme .md-placeholder {  text-shadow: '{{foreground-shadow}}';  color: '{{foreground-3}}'; }md083fork-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-has-value label {  color: '{{foreground-2}}'; }md083fork-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused .md083fork-input {  border-color: '{{primary-500}}'; }md083fork-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused label {  color: '{{primary-500}}'; }md083fork-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused md083fork-icon {  fill: '{{primary-500}}'; }md083fork-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-accent .md083fork-input {  border-color: '{{accent-500}}'; }md083fork-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-accent label {  color: '{{accent-500}}'; }md083fork-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-warn .md083fork-input {  border-color: '{{warn-500}}'; }md083fork-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-warn label {  color: '{{warn-500}}'; }md083fork-input-container.md-THEME_NAME-theme.md-input-invalid .md083fork-input {  border-color: '{{warn-500}}'; }md083fork-input-container.md-THEME_NAME-theme.md-input-invalid label {  color: '{{warn-500}}'; }md083fork-input-container.md-THEME_NAME-theme.md-input-invalid ng-message, md083fork-input-container.md-THEME_NAME-theme.md-input-invalid data-ng-message, md083fork-input-container.md-THEME_NAME-theme.md-input-invalid x-ng-message, md083fork-input-container.md-THEME_NAME-theme.md-input-invalid [ng-message], md083fork-input-container.md-THEME_NAME-theme.md-input-invalid [data-ng-message], md083fork-input-container.md-THEME_NAME-theme.md-input-invalid [x-ng-message], md083fork-input-container.md-THEME_NAME-theme.md-input-invalid .md-char-counter {  color: '{{warn-500}}'; }md083fork-input-container.md-THEME_NAME-theme .md083fork-input[disabled], [disabled] md083fork-input-container.md-THEME_NAME-theme .md083fork-input {  border-bottom-color: transparent;  color: '{{foreground-3}}';  background-image: linear-gradient(to right, '{{foreground-4}}' 0%, '{{foreground-4}}' 33%, transparent 0%);  background-image: -ms-linear-gradient(left, transparent 0%, '{{foreground-4}}' 100%); }md083fork-radio-button.md-THEME_NAME-theme .md-off {  border-color: '{{foreground-2}}'; }md083fork-radio-button.md-THEME_NAME-theme .md-on {  background-color: '{{accent-color-0.87}}'; }md083fork-radio-button.md-THEME_NAME-theme.md-checked .md-off {  border-color: '{{accent-color-0.87}}'; }md083fork-radio-button.md-THEME_NAME-theme.md-checked .md-ink-ripple {  color: '{{accent-color-0.87}}'; }md083fork-radio-button.md-THEME_NAME-theme .md-container .md-ripple {  color: '{{accent-600}}'; }md083fork-radio-button.md-THEME_NAME-theme:not([disabled]).md-primary .md-on {  background-color: '{{primary-color-0.87}}'; }md083fork-radio-button.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-off {  border-color: '{{primary-color-0.87}}'; }md083fork-radio-button.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-ink-ripple {  color: '{{primary-color-0.87}}'; }md083fork-radio-button.md-THEME_NAME-theme:not([disabled]).md-primary .md-container .md-ripple {  color: '{{primary-600}}'; }md083fork-radio-button.md-THEME_NAME-theme:not([disabled]).md-warn .md-on {  background-color: '{{warn-color-0.87}}'; }md083fork-radio-button.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked .md-off {  border-color: '{{warn-color-0.87}}'; }md083fork-radio-button.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked .md-ink-ripple {  color: '{{warn-color-0.87}}'; }md083fork-radio-button.md-THEME_NAME-theme:not([disabled]).md-warn .md-container .md-ripple {  color: '{{warn-600}}'; }md083fork-radio-button.md-THEME_NAME-theme[disabled] .md-container .md-off {  border-color: '{{foreground-3}}'; }md083fork-radio-button.md-THEME_NAME-theme[disabled] .md-container .md-on {  border-color: '{{foreground-3}}'; }md083fork-radio-group.md-THEME_NAME-theme:focus:not(:empty) {  border-color: '{{foreground-1}}'; }md083fork-select.md-THEME_NAME-theme:not([disabled]):focus .md-select-label {  border-bottom-color: '{{primary-color}}';  color: '{{ foreground-1 }}'; }  md083fork-select.md-THEME_NAME-theme:not([disabled]):focus .md-select-label.md-placeholder {    color: '{{ foreground-1 }}'; }md083fork-select.md-THEME_NAME-theme:not([disabled]):focus.md-accent .md-select-label {  border-bottom-color: '{{accent-color}}'; }md083fork-select.md-THEME_NAME-theme:not([disabled]):focus.md-warn .md-select-label {  border-bottom-color: '{{warn-color}}'; }md083fork-select.md-THEME_NAME-theme[disabled] .md-select-label {  color: '{{foreground-3}}'; }  md083fork-select.md-THEME_NAME-theme[disabled] .md-select-label.md-placeholder {    color: '{{foreground-3}}'; }md083fork-select.md-THEME_NAME-theme .md-select-label {  border-bottom-color: '{{foreground-4}}'; }  md083fork-select.md-THEME_NAME-theme .md-select-label.md-placeholder {    color: '{{foreground-2}}'; }md083fork-select-menu.md-THEME_NAME-theme md083fork-optgroup {  color: '{{foreground-2}}'; }  md083fork-select-menu.md-THEME_NAME-theme md083fork-optgroup md083fork-option {    color: '{{foreground-1}}'; }md083fork-select-menu.md-THEME_NAME-theme md083fork-option[selected] {  background-color: '{{primary-50}}'; }  md083fork-select-menu.md-THEME_NAME-theme md083fork-option[selected]:focus {    background-color: '{{primary-100}}'; }  md083fork-select-menu.md-THEME_NAME-theme md083fork-option[selected].md-accent {    background-color: '{{accent-50}}'; }    md083fork-select-menu.md-THEME_NAME-theme md083fork-option[selected].md-accent:focus {      background-color: '{{accent-100}}'; }md083fork-select-menu.md-THEME_NAME-theme md083fork-option:focus:not([selected]) {  background: '{{background-200}}'; }md083fork-sidenav.md-THEME_NAME-theme {  background-color: '{{background-hue-3}}'; }md083fork-slider.md-THEME_NAME-theme .md-track {  background-color: '{{foreground-3}}'; }md083fork-slider.md-THEME_NAME-theme .md-track-ticks {  background-color: '{{foreground-4}}'; }md083fork-slider.md-THEME_NAME-theme .md-focus-thumb {  background-color: '{{foreground-2}}'; }md083fork-slider.md-THEME_NAME-theme .md-focus-ring {  border-color: '{{foreground-4}}'; }md083fork-slider.md-THEME_NAME-theme .md-disabled-thumb {  border-color: '{{background-hue-3}}'; }md083fork-slider.md-THEME_NAME-theme.md-min .md-thumb:after {  background-color: '{{background-hue-3}}'; }md083fork-slider.md-THEME_NAME-theme .md-track.md-track-fill {  background-color: '{{accent-color}}'; }md083fork-slider.md-THEME_NAME-theme .md-thumb:after {  border-color: '{{accent-color}}';  background-color: '{{accent-color}}'; }md083fork-slider.md-THEME_NAME-theme .md-sign {  background-color: '{{accent-color}}'; }  md083fork-slider.md-THEME_NAME-theme .md-sign:after {    border-top-color: '{{accent-color}}'; }md083fork-slider.md-THEME_NAME-theme .md-thumb-text {  color: '{{accent-contrast}}'; }md083fork-slider.md-THEME_NAME-theme.md-warn .md-track.md-track-fill {  background-color: '{{warn-color}}'; }md083fork-slider.md-THEME_NAME-theme.md-warn .md-thumb:after {  border-color: '{{warn-color}}';  background-color: '{{warn-color}}'; }md083fork-slider.md-THEME_NAME-theme.md-warn .md-sign {  background-color: '{{warn-color}}'; }  md083fork-slider.md-THEME_NAME-theme.md-warn .md-sign:after {    border-top-color: '{{warn-color}}'; }md083fork-slider.md-THEME_NAME-theme.md-warn .md-thumb-text {  color: '{{warn-contrast}}'; }md083fork-slider.md-THEME_NAME-theme.md-primary .md-track.md-track-fill {  background-color: '{{primary-color}}'; }md083fork-slider.md-THEME_NAME-theme.md-primary .md-thumb:after {  border-color: '{{primary-color}}';  background-color: '{{primary-color}}'; }md083fork-slider.md-THEME_NAME-theme.md-primary .md-sign {  background-color: '{{primary-color}}'; }  md083fork-slider.md-THEME_NAME-theme.md-primary .md-sign:after {    border-top-color: '{{primary-color}}'; }md083fork-slider.md-THEME_NAME-theme.md-primary .md-thumb-text {  color: '{{primary-contrast}}'; }md083fork-slider.md-THEME_NAME-theme[disabled] .md-thumb:after {  border-color: '{{foreground-3}}'; }md083fork-slider.md-THEME_NAME-theme[disabled]:not(.md-min) .md-thumb:after {  background-color: '{{foreground-3}}'; }md083fork-tabs.md-THEME_NAME-theme .md-header {  background-color: transparent; }md083fork-tabs.md-THEME_NAME-theme .md-paginator md083fork-icon {  color: '{{primary-color}}'; }md083fork-tabs.md-THEME_NAME-theme.md-accent .md-header {  background-color: '{{accent-color}}'; }md083fork-tabs.md-THEME_NAME-theme.md-accent md083fork-tab:not([disabled]) {  color: '{{accent-100}}'; }  md083fork-tabs.md-THEME_NAME-theme.md-accent md083fork-tab:not([disabled]).active {    color: '{{accent-contrast}}'; }md083fork-tabs.md-THEME_NAME-theme.md-primary .md-header {  background-color: '{{primary-color}}'; }md083fork-tabs.md-THEME_NAME-theme.md-primary md083fork-tab:not([disabled]) {  color: '{{primary-100}}'; }  md083fork-tabs.md-THEME_NAME-theme.md-primary md083fork-tab:not([disabled]).active {    color: '{{primary-contrast}}'; }md083fork-tabs.md-THEME_NAME-theme.md-primary md083fork-tab {  color: '{{primary-100}}'; }  md083fork-tabs.md-THEME_NAME-theme.md-primary md083fork-tab[disabled] {    color: '{{foreground-3}}'; }  md083fork-tabs.md-THEME_NAME-theme.md-primary md083fork-tab:focus {    color: '{{primary-contrast}}';    background-color: '{{primary-contrast-0.1}}'; }  md083fork-tabs.md-THEME_NAME-theme.md-primary md083fork-tab.active {    color: '{{primary-contrast}}'; }  md083fork-tabs.md-THEME_NAME-theme.md-primary md083fork-tab .md-ripple-container {    color: '{{primary-contrast}}'; }md083fork-tabs.md-THEME_NAME-theme.md-warn .md-header {  background-color: '{{warn-color}}'; }md083fork-tabs.md-THEME_NAME-theme.md-warn md083fork-tab:not([disabled]) {  color: '{{warn-100}}'; }  md083fork-tabs.md-THEME_NAME-theme.md-warn md083fork-tab:not([disabled]).active {    color: '{{warn-contrast}}'; }md083fork-tabs.md-THEME_NAME-theme md083fork-tabs-ink-bar {  color: '{{accent-color}}';  background: '{{accent-color}}'; }md083fork-tabs.md-THEME_NAME-theme md083fork-tab {  color: '{{foreground-2}}'; }  md083fork-tabs.md-THEME_NAME-theme md083fork-tab[disabled] {    color: '{{foreground-3}}'; }  md083fork-tabs.md-THEME_NAME-theme md083fork-tab:focus {    color: '{{foreground-1}}'; }  md083fork-tabs.md-THEME_NAME-theme md083fork-tab.active {    color: '{{primary-color}}'; }  md083fork-tabs.md-THEME_NAME-theme md083fork-tab .md-ripple-container {    color: '{{accent-100}}'; }md083fork-input-group.md-THEME_NAME-theme input, md083fork-input-group.md-THEME_NAME-theme textarea {  text-shadow: '{{foreground-shadow}}'; }  md083fork-input-group.md-THEME_NAME-theme input::-webkit-input-placeholder, md083fork-input-group.md-THEME_NAME-theme input::-moz-placeholder, md083fork-input-group.md-THEME_NAME-theme input:-moz-placeholder, md083fork-input-group.md-THEME_NAME-theme input:-ms-input-placeholder, md083fork-input-group.md-THEME_NAME-theme textarea::-webkit-input-placeholder, md083fork-input-group.md-THEME_NAME-theme textarea::-moz-placeholder, md083fork-input-group.md-THEME_NAME-theme textarea:-moz-placeholder, md083fork-input-group.md-THEME_NAME-theme textarea:-ms-input-placeholder {    color: '{{foreground-3}}'; }md083fork-input-group.md-THEME_NAME-theme label {  text-shadow: '{{foreground-shadow}}';  color: '{{foreground-3}}'; }md083fork-input-group.md-THEME_NAME-theme input, md083fork-input-group.md-THEME_NAME-theme textarea {  color: '{{foreground-1}}';  border-color: '{{foreground-4}}'; }md083fork-input-group.md-THEME_NAME-theme.md-input-focused input, md083fork-input-group.md-THEME_NAME-theme.md-input-focused textarea {  border-color: '{{primary-500}}'; }md083fork-input-group.md-THEME_NAME-theme.md-input-focused label {  color: '{{primary-500}}'; }md083fork-input-group.md-THEME_NAME-theme.md-input-focused.md-accent input, md083fork-input-group.md-THEME_NAME-theme.md-input-focused.md-accent textarea {  border-color: '{{accent-500}}'; }md083fork-input-group.md-THEME_NAME-theme.md-input-focused.md-accent label {  color: '{{accent-500}}'; }md083fork-input-group.md-THEME_NAME-theme.md-input-has-value:not(.md-input-focused) label {  color: '{{foreground-2}}'; }md083fork-input-group.md-THEME_NAME-theme .md083fork-input[disabled] {  border-bottom-color: '{{foreground-4}}';  color: '{{foreground-3}}'; }md083fork-toast.md-THEME_NAME-theme {  background-color: '{{foreground-1}}';  color: '{{background-50}}'; }  md083fork-toast.md-THEME_NAME-theme .md083fork-button {    color: '{{background-50}}'; }    md083fork-toast.md-THEME_NAME-theme .md083fork-button.md-highlight {      color: '{{primary-A200}}'; }      md083fork-toast.md-THEME_NAME-theme .md083fork-button.md-highlight.md-accent {        color: '{{accent-A200}}'; }      md083fork-toast.md-THEME_NAME-theme .md083fork-button.md-highlight.md-warn {        color: '{{warn-A200}}'; }"); 
})();