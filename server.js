var chrono = require('chrono-node');


var s = [
    "tomorrow",
    "tomorrow at 9 GMT",
    "tomorrow at 9 CEST",
    "tomorrow at 9 CET", 
    "in 24 hours"
    ]

s.forEach((s) => console.log(chrono.parseDate(s), s));
