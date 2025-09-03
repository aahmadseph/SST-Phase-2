/* eslint-disable no-console, no-await-in-loop */
const puppeteer = require('puppeteer');
const generateHtmlTable = require('./logToHtml');

// default values
let subdomain = 'local';
let cpuThrottling = 6;
let elementLimit = 200;

// Constants
const TIMEOUT_BETWEEN_CLICKS = 1000;
const TIMEOUT_MODAL_ELEMENTS_LOAD = 2000;
const PAGE_LOAD_TIMEOUT = 30 * 1000;
const OVERALL_TEST_TIMEOUT = 20 * 60 * 1000; // 20 minutes

const MAX_NAVIGATION_RETRIES = 3;

const TYPES_OF_ELEMENTS_SELECTOR = 'button:not([href],[data-href],[target="_blank"],[class*="vjs-"]),input';

const MODAL_ROOT = 'div#modal-root';
const MODAL_WINDOW_SELECTOR = `${MODAL_ROOT} div`;
const MODAL_ELEMENTS_SELECTOR = `${MODAL_ROOT} button:not([href],[data-href],[target="_blank"],[class*="vjs-"],[aria-label="Close modal"]), ${MODAL_ROOT} input`;
const MODAL_CLOSE_BUTTON_SELECTOR = `${MODAL_ROOT} button[aria-label="Close modal"]`;

// Path to the custom Chrome profile Found at chrome://version
// can be used to set up the browser with custom settings or specific extensions
// const userDataDir = '/Users/Daniil_Pugach/Library/Application Support/Google/Chrome/Profile 5';
// const pathToChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' ;

// Get and parse command-line arguments
const args = process.argv.slice(3);

args.forEach(arg => {
    if (arg.startsWith('env=')) {
        subdomain = arg.split('=')[1];
    } else if (arg.startsWith('cpuThrottling=')) {
        cpuThrottling = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('limit=')) {
        elementLimit = parseInt(arg.split('=')[1], 10);
    }
});

console.log('Subdomain:', subdomain);
console.log('CPU Throttling:', cpuThrottling);
console.log('Element Limit:', elementLimit);

const TEST_DOMAIN = `https://${subdomain}.sephora.com`;
// Test pages
const TEST_PAGES = [
    { pageName: 'Home Page', pageUrl: `${TEST_DOMAIN}` },
    { pageName: 'Product Page', pageUrl: `${TEST_DOMAIN}/product/kulfi-mehndi-moment-blush-P504604` }
];

// const pageName = 'Product Page';
// const pageUrl = `${TEST_DOMAIN}/product/kulfi-mehndi-moment-blush-P504604`;

async function clickElements({ element, clickedElementCount, isModal = false }) {
    const modalPrefix = isModal ? '[Modal] ' : '';
    try {
        // Ensure the element is interactable
        const elementId = await element.evaluate(el => `${el.tagName}.${el.className}.${el.id}`);

        // Scroll the element into view
        await element.evaluate(el =>
            el.scrollIntoView({
                block: 'center',
                inline: 'center'
            })
        );
        const isVisible = await element.isIntersectingViewport();

        if (!isVisible) {
            console.log(`${modalPrefix}Skipping element (not visible): ${elementId}`);
        } else {
            try {
                // Increment the element count
                // eslint-disable-next-line no-param-reassign
                clickedElementCount++;
                // Click the element
                await element.click();
                console.log(`${clickedElementCount}. ${modalPrefix}Element clicked:`, elementId);

                // Wait for a short period to ensure INP data is captured
                await sleep(TIMEOUT_BETWEEN_CLICKS);
            } catch (error) {
                console.error(`${clickedElementCount}. ${modalPrefix}Error clicking element: ${elementId}`);
            }
        }
    } catch (error) {
        console.error(`${modalPrefix}Error evaluating element`);
    }

    return clickedElementCount;
}

function outputLogData({ clickedElementCount, totalElementsCount, inpData }) {
    // sort INP data by duration
    const sortedINPData = Object.entries(inpData)
        .map(([_key, value]) => value)
        .sort((a, b) => b['INP (ms)'] - a['INP (ms)']);

    console.log('Total number of elements clicked:', clickedElementCount);
    console.log('Total number of elements:', totalElementsCount);
    console.table(sortedINPData);

    // save INP data to a file
    generateHtmlTable(sortedINPData);
}

// catch error function
function catchError(error) {
    console.error(error);
}

