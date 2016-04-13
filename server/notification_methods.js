/**
 * Created by veeramarni on 12/18/15.
 */
Meteor.methods({

    pushNotificationForOfflineUsers(messageId){
        check(messageId, String);

        if (!this.userId) {
            throw new Meteor.Error('not-logged-in',
                'Must be logged in to push notification.');
        }
        let userId = this.userId;
        // placeholder for callback
        var callback = undefined;

        // get the message detail
        var message = Messages.findOne({_id: messageId});
        // get the chat users related to the message
        var chatData = Chats.findOne({_id: message.chatId}, {userIds: 1, badges: 1});
        var otherUsers = _.without(chatData.userIds, this.userId);

        log.debug("Prining otherUsers %s ", otherUsers);
        var name = Meteor.users.findOne(userId).profile.name;
        log.debug("Name of the user who is sending message", name);
        // get the offlineUsers which need push notification
        Meteor.users.aggregate([
            {
                '$match': {
                    _id: {'$in': otherUsers},
                    'status.online': false
                }
            },
            {
                '$group': {_id: null, 'offlineUsers': {'$push': '$_id'}}
            },
            {'$match': {'offlineUsers.0': {'$exists': true}}}
        ]).forEach(function (doc) {
            var dataSend = message.type === 'text' ? ":" + message.data : 'sent you a image';
            log.debug("Pushing notification [%s] to offline users ", dataSend, doc.offlineUsers);
            callback = function () {
                Push.send({
                    from: name,
                    title: message.type,
                    text: name + ' ' + dataSend,
                    query: {userId: {'$in': doc.offlineUsers}}
                })
            }

            _.each(doc.offlineUsers, function(val, no){

                let badges = 0;
                let notificationExist = NotificationHistory.findOne({userId: val, chatId: message.chatId}, {badges: 1});
                if (notificationExist) {
                    badges = notificationExist.badges || 0;
                }
                badges = badges + 1;
                log.debug(" Each loop val", val);
                var notify = {
                    chatId: message.chatId,
                    userId: val,
                    badges: badges
                }
                if (notificationExist) {
                    NotificationHistory.update({
                        userId: notify.userId,
                        chatId: notify.chatId
                    }, {$set: {badges: notify.badges}}, callback);
                } else {
                    NotificationHistory.insert(notify, callback);
                }
            })


        })
    },

    clearBadgeCount(chatId){
        check(chatId, String);
        if(!this.userId){
            throw new Meteor.Error('not-logged-in',
            'Must be logged in to get badge count.');
        }
        NotificationHistory.update({userId: this.userId, chatId: chatId}, {$set : {badges: 0}});
    },

    markRead(notif) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in',
                'Must be logged in to send message.');
        }

        // console.log('mark as read click') // for testing
        return NotificationHistory.update({
            '_id': notif._id
        }, {
            $addToSet: {
                'dismissals': this.userId
            }
        })
    },
    alertCount(){
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in',
                'Must be logged in to send message.');
        }

        if (this.userId) {
            return NotificationHistory.find({
                'expiration': {
                    $gt: new Date()
                },
                'dismissals': {
                    $nin: [this.userId]
                }
            }, {
                'limit': 5,
                sort: {
                    'addedAt': 1
                }
            }).count()
        } else {
            return NotificationHistory.find({
                'expiration': {
                    $gt: new Date()
                },
            }, {
                'limit': 5,
                sort: {
                    'addedAt': 1
                }
            }).count()
        }

    },
    registerClick(notif) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in',
                'Must be logged in to send message.');
        }
        // console.log('notification click') // for testing
        return NotificationHistory.update({
            '_id': notif._id
        }, {
            $addToSet: {
                'clicks': this.userId
            }
        })
    }
});