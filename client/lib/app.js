angular
    .module('SmartiDog', [
        'angular-meteor',
        'angular-meteor.auth',
        'ionic',
        'angularMoment',
        'ngCordova',
        'infinite-scroll'
    ]);

if (Meteor.isCordova) {
    angular.element(document).on('deviceready', onReady);
}
else {
    angular.element(document).ready(onReady);
}

function onReady() {
    angular.bootstrap(document, ['SmartiDog']);
    if (Meteor.isCordova) {
        if (cordova && cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    }
}
