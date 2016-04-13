/**
 * Created by veeramarni on 12/25/15.
 */
angular
    .module('SmartiDog')
    .service('MediaService', MediaService);


function MediaService($q, $cordovaCapture){
    var captureVideo = function(){
        var options = { limit: 3, duration: 50};
        var deferred = $q.defer();
        if (!Meteor.isCordova) {
            deferred.reject("Bummer. No capture in desktop browser");
            return deferred.promise;
        }
        if(!$cordovaCapture.captureVideo){
            deferred.reject("Bummer. No capture available");
            return deferred.promise;
        }
        $cordovaCapture.captureVideo(options).then(function(videoData){
            deferred.resolve(videoData);
        }, function(err){
            // An error occurred. Show a message to the user
            deferred.reject("Video Capture failed!");
        });
        return deferred.promise;
    }

     var captureAudio = function(){
        var options = { limit: 3, duration: 10};
         var deferred = $q.defer();
         if (!Meteor.isCordova) {
             deferred.reject("Bummer. No capture in desktop browser");
             return deferred.promise;
         }
        $cordovaCapture.captureAudio(options).then(function(audioData){
            // Success! Audio data is here
            deferred.resolve(audioData);
        }, function(err){
            // An error occurred. SHow a message to the user
            deferred.reject("Audio Capture failed!");
        });
         return deferred.promise;
    }

    return {
        captureVideo: captureVideo,
        captureAudio: captureAudio
    }
}