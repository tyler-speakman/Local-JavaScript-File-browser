define([], function () {
    console.log("/app/infrastructure/AjaxQueue.js");

    jQuery.support.cors = true; // force cross-site scripting (as of jQuery 1.5)

    var self = this;

    self.maxNumberOfActiveProcesses = 2;
    self.delayedProcessQueue = [];
    self.delayedProcessPromises = {};
    self.numberOfActiveProcesses = 0;
    self.append = function (options) {
        console.log("append (url: " + options.url + "; numberOfActiveProcesses: " + self.numberOfActiveProcesses + "; delayedProcessQueue.length: " + self.delayedProcessQueue.length + ";)" + " " + "(" + JSON.stringify(options) + ")");
        if (self.numberOfActiveProcesses <= self.maxNumberOfActiveProcesses) {
            // If there are no active URLs, then process the request immediately
            return self.process(options);
        } else {
            // If there are active URLs, then queue the request for processing later
            return self.appendToPreProcessQueue(options);
        }
    };

    self.appendToPreProcessQueue = function (options) {
        self.delayedProcessQueue.push(options.url);
        var delayedProcessPromise = $.Deferred();
        self.delayedProcessPromises[options.url] = { promise: delayedProcessPromise, options: options };
        return delayedProcessPromise;
    };

    self.process = function (options) {
        self.numberOfActiveProcesses++;
        options.url = options.url//encodeURI(url)
            .replace(/\#/gi, "%23")
            .replace(/\ /gi, "%20");
        console.log("process started (url: " + options.url + "; numberOfActiveProcesses: " + self.numberOfActiveProcesses + "; delayedProcessQueue.length: " + self.delayedProcessQueue.length + ";)" + " " + "(" + JSON.stringify(options) + ")");
        return $.ajax(options).always(self.handlePostProcess);
    };

    self.handlePostProcess = function () {
        self.numberOfActiveProcesses--;
        console.log("handlePostProcess: " + self.numberOfActiveProcesses + "; " + self.delayedProcessQueue.length);
        if (self.delayedProcessQueue.length > 0) {
            var object = self.delayedProcessQueue.shift();
            var delayedProcessPromise = self.delayedProcessPromises[options.url];
            delete self.delayedProcessPromises[options.url];
            self.process(object.options)
                .done(function (data, textStatus, jqXHR) { delayedProcessPromise.resolve(data, textStatus, jqXHR); })
                .fail(function (jqXHR, textStatus) { delayedProcessPromise.reject(jqXHR, textStatus); }); //.always(function () { console.log("process completed (url: " + url + "; numberOfActiveProcesses: " + self.numberOfActiveProcesses + "; delayedProcessQueue.length: " + self.delayedProcessQueue.length + ";)"); });
        }
    };

    return {
        append: self.append
    };
});