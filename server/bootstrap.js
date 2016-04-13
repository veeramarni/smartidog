Meteor.startup(function () {

    if (bjse.util.isDevelopment()) {
        var user1 = Meteor.users.findOne({'phone.number': '+972501214567'});
        if (!user1) {
            Accounts.createUserWithPhone({
                phone: '+972501214567',
                profile: {
                    name: 'My friend 1'
                }
            });
        }
        var user2 = Meteor.users.findOne({'phone.number': '+972501334568'});
        if (!user2) {
            Accounts.createUserWithPhone({
                phone: '+972501334568',
                profile: {
                    name: 'My friend 2'
                }
            });
        }
        var user3 = Meteor.users.findOne({'phone.number': '+972501734569'});
        if (!user3) {
            Accounts.createUserWithPhone({
                phone: '+972501734569',
                profile: {
                    name: 'My friend 3'
                }
            });
        }

    }

});
