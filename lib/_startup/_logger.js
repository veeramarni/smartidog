// creating a global server logger
if (Meteor.isServer) {
// Define levels
    var customLevels = {
        levels: {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3,
            auth: 4
        },
        colors: {
            debug: 'blue',
            info: 'green',
            warn: 'red',
            error: 'red',
            auth: 'red'
        }
    };

    if (process.env.NODE_ENV === "development") {
        Winston.setLevels(customLevels.levels);
        Winston.level = Meteor.settings.loglevel || 'info';
        log = Winston;
    } else {
        // To add Winston_Papertrail
        log = Winston;
        log.add(Winston_Papertrail, {
            levels: customLevels.levels,
            colors: customLevels.colors,
            host: 'logs3.papertrailapp.com',
            port: '21596',
            level: 'debug',
            handleExceptions: true,
            json: true,
            colorize: true,
            logFormat: function (level, message) {
                return level + ': ' + message;
            }
        })
    }

    log.info(" =====> Meteor App restarted " + new Date(Date.now()) + " <=====");
}
if (Meteor.isClient) {
    Winston.level = Meteor.settings.loglevel || 'info';
    log = Winston;

}
/*
 References:
 https://meteorhacks.com/logging-support-for-meteor*/
