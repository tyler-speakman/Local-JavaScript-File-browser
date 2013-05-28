require.config({
    urlArgs: "noCache=" + (new Date()).getTime()// This prevents caching -- it is useful for debugging, but can be turned off for production
});

define([
        "infrastructure/LogServices",
        'infrastructure/FileServices',
        'viewmodels/FileViewModel',
        'viewmodels/MediaViewModel'
], function (logServices, fileServices, fileViewModel, mediaViewModel) {
    "use strict";

    //#region Internal Methods

    function log() { [].unshift.call(arguments, "/app/infrastructure/main"); logServices.log.apply(null, arguments); }

    //#endregion

    log();

    //#region Router

    // Initialize the route handler
    var router = Sammy();

    router.get('#/path/:path/:name', function () {
        log("app.get('#/path/:path/:name'", this.params);
        fileViewModel.fsStructure = new fileServices.FsEntity({ path: this.params['path'], name: this.params['name'], children: [], isDirectory: true, isFile: false, isUpDir: false });
        log("app.get('#/path/:path/:name'", "fileViewModel.fsStructure", fileViewModel.fsStructure);
        fileViewModel.loadFsEntity(fileViewModel.fsStructure);
    });

    router.get('#/.*', function () {
        // Display C:\ by default
        fileViewModel.fsStructure = new fileServices.FsEntity({ path: "c:\\", name: "", children: [], isDirectory: true, isFile: false, isUpDir: false });
        fileViewModel.loadFsEntity(fileViewModel.fsStructure);
    });

    // Start the application
    router.run('#/');

    //#endregion

    //#region FileViewModel

    // Apply video filter by default
    fileViewModel.addSearchFilter({ key: "type", value: "video/.*" });

    fileViewModel.handleAddSearchFilterClick = function (data, event) {
        fileViewModel.addSearchFilter();
    };

    fileViewModel.handleRemoveSearchFilterClick = function (data, event) {
        log("handleRemoveSearchFilterClick()", arguments);
        fileViewModel.removeSearchFilter(data);
    };

    fileViewModel.handleSearchFilterKeyChange = function (key, data, event) {
        log("handleSearchFilterKeyChange()", arguments);
        data.key = key;
        refreshCurrentFsDirectory();
        self.refreshCurrentSearchFilter();
    };

    fileViewModel.selectedFsEntity.subscribe(function (fsEntity) {
        if (fsEntity.isAccessible && fsEntity.isDirectory) {
            router.setLocation('#' + '/path/' + encodeURIComponent(fsEntity.path) + '/' + encodeURIComponent(fsEntity.name));
        }
    });

    mediaViewModel.handleSearchClick = function (data, event) {
        var fsEntity = data;
        var name = fsEntity.name.replace(fsEntity.extension, "");
        mediaViewModel.search(name);
    };

    //#endregion

    var self = {};
    self = _.extend(self, fileViewModel, mediaViewModel);

    ko.applyBindings(self);
});