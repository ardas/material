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
