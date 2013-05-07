require.config({
    urlArgs: "noCache=" + (new Date()).getTime()// This prevents caching -- it is useful for debugging, but can be turned off for production
});

define(['viewmodels/MediaViewModel'], function (mediaViewModel) {
    console.log("/app/main-for-mediaviewmodel.js");

    ko.applyBindings(mediaViewModel);
});