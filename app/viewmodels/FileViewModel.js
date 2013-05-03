define(['infrastructure/LogServices', 'infrastructure/FileServices'], function (logServices, fileServices) {
    console.log("/app/infrastructure/LogServices.js");

    var self = this;

    // Properties
    self.fsStructure = new fileServices.FsEntity();
    self.currentFsEntityAncestry = ko.observableArray();
    self.currentFsDirectory = ko.observable(self.fsStructure);
    self.selectedFsEntity = ko.observable();
    self.currentFsDirectoryChildren = ko.observableArray();

    // Subscribers
    self.currentFsDirectory.subscribe(function (value) {
        self.currentFsEntityAncestry([]);// Reset, to force full rebind
        self.currentFsEntityAncestry(self.currentFsDirectory().hierarchy());
        //self.currentFsEntityAncestry.valueHasMutated();

        self.currentFsDirectoryChildren([]);// Reset, to force full rebind
        self.currentFsDirectoryChildren(self.currentFsDirectory().children);
        //self.currentFsDirectoryChildren.valueHasMutated();
    });
    self.selectedFsEntity.subscribe(function (fsEntity) {
        if (fsEntity && fsEntity.isFolder) {
            // If the entity is a folder then update the file system UI
            if (fsEntity.isUpDir) {
                // If the entity is just an "Up Directory" link, then goto it's parent's parent (think about it, I'm right)
                self.currentFsDirectory(fsEntity.parent.parent);
            } else {
                // Load the selected entity
                self.loadFsEntity(fsEntity);
            }
        }
    });

    // Methods
    self.loadFsEntity = function (fsEntity) {
        if (fsEntity.isLoaded) {
            // If the entity has already been loaded, then simply display the existing data (assuming it's not already being displayed)
            if (fsEntity.path !== self.currentFsDirectory().path) {
                self.currentFsDirectory(fsEntity);
            }
        } else {
            // If the entity has not already been loaded, then load and process it
            var fsStructureRequestStartTime = new Date();
            fileServices.getStructure(fsEntity.path, fsEntity, 0)//, { type: function (value) { return value.match((new RegExp("^video/.+$", "gi"))).length > 0; } }
                .done(function (fsStructure) {
                    if (fsStructure.name !== "NA") {
                        // If the directory is available, then sort it, apply the mimetype flags and update the UI
                        fsStructure.children = applyFsSort(fsStructure.children);
                        fsStructure.children = applyFsMimeTypeFlags(fsStructure.children);

                        self.currentFsDirectory(fsStructure);
                    } else {
                        // If the directory is unavailable, then flag it and update the UI
                        self.currentFsDirectory.valueHasMutated();
                        logServices.error("Directory not available", "SYSTEM");
                    }
                })
                .always(function (fsStructure) {
                    console.log("Completed (" + ((new Date()) - fsStructureRequestStartTime) / 1000 + " seconds)");
                    console.log(fsStructure);
                });
        }
    };

    bindEventToList('body', '.fs-entity', selectFsEntity);

    return self;

    //#region Data manipulators

    function applyFsMimeTypeFlags(fsEntities) {
        return _(fsEntities).map(applyMimeTypeFlags);

        //#region Internal Methods

        function applyMimeTypeFlags(fsEntity) {
            fsEntity.isVideo = isMimeType(fsEntity.type, "video");
            fsEntity.isAudio = isMimeType(fsEntity.type, "audio");
            fsEntity.isImage = isMimeType(fsEntity.type, "image");

            return fsEntity;
        }

        function isMimeType(actualType, queryType) {
            return (actualType && actualType.indexOf(queryType) > -1);
        }

        //#endregion
    }

    function applyFsSort(fsEntities) {
        return _(fsEntities).sortBy(sort);

        //#region Internal Methods

        function sort(fsEntity) {
            // Apply recursively
            if (fsEntity.children) { fsEntity.children = applyFsSort(fsEntity.children); }

            // Sort entities as follows: "Up Directory" links first, folders secound, everything else third (and of course ascending alpha-numerics)
            return ((fsEntity.isUpDir) ? "0" : "1") + ((fsEntity.isFolder) ? "0" : "1") + fsEntity.name;
        }

        //#endregion
    }

    //#endregion

    //#region UI Event Handlers

    function bindEventToList(rootSelector, selector, callback, eventName) {
        // Bind an event to all DOM elements of a specific class
        eventName = eventName || 'click';
        $(rootSelector).on(eventName, selector, function () {
            var fsEntity = ko.dataFor(this);
            callback(fsEntity);
            return false;
        });
    }

    function selectFsEntity(fsEntity) {
        this.selectedFsEntity(fsEntity);
    }

    //#endregion
});