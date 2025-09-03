// routes is a regexp of the paths to run for the tests
// name is the name of the test
// routes is ALL routes that apply to that test, browser URLs not the endpoints
// headerName defaults to x-rcps-${name}
// cookieName defaults to rcps_${name}
// queryParamName defaults to rcps_${name}
// isActive is true of false, and true = active test
// values are the values of the test
const AB_TESTS = [
    // ab test for PXS Product API
    {
        name: 'product',
        routes: /^(\/product\/)/,
        isActive: true,
        values: ['true', 'false']
    },
    {
        name: 'basket',
        routes: /^(\/basket\/)/,
        isActive: true,
        values: ['true', 'false']
    },
    {
        name: 'checkout',
        routes: /^(\/checkout*)/,
        isActive: true,
        values: ['true', 'false']
    },
    {
        name: 'frictionless_checkout',
        routes: /^(\/checkout*)/,
        isActive: true,
        values: ['true', 'false']
    }
];

function getHeaderName(testName) {
    return 'x-rcps-' + testName.replace('_', '-');
}

function getCookieName(testName) {
    return 'rcps_' + testName;
}

function getQueryParamName(testName) {
    return 'rcps_' + testName;
}

// this allows custom header, cookie or query param names
// also this runs on start up of app instead of each request
AB_TESTS.forEach(item => {
    if (!item.headerName) {
        item.headerName = getHeaderName(item.name);
    }

    if (!item.cookieName) {
        item.cookieName = getCookieName(item.name);
    }

    if (!item.queryParamName) {
        item.queryParamName = getQueryParamName(item.name);
    }
});

// this updates the abTest field that gets set as part of the cache keys
// redis, mem caches, ufe all use this as part of caches keys
function setABTestOption(req, cookie, value) {
    if (req.apiOptions.abTest && req.apiOptions.abTest.length > 0 && req.apiOptions.abTest !== 'false') {
        req.apiOptions.abTest += '&' + cookie + '_' + value;
    } else {
        req.apiOptions.abTest = cookie + '_' + value;
    }
}

// need to update req.apiOptions.headers.Cookie
// and the req.cookies
function setRequestCookie(req, cookieName, value) {
    req.cookies[cookieName] = value;
    req.apiOptions.headers.Cookie[cookieName] = value;
}

// in some cases we need to set a response cookie to the user
function setResponseCookie(res, cookieName, value) {
    res.cookie(
        cookieName,
        value, {
            path: '/',
            encode: String,
            // Expires in 60 days
            expires: new Date(Date.now() + 60 * 86400000),
            secure: true
        }
    );
}

function setExperience(request, response, cookieName, experienceValue, setCookieResponse = false) {
    if (cookieName) {
        setRequestCookie(request, cookieName, experienceValue);

        if (setCookieResponse) {
            setResponseCookie(response, cookieName, experienceValue);
        }
    }
}

export default function serverSideABTestMiddleware(request, response, next) {
    // killswitch check should be done in test code
    // this value request.apiOptions.abTest will never be set
    // as this is the first reference to it
    request.apiOptions.abTest = request.apiOptions.abTest || 'false';

    AB_TESTS.forEach(test => {
        if (test.isActive) {
            const isActiveRoute = request.apiOptions.apiPath.match(test.routes);

            if (isActiveRoute) {
                const {
                    cookieName,
                    headerName,
                    queryParamName,
                    values
                } = test;

                // Set Experience by queryParam (?rcps_pla=true)
                if (request.query[queryParamName] && values.includes(`${request.query[queryParamName]}`)) {
                    const experienceValue = request.query[queryParamName];
                    setExperience(
                        request,
                        response,
                        cookieName,
                        experienceValue,
                        true
                    );
                    setABTestOption(request, cookieName, experienceValue);
                    // set experience by header
                } else if (request.headers[headerName] && values.includes(`${request.headers[headerName]}`)) {
                    const experienceValue = request.headers[headerName];
                    setExperience(
                        request,
                        response,
                        cookieName,
                        experienceValue,
                        true
                    );
                    setABTestOption(request, cookieName, experienceValue);
                    // if cookie already set just set apiOption.abTest
                } else if (request.cookies[cookieName] && values.includes(`${request.cookies[cookieName]}`)) {
                    setABTestOption(request, cookieName, request.cookies[cookieName]);
                }
            }
        }
    });
    next();
}
