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


})();
