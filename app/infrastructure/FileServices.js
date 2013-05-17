define(["infrastructure/LogServices", "infrastructure/FileServicesFromNodeJS", "infrastructure/FileServicesFromChrome", "models/FileModels"], function (logServices, fileServicesFromNodeJs, fileServicesFromChrome, fileModels) {
    "use strict";

    //#region Internal Methods

    function log() { [].unshift.call(arguments, "/app/infrastructure/FileServices"); logServices.log.apply(null, arguments); }

    //#endregion

    log();

    var self = {};

    self.getStructure = function (path, parent, depth) {
        var promise = $.Deferred();
        fileServicesFromNodeJs.getStructure(path, parent, 0)
        //fileServicesFromChrome.getStructure(path, parent, 0)
            .done(handleUrlResponseSuccess)
            .fail(handleUrlResponseFailure);
        return promise;

        //#region Internal Methods

        function handleUrlResponseSuccess(fsEntities) {
            parent.children = [];
            parent.isAccessible = true;
            var fsEntitySubRequestPromises = [];
            var hasUpDir = false;
            var index = fsEntities.length;
            while (index--) {
                var fsEntity = new fileModels.FsEntity(fsEntities[index]);
                parent.children.push(fsEntity);
                fsEntity.parent = parent;
                var fsEntityFullPath = fsEntity.path + ((fsEntity.isDirectory) ? "\\" : "");
                var subRequestDepth = depth - 1;
                var isUpDir = fsEntity.name === "..";
                if (fsEntity.isDirectory && subRequestDepth >= 0 && !isUpDir && fsEntity.name !== "") {
                    var fsEntitySubRequestPromise = getStructure(fsEntityFullPath, fsEntity, subRequestDepth);
                    fsEntitySubRequestPromises.push(fsEntitySubRequestPromise);
                }
                if (isUpDir) { hasUpDir = true; }
            }

            // If an "upDir" / "parent-directory" reference wasn't found (but should exist), then insert one
            if (!hasUpDir && parent.path.length > 0) {
                parent.children.push(new fileModels.FsEntity({ path: parent.path + parent.name, name: "..", isDirectory: true, isFile: false, isUpDir: true, isAccessible: true, parent: parent }));
            }

            // When all sub directory requests are complete, then resolve parent promise
            $.when.apply(null, fsEntitySubRequestPromises)
                .done(handleFsEntitySubRequestSuccess)
                .fail(handleFsEntitySubRequestFailure)
                .always(function () { parent.isLoaded = true; });

            //#region Internal Methods

            function handleFsEntitySubRequestSuccess() { promise.resolve(parent); }

            function handleFsEntitySubRequestFailure(jqXHR, textStatus) { promise.resolve(parent); /*promise.reject(jqXHR, textStatus);*/ }

            //#endregion
        }

        function handleUrlResponseFailure(jqXHR, textStatus) {
            var fsEntity = new fileModels.InaccessibleFsEntity();
            fsEntity.parent = parent;
            parent.isAccessible = false;
            promise.resolve(fsEntity);
            //promise.reject(jqXHR, textStatus);//
        }

        //#endregion
    };

    return {
        getStructure: self.getStructure,
        FsEntity: fileModels.FsEntity
    };
});