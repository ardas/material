angular.module('dialogDemo1', ['ngMaterial'])

.controller('AppCtrl', function($scope, $md083forkDialog) {
  $scope.alert = '';

  $scope.showAlert = function(ev) {
    $md083forkDialog.show(
      $md083forkDialog.alert()
        .title('This is an alert title')
        .content('You can specify some description text in here.')
        .ariaLabel('Password notification')
        .ok('Got it!')
        .targetEvent(ev)
    );
  };

  $scope.showConfirm = function(ev) {
    var confirm = $md083forkDialog.confirm()
      .title('Would you like to delete your debt?')
      .content('All of the banks have agreed to forgive you your debts.')
      .ariaLabel('Lucky day')
      .ok('Please do it!')
      .cancel('Sounds like a scam')
      .targetEvent(ev);

    $md083forkDialog.show(confirm).then(function() {
      $scope.alert = 'You decided to get rid of your debt.';
    }, function() {
      $scope.alert = 'You decided to keep your debt.';
    });
  };

  $scope.showAdvanced = function(ev) {
    $md083forkDialog.show({
      controller: DialogController,
      templateUrl: 'dialog1.tmpl.html',
      targetEvent: ev,
    })
    .then(function(answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.alert = 'You cancelled the dialog.';
    });
  };
});

function DialogController($scope, $md083forkDialog) {
  $scope.hide = function() {
    $md083forkDialog.hide();
  };

  $scope.cancel = function() {
    $md083forkDialog.cancel();
  };

  $scope.answer = function(answer) {
    $md083forkDialog.hide(answer);
  };
}
