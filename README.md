# Bluzelle Heroku Example Chat Application

[![N|Solid](https://bluzelle.com/assets/img/Bluzelle%20-%20Screen%20-%20Logo%20-%20Big%20-%20Blue.png)](https://bluzelle.com/)



The Bluzelle Heroku Example Chat application is a simple nodejs project that utilizes the Bluzelle database, socket.io and expressjs

# Prerequisites

  - Nodejs/npm
  - Heroku CLI

# Instructions

1) Deploy the application by clicking this button:
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/bluzelle/heroku-example-chat)

Follow the Heroku instructions for setting up your application.

2) Login to Heroku using the Heroku CLI:
```sh
$ Heroku login
```
3) Once you've logged into Heroku with the Heroku CLI, you can now install the add-on to your Heroku Application (where APPLICATION_NAME is the name of your Heroku Application)

```sh
$ Heroku addons:create bluzelle:test -a APPLICATION_NAME
```

4) If everything went smoothly and the add-on installed properly, you will find 3 Config Variables (In your Heroku Application Dashboard, under the settings tab, you should see Config Vars.  If you Click on "Reveal Vars", you will see 3 Config Variables that the Bluzelle Add-on had set, BLUZELLE_ADDRESS, BLUZELLE_PORT, and BLUZELLE_UUID)

# Support Contact
If you need help setting up the application to use our service, ask us at gitter: 

[![Join the chat at https://gitter.im/bluzelle/Lobby](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/bluzelle/Lobby)
