var chrono = require('chrono-node');
var moment = require('moment')

moment.locale('de-ch')

var s = [
    "tomorrow",
    "tomorrow at 9 GMT",
    "tomorrow at 9",
    "tomorrow at 9 CEST",
    "tomorrow at 9 CET", 
    "tomorrow at 22:22 CEST", 
    "in 24 hours"
    ]

s.forEach((s) => console.log(
    chrono.parseDate(s),
    moment(chrono.parseDate(s)).format('LLL'),
    chrono.parseDate(s).toString(),
    s
));


/*
marco@40:~/repos/waylett$ nodejs server.js 
2019-06-05T11:00:00.000Z '5. Juni 2019 12:00' 'Wed Jun 05 2019 12:00:00 GMT+0100 (British Summer Time)' 'tomorrow'
2019-06-05T09:00:00.000Z '5. Juni 2019 10:00' 'Wed Jun 05 2019 10:00:00 GMT+0100 (British Summer Time)' 'tomorrow at 9 GMT'
2019-06-05T08:00:00.000Z '5. Juni 2019 09:00' 'Wed Jun 05 2019 09:00:00 GMT+0100 (British Summer Time)' 'tomorrow at 9'
2019-06-05T07:00:00.000Z '5. Juni 2019 08:00' 'Wed Jun 05 2019 08:00:00 GMT+0100 (British Summer Time)' 'tomorrow at 9 CEST'
2019-06-05T08:00:00.000Z '5. Juni 2019 09:00' 'Wed Jun 05 2019 09:00:00 GMT+0100 (British Summer Time)' 'tomorrow at 9 CET'
2019-06-05T20:22:00.000Z '5. Juni 2019 21:22' 'Wed Jun 05 2019 21:22:00 GMT+0100 (British Summer Time)' 'tomorrow at 22:22 CEST'
2019-06-05T22:05:57.000Z '5. Juni 2019 23:05' 'Wed Jun 05 2019 23:05:57 GMT+0100 (British Summer Time)' 'in 24 hours'
*/
