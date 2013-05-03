define([], function () {
    console.log("/app/infrastructure/LogServices.js");

    return {
        info: toastr.info,
        warning: toastr.warning,
        success: toastr.success,
        error: toastr.error
    };
});