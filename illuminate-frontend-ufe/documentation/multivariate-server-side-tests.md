# JERRI and Woody multivariate testing

## need to setup the route in router.mjs and / or apiRouter.mjs

-   add a line like (change product to url path of test)

    app.use(`${CA_EN_FR}/product/*`, serverSideABTestMiddleware);

## where to make changes

-   projects/server/src/services/middleware/serverSideABTestMiddleware.mjs

## simplist implementation you give:

-   a name => used for header/cookie/query param names
-   routes => a regexp for the routes
-   isActive => true/false if test is active, usually true
-   values => values allowed for cookie, usually true/false as strings

## example for product pages:

{

    name: 'product',
    routes: /^(\/product\/)/,
    isActive: true,
    values: ['true', 'false']

}

### this will generate:

-   a cookie rcps_product => use request.apiOptions.headers.Cookie[] or request.cookies[] to get this value
-   a header x-rcps-product => used on origin requests when cookie is not set yet
-   a query param rcps_product => used by QA/devs to switch experiences

## a DevOps Jira to update the Akamai config will be needed

-   this is per environment
-   Goes to DevOps board
-   should have simple title like "Create rcps_product cookie in prod env"
-   Acceptance Criteria
    -   Update cache key for routes [routes you specified]
    -   Add rcps\_[whatever name you put] cookie to cache key
    -   Add x-rcps-[whatever name you put] header to cache key
    -   Add rcps\_[whatever name you put] query param to cache key

## update JERRI code to look at request.apiOptions.headers.Cookie[<your cookie name>] and split your code
