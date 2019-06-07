var chrono = require('chrono-node');
var moment = require('moment');
var uuidv1 = require('uuid/v1');
var xmpp = require('simple-xmpp');

const env = process.env;

var caldav = require('@datafire/caldav').create({
    username: env.USER,
    password: env.PASSWORD,
    server: env.SERVER,
    basePath: "/remote.php/dav",
    principalPath: "/principals"
});

var myMaster = env.MASTER
var jid = env.JABBERID
var pwd = env.JABBERPASSWORD
var server = env.JABBERSERVER
var port = 5222;

/*
caldav.listCalendars({}).then(data => {
      console.log(data);
});


caldav.listEvents({ "filename": "/calendars/" + env.USER + "/" + env.CALENDER
}).then(data => {
      console.log(data);
});
*/

function createEventFrom(text) {

    var parseResults = chrono.parse(text)
    var eventFilename = uuidv1();

    if (parseResults.length > 0) {
        var eventName =  text.replace(parseResults[0].text, '').trim();
        var startDate = parseResults[0].start.date();
        try {
            var endDate = parseResults[0].end.date();
        }
        catch(error){
            var endDate = startDate;
        }
    }


    caldav.createEvent({
        start: startDate.toString(),
        end: endDate.toString(),
        summary: eventName,
        filename: "/calendars/" + env.USER + "/" + env.CALENDER + "/" + eventFilename
    }).then(data => {console.log(data)});
    
    return [eventFilename, eventName, startDate, endDate].join(' ')

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
