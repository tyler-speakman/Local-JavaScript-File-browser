require.config({
    urlArgs: "noCache=" + (new Date()).getTime()// This prevents caching -- it is useful for debugging, but can be turned off for production
});

define(["infrastructure/LogServices", 'infrastructure/FileServices', 'viewmodels/FileViewModel'], function (logServices, fileServices, fileViewModel) {
    "use strict";

    //#region Internal Methods

    function log() { [].unshift.call(arguments, "/app/infrastructure/FileServices"); logServices.log.apply(null, arguments); }

    //#endregion

    log();

    var self = {};

    //fileViewModel.currentVideoPath = ko.observable();

    //fileViewModel.selectedFsEntity.subscribe(function (fsEntity) {
    //    if (fsEntity && fsEntity.isVideo) {
    //        // If the entity is a video file, then update the video UI
    //        self.currentVideoPath(fsEntity.path.replace("file:///", ""));
    //    }
    //});

    fileViewModel.handleAddSearchFilterClick = function (data, event) {
        fileViewModel.addSearchFilter();
    };

    fileViewModel.handleRemoveSearchFilterClick = function (data, event) {
        console.log(arguments);
        fileViewModel.removeSearchFilter(data);
    };

    fileViewModel.handleSearchFilterKeyChange = function (key, data, event) {
        console.log(arguments);
        data.key = key;
        refreshCurrentFsDirectory();
        self.refreshCurrentSearchFilter();
    };

    ko.applyBindings(fileViewModel);

    // Initialize the route handler
    var app = Sammy();

    app.get('#/', function () { });

    app.get('#/path/:path/:name', function () {
        log("app.get('#/path/:path/:name'", this.params);
        fileViewModel.fsStructure = new fileServices.FsEntity({ path: this.params['path'], name: this.params['name'], children: [], isDirectory: true, isFile: false, isUpDir: false });
        log("app.get('#/path/:path/:name'", "fileViewModel.fsStructure", fileViewModel.fsStructure);
        fileViewModel.loadFsEntity(fileViewModel.fsStructure);
    });

    // start the application
    app.run('#' + '/path/' + encodeURIComponent("c:\\") + '/' + encodeURIComponent("windows"));
    //app.run('#/');
});