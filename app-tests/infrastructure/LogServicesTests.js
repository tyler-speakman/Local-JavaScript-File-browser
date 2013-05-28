define(
    ["infrastructure/LogServices"],
    function (logServices) {
        "use strict";

        module(
                "/app/infrastructure/LogServices",
                {
                    setup: function () { logServices.enableLogging(); },
                    teardown: function () { }
                }
            );

        test("getFormattedLogs() with no arguments returns an empty array", function () {
            // Arrange

            // Act
            var formattedLogs = logServices.getFormattedLogs();

            // Assert
            equal(formattedLogs.length, 0, "Passed!");
        });

        test("getFormattedLogs() with one string argument returns an array with one element", function () {
            // Arrange

            // Act
            var formattedLogs = logServices.getFormattedLogs("a");

            // Assert
            equal(formattedLogs.length, 1, "Passed!");
        });

        test("getFormattedLogs() with two adjacent string arguments returns an array with one elements", function () {
            // Arrange

            // Act
            var formattedLogs = logServices.getFormattedLogs("a", "b");

            // Assert
            equal(formattedLogs.length, 1, "Passed!");
        });

        test("getFormattedLogs() with two string arguments separated by an object argument returns an array with three elements", function () {
            // Arrange

            // Act
            var formattedLogs = logServices.getFormattedLogs("a", { z: "z" }, "b");

            // Assert
            equal(formattedLogs.length, 3, "Passed!");
        });

        test("getFormattedLogs() with two groups of string arguments separated by an object argument returns an array with three elements", function () {
            // Arrange

            // Act
            var formattedLogs = logServices.getFormattedLogs("a", "a", "a", "a", { z: "z" }, "b", "b", "b", "b");

            // Assert
            equal(formattedLogs.length, 3, "Passed!");
        });

        test("getFormattedSessionLogs() with two string arguments separated by an object argument returns an array with four elements (where the fourth element is an empty string)", function () {
            // Arrange

            // Act
            var formattedSessionLogs = logServices.getFormattedSessionLogs("a", { z: "z" }, "b");

            // Assert
            equal(formattedSessionLogs.length, 4, "Passed!");
            equal(formattedSessionLogs[3], "", "Passed!");
        });
    }
);