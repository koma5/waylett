# WAYLETT

This node bot called waylett listens to it's master on jabber. It uses chrono (natural language processing) for parsing dates and add's these dates to a caldav calendar. It retrieves these events form the same calendar and schedules them for notification on the same channel (jabber).

Example usage: `in 123 years plant a tree.`.

Upcoming events (24 hours) can be listed with the `list` command.

## secrets
Store these environment variables in the file `.env`
```
export USER=username
export PASSWORD=passowrd
# example here nextcloud caldav url (! trailing '/')
export CALENDARURL=https://example.org/remote.php/dav/calendars/username/waylett/

# Jabber ID of the one who's controlling the bot. It won't listen to anybody else
export MASTER=username@example.org
export JABBERID=waylett@jabber.example.org
export JABBERPASSWORD=password
export JABBERSERVER=jabber.example.org

# your time zone; unfortunately there is no timestamp/timezone in xmpp messages.
export WAYLETTTIMEZONE="Europe/London"

```

## install
```
git clone https://github.com/koma5/waylett && cd waylett
npm install
```


## run
```
. .env
node bot.js
```

## attribution
To the the guy and his obelisk, who lies buried outside my window, in [Kensal Green Cemetery][1] for 123 years.

## to do (maybe)
* maybe ... overlap schedule by about 30 seconds
* key schedules with id

[1]:https://www.openstreetmap.org/?mlat=51.528858&mlon=-0.220988
