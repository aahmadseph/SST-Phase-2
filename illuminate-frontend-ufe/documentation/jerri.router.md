# JERRI

## JavaScript Enterprise Routing and Rendering Implementation

# Getting started with Jerri

##### Branch all

##### Setup

1. In projects/server folder `mkdir projects/server/ssl-keys`

2. Create SSL certificates

`openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout projects/server/ssl-keys/domain.keys -out projects/server/ssl-keys/domain.crt`

Enter place holder values for the certificate when prompted.

NOTE: You might have to execute the following command to get Chrome to allow you to accept the certificate

`sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain projects/server/ssl-keys/domain.crt`

3. In one terminal window

`build:ui` or `npm run build:ui:dev`

4. In a third terminal

`npm run run:server:dev`

OR

`run:server:dev-frontend`

OR

`sudo bash projects/server/tools/router.sh`

Alternatively you can start UFE and Jerri both in one command:

`sudo npm run start-jerri --workspace=server -- --start`

OR

`sudo npm run start-jerri-frontend --workspace=server -- --start`

OR

`sudo bash projects/server/tools/router.sh --start `

6. To stop jerri type

`sudo npm run stop-jerri --workspace=server`

##### passing in other options

-   --help prints this help menu
-   --start starts UFE
-   --inline starts UFE rendering embedded in JERRI
    performance will be horrible
-   --frontend starts UFE in frontend mode
    you still need to run npm run webpack-frontend\* scripts
-   --ufe= number of UFE worker threads to start
    example --ufe=6 starts 6 UFE template_child.js processes
-   --workers= number of JERRI worker threads to start
    example --workers=10 starts 10 JERRI router.js processes
-   --profile= which environment to connect to
    example --profile=azr-qa3 connects to qa3 in azure
-   --port= which port JERRI should run on, default is 443
    port 443 requires sudo but any port over 1024 does not
    for this to work right, --start should be used
    or UFE needs to be started with RENDER_HOST and RENDER_PORT
    set in the environment and RENDER_PORT must match --port= value
-   --inspect start in debug mode
-   --redis use redis

##### Codebase

-   router.sh
    -   projects/server/tools/router.sh
    -   current environment configuration
    -   can pass qa, qa2, qa3, or qa4 or dev server to change env that is being proxied
    -   needs to be run using sudo unless using --port= for alternate port above 1024
-   router.js is an expressjs basic setup
    -   entry point ufe/projects/server/src/services/router.js
-   projects/server/src/services/middleware => middleware for expressjs
    -   adds some properties onto the request object that is then used by the apis
    -   tracks how long a request takes from ~start to finish
-   projects/server/src/services/utils => where the utils are
    -   includes headers (headers.js)
    -   includes api request code which returns promises (apiRequest.js)
    -   TODO clean up
    -   includes generic proxyGETRequest, nodeServiceCaller, EventManager and a few other utils
-   projects/server/src/services/api => where the APIs are
    -   api call configuration
    -   each file should be less than 25 lines
    -   avoid logic in these files, ideally they just ufeGet (or ufePost) and return the promise
    -   caching time setup goes in the files
-   orchestration => where the api orchestration happens
    -   no graphql at this time
    -   currently uses EventManager/events over Promise.all
    -   calls nodeServiceCaller which is the node service to render the pages

##### Debugging

-   run the script

    `bash projects/server/tools/router.sh --inspect`

OR

`sudo npm run start-jerri --workspace=server -- --inspect`

-   pass in any other options you need to pass in, like --profile= for the environment
-   watch the output for

    `Debugger listening on`

-   open the browser up and go to

    `chrome://inspect`

-   on the left select Devices
-   in the area that says 'Remote Target' click on the inspect under the entry point for what you want to debug
-   for JERRI this would be router.js
-   for UFE this would be either ufe.js or template_child.js
-   chrome devtools will open up and you are now ready to debug and / or profile
-   it is important to note that not all the functionality that is in the browser developer tools is available in the chrome inspector
-   to set breakpoints use the sources tab, just like you would if you were debugging in the browser
-   there are 2 ways of profiling, the memory tab and the profiler
-   the memory tab is useful for detecting memory leaks
-   the profiler is helpful in looking at how long code takes to run

###### From https://nodejs.org/en/docs/guides/debugging-getting-started/

-   Open chrome://inspect in a Chromium-based browser or edge://inspect in Edge
-   Click the Configure button and ensure your target host and port are listed

###### Also read

-   https://marmelab.com/blog/2018/04/03/how-to-track-and-fix-memory-leak-with-nodejs.html
