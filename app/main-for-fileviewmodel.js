﻿require.config({
    urlArgs: "noCache=" + (new Date()).getTime()// This prevents caching -- it is useful for debugging, but can be turned off for production
});

define(["infrastructure/LogServices", 'infrastructure/FileServices', 'viewmodels/FileViewModel'], function (logServices, fileServices, fileViewModel) {
    "use strict";

    //#region Internal Methods

    function log() { [].unshift.call(arguments, "/app/infrastructure/main-for-fileviewmodel"); logServices.log.apply(null, arguments); }

    //#endregion

    log();

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
    // start the application
    router.run('#/');

    var self = {};

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

    ko.applyBindings(fileViewModel);
});