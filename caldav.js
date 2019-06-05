var ics = require('ics');
var caldav = require('@datafire/caldav');

const env = process.env;

caldav = caldav.create({
    username: env.USER,
    password: env.PASSWORD,
    server: env.SERVER,
    basePath: "/remote.php/dav",
    principalPath: "/principals"
});



caldav.listCalendars({}).then(data => {
      console.log(data);
});


var newEvent = ics.createEvent({
    title: 'test ics',
    start: [2019, 6, 6, 12, 0],
    duration: { minutes: 0 }
});

