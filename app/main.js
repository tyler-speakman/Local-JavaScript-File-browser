require.config({
    urlArgs: "noCache=" + (new Date()).getTime()// This prevents caching -- it is useful for debugging, but can be turned off for production
});

define(['infrastructure/FileServices', 'viewmodels/FileViewModel'], function (filesServices, fileViewModel) {
    console.log("/app/main.js");

    var self = this;

    fileViewModel.currentVideoPath = ko.observable();

    fileViewModel.selectedFsEntity.subscribe(function (fsEntity) {
        if (fsEntity && fsEntity.isVideo) {
            // If the entity is a video file, then update the video UI
            self.currentVideoPath(fsEntity.path.replace("file:///", ""));
        }
    });

    var startingFsEntity = new filesServices.FsEntity({ path: "C:", name: "C:", children: [], isFolder: true, isFile: false, isUpDir: false });
    self.fsStructure = startingFsEntity;
    self.loadFsEntity(self.fsStructure);
    ko.applyBindings(fileViewModel);
});