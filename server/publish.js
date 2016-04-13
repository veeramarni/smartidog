Meteor.publish('connections', function () {
    return Connections.find({userId: this.userId});
});

Meteor.publish('contactsChecks', function () {
    return ContactsChecks.find({userId: this.userId});
});

Meteor.publish('images', function (limit) {
    if (!this.userId) return;
    check(limit, Number);

    return Images.find({}, {
        limit: limit
    });
});

Meteor.publish('users', function () {
    return Meteor.users.find({}, {fields: {profile: 1}});
});

Meteor.publish('notificationHistory', function () {
    return NotificationHistory.find({userId: this.userId});
});

Meteor.publishComposite('chats', function (limit) {
    if (!this.userId) return;
    check(limit, Number);
    return {
        find() {
            return Chats.find({userIds: this.userId});
        },
        children: [
            {
                find(chat) {
                    return Messages.find({chatId: chat._id}, {
                        sort: {
                            'timestamp': -1
                        },
                        limit: limit
                    });
                },
                children: [
                    {
                        find(message){
                            if (message.type === 'picture') {
                                var query = {'_id': message.data};
                                return Images.find(query);
                            }
                        }
                    }
                ]
            },
            {
                find(chat) {
                    let query = {_id: {$in: chat.userIds}};
                    let options = {fields: {profile: 1}};

                    return Meteor.users.find(query, options);
                }
            }
        ]
    };
});

