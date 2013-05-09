/*global console, define*/
define([
        "infrastructure/LogServices",
        'models/MediaModels',
        'infrastructure/MediaServicesFromImdbApiOrg',
        'infrastructure/MediaServicesFromTheMovieDbOrg'
],
    function (logServices, mediaModels, mediaServicesFromImdbApiOrg, mediaServicesFromTheMovieDbOrg) {
        log();

        var self = this;
        //self.mediaSservices = mediaServicesFromImdbApiOrg;
        self.mediaSservices = mediaServicesFromTheMovieDbOrg;

        self.searchByTitle = function (title) {
            log("searchByTitle(title: " + title + ")");
            var promise = $.Deferred();
            self.mediaSservices.searchByTitle(title)
                .then(handleResponse)
                .fail(handleResponseFailure);

            return promise;

            //#region Internal Methods

            function handleResponse(responses) {
                log("searchByTitle(title: " + title + ").handleResponse(responses: " + responses + ")");
                log(responses);
                //value = _(value).map(mediaModels.mapToPartialVideo);
                promise.resolve(responses);
            }

            function handleResponseFailure() { promise.reject(arguments); }

            //#endregion
        };

        self.getDetailsById = function (id) {
            log("getDetailsById(id: " + id + ")");
            var promise = $.Deferred();
            self.mediaSservices.getDetailsById(id)
                .then(handleResponse)
                .fail(handleResponseFailure);

            return promise;

            function handleResponse(response) {
                log("getDetailsById(id: " + id + ").handleResponse(response: " + response + ")");
                log(response);

                //value = mediaModels.mapToVideo(value);
                promise.resolve(response);
            }

            function handleResponseFailure() { promise.reject(arguments); }
        };

        return {
            searchByTitle: self.searchByTitle,
            getDetailsById: self.getDetailsById
        };

        //#region Internal Methods

        //#endregion

        function log(message, title) { logServices.log(message, title, "/app/infrastructure/MediaServices"); }
    }
);