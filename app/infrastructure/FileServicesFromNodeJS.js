define(["infrastructure/AjaxQueueServices"], function (ajaxQueueServices) {
    console.log("/app/infrastructure/FileServices.js");

    function getStructure(path, parent, depth) {
        var promise = $.Deferred();

        ajaxQueueServices.append({ url: "http://127.0.0.1:8000/readDir", data: { path: parent.path, name: parent.name, depth: depth }, dataType: "json", contentType: "application/json" })
            .then(handleUrlResponse)
            .fail(handleUrlResponseFailure);

        return promise;

        //#region Internal Methods

        function handleUrlResponse(data, textStatus, jqXHR) {
            promise.resolve(data.children);
        }

        function handleUrlResponseFailure(jqXHR, textStatus) {
            console.log(JSON.stringify(jqXHR));
            console.log(textStatus);
            promise.resolve([]);
            if (status === 0 || textStatus === "error") {
                throw "No response from server. Is your NodeJS instance running?";
            }
        }

        //#endregion
    }

    return {
        getStructure: getStructure
    };
});