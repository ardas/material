
angular.module('sidenavDemo1', ['ngMaterial'])

.controller('AppCtrl', function($scope, $timeout, $md083forkSidenav, $log) {
  $scope.toggleLeft = function() {
    $md083forkSidenav('left').toggle()
                      .then(function(){
                          $log.debug("toggle left is done");
                      });
  };
  $scope.toggleRight = function() {
    $md083forkSidenav('right').toggle()
                        .then(function(){
                          $log.debug("toggle RIGHT is done");
                        });
  };
})

.controller('LeftCtrl', function($scope, $timeout, $md083forkSidenav, $log) {
  $scope.close = function() {
    $md083forkSidenav('left').close()
                      .then(function(){
                        $log.debug("close LEFT is done");
                      });

  };
})

.controller('RightCtrl', function($scope, $timeout, $md083forkSidenav, $log) {
  $scope.close = function() {
    $md083forkSidenav('right').close()
                        .then(function(){
                          $log.debug("close RIGHT is done");
                        });
  };
});
