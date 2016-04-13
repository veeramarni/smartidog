/**
 * Created by veeramarni on 1/21/16.
 */
angular
    .module('SmartiDog')
    .directive('chatMessage', chatMessage);

function chatMessage(){
    function chatMessageCtrl($scope, Fw7Service){

        $scope.photoBrowserStandalone = photoBrowserStandalone;
        $scope.getImageUrl = getImageUrl;

        $scope.helpers({
            images(){
                return Images.find({chatId: $scope.chatId}, { sort: { uploadedAt: 1}});
            }
        });

        // Methods
        function photoBrowserStandalone(id) {
            var index = lodash.findIndex($scope.images, '_id', id);
            if (index < 0) {
                log("Error: PhotoBrowserStandalone, couldn't find the image index");
                return;
            }
            Fw7Service.photoBrowserStandalone(getAllImages(), index);
        }
        function getAllImages() {
            return function () {
                imagesUrl = [];
                _.each($scope.images, function (val, no) {
                    imagesUrl.push(val.url({store:'mobile'}));
                });
                return imagesUrl;
            }
        }
        function getImageUrl(id) {
            if (!id) {
                return;
            }
            var img = Images.findOne({_id: id, chatId: $scope.chatId});
            return img ? img.url() : '';
        }
    }
    return {
        restrict: 'E',
        scope: true,
        replace: true,
        templateUrl: 'client/templates/chats/message/message.html',
        scope: {
            message: "=",
            chatId: "@"
        },
        controller: chatMessageCtrl
    }
}