// Custom sleep function
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function blockNavigation() {
    // Prevent history state changes
    history.pushState = function () {
        console.log('Prevented pushState');
    };

    history.replaceState = function () {
        console.log('Prevented replaceState');
    };

    // Handle form submissions
    document.addEventListener(
        'submit',
        event => {
            event.preventDefault();
            console.log('Prevented form submission');
        },
        true
    );

    // Block all click events that might cause navigation
    document.addEventListener(
        'click',
        event => {
            if (event.target.tagName === 'A' && event.target.href) {
                event.preventDefault();
                console.log('Prevented navigation');
            }
        },
        true
    );

    window.handleBeforeUnload = event => {
        event.preventDefault();
        event.returnValue = '';
    };

    // Prevent any navigation from happening
    window.addEventListener('beforeunload', window.handleBeforeUnload);

    const fakeNavigationAction = () => {
        return { type: 'INP_TEST' };
    };

    // Make the function globally accessible for Core Web Vital (INP) tests
    Sephora.Util.Perf.HistoryLocationActions = {
        ...Sephora.Util.Perf.HistoryLocationActions,
        ...{ replaceLocation: fakeNavigationAction, goTo: fakeNavigationAction }
    };
}

function injectINPLogFunction() {
    // Prevent the function from being injected multiple times
    if (window.isInpTestInProgress) {
        return;
    }

    window.isInpTestInProgress = true;
    window.inpScores = {};
    window.customOnINP = callback => {
        console.log('Custom INP tracker initialized');

        const po = new PerformanceObserver(entryList => {
            // Get the last interaction observed:
            Array.from(entryList.getEntries()).forEach(entry => {
                const duration = entry.duration;
                const eventType = entry.name;
                let target = entry.target || {};

                // recursively extract element parent if current target is not a button or input
                if (target.tagName !== 'BUTTON' && target.tagName !== 'INPUT') {
                    let parent = target.parentElement;

                    while (parent.tagName !== 'BUTTON' && parent.tagName !== 'INPUT' && parent.tagName !== 'BODY') {
                        parent = parent.parentElement;
                    }

                    if (parent.tagName === 'BUTTON' || parent.tagName === 'INPUT') {
                        target = parent;
                    }
                }

                if (eventType === 'click') {
                    callback({
                        duration,
                        target
                    });
                }
            });
        });

        // A durationThreshold of 16ms is necessary to include more
        // interactions, since the default is 104ms. The minimum
        // durationThreshold is 16ms.
        // observe everything related to INP
        po.observe({ type: 'event', buffered: true, durationThreshold: 16 });
    };

    setTimeout(() => {
        console.log('INP script timeout');
        window.customOnINP(metric => {
            // get element tagName, className and id and combine it to create a unique element reference
            let elementRef = `${metric.target.tagName}.${metric.target.className}.${metric.target.id}_${metric.duration}` || 'na';

            // eslint-disable-next-line no-undef
            if (inpScores[`${elementRef}`]) {
                elementRef = `${elementRef}_${Math.random()}`;
            }

            // eslint-disable-next-line no-undef
            inpScores[`${elementRef}`] = {
                Element: elementRef,
                'INP (ms)': metric.duration
            };
            console.log(`INP (ms): ${metric.duration} - ${elementRef}`);
        });
        console.log('INP script injected');
    }, 500);
}

async function initializePageSettings(browser, page) {
    // Set up dialog event listener to handle the beforeunload dialog
    page.on('dialog', async dialog => {
        if (dialog.type() === 'beforeunload') {
            await dialog.dismiss(); // Dismiss the dialog, equivalent to clicking 'Cancel'
        }
    });

    // Prevent new tabs or windows
    browser.on('targetcreated', async target => {
        if (target.type() === 'page') {
            console.log('A new tab or window was opened.');
            const newPage = await target.page();

            if (newPage) {
                await newPage.close();
                console.log('New tab or window has been closed.');
            }
        }
    });

    // add blockNavigation function to the page
    await page.evaluate(blockNavigation);
}

async function navigateWithRetries(page, url, retries = MAX_NAVIGATION_RETRIES) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // allow navigation to happen
            await page.removeAllListeners('dialog');
            // remove beforeunload event listener
            await page.evaluate(() => {
                if (window.handleBeforeUnload) {
                    window.removeEventListener('beforeunload', window.handleBeforeUnload);
                }
            });
            await page.goto(url);

            return; // Navigation succeeded
        } catch (error) {
            console.error(`Navigation error on attempt ${attempt}:`, error);

            if (attempt === retries) {
                throw error; // Rethrow the error if all retries fail
            }

            await sleep(1000); // Wait before retrying
        }
    }
}

