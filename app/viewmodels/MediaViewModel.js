define(['infrastructure/LogServices', 'infrastructure/MediaServices'], function (logServices, mediaServices) {
    log();

    var self = this;

    // Properties
    self.search = ko.observable();
    self.searchResults = ko.observableArray();
    self.isSearchFocused = ko.observable(true);
    self.searchResults.subscribe(function () { return self.isSearchFocused(self.searchResults().length === 0); });
    self.selectedSearchResult = ko.observable();
    self.selectedSearchResultsHistory = ko.observableArray();

    // Subscribers
    self.search.subscribe(function (value) {
        // Validate search
        if (!value || !_(value).isString() && value.length === 0) { return; }

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

    bindEventToList('body', '.media-search-result', selectVideoSearchResult, 'click');

    $('body').on('keypress', ".media-search-results", function (event) {
        if (event.which == 13) { event.preventDefault(); }
        event.target.blur();
    });

    $('body').on('blur', '.media-search-results', function () {
        var searchResult = self.searchResults()[this.selectedIndex];//ko.dataFor(this.selected);
        if (searchResult === undefined) { return; }
        selectVideoSearchResult(searchResult);
        return false;
    });

    return self;

    //#region UI Event Handlers

    function bindEventToList(rootSelector, selector, callback, eventName) {
        // Bind an event to all DOM elements of a specific class
        eventName = eventName || 'click';
        $(rootSelector).on(eventName, selector, function () {
            var searchResult = ko.dataFor(this);
            callback(searchResult);
            return false;
        });
    }

    //function bindEventToSelectList(rootSelector, selector, callback, eventName) {
    //    // Bind an event to all DOM elements of a specific class
    //    eventName = eventName || 'blur';
    //    $(rootSelector).on(eventName, selector, function () {
    //        var searchResult = ko.dataFor(this);
    //        callback(searchResult);
    //        return false;
    //    });
    //}

    function selectVideoSearchResult(videoSearchResult) {
        log(videoSearchResult);

        mediaServices.getDetailsById(videoSearchResult.id)
            .then(function (response) {
                videoSearchResult = response;//_(videoSearchResult).extend(response);
                self.selectedSearchResult(videoSearchResult);
            });

        // Set selected item
        self.selectedSearchResult(videoSearchResult);

        // Clear search
        self.search("");
        self.searchResults([]);

        // Add selected item to history
        if (!_(self.selectedSearchResultsHistory()).contains(videoSearchResult)) {
            self.selectedSearchResultsHistory.push(videoSearchResult);
        }
    }

    //#endregion

    function log(message, title) { logServices.log(message, title, "/app/infrastructure/MediaViewModel"); }
});