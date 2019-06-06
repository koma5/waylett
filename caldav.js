var chrono = require('chrono-node');
var moment = require('moment');
var uuidv1 = require('uuid/v1');

const env = process.env;

var caldav = require('@datafire/caldav').create({
    username: env.USER,
    password: env.PASSWORD,
    server: env.SERVER,
    basePath: "/remote.php/dav",
    principalPath: "/principals"
});


/*
caldav.listCalendars({}).then(data => {
      console.log(data);
});


caldav.listEvents({ "filename": "/calendars/" + env.USER + "/" + env.CALENDER
}).then(data => {
      console.log(data);
});
*/

var text = "postcard in 48 hours"
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
console.log(startDate, endDate)

caldav.createEvent({
    start: startDate.toString(),
    end: endDate.toString(),
    summary: eventName,
    filename: "/calendars/" + env.USER + "/" + env.CALENDER + "/" + eventFilename
}).then(data => {console.log(data)});


