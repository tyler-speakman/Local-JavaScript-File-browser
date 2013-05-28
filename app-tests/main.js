require.config({
    baseUrl: "../app",
    urlArgs: "noCache=" + (new Date()).getTime()// This prevents caching -- it is useful for debugging, but can be turned off for production
});
define(
    [
        "../app-tests/infrastructure/LogServicesTests",
        "../app-tests/infrastructure/FileServicesTests"
    ],
    function (logServicesTests, fileServicesTest) {
        "use strict";
        sinon.config.useFakeTimers = false;

        console.log("/app-tests/main");

        //#region /app/infrastructure/LogServices

        //#endregion
    }
);