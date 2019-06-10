var chrono = require('chrono-node');
var moment = require('moment');
var tz = require('moment-timezone');
var uuidv1 = require('uuid/v1');
var xmpp = require('simple-xmpp');
var caldav = require('node-caldav')
var schedule = require('node-schedule')

const env = process.env;

var timezone = env.WAYLETTTIMEZONE;
console.log(timezone)

moment.tz.setDefault(timezone);

var myMaster = env.MASTER
var jid = env.JABBERID
var pwd = env.JABBERPASSWORD
var server = env.JABBERSERVER
var port = 5222;

var scheduleFreq = {count: 15, period: 'minutes'};

var wayletter = null;
scheduleEvents(scheduleFreq);

function createEventFrom(text, callback) {

    var parseResults = chrono.parse(text)
    var eventFilename = uuidv1();

    if (parseResults.length > 0) {
        var eventName =  text.replace(parseResults[0].text, '').trim();
        var startDate = moment(parseResults[0].start.date());
        try {
            var endDate = moment(parseResults[0].end.date());
            var summary = [startDate, '\n', endDate].join(' ')
        }
        catch(error){
            var endDate = startDate;
            var summary = [ startDate ].join(' ')
        }
    }

    try {
        if (startDate === undefined) throw("uuups");

        caldav.addEvent({
            startDate: startDate,
            endDate: endDate,
            allDayEvent: false,
            tzid: timezone,
            summary: eventName,
            key: eventFilename
            },
            env.CALENDARURL,
            env.USER,
            env.PASSWORD,
            function(err) {
                if(err) {
                    callback("caldav was not happy.")
                    log(err);
                }
                else {
                    callback(summary);

                    if(wayletter.nextInvocation()._date >= startDate ) {
                        scheduleSingleEvent(startDate, eventName);
                    }

                }
            }
        );
    }
    catch(error) {
        callback("failed to parse a date.")
    }


}



xmpp.on('online', function(data) {
        log('Connected with JID: ' + data.jid.user);
});

xmpp.on('error', function(err) {
        console.error("error:", JSON.stringify(err));
});

xmpp.on('chat', function(from, message) {
        log(from + ' ' + message)
        if (from === myMaster) {
            if (message === "list") {

                listEvents({count: 1, period: 'days'}, (eventsString) => {
                    send(eventsString);
                })

            }
            else {
                createEventFrom(message, (eventCreationResponse) => {
                    send(eventCreationResponse);
                })
            }
        }
        else {
            send("sorry. You are not my master!");
        }
});

xmpp.on('subscribe', function(from) {
        if (from === myMaster) {
                    xmpp.acceptSubscription(from);
                }
});


xmpp.connect({
        jid: jid,
        password: pwd,
        host: server,
        port: port
});

xmpp.subscribe(myMaster);
xmpp.getRoster();

function scheduleSingleEvent(startDate, name) {
    var job = schedule.scheduleJob(
        startDate.toDate(), () => {
            var message = name ? name : "Beschaaaid!"
            send(message)
        });
    var next = job ? job.nextInvocation() : '... scheduling failed.'
    log("scheduled: " + next + " " + name);
}

function scheduleEvents(scheduleFreq) {
    getEvents(scheduleFreq, function(events) {
        var eventList = [];
        log("scheduling, scheduling every " + scheduleFreq.count + " " + scheduleFreq.period)
        events.forEach((i) => {

            var timezone = (i.startDate.timezone === 'Z') ? 'Zulu': i.startDate.timezone

            var scheduleDate = moment(i.startDate.toString()).tz(timezone)
            scheduleSingleEvent(scheduleDate, i.summary);
        })


    });

    wayletter = schedule.scheduleJob(moment().add(scheduleFreq.count, scheduleFreq.period).toDate(), () => {scheduleEvents(scheduleFreq)})
}

function listEvents(scheduleFreq, callback) {
    getEvents(scheduleFreq, function(events){
        var eventList = [''];
        events.forEach((i) => {
            var timezone = (i.startDate.timezone === 'Z') ? 'Zulu': i.startDate.timezone
            eventList.push(`${moment(i.startDate.toString()).tz(timezone)} ${i.summary}`);
        });
        callback(eventList.join('\n'))
    })

}

function getEvents(scheduleFreq, callback) {

    var dateQueryStart = new moment()

    caldav.getEvents(
        env.CALENDARURL,
        env.USER, env.PASSWORD,
        dateQueryStart,
        dateQueryStart.clone().add(scheduleFreq.count, scheduleFreq.period),
        function(blahh, results) {
            callback(results ? results : []);
        });
}

function log(message) {console.log(moment().toString() + ' ' + message);}
function send(message) {xmpp.send(myMaster, message); log("sent: " + message.replace(/\n/g, ' '))}

