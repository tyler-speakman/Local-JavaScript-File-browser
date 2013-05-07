define(['infrastructure/LogServices', 'infrastructure/MediaServices'], function (logServices, mediaServices) {
    log();

    var self = this;

    // Properties
    self.search = ko.observable();
    self.searchResults = ko.observableArray();

    // Subscribers
    self.search.subscribe(function (value) {
        mediaServices.searchByTitle(value)
            .done(handleSearchResponse)
            .fail(handleSearchResponseFailure);

        function handleSearchResponse(data, textStatus, jqXHR) {
            log(data);
            self.searchResults(data);
        }

        function handleSearchResponseFailure(data, textStatus, jqXHR) {
            logServices.error("Not found.", "SYSTEM");
        }
    });

    // Methods

    return self;

    //#region Data manipulators

    //#endregion

    //#region UI Event Handlers

    //#endregion

    function log(message) {
        if (_(message).isObject() || _(message).isArray()) {
            log();
            console.log(message);
        } else {
            console.log("(/app/infrastructure/MediaViewModel) " + (message ? message : ""));
        }
    }
});