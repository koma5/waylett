var chrono = require('chrono-node');
var moment = require('moment');
var uuidv1 = require('uuid/v1');
var xmpp = require('simple-xmpp');
var caldav = require('node-caldav')

const env = process.env;

var myMaster = env.MASTER
var jid = env.JABBERID
var pwd = env.JABBERPASSWORD
var server = env.JABBERSERVER
var port = 5222;

function createEventFrom(text) {

    var parseResults = chrono.parse(text)
    var eventFilename = uuidv1();

    if (parseResults.length > 0) {
        var eventName =  text.replace(parseResults[0].text, '').trim();
        var startDate = parseResults[0].start.date();
        try {
            var endDate = parseResults[0].end.date();
            var summary = [eventName, '\n', startDate, '\n', endDate].join(' ')
        }
        catch(error){
            var endDate = startDate;
            var summary = [eventName, '\n', startDate].join(' ')
        }
    }

    try {
        caldav.addEvent({
            startDate: startDate,
            endDate: endDate,
            tzid: "Europe/London",
            summary: eventName,
            key: eventFilename
            },
            env.CALENDARURL,
            env.USER,
            env.PASSWORD,
            function(err, data) {console.log(err, data)}
        );

        return summary
    }
    catch(error) {
        return "failed to parse a date"
    }


}



xmpp.on('online', function(data) {
        console.log('Connected with JID: ' + data.jid.user);
});

xmpp.on('error', function(err) {
        console.error("error:", JSON.stringify(err));
});

xmpp.on('chat', function(from, message) {
        console.log(from, message)
        if (from === myMaster) {
            xmpp.send(from, createEventFrom(message));
        }
        else {
            xmpp.send(from, "sorry. You are not my master!");
        }
});

xmpp.connect({
        jid: jid,
        password: pwd,
        host: server,
        port: port
});
