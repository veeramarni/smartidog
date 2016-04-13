angular
    .module('SmartiDog')
    .controller('ChatsCtrl', ChatsCtrl);

function ChatsCtrl($scope, $reactive, NewChat, ContactsService) {
  $reactive(this).attach($scope);

  var self = this;
  this.showNewChatModal = showNewChatModal;
  this.subscribe('contactsChecks');
  this.remove = remove;
  this.getBadgeCount = getBadgeCount;
  this.badgesCount = 0;

  this.helpers({
    data() {
      return Chats.find();
    },
    notification(){
      return NotificationHistory.find();
    },
    contactsCheck(){
      var check = ContactsChecks.findOne({contactsCheck: true});
      return check === undefined ?  false : check.contactsCheck;
    }
  });

  init();


  /**
   * Notify the dev team about this issue
   */
  self.autorun(function () {
    self.badgesCount = getAllBadgesCount();
    console.log("Badge count" + self.badgesCount);
  })

  function init() {
    checkConnections();
  }

  ////////////

  function checkConnections() {
    if (!self.contactsCheck) {
      // get all the contacts
      ContactsService.getAllContacts().then(function (contacts) {
        Meteor.call('createContacts', contacts, function (err, data) {
          if (err) {
            console.log("Creating contacts failed due to " + err.error);
            return;
          }
          Meteor.call('createConnections', function (err, data) {
            console.log("Connections created");
          })

        })
      }, function(err){
        log.debug("No contacts found!");
        Meteor.call('getEnvironment', function(err, data){
          if(data === "development"){
            log.debug("Creating dummy connection as it is in development environment");
            Meteor.call('createDummyConnection');
          }
        })
      })
    }
    else {
      alert("Connections exist so not checking");
    }
  }

  function getBadgeCount(chatId) {
    if (!chatId) {
      return;
    }
    let data = NotificationHistory.findOne({chatId: chatId});
    var ret = data ? data.badges !== 0 ? data.badges : '' : ''
    return ret;
  }

  function getAllBadgesCount() {
    let data = NotificationHistory.find().fetch();
    let sum = 0;
    _.each(data, function (item, no) {
      sum = sum + item.badges;
    })
    console.log("Getting the sum :" + sum);
    return sum;
  }

  function showNewChatModal() {
    NewChat.showModal();
  }

  function remove(chat) {
    console.log("Remove chat with chat id " + chat._id);
    Meteor.call('removeChat', chat._id);
  }
}