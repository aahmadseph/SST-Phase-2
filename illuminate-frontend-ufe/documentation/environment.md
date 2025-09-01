![Sephora](https://www.sephora.com/img/ufe/logo.svg)

# Table of contents

-   [Development tools](#development-tools)
-   [The repositories](#the-repositories)
-   [JavaScript part](#javascript-part)
-   [Redirect domain to local](#redirect-domain-to-local)
-   [Run](#run)
    -   [UI](#ui)
        -   [Isomorphic build mode](#isomorphic-build-mode)
        -   [Development build mode](#development-build-mode)
    -   [JERRI](#jerri)
-   [Restarting](#restarting)
-   [Unit testing](#unit-testing)
-   [Git hooks](#git-hooks)
-   [Troubleshooting](#troubleshooting)
-   [Legacy Setup For TOM](#legacy-setup-for-tom)
    -   [TOM](#tom)
    -   [Java part](#java-part)
    -   [Java](#java)
    -   [JENV](#jenv)
    -   [Maven](#maven)
    -   [JBOSS](#jboss)
    -   [Link JBOSS and TOM repo](#link-jboss-and-tom-repo)

# Development tools

**Note: Windows laptop users, install any Windows Subsystem for Linux (WSL).**

1. Install homebrew

    ```sh
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

2. Install git

    ```sh
    brew install git
    ```

3. (Optional) Required IDEs plugins/extensions/packages:
    - VSCode
        - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - it visually highlight code with errors or warnings.
        - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - we need it to format not only `*.js` files.
        - [Prettier ESLint](https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint) - we need it to enable usage of official Prettier's module [prettier-eslint](https://github.com/prettier/prettier-eslint).
    - Atom
        - [Prettier](https://github.com/prettier/prettier-atom) - after installing package go to it's settings and enable flag `ESLint Integration`. We need it to enable usage of official Prettier's module [prettier-eslint](https://github.com/prettier/prettier-eslint).
    - WebStorm
        - WebStorm comes with built-in support for Prettier. To run Prettier on save open `Preferences/Settings/Languages & Frameworks/JavaScript/Prettier` and tick the corresponding checkbox: `On save` action.
    - IntelliJ IDEA
        - [Prettier](https://plugins.jetbrains.com/plugin/10456-prettier) - To run Prettier on save open `Preferences/Settings/Languages & Frameworks/JavaScript/Prettier` and tick the corresponding checkbox: `On save` action.
    - Vim
        - [vim-prettier](https://github.com/prettier/vim-prettier) - read more [here](https://prettier.io/docs/en/vim.html).
    - Sublime Text
        - [Js​Prettier](https://packagecontrol.io/packages/JsPrettier)

# The repositories

1. Setup GitHub

    - Log into <https://github.com/Sephora-US-Digital>
    - Generate SSH key. Do not forget to replace placeholder in the example shell command!
        ```sh
        ssh-keygen -o -t rsa -b 4096 -C "replace_this_with_your_e-mail_address"
        ```
    - Copy public key into buffer
        ```sh
        pbcopy < ~/.ssh/id_rsa.pub
        ```
    - Once you have your ssh keys, please follow instructions listed here to finish adding them to GitHub: https://confluence.sephora.com/wiki/display/IIT/Setting+up+SSH+key+on+Github

2. Create a new folder for the repo.

    ```sh
    mkdir ~/sourcecode && mkdir ~/sourcecode/Sephora
    ```

3. Change to Sephora Directory

    ```sh
    cd ~/sourcecode/Sephora
    ```

4. Clone `ufe` repository
    ```sh
    git clone git@github.com:Sephora-US-Digital/illuminate-frontend-ufe.git ufe
    ```

# JavaScript part

1. Install `nvm` (Node Version Manager)
   Remove any previous installation of nvm before starting usually found in `~/.nvm`.

    ```sh
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | zsh
    ```

    Add the source lines from the snippet below to `~/.zshrc`.

    ```sh
    # place this after nvm initialization!
    autoload -U add-zsh-hook
    load-nvmrc() {
        local node_version="$(nvm version)"
        local nvmrc_path="$(nvm_find_nvmrc)"

        if [ -n "$nvmrc_path" ]; then
            local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

            if [ "$nvmrc_node_version" = "N/A" ]; then
                nvm install
            elif [ "$nvmrc_node_version" != "$node_version" ]; then
                nvm use
            fi
        elif [ "$node_version" != "$(nvm version default)" ]; then
            echo "Reverting to nvm default version"
            nvm use default
        fi
    }
    add-zsh-hook chpwd load-nvmrc
    load-nvmrc
    ```

    Run command

    ```sh
    source ~/.zshrc
    ```

2. The node version we use is defined in `~/sourcecode/Sephora/ufe/.nvmrc` file. You don't need to install `npm` as it gets installed along with the NodeJS. Run commant below to install NodeJS.
    ```sh
    cd ~/sourcecode/Sephora/ufe
    ```
    To test it run command:
    ```sh
    node --version && npm --version
    ```
3. To download all product dependencies run command

    ```sh
    npm ci
    ```

4. To build UI in isomorphic mode run command (this is not an optional step).
    ```sh
    npm run build:ui
    ```

# Redirect domain to local

Open up your hosts file. In OSX its located in `/private/etc/hosts`.

```txt
127.0.0.1        localhost
255.255.255.255  broadcasthost
::1              localhost
127.0.0.1        local.sephora.com
```

Copy the line `127.0.0.1 local.sephora.com` to the bottom of the file and save. Once your local instance is up and running you will be able to access it through this domain.

-   Once you have your local running, you can access the above domain in your browser at: `https://local.sephora.com/`

> Note! In some cases, the hosts file is restored to its original version when restarting the machine. To avoid this issue, ensure your VPN is turned off before editing your hosts file.

# Jerri SSL Key Setup

-   For existing UFE users, move `ssl_keys` directory into `projects/server`.

1. In projects/server folder `mkdir projects/server/ssl-keys`

2. Create SSL certificates

`openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout projects/server/ssl-keys/domain.keys -out projects/server/ssl-keys/domain.crt`

Enter place holder values for the certificate when prompted.

NOTE: You might have to execute the following command to get Chrome to allow you to accept the certificate

`sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain projects/server/ssl-keys/domain.crt`

# Run

Working with the project, it's the correct set-up to have three terminal consoles running at all times: one for UI, another for TOM (optional/legacy) and a third for JERRI.

## Quick commands to run your local application(UFE and JERRI):

Open new terminal window and go to UFE repo.

```sh
cd ~/sourcecode/Sephora/ufe
```

To run in frontend mode:

First install dependencies:

```
npm ci
```

First terminal

```sh
npm run build:ui:dev
```

Second terminal **(Only run after first command has executed successfully)**

```sh
npm run run:server:dev-frontend -- -- --enableMemoryCache --logLevel=verbose --profile=qa4
```

To run in isomorphic mode:

```sh
npm run build:ui && npm run run:server:dev -- -- --enableMemoryCache --logLevel=verbose --profile=qa4
```

## View in browser

To see running in the browser navigate to: [https://local.sephora.com:10443](https://local.sephora.com:10443)

For more detailed commands and options, continue reading below...

## UI

### Isomorphic build mode

This mode is what we use in production and it helps to reveal some errors unseen in development build mode. Any architecture related change has to be tested in this mode.

To build application in isomorphic mode run command:

```sh
npm run build:ui
```

To keep application running and rebuild it, whenever any JavaScript file has changed, use command:

```sh
npm run build-watch --workspace=ui
```

### Development build mode

To run and keep application running and rebuild it, whenever any JavaScript file has changed, use command:

```sh
npm run build:ui:dev
```

This script runs `webpack` in watch mode with some build optimizations including babel cache and multithreading, and also provides full source-maps for files in the bundles.

To speedup build process you can use another command but it will not provide source maps for the bundles and code in Chrome DevTools (as an example) will be in ES5 syntax:

```sh
npm run build-frontend-no-map --workspace=ui
```

## JERRI

Open new terminal window and go to UFE repo.

```sh
cd ~/sourcecode/Sephora/ufe
```

Read [README.jerri.router.md](./jerri.router.md#jerri) file how to run it for SPA pages.

> Information below is related to non SPA pages only.

To start the node template service run the command:

```sh
npm run start-develop --workspace=server
```

This will start the service in front-end render mode. This tells the service to render what would normally be rendered on the server side in the browser instead, which makes debugging much easier.

<<<<<<< Updated upstream
Open the site with `https://local.sephora.com:4000/`
=======
The service can be stopped with:

```sh
npm run stop --workspace=server
```

> > > > > > > Stashed changes

You can find JERRI logs here - `~/sourcecode/Sephora/ufe/logs`

# Restarting

It's rare, but if you have made or pulled a change to the node server or the webpack build configuration you will need to restart one or both. To restart the webpack watcher just control-c to quit and re-run `npm run build:ui:dev`. To restart node run `npm run start-develop --workspace=server` to restart in debug mode. Alternatively you can just stop node by running `npm run stop --workspace=server`.

# Unit testing

To perform UI unit tests run use command:

```sh
npm run test:ui
```

To perform server unit tests run use command:

```sh
npm run test:server
```

For watch mode use this command:

```sh
npm run test-watch --workspace=ui
```

Alternatively, you may prefer to run the autowatching karma via Intellij with the Karma plugin. If so, please refer to the following [article](https://www.jetbrains.com/help/idea/karma.html#ws_karma_running). Also, please note the `autotest` toggle in Intellij IDEA.

Test coverage report:

-   For the local build use this file `~/sourcecode/Sephora/ufe/test/output/html/index.html`. It's created after running `npm run test` command.
-   For the latest Jenkins build use this [link](https://jenkins.lipstack.sephoraus.com/view/frontend/job/code-build-ufe/Test_20Reports/)

# Git hooks

To automatically run code formatters, unit tests and ESLint checks before every commit, install the pre-commit hook into the git roll-out in your project's root.

```sh
ln -s FULL_PATH_TO_PROJECT_ROOT/githooks/pre-commit FULL_PATH_TO_PROJECT_ROOT/.git/hooks
```

You may be required to set permissions to run the `pre-commit` script, so just to be safe run `chmod +x .git/hooks/pre-commit` once from the project's root directory after you've successfully installed the pre-commit hook.

To automatically run unit tests before every push, install the pre-push hook into the git roll-out in your project's root.

```sh
ln -s FULL_PATH_TO_PROJECT_ROOT/githooks/pre-push FULL_PATH_TO_PROJECT_ROOT/.git/hooks
```

You may be required to set permissions to run the `pre-push` script, so just to be safe run `chmod +x .git/hooks/pre-push` once from the project's root directory after you've successfully installed the pre-push hook.

All devs should be using either the pre-commit or pre-push hook to ensure that their changes meet the project standards.

# Troubleshooting

Use this wiki page to troubleshoot some well known issues discovered before - [Local Dev Environment Troubleshooting](https://confluence.sephora.com/wiki/pages/viewpage.action?spaceKey=ILLUMINATE&title=Local+Dev+Environment+Troubleshooting)
