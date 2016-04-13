angular
    .module('SmartiDog')
    .factory('Fw7Service', Fw7Service);


function Fw7Service(){

    function photoBrowserStandalone(images, index){
        var myApp = new Framework7({
            init: false // IMPORTANT - just do it
        });
        // Add view
        var mainView = myApp.addView('.view-main', {
            // Because we use fixed-through navbar we can enable dynamic navbar
            dynamicNavbar: true
        });
        var myPhotoBrowserStandalone = myApp.photoBrowser({
            type: 'standalone',
            theme: 'light',
            photos: images,
            initialSlide: index,
            onClose: function(pb){
                myApp = undefined;
                //note: modified close() method to close(e) to add e.preventDefault();
            }
        });
        myPhotoBrowserStandalone.open();
    }

return {
    photoBrowserStandalone: photoBrowserStandalone
}


}

