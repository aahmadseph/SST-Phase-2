const createConfiguration = () => ({
    Util: {
        InflatorComps: {
            Comps: {},
            services: { loadEvents: {} }
        },
        Perf: {
            getLogs: () => {},
            getMeasurements: () => {},
            getSummary: () => {},
            loadEvents: [],
            report: () => {},
            getEntrySize: () => {},
            resetImageDedup: () => {},
            isReportSupported: () => {
                return window.performance && typeof window.performance.mark === 'function';
            }
        },
        TestTarget: {},
        getQueryStringParams: () => {},
        shouldGetWelcomeMats: () => {},
        getCurrentUser: () => {},
        getBasketCache: () => {},
        getUserInfoCache: () => {},
        shouldGetUserFull: () => {},
        shouldGetTargeters: () => {},
        shouldGetTargetedPromotion: () => {},
        onLastLoadEvent: (target, events, callback) => {
            let count = 0;
            const { loadEvents } = Sephora.Util.InflatorComps.services;

            for (let i = 0; i < events.length; i++) {
                if (loadEvents[events[i]] && ++count === events.length) {
                    callback();
                } else {
                    target.addEventListener(
                        events[i],
                        () => {
                            if (++count === events.length) {
                                callback();
                            }
                        },
                        false
                    );
                }
            }
        }
    },
    buildInfo: {
        BUILD_NUMBER: 1
    },
    debug: { dataAt: key => key },
    isLazyLoadEnabled: false,
    renderQueryParams: {
        country: '',
        urlPath: ''
    },
    configurationSettings: {
        bvApi_ppage: {},
        bvApi_review_page: {},
        bvApi_rich_profile: {},
        core: {},
        isNLPSearchEnabled: false,
        productPageConfigurations: {},
        spaEnabled: false,
        sdnDomainBaseUrl: 'https://qa-api-developer.sephora.com'
    },
    DOMContentLoadedFired: true,
    channel: null,
    analytics: {
        backendData: {},
        promises: {},
        resolvePromises: {},
        utils: {}
    },
    fantasticPlasticConfigurations: {},
    loadFunctions: {
        onLoad: () => {},
        onDomContentLoad: () => {}
    },
    isNodeRender: false,
    isSPA: false,
    spaEnabled: false,
    renderedData: { template: '' },
    isMobile: () => {},
    isDesktop: () => {},
    performance: {
        renderTime: {
            printOutDynatraceStatistics: () => {},
            updateDigitalData: () => {},
            components: {},
            getComponentDataByName: function (name) {
                let dictionaryEntry = this.components[name];

                if (!dictionaryEntry) {
                    dictionaryEntry = {
                        counter: 0,
                        renderTime: 0,
                        renderFunctionTime: 0,
                        rootRenderTime: 0
                    };
                    this.components[name] = dictionaryEntry;
                }

                return dictionaryEntry;
            }
        },
        clear: () => {}
    },
    state: {},
    CheckoutMain: function () {
        this.state = {
            focus: {
                isInitialized: false
            },
            orderDetails: {
                header: {}
            }
        };
    }
});

var parentElement = document.createElement('div');
var componentElement = null;
require('core-js/actual');
require('regenerator-runtime/runtime');

window.enzyme = require('enzyme');
var adapter = require('enzyme-adapter-react-16');
window.enzyme.configure({ adapter: new adapter() });

