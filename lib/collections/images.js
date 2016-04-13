if (Meteor.isServer) {
  var createThumb = function (fileObj, readStream, writeStream) {
    // Transform the image into a 72x72px thumbnail
    readStream.pipe(imagemagick.streams.convert({
      srcData: readStream,
      width: 72,
      height: 72,
      debug: true,
      resizeStyle: 'aspectfill', // is the default, or 'aspectfit' or fill
      gravity: 'Center' // optional: position crop area when using 'aspectfill'
    }, function (err, buffer) {
      if (err) {
        log.error("CreateThumb is failed", err);
      }
      if (buffer) {
        log.debug("Thumb Image created successfully");
      }


    }).pipe(writeStream));
  };
  var createBlurImage = function (fileObj, readStream, writeStream) {
    readStream.pipe(imagemagick.streams.convert({
      srcData: readStream,
      blur: 5
    }, function (err) {
      if (err) {
        log.error("CreateBlurImage is failed", err);
      }
    }).pipe(writeStream));
  };

  var gmCreateThumb = function (fileObj, readStream, writeStream){
    gm(readStream, fileObj.name()).resize('32','32','!').stream().pipe(writeStream);
  };

  var gmCompressedSize = function (fileObj, readStream, writeStream){
    gm(readStream, fileObj.name()).resize('800','600').quality(50).stream().pipe(writeStream);
  };
  var AWSKEY = {
    /* OPTIONAL IN MOST CASES
     region: "eu-west-1", // substitute the region you selected
     */
    /* REQUIRED */
    accessKeyId: Meteor.settings.private.S3.AWSAccessKeyId,
    secretAccessKey: Meteor.settings.private.S3.AWSSecretAccessKey,
    bucket: Meteor.settings.private.S3.AWSBucket
  };
  /**
   * To Store Images
   * @type {FS.Store.S3}
   */
  var imageStore = new FS.Store.S3("images", AWSKEY);

  var thumbStore = new FS.Store.GridFS("thumbs", {transformWrite: gmCreateThumb});
  var thumbFileStore = new FS.Store.FileSystem("thumbsFile", {path: "~/uploads", transformWrite: gmCreateThumb});
  var mobileStore = new FS.Store.S3("mobile",_.extend(AWSKEY, {transformWrite: gmCompressedSize}));
}
if (Meteor.isClient) {
  /**
   * To Store Images
   * @type {FS.Store.S3}
   */
  var imageStore = new FS.Store.S3("images");
  var thumbStore = new FS.Store.GridFS("thumbs");
  var thumbFileStore = new FS.Store.FileSystem("thumbsFile");
  var mobileStore = new FS.Store.S3("mobile");
}

Images = new FS.Collection("Images", {
  stores: [thumbStore, mobileStore],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  },
  onInvalid: function (message) {
    if(Meteor.isClient){
      alert('Image Insert Failed');
    }else {
      log.error(message);
    }
  }
});

// Allow rules
Images.allow({
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
