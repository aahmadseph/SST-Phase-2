/* eslint-disable ssr-friendly/no-dom-globals-in-module-scope */
import '@testing-library/jest-dom';
import 'core-js/actual';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';
import { setupServer } from 'msw/node';
import apiHandlers from '../__mocks__/apiHandlers';
import ErrorsAccumulator from './ErrorsAccumulator';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

window.process = {
    ...window.process,
    env: {
        ...window.process.env,
        NODE_ENV: 'test',
        UFE_ENV: 'PROD'
    }
};

if (!window.crypto.subtle) {
    window.crypto.subtle = {
        digest: async (algorithm, data) => {
            const { createHash } = await import('node:crypto');
            const hash = createHash(algorithm.replace('-', '').toLowerCase());
            hash.update(new Uint8Array(data));

            return Promise.resolve(hash.digest().buffer);
        }
    };
}

class IntersectionObserverMock {
    constructor(callback, options) {
        this.callback = callback;
        this.options = options;
    }

    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
    takeRecords = jest.fn();

    // Allow manually triggering the callback
    trigger = entries => {
        this.callback(entries, this);
    };
    // Example on how to use it:
    // test('should do something on intersection', () => {
    //     const observerInstance = new IntersectionObserver(() => {});
    //     observerInstance.trigger([
    //         { isIntersecting: true, target: /* element ref */ {} },
    //     ]);
    // });
}

Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock
});

Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock
});

// prettier-ignore
const createConfiguration = () => ({
    analytics: {
        backendData: {},
        promises: {},
        resolvePromises: {},
        utils: {}
    },
    buildInfo: {
        BUILD_NUMBER: 1
    },
    channel: null,
    CheckoutMain: function () {
        this.state = {
            focus: {
                isInitialized: false
            },
            orderDetails: {
                header: {}
            }
        };
    },
    configurationSettings: {
        'bvApi_ppage': {},
        'bvApi_review_page': {},
        'bvApi_rich_profile': {},
        core: {},
        gqlAPIEndpoint: '/gway/v1/graph',
        gqlTTLs: { testQuery: '12345' },
        isNLPSearchEnabled: false,
        productPageConfigurations: {},
        sdnDomainBaseUrl: 'https://qa-api-developer.sephora.com',
        sdnUfeAPIUserKey: 'sdnUfeAPIUserKey',
        spaEnabled: false
    },
    debug: { dataAt: key => key },
    DOMContentLoadedFired: true,
    fantasticPlasticConfigurations: {},
    isDesktop: () => {},
    isJestEnv: true,
    isLazyLoadEnabled: false,
    isMobile: () => {},
    isNodeRender: false,
    isSPA: false,
    loadFunctions: {
        onDomContentLoad: () => {},
        onLoad: () => {}
    },
    logger: {
        isVerbose: false,
        isInfo: true,
        isWarn: true,
        isError: true,
        verbose: () => {},
        info: () => {},
        warn: () => {},
        error: () => {},
        dump: () => {}
    },
    performance: {
        clear: () => {},
        renderTime: {
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
            },
            printOutDynatraceStatistics: () => {},
            updateDigitalData: () => {}
        }
    },
    renderedData: { template: '' },
    renderQueryParams: {
        country: 'US',
        language: 'en',
        urlPath: ''
    },
    spaEnabled: false,
    state: {},
    Util: {
        getBasketCache: () => {},
        getCurrentUser: () => {},
        getQueryStringParams: () => {},
        getUserInfoCache: () => {},
        InflatorComps: {
            Comps: {},
            services: { loadEvents: {} }
        },
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
        },
        Perf: {
            getEntrySize: () => {},
            getLogs: () => {},
            getMeasurements: () => {},
            getSummary: () => {},
            imageExpectedDedup: () => {},
            isReportSupported: () => {
                return window.performance && typeof window.performance.mark === 'function';
            },
            loadEvents: [],
            report: () => {},
            resetImageDedup: () => {}
        },
        shouldGetTargetedPromotion: () => {},
        shouldGetTargeters: () => {},
        shouldGetUserFull: () => {},
        shouldGetWelcomeMats: () => {},
        TestTarget: {}
    }
});

function initializeEnvironment() {
    window.Sephora = createConfiguration();
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
    localStorage.setItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN, JSON.stringify('JWT'));
}

const RED_COLOR = '\x1b[31m';
const COLOR_RESET = '\x1b[0m';
const testErrors = new ErrorsAccumulator();
initializeEnvironment();
const server = setupServer(...apiHandlers);
global.mockServer = server;

function formatMessage(args) {
    let message = args[0];

    if (typeof message === 'string' && args.length > 1) {
        const argsCopy = [...args].slice(1);
        message = message.replace(/%s/g, () => {
            if (argsCopy.length === 0) {
                return '%s';
            }

            return String(argsCopy.shift());
        });
    }

    return message;
}

function logError(...args) {
    const message = formatMessage(args);
    const { stack } = new Error();
    testErrors.addError({
        message,
        context: args[1] || '',
        stack
    });
}

beforeAll(() => {
    server.listen();
});

beforeEach(() => {
    expect.hasAssertions();
    testErrors.clear();
    /* eslint-disable no-console */
    console.error = logError;
    console.warn = logError;
    /* eslint-enable no-console */
    initializeEnvironment();
});

afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
    jest.restoreAllMocks();

    if (testErrors.hasErrors()) {
        const [{ message, context, stack }] = testErrors.getErrors();
        testErrors.clear();

        throw new Error(`${RED_COLOR}${message}${COLOR_RESET}\nContext: ${context}\n${stack}`);
    }
});

afterAll(() => {
    server.close();
});