function initialize() {
    /* eslint no-extend-native:0 */
    Function.prototype.ensure = function (arr, func) {
        return func();
    };

    window.using = function (description, paramsArray, callback) {
        paramsArray.forEach(callback);
    };

    window.Sephora = createConfiguration();

    window.DOMParser = function () {};

    /* Fallback in case testing environment does not support rAF. Note that the fallback works
    synchronously, as opposed to requestAnimationFrame */
    window.requestAnimationFrame =
        window.requestAnimationFrame ||
        function (callback) {
            return callback();
        };
    window.process = {
        env: {
            NODE_ENV: 'production',
            UFE_ENV: 'PROD'
        }
    };

    // Display the test name in the CLI console as the tests are running
    // if the TESTNAME environment variable is set when running the tests
    if (process.env.TESTNAME) {
        jasmine.getEnv().addReporter({
            specStarted: function (result) {
                window.console.error(result.fullName);
            }
        });
    }

    const originalErrorFunc = window.console.error;
    const originalWarningFunc = window.console.warn;
    const warningToIgnore = [
        'You need to pass your component as a second parameter to ' +
            'store.subscribe or store.setAndWatch, ' +
            'otherwise there’s a risk to stay subscribed on the unmounted component.' +
            'If you want to ignore automatic unsubscription, please pass ' +
            '{ ignoreAutoUnsubscribe: true } as a second parameter to store.subscribe or store.setAndWatch',
        'no Activity id provided'
    ];
    const originalLogFunc = window.console.log;
    const logsToIgnore = ['|****** SPA Load Started ******|', 'something something something', ' [LazyLoad] name:', 'some a', 'some b', 'some c'];

    let originalStyleTags;
    beforeEach(async () => {
        try {
            // Clear require cache every time so tests don't interfere with one another
            Object.keys(require.cache).forEach(function (key) {
                delete require.cache[key];
            });
            const { UFE_ENV_PRODUCTION } = require('utils/framework/Constants');
            global.process.env.UFE_ENV = UFE_ENV_PRODUCTION;
            spyOn(window.console, 'error').and.callFake(function () {
                if (arguments[0] === true) {
                    originalErrorFunc.apply(console, arguments);
                }
            });
            spyOn(window.console, 'warn').and.callFake(function () {
                if (!warningToIgnore.includes(arguments[0])) {
                    originalWarningFunc.apply(console, arguments);
                }
            });
            spyOn(window.console, 'log').and.callFake(function () {
                if (![...arguments].some(argument => logsToIgnore.some(logEntry => argument.includes(logEntry)))) {
                    originalLogFunc.apply(console, arguments);
                }
            });
            /*eslint camelcase: ["error", {properties: "never"}]*/
            window.digitalData = {
                page: {
                    attributes: {
                        eventStrings: [],
                        previousPageData: { recInfo: {} },
                        search: {},
                        sephoraPageInfo: { categoryFilters: [] }
                    },
                    category: {},
                    pageInfo: {}
                },
                performance: {},
                product: []
            };
            window.Sephora = createConfiguration();

            window.data = { templateInformation: { template: '' } };
            window.global = false;

            /* Mock FingerprintJS global variable */
            window.FingerprintJS = {
                load: () => Promise.resolve({ get: () => Promise.resolve({ components: { fonts: [] } }) }),
                hashComponents: () => '11111'
            };
            window.braze = {
                getUser: () => ({
                    setCustomUserAttribute: () => {},
                    setEmail: () => {},
                    setDateOfBirth: () => {}
                })
            };

            window.ConstructorioTracker = {
                setClientOptions: () => {}
            };

            //Create Promises
            require('analytics/promises').default(Sephora.analytics);
            require('analytics/loadAnalytics');

            Sephora.analytics.promises.initialPageLoadFired = new Promise(function (resolve) {
                Sephora.analytics.resolvePromises.initialPageLoadFired = resolve;
            });

            // Clear local storage before each run
            window.localStorage.clear();

            window.fetch = function () {
                const response = {
                    json: function () {
                        return Promise.resolve({});
                    },
                    text: function () {
                        return Promise.resolve({});
                    },
                    status: 200
                };

                return Promise.resolve(response);
                //return {
                //    then: function (callback) {
                //        return callback();
                //    },

                //    catch: function (callback) {
                //        return callback();
                //    }
                //};
            };

            // require.ensure is used to package nested requires in components.chunk.js
            // rather than priority.bundle.js in order to keep priority.bundle.js lean
            await require.ensure(
                [],
                require => {
                    const React = require('react');
                    spyOn(React, 'memo').and.callFake(component => component);
                    const Location = require('utils/Location').default;
                    spyOn(Location, 'reload');
                    spyOn(Location, 'setLocation');
                    spyOn(HTMLFormElement.prototype, 'submit');

                    // when component is shallow-rendered,
                    // this method helps to dive into the Component Tree and get the inner text
                    enzyme.getText = function (textElem) {
                        let result = textElem;

                        while (['span', 'p', 'div'].indexOf(result.name()) === -1) {
                            result = result.dive();
                        }

                        return result.text();
                    };

                    if (componentElement) {
                        parentElement.appendChild(componentElement);
                    }
                },
                'components'
            );
        } catch (error) {
            window.console.dir(error);
        }

        // Keep track of the original style tags
        originalStyleTags = Array.from(document.head.getElementsByTagName('style'));
    });

    afterEach(() => {
        try {
            jasmine.clock().uninstall();

            if (componentElement) {
                const ReactDOM = require('react-dom');
                ReactDOM.unmountComponentAtNode(parentElement);

                componentElement = null;
            }

            // Get all style tags
            const currentStyleTags = Array.from(document.head.getElementsByTagName('style'));

            // Filter out the original style tags
            const newStyleTags = currentStyleTags.filter(tag => !originalStyleTags.includes(tag));

            // Remove the new style tags
            newStyleTags.forEach(tag => tag.parentNode.removeChild(tag));
        } catch (error) {
            window.console.dir(error);
        }
    });
}

module.exports = { initialize };
