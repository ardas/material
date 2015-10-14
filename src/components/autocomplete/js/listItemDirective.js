(function () {
  'use strict';
  angular
      .module('material.083fork.components.autocomplete')
      .directive('mdAutocompleteListItem', MdAutocompleteListItem);

  function MdAutocompleteListItem ($compile, $md083forkUtil) {
    return {
      require: '^?mdAutocomplete',
      terminal: true,
      link: link,
      scope: false
    };
    function link (scope, element, attr, ctrl) {
      var newScope = ctrl.parent.$new(false, ctrl.parent),
          itemName = ctrl.scope.$eval(attr.mdAutocompleteListItem);
      newScope[itemName] = scope.item;
      $compile(element.contents())(newScope);
      element.attr({ 'role': 'option', 'id': 'item_' + $md083forkUtil.nextUid() });
    }
  }
})();
