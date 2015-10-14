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

})();
