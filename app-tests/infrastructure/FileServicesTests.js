define(
    ["infrastructure/FileServices"],
    function (fileServices) {
        "use strict";

        module(
                "/app/infrastructure/FileServices",
                {
                    setup: function () { },
                    teardown: function () { }
                }
            );

        test("getStructure() with any missing argument throws an exception", function () {
            // Arrange

            // Act

            // Assert
            throws(function () { fileServices.getStructure(); }, "Passed!");
        });
    }
);