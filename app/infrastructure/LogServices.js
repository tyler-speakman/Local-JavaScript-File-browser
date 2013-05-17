define([], function () {
    "use strict";

    //#region Internal Methods

    function log() {
        if (!self.isLogging) { return; }

        var args = _(arguments).filter(function (value) { return value != undefined && value != null; });
        var number = 0xFFF + (Math.random() * 1000 | 0);
        args.unshift((number).toString(16).toUpperCase());
        sessionLog.apply(null, args);
        //console.trace()
        console.log("");
    }

    function sessionLog() {
        if (!self.isLogging) { return; }

        if (arguments.length <= 1) { return; }

        var session = arguments[0];
        var args = [].slice.call(arguments, 1, arguments.length);
        var stringArguments = [];
        var index = args.length;
        while (index--) {
            var arg = args[index];
            if (_(arg).isObject() || _(arg).isArray()) {
                if (index === 0) {
                    var slice = args.slice(0, index);
                    slice.unshift(session);
                    sessionLog.apply(null, slice);
                }

                console.log(arg);

                if (index - 1 === args.length) {
                    var slice1 = args.slice(index + 1, args.length);
                    slice1.unshift(session);
                    sessionLog.apply(null, slice1);
                }
                return;
            } else if (_(arg).isString()) {
                stringArguments.unshift(arg);
            } else {
                // Ignore
            }
        }

        if (stringArguments.length > 0) {
            var formattedStringArguments = _(stringArguments).map(function (value) { return format("(%1)", value); });
            console.log(session + ": " + formattedStringArguments.join(" "));
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
    };

    //#endregion

    var self = {};

    self.isLogging = false;

    log("/app/infrastructure/LogServices");

    return {
        info: toastr.info,
        warning: toastr.warning,
        success: toastr.success,
        error: toastr.error,
        log: log,
        isLogging: self.isLogging
    };
});