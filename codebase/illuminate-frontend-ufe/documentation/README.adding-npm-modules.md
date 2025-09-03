# Adding new npms policy

-   Guidelines to ensure we aren't using npm modules that contain vulnerabilities
-   Every NPM module we use should be maintained by a trusted organization
-   Modules that are well known and have a lot of visibility on them can usually be considered safe
-   They should have at least 1 million downloads per week and be actively maintained
-   Our codebase should also be actively scanned for security vulnerabilities that could be introduced from these sources with a tool like veracode and automated security scans in our CI/CD pipeline like dependabot

## NPM Vetting Policy

-   What does this NPM do and why do we need it?
-   Can it be done easily in house?
-   Can we copy/paste a small amount of the module to achieve the same goal?
    -   If so will it be simple to maintain?
    -   What kind of licence does it have?
        -   Does it have an MIT license?
-   How large is it? Does it tree shake?
-   Is it maintained by a trusted org?
-   Is there a lot of visibility on this package?
    -   Over 1 million downloads per week? Has it been updated in the last year?

## When adding new npm to package.json

-   With monorepo make sure to add to the proper repo and not just add to all repo unless necessary
-   If this is for development then make sure to use --save-dev
-   Always make sure to use --save-exact as this prevents the wild card ^ from giving us random versions
