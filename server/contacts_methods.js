/**
 * Created by veeramarni on 12/21/15.
 */
Meteor.methods({
    createConnections: function () {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in',
                'Must be logged in to update contacts')
        }
        var userId = this.userId;

        var connectionExist = Connections.findOne({userId: userId});
        log.debug("Is connections for userId %s exist in database ? %s", userId, !!connectionExist);

        if (connectionExist) {
            // temporarily remove to add new connections
            Connections.remove({'userId': userId})
        }

        var userContacts = Contacts.findOne({'userId': userId}, {
            fields: {
                "contacts.name": 1,
                "contacts.phoneNumbers": 1
            }
        });

        if (!userContacts && !(userContacts.contacts && userContacts.contacts[0].name)) {
            throw new Meteor.Error('no-contacts-found', "User doesn't have contacts to find connections");
        }
        var formattedContacts = {}, formattedPhoneNos = [];

        _.each(userContacts.contacts, function (value, key, list) {
            //convert the phone numbers to E164format
            var phns = value.phoneNumbers;
            _.each(phns, function (phn) {
                if (phn.value !== undefined) {
                    var phE164format = bjse.api.phone.parsePhone({'phone': phn.value}),
                        key = phE164format.phone,
                        map = {};
                    map[key] = {
                        name: value.name.formatted || value.name.givenName + " " + value.name.familyName,
                        displayName: value.displayName,
                        type: phn.type,
                        isMobile: phE164format.isMobile
                    };
                    _.extend(formattedContacts, map);
                    formattedPhoneNos.push(key);
                }
            })
        });
        log.debug("Contacts found for the user are ", formattedPhoneNos);
        // adding the self phone number to make sure the result is not null at match step
        var personalNo = Meteor.user().phone.number;
        formattedPhoneNos.push(Meteor.user().phone.number);

        if (!bjse.util.isProduction()) {
            // Add admins for testing pupose
            formattedPhoneNos.push('987654321', '123456789');
            _.extend(formattedContacts, {'987654321': {name: 'IOSSimAmin', type: 'mobile'}});
            _.extend(formattedContacts, {'123456789': {name: 'WebOsAdmin', type: 'mobile'}});
        }
        log.debug(formattedContacts);
        var results = Meteor.users.aggregate([
            {
                '$match': {
                    'phone.number': {'$in': formattedPhoneNos}
                }
            },
            {
                '$group': {
                    '_id': null,
                    'phones': {'$push': '$phone.number'},
                    'phoneFoundDetails': {
                        '$push': {
                            '_id': '$_id',
                            'phone': '$phone.number',
                            'verified': '$phone.verified'
                        }
                    }
                }
            }, {
                '$project': {
                    'notFound': {
                        '$setDifference': [formattedPhoneNos, '$phone']
                    },
                    'phoneFoundDetails': 1
                }
            }
        ]);
        log.debug("Connections to upload the database ", results);
        _.each(results, function (doc) {
            var subDocument = [];
            if (doc.notFound)
                _.each(doc.notFound, function (no) {
                    if (formattedContacts[no].isMobile) {
                        subDocument.push({
                            'phoneNo': no,
                            'name': formattedContacts[no].name,
                            'type': formattedContacts[no].type,
                            'verified': false
                        })
                    }
                });
            if (doc.phoneFoundDetails)
                _.each(doc.phoneFoundDetails, function (user) {
                    var no = user.phone;
                    if (no !== personalNo) {
                        subDocument.push({
                            'userId': user._id,
                            'phoneNo': no,
                            'name': formattedContacts[no].name,
                            'type': formattedContacts[no].type,
                            'verified': user.isVerified || false
                        })
                    }

                });
            Connections.insert({'userId': userId, 'contacts': subDocument});
        })
    },


    createContacts: function (contacts) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in',
                'Must be logged in to update contacts')
        }
        var userId = this.userId, contactsExist = Contacts.findOne({userId: userId});
        log.debug("Is contacts for userId %s exist in database ? %s", userId, !!contactsExist);

        if (contactsExist) {
            // Drop the contacts
            Contacts.remove({'userId': userId}, function () {
                ContactsChecks.update({'userId': userId}, {'userId': userId, contactsCheck: false}, {upsert: true});
            });

        }
        Contacts.insert({'userId': userId, 'contacts': contacts}, function () {
            ContactsChecks.update({'userId': userId}, {'userId': userId, contactsCheck: true}, {upsert: true});
        });

        return true;
    },

    createDummyConnection: function () {
        if (!this.userId && !bjse.util.isDevelopment()) {
            throw new Meteor.Error('not-allowed',
                'This method is not allowed')
        }
        var userId = this.userId;

        if(!Connections.findOne({userId: userId})){
            log.debug("Creating dummy connection for userId ", userId);
            var user1 = Meteor.users.findOne({'phone.number': '+972501214567'});
            var user2 = Meteor.users.findOne({'phone.number': '+972501334568'});
            var user3 = Meteor.users.findOne({'phone.number': '+972501734569'});
            var user1Contact = {
                userId: user1._id,
                phoneNo: user1.phone.number,
                name: user1.profile.name,
                type: "mobile",
                verified: true
            };
            var user2Contact = {
                userId: user2._id,
                phoneNo: user2.phone.number,
                name: user2.profile.name,
                type: "mobile",
                verified: true
            };
            var user3Contact = {
                userId: user3._id,
                phoneNo: user3.phone.number,
                name: user3.profile.name,
                type: "mobile",
                verified: true
            }
            var contacts = [];
            contacts.push(user1Contact);
            contacts.push(user2Contact);
            contacts.push(user3Contact);
            Connections.insert({
                userId: userId,
                contacts: contacts
            })
        }

    }
});