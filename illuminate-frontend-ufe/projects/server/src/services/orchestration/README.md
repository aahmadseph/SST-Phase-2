## There are 2 different types of orchestration files

### Server Side Rendered Page for SEO 
* Goes in projects/server/services/orchestration
* Should be named to properly reflect what the file is for, like productPages.js for product pages
* Signature is function someFunctionName(request, response) 
* Must handle errors and use sendErrorResponse
* Must handle redirects and use sendRedirect.js (sendTempRedirect and sendPermRedirect)
* Must call useServiceCaller on success of retrieving data
* Must properly handle error codes from backend
* Must update router.js for route 
  * app.get(url path, orchestrationHandler)  
* Use PromierHandler to call multiple APIs in parallel  
* See projects/server/services/orchestration/buyPages.js for an example
* More information here https://confluence.sephora.com/wiki/display/FEE/Working+in+JERRI+Code 

### Client Side Rendered Page
* Use clientSidePages.js, which is already pulled into router.js
* Easiest usage:

        app.get('insert your URL path here', (request, response) => {
            // use this if the page is RWD
            request.apiOptions.channel = 'rwd';  
            clientSidePage(request, response, 'insert your template here');
        });
* Alternate usage to call SEO microservice:

        app.get([`${CA_EN_FR}/beauty/challenges*`], (request, response) => {
            request.apiOptions.channel = 'rwd';
            clientSidePage(request, response, 'Content/EnhancedContent', {}, {
                enableNoindexMetaTag: false,
                seoURL: request.apiOptions.apiPath
            });
        });
* Alternate usage to call MEDIA microservice and pass flag to DISABLE SEO noindex:

        app.get(`${CA_EN_FR}/happening/stores/sephora-near-me`, (request, response) => {
            clientSidePage(request, response, 'Store/StoreLocator', null, {
                enableNoindexMetaTag: false,
                mediaId: MEDIA_IDS.SEPHORA_NEAR_ME
            });
        });
* Alternate usage to call SEO and MEDIA microservice and pass flag to DISABLE SEO noindex:

        app.get(`${CA_EN_FR}/happening/stores/sephora-near-me`, (request, response) => {
            clientSidePage(request, response, 'Store/StoreLocator', null, {
                enableNoindexMetaTag: false,,
                seoURL: request.apiOptions.apiPath,
                mediaId: MEDIA_IDS.SEPHORA_NEAR_ME
            });
        });
    