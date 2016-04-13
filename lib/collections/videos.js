if (Meteor.isServer) {
    /**
     * To Store Videos
     */
    var videoStore = new FS.Store.S3("videos", {
        /* OPTIONAL IN MOST CASES
         region: "eu-west-1", // substitute the region you selected
         */
        /* REQUIRED */
        accessKeyId: Meteor.settings.private.S3.AWSAccessKeyId,
        secretAccessKey: Meteor.settings.private.S3.AWSSecretAccessKey,
        bucket: Meteor.settings.private.S3.AWSBucket
    });
}
if(Meteor.isClient){
    /**
     * To Store Videos
     */
    var videoStore = new FS.Store.S3("videos");
    //var videoThumbs = new FS.Store.FileSystem("videothumbs", { path: "~/uploads/videothumbs"});
}

var videoThumbs = new FS.Store.FileSystem("videothumbs", {path: "~/uploads/videothumbs"});
Videos = new FS.Collection("Videos", {
    stores: [videoThumbs],
    //filter: {
    //    allow: {
    //        contentTypes: ['video/*']
    //    }
    //},
    onInvalid: function (message) {
        if (Meteor.isClient) {
            alert("Video insert failed");
        } else {
            log.error(message);
        }
    }

});

Videos.allow({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    },
    download: function () {
        return true;
    }
});