describe('UI Tests', function () {
    let browser;
    let page;
    let inpData = {};
    let isInitialized = false;

    beforeAll(async function () {
        // Browser setup with custom Chrome profile
        browser = await puppeteer.launch({
            headless: true,
            ignoreHTTPSErrors: true,
            args: ['--ignore-certificate-errors']
            // userDataDir: userDataDir,
            // executablePath: pathToChrome
        });

        // wait for the browser to open
        await sleep(1000);

        page = await browser.newPage();

        // Set the CPU throttling rate
        await page.emulateCPUThrottling(cpuThrottling);

        // Set the viewport size for desktop view
        await page.setViewport({ width: 1280, height: 800 });
        page.setDefaultNavigationTimeout(PAGE_LOAD_TIMEOUT);
    });

    afterAll(async function () {
        // await browser.close();
    });

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = OVERALL_TEST_TIMEOUT; // timeout to collect INP data
    });

    TEST_PAGES.forEach(({ pageName, pageUrl }) => {
        (function (pageNameValue, pageUrlValue) {
            it(`should load the ${pageNameValue} click all interactive elements on the page and collect INP data`, async function () {
                console.log(`Running test for ${pageNameValue} page with URL: ${pageUrlValue}`);
                try {
                    await navigateWithRetries(page, pageUrlValue);
                    // Reset the initialization flag
                    isInitialized = false;
                } catch (error) {
                    console.error('Navigation failed after retries:', error);

                    return;
                }

                // Wait for the page to fully load
                await sleep(3000);

                if (!isInitialized) {
                    await initializePageSettings(browser, page);
                    isInitialized = true;
                    await sleep(1000); // just in case
                }

                const title = await page.title();
                console.log('page Title:', title);

                try {
                    const elements = await page.$$(TYPES_OF_ELEMENTS_SELECTOR);
                    console.log('Total number of elements on the page:', elements.length);

                    // Log the element click using the injected function
                    await page.evaluate(injectINPLogFunction);
                    await sleep(1000);

                    // Validate if the script was injected
                    const isFunctionInjected = await page.evaluate(() => {
                        return typeof window.customOnINP === 'function';
                    });

                    // exit if the function was not injected
                    if (!isFunctionInjected) {
                        console.error('INP function was not injected');

                        return;
                    } else {
                        console.log('INP function was injected');
                    }

                    let clickedElementCount = 0;
                    let totalElementsCount = 0;

                    for (const element of elements) {
                        // Increment the total element count
                        totalElementsCount++;

                        if (clickedElementCount >= elementLimit) {
                            break;
                        }

                        try {
                            clickedElementCount = await clickElements({ element, clickedElementCount });

                            const isModalPresent = await page.$(MODAL_WINDOW_SELECTOR);

                            // if modal is present, try to click on elements inside the modal
                            if (isModalPresent) {
                                // wait to load modal elements
                                await sleep(TIMEOUT_MODAL_ELEMENTS_LOAD);

                                const modalElements = await page.$$(MODAL_ELEMENTS_SELECTOR);

                                for (const modalElement of modalElements) {
                                    // Increment the total element count
                                    totalElementsCount++;

                                    await sleep(TIMEOUT_BETWEEN_CLICKS);

                                    clickedElementCount = await clickElements({
                                        element: modalElement,
                                        clickedElementCount,
                                        isModal: true
                                    });
                                }

                                // wait for modal to close
                                await sleep(TIMEOUT_BETWEEN_CLICKS);

                                // close modal <button type="button" aria-label="Close modal" data-at="close_button" class="css-1kna575">...</button>
                                const modalCloseButton = await page.$(MODAL_CLOSE_BUTTON_SELECTOR);

                                if (modalCloseButton) {
                                    await modalCloseButton.click();
                                }
                            }

                            // update the INP data after each 10 elements
                            if (clickedElementCount % 5 === 0) {
                                // Retrieve INP score from the web application
                                const inpDataBlock = await page.evaluate(currentPageName => {
                                    const inpDataScores = { ...window?.inpScores };
                                    // add page name to the INP data
                                    Object.keys(inpDataScores).forEach(key => {
                                        inpDataScores[key]['PageName'] = currentPageName;
                                    });
                                    // clear the INP data in browser
                                    window.inpScores = {};

                                    return inpDataScores;
                                }, pageNameValue);

                                if (Object.keys(inpDataBlock).length > 0) {
                                    console.table(inpDataBlock);
                                    inpData = { ...inpData, ...inpDataBlock };
                                }
                            }
                        } catch (error) {
                            catchError(error);
                        }
                    }

                    const inpDataBlock = await page.evaluate(currentPageName => {
                        const inpDataScores = { ...window?.inpScores };
                        // add page name to the INP data
                        Object.keys(inpDataScores).forEach(key => {
                            inpDataScores[key]['PageName'] = currentPageName;
                        });
                        // clear the INP data in browser
                        window.inpScores = {};

                        return inpDataScores;
                    }, pageNameValue);

                    inpData = { ...inpData, ...inpDataBlock };
                    outputLogData({ clickedElementCount, totalElementsCount, inpData });

                    // should contain 'Sephora'
                    expect(title).toContain('Sephora');
                } catch (error) {
                    catchError(error);
                }
            });
        }(pageName, pageUrl));
    });
});
