/**
 * Created by veeramarni on 12/20/15.
 */
angular
    .module('SmartiDog')
    .controller('ContactsCtrl', ContactsCtrl);

function ContactsCtrl($scope, $reactive, ContactsService){
  $reactive(this).attach($scope);

  var self = this;
  // Adds the contacts that are picked
  this.selectedContacts = [];
  // Used for saving contacts
  this.contactForm = {};

  this.addContact = addContact;
  $scope.$on('$ionicView.enter', function() {
    // Code you want executed every time view is opened
    pickContact();
  });


  //////////

  function pickContact(){
    ContactsService.pickContact().then(function(contact){
          self.selectedContacts.push(contact);
        },
        function(failure){
          console.log("Bummer. Failed to pick a contact");
        }
    );
  }

  function addContact(){
    ContactsService.addContact(self.contactForm).then(function(){
      // Contact saved
    })
  }

}