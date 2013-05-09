/*global console, define*/
define(
    [
        "infrastructure/LogServices"
    ],
    function (logServices) {
        log();

        return {
            Video: Video,
            PartialVideo: PartialVideo,
            mapToVideo: mapToVideo,
            mapToPartialVideo: mapToPartialVideo
        };

        function PartialVideo() {
            var self = this;
            self.id = -1;
            self.title = "";
            self.poster = "";
            self.year = new Date("1900/01/01");
            self.source = "";

            self.isPartial = true;

            return self;
        }

        function Video() {
            var self = new PartialVideo();

            self.plot = "";
            self.trailers = [];
            self.genres = [];

            self.isPartial = false;

            return self;
        }

        function mapToPartialVideo(value) {
            log("mapToPartialVideo(value: " + value + ")");
            log(value);
            return _.pick(value, _(new PartialVideo()).keys());
        }

        function mapToVideo(value) {
            log("mapToVideo(value: " + value + ")");
            log(value);

            return _.pick(value, _(new Video()).keys());
        }

        //#endregion

        function log(message, title) { logServices.log(message, title, "/app/infrastructure/MediaModels"); }
    }
);