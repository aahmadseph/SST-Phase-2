![Sephora](https://www.sephora.com/img/ufe/logo.svg)

# Table of contents

-   [WSL](#wsl-setup)
-   [Setup Localhost](#setup-localhost)
-   [Jerri SSL Key Setup](#jerri-ssl-key-setup)
-   [Changes to make code work on Windows](#changes-to-make-code-work-on-windows)
-   [Building the code](#building-the-code)
-   [Running the Code](#running-the-code)

# WSL Setup

**Note: These are steps specific to Windows 11. We assume that you've already setup the codebase and have a supported IDE installed**

1. Install WSL
   Open powershell and type in the following command:

    ```sh
    wsl --install
    ```

    It is recommended to run everything via WSL2 so run this:

    ```sh
    wsl --set-default-version 2
    ```

    To launch wsl, simply open a new powershell session and type:

    ```sh
    wsl
    ```

    We also need to make sure we run everything via 'bash' in our WSL. A quick way to check would be via this command when wsl is running:

    ```sh
    echo $SHELL
    ```

    If it returns /bin/bash, you're good.If it shows something like /usr/bin/zsh, fish, or another shell, then bash is not the default.

    A temporary and quick fix would be to run the WSL in a powershell by this commmand:

    ```sh
    wsl -e bash
    ```

    Verify now again before proceeding further

# Setup Localhost

While inside the wsl, type in the following command:

```sh
sudo nano /etc/hosts
```

The default password for WSL is unix

Add this line at the end of all IpV4 addresses:

```sh
127.0.0.1 local.sephora.com
```

Then press Ctrl+O to save it and Ctrl+X to exit.

# Jerri SSL Key Setup

1. In projects/server folder mkdir projects/server/ssl-keys
2. Create SSL certificates

    ```sh
    openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout projects/server/ssl-keys/domain.keys -out projects/server/ssl-keys/domain.crt
    ```

    Enter place holder values for the certificate when prompted.

3. Type in these commands to get Chrome to allow you to accept the certificate

    ```sh
    sudo cp projects/server/ssl-keys/domain.crt /usr/local/share/ca-certificates/domain.crt
    sudo update-ca-certificates
    ```

# Changes to make code work on Windows

Since windows follows a different way to handle escape characters and WSL has its own limitations we need to do few things to make it work. Unfortunately these changes have to be done everytime we run.

1. Open the package.json file inside projects/ui and update the line for 'build-frontend' and add the following just after 'node':
   `sh --max_old_space_size=4096 `

    Sample result:

    ```sh
     "build-frontend": "BUILD_OPTIMIZATIONS=true BUILD_MODE=frontend node --max_old_space_size=4096 ../../node_modules/.bin/webpack --watch --progress"
    ```

    This is to avoid a 'heap out of memory' error. We've allocated 4GB to it (4096) but it can be reduced based on the system.

2. Open the package.json file inside the projects/server and update the line for 'run-dev' and add the following in the beginning:

    ```sh
    bash
    ```

    Sample result:

    ```sh
    "run-dev": "bash tools/router.sh --start --port=10443"
    ```

3. To fix an escape character issue with few important files, we need to do the following:

    ```
    cd projects/server
    sed -i 's/\r//' tools/router.sh
    sed -i 's/\r//' tools/runProfiles/azr-qa4.profile.sh
    ```

# Building the code

Follow the following commands to build the codebase.

1. Make sure you're in the main directory of the codebase and have checked out the develop branch. Do this in the powershell/Git bash to be sure:

    ```
    git checkout dev && git pull;
    ```

2. Run the following commands in wsl one by one(make sure you're in bash):

    ```
    npm run clean;
    npm ci;
    rm -rf projects/ui/dist;
    ```

# Running the Code

1. Open wsl(with bash) in a new powershell terminal. Type in the following command:

    ```sh
    npm run build:ui:dev
    ```

2. Once you see the message 'compiled successfully' open another terminal with wsl in a new tab, pointing to the same directory as the first one. Then run either of the this command:

    ```
    npm run run:server:dev-frontend -- -- --enableMemoryCache --logLevel=verbose --profile=qa4
    ```

    Check https://local.sephora.com:10443/ in a browser.

If there are no errors in the terminal(You see a watermark for UFE and Jerri) but if you don't see anything on the URL, try ether of the following commands:

```
npm run run:server:dev-frontend -- -- --enableMemoryCache --logLevel=verbose --profile=qa4 --start
```

```
npm run run:server:dev-frontend -- -- --enableMemoryCache --logLevel=verbose --profile=qa4 --useEmbeddedUFE
```

If you see an error that mentions a path issue with the directory pointing to ~ufe, run this command instead as it will set the correct UFE_HOME forcefully in wsl:

```
UFE_HOME=/mnt/c/Github/UFECode/illuminate-frontend-ufe npm run run:server:dev-frontend -- -- --enableMemoryCache --logLevel=verbose --profile=qa4 --start
```

Check https://local.sephora.com:10443/ in a browser and you should be able to see the Sephora webpage.
