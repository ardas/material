
angular.module('toastDemo1', ['ngMaterial'])

.controller('AppCtrl', function($scope, $md083forkToast, $animate) {

  $scope.toastPosition = {
    bottom: false,
    top: true,
    left: false,
    right: true
  };

  $scope.getToastPosition = function() {
    return Object.keys($scope.toastPosition)
      .filter(function(pos) { return $scope.toastPosition[pos]; })
      .join(' ');
  };

  $scope.showCustomToast = function() {
    $md083forkToast.show({
      controller: 'ToastCtrl',
      templateUrl: 'toast-template.html',
      hideDelay: 6000,
      position: $scope.getToastPosition()
    });
  };

  $scope.showSimpleToast = function() {
    $md083forkToast.show(
      $md083forkToast.simple()
        .content('Simple Toast!')
        .position($scope.getToastPosition())
        .hideDelay(3000)
    );
  };

  $scope.showActionToast = function() {
    var toast = $md083forkToast.simple()
          .content('Action Toast!')
          .action('OK')
          .highlightAction(false)
          .position($scope.getToastPosition());

    $md083forkToast.show(toast).then(function() {
      alert('You clicked \'OK\'.');
    });
  };

})

.controller('ToastCtrl', function($scope, $md083forkToast) {
  $scope.closeToast = function() {
    $md083forkToast.hide();
  };
});
