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

})();
