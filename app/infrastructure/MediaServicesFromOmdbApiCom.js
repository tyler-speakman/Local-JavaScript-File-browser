/*global console, define*/
define([
        "infrastructure/LogServices",
        'models/MediaModels',
        "infrastructure/AjaxQueueServices"
], function (logServices, mediaModels, ajaxQueueServices) {
    log();

    throw "Not Implemented";

    function log(message, title) { logServices.log(message, title, "/app/infrastructure/MediaServicesFromOmdbApiCom"); }
});