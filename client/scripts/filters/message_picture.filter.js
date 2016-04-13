angular
.module('SmartiDog')
.filter('messagePicture', messagePicture);


function messagePicture(){
    return function(id){
        if(!id)
        return;
        let  imgData = Images.findOne({_id: id});
        if(!imgData){
            console.log("Image not found for id " + id);
            return;
        }
        console.log("image found " + imgData.url());
        return imgData.url();
    }
}