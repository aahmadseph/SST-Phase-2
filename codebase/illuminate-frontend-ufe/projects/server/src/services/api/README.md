
## There are 3 different types APIs that JERRI can call
1. ATG
2. http 
3. https

### ATG
* Legacy API to talk to ATG
* require / import ufeGet from projects/server/src/services/utils/apiRequest.js
* All calls are over http
* Most environments are setup to handle this in tools/runProfiles
* New API calls are not going into ATG, they should be microservices
* Heavily relies on request.apiOptions
* local these files use tools/runProfiles and in lower env and prod there are aks yml files that have config values
  * no need to update configuration
* Method signature ufeGet(url, headers = {}, options = {})
  * url is the ATG API URL that needs to be called
  * headers = apiOptions.headers
  * options = apiOptions and if caching is enabled then cacheTime is added to apiOptions 
* More information here https://confluence.sephora.com/wiki/display/FEE/Working+in+JERRI+Code 

### http and https
* These APIs are the same but one is not secure (http) and one is secure (https)
* import httpsRequest or httpRequest from projects/server/src/services/utils/apiRequest.js
* NEW config is in server/config/apiConfig.js 
  * Both contentful/CMS API/CXS and commerce tools/BXS are already configured
  * New server connections would be added here using getEnvProp
  * Confiig for a server consists of a host and port and host 
  * The env properties should have unique names from other hosts
  * Ports can conflict as they go to different hosts and are outbound 
* Method signatures are identical just method names are different httpRequest(host, port, urlPath, method = 'GET', apiOptions = {}, postdata, headersIn = {}) vs httpsRequest(host, port, urlPath, method = 'GET', apiOptions = {}, postdata, headersIn = {})
  * host - this is the host from server/config/apiConfig.js
  * port - this is the port from server/config/apiConfig.js
  * urlPath - the URL endpoint
  * method - http method, GET, POST, and so on
  * apiOptions = apiOptions and if caching is enabled then cacheTime and cachehKey are added to apiOptions 
  * postdata - undefined unless method is POST or PUT
  * headers = apiOptions.headers

* All APIs should implement the following interface 
  <pre>function apiFilename(options) {

    // return using one of the methods above
    // or if there is some logic, then return a new Promise()
    return new Promise();
  }</pre>

### API Antipatterns
* If your API file is more than 50 lines of code, you are likely doing something wrong
* API Options should be passed unmodified from orchestration file to the request as modifying it impacts caching
* Do not destructure the options in the arguments to the function
  * Bad
    <pre>export function getCategory({
        country = 'US',
        ...options
      }
    </pre>
  * Good
    <pre>export function getCategory(options) {
        const {
          country
        } = options;
    </pre>
  * Bad - causes request object to be passed around unnecessarily
    <pre>
      export function getCategory(request) { ... }
    </pre> 
  * Bad - should only be 1 argument
    <pre>
      export function getCategory(options, headers) { ... }
    </pre>          
* All APIs should implement some type of caching, see projects/server/src/services/utils/cacheTimes.js for available cache times, for example:
  <pre>
    const addCaching = Object.assign({}, options, {
        cacheTime: CACHE_FIVE_MINUTES
    });
  </pre>
  For none ATG APIs to add caching you also need to specify the cache key, typically URL
  <pre>
    const addCaching = Object.assign({}, options, {
        cacheKey: url,
        cacheTime: CACHE_FIVE_MINUTES
    });
  </pre>        

### Example API file:
<pre>
  import {
      httpsRequest
  } from '#server/src/services/utils/apiRequest.mjs';
  import {
      withSdnToken
  } from '#server/src/services/api/oauth/sdn/withSdnToken.mjs';
  import {
      CACHE_THIRTY_MINUTES
  } from '#server/src/services/utils/cacheTimes.mjs';
  import {
      SDN_API_HOST,
      SDN_API_PORT
  } from '#server/src/config/envRouterConfig.mjs';

  function test(options) {

      const requestUrl = /v1/test;

      const apiOptions = {
          ...options
      };

      const headers = {
          'x-country-code': options.country,
          'x-source': options.channel,
          'x-locale': options.language,
          'x-request-timestamp': `${Date.now()}`,
          authorization: `Bearer ${sdnAccessToken}`
      };

      return httpsRequest(SDN_API_HOST, SDN_API_PORT, requestUrl, 'GET', apiOptions, {}, headers);
  }

  export default withSdnToken(test);
</pre>

  
