# Configuration (util/configuration aka Sephora.configuration) in JERRI

## How to use getConfigurationValue()

-   signature getConfigurationValue(options, property-name, default-value)
-   from projects/server/src/services/utils/configurationCache
-   options is request.apiOptions
-   property-name is the name of the property you want to get, MUST BE A STRING
-   default-value is the default if the property does not exist or if for some reason the data is empty ( memory cache is disabled or just flushed )
-   this method returns the first child sub property util/configuration API
-   This parses the /v1/util/configuration api ( same data as found in Sephora.configurationSettings )
-   only looks at first level
-   foo.bar wont work
-   foo will work and return properties under foo or foos value

## for preview environments

-   you will need to use url parameters to switch
-   for example to set isAuthServiceResetPassEnabled to false you would do the following:

`https://true-azre1-preview.sephora.com:10443/shop/skincare?setConfigValue=isAuthServiceResetPassEnabled:false`

`https://true-azre1-preview.sephora.com:10443/shop/skincare?setConfigValue=isAuthServiceResetPassEnabled:false|isSomeOtherSwitch=false`

## for local environments

-   you will need to use url parameters to switch like preview
-   you will want to run without --enableMemoryCache option to the router as you want memory caches disabled

`https://local.sephora.com:10443/shop/skincare?setConfigValue=isAuthServiceResetPassEnabled:false`

`https://local.sephora.com:10443/shop/skincare?setConfigValue=isAuthServiceResetPassEnabled:false|isSomeOtherSwitch=false`

## in code example to get Auth Reset Pass switch

`const isBXSEnabled = getConfigurationValue(options, 'isAuthServiceResetPassEnabled', true);`
