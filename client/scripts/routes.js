angular
    .module('SmartiDog')
    .config(config);

function config($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'client/templates/layouts/tabs/tabs.html',
            resolve: {
                user: ($auth) => {
                    return $auth.requireUser();
                },
                chats: () => Meteor.subscribe('chats', 20),
                notificationHistory: () => Meteor.subscribe('notificationHistory')
            }
        })
        .state('tab.chats', {
            url: '/chats',
            views: {
                'tab-chats': {
                    templateUrl: 'client/templates/chats/chats.html',
                    controller: 'ChatsCtrl as chats'
                }
            }
        })
        .state('tab.chat', {
            url: '/chats/:chatId',
            views: {
                'tab-chats': {
                    templateUrl: 'client/templates/chats/chat/chat.html',
                    controller: 'ChatCtrl as chat'
                }
            }
        })
        .state('login', {
            url: '/login',
            templateUrl: 'client/templates/login/login.html',
            controller: 'LoginCtrl as logger'
        })
        .state('confirmation', {
            url: '/confirmation/:phone',
            templateUrl: 'client/templates/login/confirmation/confirmation.html',
            controller: 'ConfirmationCtrl as confirmation'
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'client/templates/profile/profile.html',
            controller: 'ProfileCtrl as profile',
            resolve: {
                user: ($auth) => {
                    return $auth.requireUser();
                }
            }
        })
        .state('tab.contacts', {
            url: '/contacts',
            views: {
                'tab-contacts':{
                    templateUrl: 'client/templates/contacts/contacts.html',
                    controller: 'ContactsCtrl as contacts'
                }
            }
        })
        .state('tab.settings', {
            url: '/settings',
            views: {
                'tab-settings': {
                    templateUrl: 'client/templates/settings/settings.html',
                    controller: 'SettingsCtrl as settings',
                }
            }
        });

    $urlRouterProvider.otherwise('tab/chats');
}