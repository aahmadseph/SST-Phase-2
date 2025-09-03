# Docker

## Prerequisites to use docker

1.) Install docker desktop

-   [Install Docker Desktop on Mac](https://docs.docker.com/desktop/mac/install/)
-   [Install Docker Desktop on Windows](https://docs.docker.com/desktop/windows/install/)

) Restart workstation and start Docker Desktop

# Getting Started with docker-compose

1.) First open one terminal and start webpack

     npm run build-watch --workspace=ui

2.) Open another terminal to run docker-compose and passing in environment

    PROFILE_HOST=qa4 npm run compose-jerri-ufe-up --workspace=server

OR iso mode

    PROFILE_HOST=qa4 npm run compose-isomode-up --workspace=server

3.) navigate to https://local.sephora.com and you should see the homepage

4.) to make changes make sure you take down the containers with the following

    npm run compose-jerri-ufe-down --workspace=server

OR iso mode

    npm run compose-isomode-down --workspace=server

5.) Then let webpack finish bundling before running the command from step 2.
