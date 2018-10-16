# Bluzelle Heroku Example Chat Application

[![N|Solid](https://bluzelle.com/assets/img/Bluzelle%20-%20Screen%20-%20Logo%20-%20Big%20-%20Blue.png)](https://bluzelle.com/)



The Bluzelle Heroku Example Chat application is a simple nodejs project that utilizes the Bluzelle database, socket.io and expressjs

# Prerequisites

  - Nodejs/npm
  - Heroku CLI

# Instructions

1) Deploy the application by clicking this button:
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/bluzelle/heroku-example-chat)


2) Login to Heroku using the Heroku CLI:
```sh
$ Heroku login
```
3) Once you've logged into Heroku with the Heroku CLI, you can now install the add-on to your Heroku Application (where APPLICATION_NAME is the name of your Heroku Application)

```sh
$ Heroku addons:create bluzelle:test -a APPLICATION_NAME
```

4) If everything went smoothly and the add-on installed properly, you will find 3 Config Variables (In your Heroku Application Dashboard, under the settings tab, you should see Config Vars.  If you Click on "Reveal Vars", you will see 3 Config Variables that the Bluzelle Add-on had set, BLUZELLEDB_ADDRESS, BLUZELLEDB_PORT, and BLUZELLEDB_UUID)

# Challenges
There are a couple of challenges with this application architecture.

1) Messages are appended to each value entry in the database.  Once the value entry hit the buffer limit (300 KB), then it will error out.  Solution: utilize different uuids

2) Even though it's using socket.io, this is not "completely" real-time polling.  The sockets initializes via HTTPS then "promotes" to sockets.  Keep in mind that some browsers will not support this.


# Support Contact
If you need help setting up the application to use our service, ask us at gitter: 

[![Join the chat at https://gitter.im/bluzelle/Lobby](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/bluzelle/Lobby)
