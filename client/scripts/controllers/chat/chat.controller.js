angular
    .module('SmartiDog')
    .controller('ChatCtrl', ChatCtrl);

function ChatCtrl($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, $log) {
  $reactive(this).attach($scope);

  let chatId = $stateParams.chatId;
  this.chatId = chatId;
  let isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
  var self = this;
  this.noMoreItemsAvailable = false;
  this.items = [];
  /*****************************
   *
   * Methods
   */
  this.sendMessage = sendMessage;
  this.inputUp = inputUp;
  this.inputDown = inputDown;
  this.closeKeyboard = closeKeyboard;
  this.sendPicture = sendPicture;
  this.captureVideo = captureVideo;
  this.loadMore = loadMore;
  // clear badges
  clearBadges();


  /******************************
   *  Helpers
   ******************************/

  this.helpers({
    messages() {
      return Messages.find({chatId: chatId}, { sort: { timestamp: 1}});
    },
    data() {
      return Chats.findOne(chatId);
    }
  });


  $scope.$watchCollection('chat.messages', (oldVal, newVal) => {
    let animate = oldVal.length !== newVal.length;
    $ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(animate);
  });

  ////////////

  function captureVideo() {
    var options = {limit: 3, duration: 50};
    alert("In Capture Video");

    return MeteorMedia.captureVideo(options,  (err, data) => {
      //if (err && err.error == 'cancel') return;
      if (err) {
        // An error occurred. Show a message to the user
        alert("Video capture failed!" + err.error);
        return;
      }
      log.info("Getting video file properties" );
      log.debug("Video File " + JSON.stringify(data));
      var newFile = new FS.File(data);
      newFile.ownerId = Meteor.userId();
      newFile.chatId = chatId;
      //if(!newFile.type){
      //    newFile.type = "video/*";
      //}
      Videos.insert(newFile, function (err, fileObj) {
        if (err) {
          alert("Video insert failed!" + err);
          return;
        }
        callMessage('video', fileObj._id);
      })
    })
  }

  function captureAudio() {
    var options = {limit: 3, duration: 10};

    MeteorMedia.captureAudio(options).then(function (audioData) {
      // Success! Audio data is herfe
    }, function (err) {
      // An error occurred. SHow a message to the user
    })
  }

  function clearBadges() {
    Meteor.call('clearBadgeCount', chatId);
  }


  function sendPicture() {
    MeteorMedia.getPicture({quality: 100}, (err, data) => {
      if (err && err.error == 'cancel') return;
      if (err) return handleError(err);
      var newFile = new FS.File(data);
      newFile.fileName = Meteor.uuid();
      newFile.ownerId = Meteor.userId();
      newFile.chatId = chatId;
      Images.insert(newFile, function (err, fileObj) {
        if (err) {
          alert("Image insert failed!");
          return;
        }
        callMessage('picture', fileObj._id);
      })

    });
  }

  function handleError(err) {
    $log.error('profile save error ', err);
    $ionicPopup.alert({
      title: err.reason || 'Save failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
    });
  }

  function sendMessage() {
    if (_.isEmpty(this.message)) return;
    callMessage('text');
    delete this.message;
  }

  function callMessage(type, data) {
    Meteor.call('newMessage', {
      data: type === 'text' ? self.message : data,
      type: type,
      chatId: chatId
    }, function (err, messageId) {
      if (err) {
        return;
      }
      Meteor.call('pushNotificationForOfflineUsers', messageId);
    });
  }

  function loadMore(){
    console.log("Load more triggered");
    if (typeof $scope.collection !== 'undefined') {
      var scrollBefore = document.getElementById('content').scrollHeight;
      // hide the finite scroll if too many and load the remaining
      if ($scope.collection.length + $scope.infiniteScrollLoadAmount > Messages.getLength()) {
        $scope.infiniteScrollPrevent = true;
        $scope.collection = Messages.getSectionReverse($scope.collection.length, Messages.getLength() - $scope.collection.length).concat($scope.collection);
      } else {
        // update data with new section
        $scope.collection = Messages.getSectionReverse($scope.collection.length, $scope.infiniteScrollLoadAmount).concat($scope.collection);
      }

      // hide loading icon
      $scope.$broadcast('scroll.refreshComplete');

      // scroll to the previous spot
      $timeout(function () {
        var scrollAfter = document.getElementById('content').scrollHeight;
        $ionicScrollDelegate.scrollTo(0, scrollAfter-scrollBefore, false);
      }, 200);
    }
   // $scope.$broadcast('scroll.infiniteScrollComplete');

  }
  function inputUp() {
    if (isIOS) {
      self.keyboardHeight = 216;
    }

    $timeout(function () {
      $ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(true);
    }, 300);
  }

  function inputDown() {
    if (isIOS) {
      self.keyboardHeight = 0;
    }

    $ionicScrollDelegate.$getByHandle('chatScroll').resize();
  }

  function closeKeyboard() {
    Meteor.isCordova && cordova.plugins.Keyboard.close();
  }
}