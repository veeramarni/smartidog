/**
 * Created by veeramarni on 12/20/15.
 */
angular
    .module('SmartiDog')
    .service('ContactsService', ContactsService);

function ContactsService($q, $cordovaContacts) {

    var formatContact = function (contact) {
        return {
            "displayName": contact.name.formatted || contact.name.givenName + " " + contact.name.familyName || "Unknown",
            "emails": contact.emails || [],
            "phones": contact.phoneNumbers || [],
            "photos": contact.photos || []
        };
    };

    var pickContact = function () {
        var deferred = $q.defer();

        if (!Meteor.isCordova) {
            deferred.reject("Bummer. No contacts in desktop browser");
            return deferred.promise;
        }
        $cordovaContacts.pickContact().then(function (contact) {
            deferred.resolve(formatContact(contact));
        }, function (err) {
            deferred.reject("Error in picking contact");
        });
        return deferred.promise;
    };

    var getAllContacts = function () {
            var deferred = $q.defer();
            var options = {};
            options.multiple = true;
            if (!Meteor.isCordova) {
                deferred.reject("Bummer. No contacts in desktop browser");
                return deferred.promise;
            }
            $cordovaContacts.find(options).then(function (allContacts) {
                deferred.resolve(allContacts);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }
        ;

    var addContact = function () {
        var deferred = $q.defer();
        if (!Meteor.isCordova) {
            deferred.reject("Bummer. No contacts in desktop browser");
            return deferred.promise;
        }
        $cordovaContacts.save(contactForm).then(function (result) {
            deferred.resolve();
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    return {
        pickContact: pickContact,
        getAllContacts: getAllContacts,
        addContact: addContact
    }

}