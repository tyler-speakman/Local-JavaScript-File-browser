define([], function () {
    "use strict";

    //#region Internal Methods

    function log() {
        var formattedSessionLogs = getFormattedSessionLogs.apply(arguments);
        _(formattedSessionLogs).each(function (value) { console.log(value); });
    }

    function getFormattedSessionLogs() {
        //#region Internal Methods
        //#endregion

        if (!self.isLogging) { return []; }

        // Validation
        if (arguments.length === 0) { return []; }

        var args = _(arguments).filter(function (value) { return value != undefined && value != null; });
        var formattedLogs = getFormattedLogs.apply(null, args);

        // Append a session ID to the formatted logs
        var sessionId = (0xFFF + ((Math.random() * 1000) | 0)).toString(16).toUpperCase();
        var formattedSessionLogs = _(formattedLogs).map(function (value) {
            if (_(value).isString()) {
                return sessionId + ": " + value;
            } else {
                return value;
            }
        });

        if (formattedSessionLogs.length > 1) {
            // If we have more than one formattedLogs, then append a line break at the end to improve visibility
            formattedSessionLogs.push("");
        }
        //console.trace()

        return formattedSessionLogs;
    }

    function getFormattedLogs() {
        if (!self.isLogging) { return []; }

        var args = [].slice.call(arguments);
        var stringArguments = [];
        var index = args.length;
        while (index--) {
            var arg = args[index];
            if (_(arg).isObject() || _(arg).isArray()) {
                var firstSetOfLogs = (index !== 0) ? getFormattedLogs.apply(null, args.slice(0, index)) : [];
                var secondSetOfLogs = [arg];
                var thirdSetOfLogs = (index - 1 !== args.length) ? getFormattedLogs.apply(null, args.slice(index + 1, args.length)) : [];
                return [].concat(firstSetOfLogs, secondSetOfLogs, thirdSetOfLogs);
            } else if (_(arg).isString()) {
                stringArguments.unshift(arg);
            } else {
                // Ignore
            }
        }

        if (stringArguments.length > 0) {
            var formattedStringArguments = _(stringArguments).map(function (value) { return format("(%1)", value); });
            return [formattedStringArguments.join(" ")];
        } else {
            return [];
        }
    }

    //function log(message, title, group) {
    //    if (_(message).isObject() || _(message).isArray()) {
    //        log(undefined, title, group);
    //        console.log(message);
    //    } else {
    //        group = (group ? "(" + group + ") " : "");
    //        title = (title ? title + ": " : "");
    //        message = (message ? message : "");
    //        console.log(group + title + message);
    //    }
    //}

    //format("a %1 and a %2", "cat", "dog");
    //"a cat and a dog"
    function format(string) {
        var args = arguments;
        var pattern = RegExp("%([1-" + (arguments.length - 1) + "])", "g");
        return string.replace(pattern, function (match, index) {
            return args[index];
        });
    }

    //#endregion

    var self = {};

    self.isLogging = false;
    self.enableLogging = function () { self.isLogging = true; };
    self.disableLogging = function () { self.isLogging = false; };

    log("/app/infrastructure/LogServices");

    return {
        info: toastr.info,
        warning: toastr.warning,
        success: toastr.success,
        error: toastr.error,
        //log: function () { _(log.apply(null,arguments)).each(function (value) { console.log(value); }); },
        log: log,
        getFormattedLogs: getFormattedLogs,
        getFormattedSessionLogs: getFormattedSessionLogs,
        enableLogging: self.enableLogging,
        disableLogging: self.disableLogging
    };
});