/*global console, define*/
define(['infrastructure/MediaServicesFromImdbApiOrg'], function (mediaServicesFromImdbApiOrg) {
    console.log("/app/infrastructure/MediaServices.js");

    return {
        searchByTitle: mediaServicesFromImdbApiOrg.searchByTitle
    };
});