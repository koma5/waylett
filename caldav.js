var ics = require('ics');
const env = process.env;
var caldav = require('@datafire/caldav').create({
    username: env.USER,
    password: env.PASSWORD,
    server: env.SERVER,
    basePath: "/remote.php/dav",
    principalPath: "/principals"
});



caldav.listCalendars({}).then(data => {
      console.log(data);
});


caldav.listEvents({ "filename": "/calendars/" + env.USER + "/" + env.CALENDER
}).then(data => {
      console.log(data);
});

caldav.createEvent({
    start: "2019-06-07T20:22:00.000+05:00",
    end: "2019-06-07T20:22:22.000Z",
    summary: "first!!",
    filename: "/calendars/" + env.USER + "/" + env.CALENDER + "/aiiisdddwwww.ics"
}).then(data => {console.log(data)});



var newEvent = ics.createEvent({
    title: 'test ics',
    start: [2019, 6, 6, 12, 0],
    duration: { minutes: 0 }
});

