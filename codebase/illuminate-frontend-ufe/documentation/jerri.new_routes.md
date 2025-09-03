## For any new page routing that are added to JERRI the following things MUST be checked and necessary Jiras created to proper teams

### First add the route in JERRI in router.js

-   This will allow you to work on the page locally
-   Any page can be added to JERRI at any time and unless all the next steps are done it will only be available local

### You will need to create a Jira for MCP for routing changes

-   This will allow you to see the page by directly hitting the JERRI instance in any environment that the yml files have been updated for
    -   Example: directly hitting passion-azre1-jerri-qa4.sephora.com/some-new-url
-   All new pages should go in jerri content cluster in eus1 and wus1
-   Jiras for MCP
    -   Project = MSP MicroServices Platform
    -   Acceptance Criteria
        -   In jerri-content/prod/gw.yml and jerri-content-canary/prod/gw.yml and jerri-content-az2/prod/gw.yml for both eus1 and wus1 add
            -   /some-new-url
        -   NOTE: instead of adding in FULL URL add in base path if possible, so instead of /beauty/some-new-url /beauty IF it is not already there
        -   Check https://gitlab.lipstack.sephoraus.com/kubernetes/k8s-state/applications/eus1-omni-prod/-/tree/master/jerri-content/prod/gw.yml to verify the URL does not exist there
-   Example MCP Jiras for Akamai routing in production
    -   MSP-1987 (NOTE: only mention content cluster)

### You will need to create a Jira for DevOps for Akamai changes for Akamaized environments

-   Jiras for DevOps
    -   Project = DevOps
    -   Acceptance Criteria
        -   Route /some-new-url to JERRI content cluster
-   Example DevOps Jiras for Akamai routing in production
    -   DEVOPS-31402
    -   DEVOPS-31437
-   `Routing to JERRI via Akamai takes effect only after full deployment. Akamai changes are done after full release`

### You will need to create a Jira for Network Engineering (NE) for Preview changes

-   Routing on preview env is managed via F5 Load Balancer (LB) and on Production via Akamai routing config updates
-   Create NE Jira (ex: NE-6449) for qa4 preview env. Once tested and passed clone the same with updated URLs for prod preview (ex: NE-6568)
-   For prod preview we need to submit a change request and it does not need specific approvals

### Kill switch flags should be used to turn the feature OFF during Canary release and turn it ON during full deployment night
* all features should have kill switches to disable them 
