/*global console, define*/
define(["infrastructure/AjaxQueueServices"], function (ajaxQueueServices) {
    console.log("/app/infrastructure/MediaServicesFromImdbApiOrg.js");

    return {
        searchByTitle: searchByTitle
    };

    var constants = {
        Output: { JSON: "json", JSONP: "jsonp", XML: "" },
        Plot: { None: "none", Simple: "simple", Full: "full" },
        Episode: { None: "none", Simple: "simple", Full: "full" },
        Limit: { "1": 1, "2": 2, "3": 3, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10 },
        YG: { Disabled: 0, Enabled: 1 },
        mt: { "None": "none", "Movie": "M", "TV Series": "TVS", "TV Movie": "TV", "Video": "V", "Video Game": "VG" },

        Lang: { "en-US": "en-US", "zh-CN": "zh-CN" },
        Aka: { Simple: "simple", Full: "full" },
        Release: { Simple: "simple", Full: "full" },
        Business: { Disabled: 0, Enabled: 1 },
        Technical: { Disabled: 0, Enabled: 1 }
    };

    function searchByTitle(title) {
        var searchOptions = {};//{ q: "", type: "", plot: "", episode: "", limit: "", year: "", yg: "", mt: "", lang: "", offset: "", aka: "", release: "", business: "", technical: "" }
        searchOptions.q = title;
        searchOptions.limit = 5;

        return search(searchOptions);
    }

    function search(options) {
        var promise = $.Deferred();
        ajaxQueueServices.append("http://imdbapi.org/?", options)
            .then(handleResponseText)
            .fail(handleResponseTextFailure);

        return promise;

        function handleResponseText(responseText, statusText, jqXHR) {
            // Validate response
            if (responseText === '{"code":404, "error":"Film not found"}') {
                // If video isn't found, then reject promise
                promise.reject(JSON.parse(responseText));
                return;
            }

            // If videos are found, then initalize standard object and map response object onto it
            var objects = JSON.parse(responseText);
            var index = objects.length;
            while (index--) {
                objects[index] = _.extend(new Video(), objects[index]);
            }
            promise.resolve(objects);
            return objects;
        }

        function handleResponseTextFailure(jqXHR, textStatus) {
            promise.reject([]);
        }
    }

    function Video() {
        var self = this;
        self.actors = []; // The movie's cast list.
        self.also_known_as = []; //  The movie's other name. Fields(full mode): title country remarks
        self.country = []; // The movie's country.
        self.directors = []; // The movie's directors.
        self.episodes = []; // The TV series's episodes(only TV series). Fields: date season episode title.
        self.film_locations = []; // The movie's locations.
        self.genres = []; // The movie's genres.(e.g. Drama, War)
        self.imdb_id = ""; // The movie's ID on IMDb.com.
        self.imdb_url = ""; // The movie's url on IMDb.com.
        self.language = []; // The movie's audio language.
        self.plot = ""; // The movie's summary.
        self.plot_simple = ""; // The movie's summary.(short)
        self.poster = ""; // The movie's poster.
        self.rated = ""; // The movie's classification and ratings.
        self.rating = -1.0; // The score of the movie on IMDb.com.
        self.rating_count = -1; // The number of voters on IMDb.com.
        self.release_date = -1; // (simple mode)
        // self.release_date = [];// The movie's release date. Fields(full mode): year month day country remarks
        self.runtime = []; // The movie's duration.
        self.title = ""; // The movie's name.
        self.type = ""; // The movie's type (i.e., M as Movie, TVS as TV Series, TV as TV Movie, V as Video, VG as Video Game, etc)
        self.writers = []; // The movie's writers.
        self.year = -1; // The movie's age.
        self.business = {}; // The movie's business info. (Budget, Gross, Opening Weekend, Weekend Gross, Admissions, Filming Dates, Producation Dates, Copyright holder etc.)
        self.technical = {}; // The movie's technical info. (Camera, Laboratory, Film Length, Film negative format, Cinematographic process, Printed film format, Aspect ratio etc.)
    }
});