define([], function () {
    console.log("/app/infrastructure/LogServices.js");

    return {
        info: toastr.info,
        warning: toastr.warning,
        success: toastr.success,
        error: toastr.error,
        log: log
    };

    function log(message, title, group) {
        if (_(message).isObject() || _(message).isArray()) {
            log(undefined, title, group);
            console.log(message);
        } else {
            group = (group ? "(" + group + ") " : "");
            title = (title ? title + ": " : "");
            message = (message ? message : "");
            console.log(group + title + message);
        }
    }
});