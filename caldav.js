var dav = require('dav');

const env = process.env;

var xhr = new dav.transport.Basic(
  new dav.Credentials({
    username: env.USER,
    password: env.PASSWORD
  })
);

dav.createAccount({ server: env.URL, xhr: xhr })
.then(function(account) {
  // account instanceof dav.Account
  account.calendars.forEach(function(calendar) {
    console.log('Found calendar named ' + calendar.displayName);
    // etc.
  });
});
