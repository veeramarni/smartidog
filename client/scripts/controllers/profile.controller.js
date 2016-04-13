angular
    .module('SmartiDog')
    .controller('ProfileCtrl', ProfileCtrl);

function ProfileCtrl ($scope, $auth, $reactive, $state, $ionicPopup, $log, $ionicLoading) {
  $reactive(this).attach($scope);

  var currentUser = Meteor.user();
  let name = currentUser.profile ? currentUser.profile.name : '';
  this.name = name;
  this.updateName = updateName;
  this.updatePicture = updatePicture;

  ////////////

  function updatePicture () {
    MeteorMedia.getPicture({ width: 60, height: 60 }, function (err, data) {
      if (err && err.error == 'cancel') {
        return;
      }

      if (err) {
        return handleError(err);
      }

      $ionicLoading.show({
        template: 'Updating picture...'
      });

      Meteor.call('updatePicture', data, (err) => {
        $ionicLoading.hide();
        err && handleError(err);
      });
    });
  }

  function updateName () {
    if (_.isEmpty(this.name)) return;

    Meteor.call('updateName', this.name, (err) => {
      if (err) return handleError(err);
      $state.go('tab.chats');
    });
  }

  function handleError (err) {
    $log.error('profile save error ', err);

    $ionicPopup.alert({
      title: err.reason || 'Save failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
    });
  }
}