/*global console, define*/
define(
    [
        "infrastructure/LogServices",
        'models/MediaModels',
        "infrastructure/AjaxQueueServices"
    ],
    function (logServices, mediaModels, ajaxQueueServices) {
        console.log("/app/infrastructure/MediaServicesFromImdbApiOrg.js");

        var self = this;
        self.configuration = {};

        self.initialize = function () {
            var queryParameters = getDefaultQueryParameters();

            return ajaxQueueServices.append({ url: "http://api.themoviedb.org/3/configuration", data: queryParameters })
                .then(handleResponse)
                .fail(handleResponseFailure);

            //#region Internal Methods

            function handleResponse(response, statusText, jqXHR) { log(response); self.configuration = response; }

            function handleResponseFailure(jqXHR, textStatus) { logServices.error("/app/infrastructure/MediaServicesFromTheMovieDbOrg.initialize()", ""); }

            //#endregion
        };

        self.configuationPromise = self.initialize();

        return {
            searchByTitle: searchByTitle,
            getDetailsById: getDetailsById
        };

        function getDefaultQueryParameters() { return { api_key: "a9fd9d2cebb0771feb0d36a3e3b57d13" }; }

        function getDetailsById(id) {
            log("getDetailsById(id: " + id + ")");
            var queryParameters = getDefaultQueryParameters();
            queryParameters.append_to_response = "trailers";//"releases,trailers,similar_movies";

            var promise = $.Deferred();
            ajaxQueueServices.append({ url: "http://api.themoviedb.org/3/movie/" + id, data: queryParameters })
                .then(handleResponse)
                .fail(handleResponseFailure);

            return promise;
            //#region Internal Methods

            function handleResponse(response, statusText, jqXHR) {
                log("getDetailsById(id: " + id + ").handleResponse(response: " + response + ")");

                // If videos are found, then initalize standard object and map response object onto it
                response = mapToVideo(response);
                response = mediaModels.mapToVideo(response);

                promise.resolve(response);

                return response;
            }

            function handleResponseFailure(jqXHR, textStatus) {
                //throw "Failed to initialize";
                logServices.error("/app/infrastructure/MediaServicesFromTheMovieDbOrg.getById()", "Failed");
            }

            //#endregion
        }

        function searchByTitle(title) {
            log("searchByTitle(title: " + title + ")");
            var queryParameters = getDefaultQueryParameters();
            queryParameters.query = title;

            return search(queryParameters);
        }

        function search(data) {
            var promise = $.Deferred();

            // Do not make any requests until done initializing
            configuationPromise.done(function (configuration) {
                ajaxQueueServices.append({ url: "http://api.themoviedb.org/3/search/movie", data: data })
                    .then(handleResponse)
                    .fail(handleResponseFailure);
            });

            return promise;

            //#region Internal Methods

            function handleResponse(response, statusText, jqXHR) {
                log("search(..).handleResponse(response: " + response + ")");

                response = response.results;

                // If videos are found, then initalize standard object and map response object onto it
                response = _(response).map(mapToPartialVideo);
                response = _(response).map(mediaModels.mapToPartialVideo);

                promise.resolve(response);

                return response;
            }

            function handleResponseFailure(jqXHR, textStatus) {
                promise.reject([]);
            }

            //#endregion
        }

        function PartialVideo() {
            var self = this;
            self.adult = false;
            self.backdrop_path = "";
            self.id = -1;
            self.original_title = "";
            self.release_date = new Date("1900/01/01");;
            self.poster_path = "";
            self.popularity = -1.0;
            self.title = "";
            self.vote_average = -1.0;
            self.vote_count = -1;
            self.source = "themoviedb.org";
        }

        function Video() {
            var self = new PartialVideo();
        }

        function mapToPartialVideo(value) {
            value = _(new PartialVideo()).extend(value);

            var posterSizes = self.configuration.images.poster_sizes;
            value.poster = self.configuration.images.base_url + posterSizes[0] + "/" + value.poster_path;
            value.year = value.release_date.substr(0, 4);

            value.isPartial = true;

            return value;
        }

        function mapToVideo(value) {
            value = _(new Video()).extend(value);
            value = mapToPartialVideo(value);

            value.plot = value.overview;

            // Apply YouTube media ID
            if (value.trailers && value.trailers.youtube) {
                value.trailers.youtube = _(value.trailers.youtube).map(applyYouTubeId);
            }

            // Apply genres information
            if (value.genres) {
                value.genres = _(value.genres).map(applyGenres);
            }

            value.isPartial = false;

            return value;

            //#region Internal Methods

            function applyYouTubeId(value) {
                value.id = value.source.replace("http://www.youtube.com/watch?v=", "");
                return value;
            }

            function applyGenres(value) {
                return value.name;
            }

            //#endregion
        }

        function log(message, title) { logServices.log(message, title, "/app/infrastructure/MediaServicesFromTheMovieDbOrg"); }
    }
);