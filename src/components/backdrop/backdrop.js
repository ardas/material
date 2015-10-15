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
})();
