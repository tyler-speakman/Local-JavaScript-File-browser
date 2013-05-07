define([], function () {
    console.log("/app/infrastructure/AjaxQueue.js");

    var self = this;

    self.maxNumberOfActiveProcesses = 2;
    self.delayedProcessQueue = [];
    self.delayedProcessPromises = {};
    self.numberOfActiveProcesses = 0;
    self.append = function (url, data) {
        //console.log("append (url: " + url + "; numberOfActiveProcesses: " + self.numberOfActiveProcesses + "; delayedProcessQueue.length: " + self.delayedProcessQueue.length + ";)");
        if (self.numberOfActiveProcesses <= self.maxNumberOfActiveProcesses) {
            // If there are no active URLs, then process the request immediately
            return self.process(url, data);
        } else {
            // If there are active URLs, then queue the request for processing later
            return self.appendToPreProcessQueue(url, data);
        }
    };

    self.appendToPreProcessQueue = function (url, data) {
        self.delayedProcessQueue.push(url);
        var delayedProcessPromise = $.Deferred();
        self.delayedProcessPromises[url] = { promise: delayedProcessPromise, url: url, data: data };
        return delayedProcessPromise;
    };

    self.process = function (url, data) {
        self.numberOfActiveProcesses++;
        url = url//encodeURI(url)
            .replace(/\#/gi, "%23")
            .replace(/\ /gi, "%20");
        //console.log("process started (url: " + url + "; numberOfActiveProcesses: " + self.numberOfActiveProcesses + "; delayedProcessQueue.length: " + self.delayedProcessQueue.length + ";)");
        return $.get(url, data).always(self.handlePostProcess);
    };

    self.handlePostProcess = function () {
        self.numberOfActiveProcesses--;
        //console.log("handlePostProcess: " + self.numberOfActiveProcesses + "; " + self.delayedProcessQueue.length);
        if (self.delayedProcessQueue.length > 0) {
            var object = self.delayedProcessQueue.shift();
            var url = object.url;
            var data = object.data;
            var delayedProcessPromise = self.delayedProcessPromises[url];
            delete self.delayedProcessPromises[url];
            self.process(url, data)
                .done(function (data, textStatus, jqXHR) { delayedProcessPromise.resolve(data, textStatus, jqXHR); })
                .fail(function (jqXHR, textStatus) { delayedProcessPromise.reject(jqXHR, textStatus); }); //.always(function () { console.log("process completed (url: " + url + "; numberOfActiveProcesses: " + self.numberOfActiveProcesses + "; delayedProcessQueue.length: " + self.delayedProcessQueue.length + ";)"); });
        }
    };

    return {
        append: self.append
    };
});