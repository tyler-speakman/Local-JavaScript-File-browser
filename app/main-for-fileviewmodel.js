﻿require.config({
    urlArgs: "noCache=" + (new Date()).getTime()// This prevents caching -- it is useful for debugging, but can be turned off for production
});

define(['infrastructure/FileServices', 'viewmodels/FileViewModel'], function (filesServices, fileViewModel) {
    console.log("/app/main-for-fileviewmodel.js");

    var self = this;

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
    var startingFsEntity = new filesServices.FsEntity({ path: "", name: "C:", children: [], isDirectory: true, isFile: false, isUpDir: false });
    self.fsStructure = startingFsEntity;
    self.loadFsEntity(self.fsStructure);
    ko.applyBindings(fileViewModel);
});