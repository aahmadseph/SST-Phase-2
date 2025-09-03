Files to update when updating nodejs

-   .npmrc
    -   npm uses this file as part of npm ci/install
-   package.json
    -   validation of nodejs and npm versions
-   Jenkinsfile
    -   downloads version of nodejs for build and test
-   tools/dockerfiles/Dockerfile.base
    -   docker base image that installs nodejs
-   .github/workflows/ufe.yml
    -   update which node to use by adding new line like
        UFE_CICD_NODE22_IMAGE: artifactory.lipstack.sephoraus.com/ufe:github-node22
    -   update references to use new image
-   need devops to create new image for the dockerfile
    -   we do not have permissions to do this so jira needs to be created with these instructions
    ```
    docker build --force-rm -f "automation/gitHub/Dockerfile" \
        --build-arg NODE_VERSION=22.12.0 \
        -t artifactory.lipstack.sephoraus.com/ufe:github-node22_12_0 .
    ```
    ```
    docker push artifactory.lipstack.sephoraus.com/ufe:github-node22_12_0
    ```
    -   the image can be verified to exist under here
        https://artifactory.lipstack.sephoraus.com/ui/packages/docker:%2F%2Fufe?name=ufe&type=packages

Files to update post upgrade of nodejs

-   config/loaders/BabelLoader.mjs
    -   controls what the target nodejs version is from webpack root bundle build
