(function() {
'use strict';

/*
 * @ngdoc module
 * @name material.components.backdrop
 * @description Backdrop
 */

/**
 * @ngdoc directive
 * @name mdBackdrop
 * @module material.components.backdrop
 *
 * @restrict E
 *
 * @description
 * `<md-backdrop>` is a backdrop element used by other coponents, such as dialog and bottom sheet.
 * Apply class `opaque` to make the backdrop use the theme backdrop color.
 *
 */

angular.module('material.083fork.components.backdrop', [
  'material.083fork.core'
])
  .directive('mdBackdrop', BackdropDirective);

function BackdropDirective($mdTheming) {
  return $mdTheming;
}
})();
