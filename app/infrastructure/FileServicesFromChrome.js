define(["infrastructure/LogServices", "infrastructure/AjaxQueueServices"], function (logServices, ajaxQueueServices) {
    "use strict";
    //#region Internal Methods

    function log() { [].unshift.call(arguments, "/app/infrastructure/FileServicesFromChrome"); logServices.log.apply(null, arguments); }

    //#endregion

    log();

    // NOTE: Requires chrome to start with "--allow-file-access-from-files"
    function getStructure(path, parent, depth) {
        var url = path.replace(/\\/gi, "/");

        var promise = $.Deferred();

        ajaxQueueServices.append({ url: "file:///" + url })
            .then(handleUrlResponse)
            .fail(handleUrlResponseFailure);

        return promise;

        //#region Internal Methods

        function handleUrlResponse(data, textStatus, jqXHR) {
            promise.resolve(getFsEntitiesFromChromeResponseText(data));
        }

        function handleUrlResponseFailure(jqXHR, textStatus) {
            //if (jqXHR.statusText.indexOf('"Access to restricted URI denied"  code: "1012" nsresult: "0x805303f4 (NS_ERROR_DOM_BAD_URI)"') > -1) {
            //    console.log('If you are using Firefox, then please activate.. ???????');
            //}

            if (jqXHR.status === 404) {
            } else {
                console.log(arguments);
                console.log('The system has encountered an error with accessing your filesystem, please ensure that your browser shortcut includes the "Requires chrome to start with "--allow-file-access-from-files" flag');
            }

            console.log(jqXHR);
            console.log(textStatus);
            promise.resolve([]);
        }

        //#endregion
    }

    return {
        getStructure: getStructure
    };

    //#region Internal Methods

    function getFsEntitiesFromChromeResponseText(fsRequestText) {
        if (fsRequestText === "") { return []; }

        var parentPath = getParentPathFromFsRequestText(fsRequestText);

        var fsEntities = [];
        var fileRegExp = new RegExp(/<script>addRow\("([^\"]+)","([^\"]+)",([0-9]+),"([^\"]+)","([^\"]+)"\);<\/script>/g);
        var fileMatch;
        while (fileMatch = fileRegExp.exec(fsRequestText)) {
            var isUpDir = fileMatch[1] === "..";
            var isDirectory = fileMatch[3] === "1" || isUpDir;
            var isFile = !isDirectory && !isUpDir;

            var path = (parentPath).replace(/\\\\/gi, "\\").replace(/\\/gi, "/");;

            var fsEntity;
            if (isFile) {
                fsEntity = { name: fileMatch[1], path: path, isDirectory: isDirectory, isFile: true, isAccessible: true, isUpDir: false, size: fileMatch[4], lastModifiedDate: new Date(fileMatch[5]), };
            } else if (isDirectory && !isUpDir) {
                fsEntity = { name: fileMatch[1], path: path, isDirectory: true, isFile: false, isAccessible: true, isUpDir: false, size: NaN, children: [] };
            } else if (isUpDir) {
                fsEntity = { name: "..", path: path, isDirectory: true, isFile: false, isAccessible: true, isUpDir: true, size: NaN };
            }

            if (fsEntity) {
                fsEntities.push(fsEntity);
            } else {
                console.log(fsRequestText);
                throw "What is this?";
            }
        }

        return fsEntities;

        //#region Internal Methods

        function getParentPathFromFsRequestText(fsRequestText) {
            var parentPathRegExp = new RegExp(/<script>start\("([^\"]+)"\);<\/script>/g);
            var parentPathMatch = parentPathRegExp.exec(fsRequestText);
            return (parentPathMatch) ? parentPathMatch[1] : undefined;
        }

        //#endregion
    }
});