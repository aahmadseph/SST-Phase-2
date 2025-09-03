/**
 * This module becomes a property of Sephora.analytics.
 *
 * Its purpose is to hold methods which preprocess event data
 * so that the tag management system can simply read from the
 * digitalData object and not need to employ its own logic.
 */

import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import postProcess from 'analytics/postProcessEvent';
import deepExtend from 'utils/deepExtend';
import Cookies from 'utils/Cookies';

const eventInProgress = {};

const EVENTS_POOL = [];

let eventRunning = false;
let eventTimeout;

function getEventHash(eventName, eventData) {
    return eventName + JSON.stringify(eventData !== undefined ? eventData : {});
}

/*
 Makes the call of event debounced, so during the first call no other call of the same event is
 possible. Debounce uses pair eventName + eventParams.data as a hash key to detect whether
 it is the same event or not. It does not count other params of event, such as pageType,
 only eventParams.data is used for it
 */
function debounceProcessEvents(processToDebounce) {
    const self = this;

    return function (eventName, { data = {} } = {}) {
        const eventData = data.sku || data;
        const eventHash = getEventHash(eventName, eventData);

        if (!eventInProgress[eventHash]) {
            eventInProgress[eventHash] = true;

            function removeEventInProgress(event) {
                const eventDataListener = event.detail.data.sku || event.detail.data;
                const eventHashToRemove = getEventHash(event.type, eventDataListener);

                if (eventInProgress[eventHashToRemove]) {
                    delete eventInProgress[eventHashToRemove];
                    window.removeEventListener(eventName, removeEventInProgress);
                }
            }

            window.addEventListener(eventName, removeEventInProgress);
            processToDebounce.apply(self, arguments);
        }
    };
}

/**
 * Take a page type and and event name and start a multi-step process which:
 * - Decides which data needs to be bound and how.
 * - Decides what dependencies to wait for
 * - Finally sends an event that is handled by our tag management system
 * @param  {string} eventName The name of this event
 * @param  {object} opts An optional object containing any amount of other arguments
 */
function processEvents(eventName, opts = {}) {
    import(/* webpackMode: "eager" */ 'analytics/getBindingMethods').then(getBindingMethods => {
        try {
            // Being extra safe, don't do anything unless promises object has been loaded.

            if (anaUtils.safelyReadProperty('Sephora.analytics.promises') === '') {
                return;
            }

            let methodsToCallOnEvent = [];

            opts.data = opts.data || {};

            opts.pageType =
                opts.pageType ||
                anaUtils.safelyReadProperty('digitalData.page.category.pageType') ||
                anaUtils.safelyReadProperty('Sephora.analytics.backendData.pageType');

            //Add the promises that we always need to wait for
            methodsToCallOnEvent.push(Sephora.analytics.promises.tagManagementSystemReady);

            //Wait for initial page load on all events besides initial page load
            if (eventName !== anaConsts.PAGE_LOAD) {
                methodsToCallOnEvent.push(Sephora.analytics.promises.initialPageLoadFired);
            }

            //Add all the binding methods relevant to this page
            methodsToCallOnEvent = methodsToCallOnEvent.concat(getBindingMethods.default(opts.pageType, eventName, opts.data));

            prepareToScheduleEvent(eventName, methodsToCallOnEvent, opts.data);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
        }
    });
}

//Declare fire so we can recursively call it from within
const fireEvent = function (eventName, methodsToCall, data) {
    if (methodsToCall.length) {
        const method = methodsToCall.shift();

        if (method instanceof Promise) {
            method.then(function (promiseData) {
                if (promiseData) {
                    const currentEvent = anaUtils.getMostRecentEvent(eventName);
                    deepExtend(currentEvent, { eventInfo: { attributes: promiseData } });
                }

                fireEvent(eventName, methodsToCall, data);
            });
        } else if (typeof method === 'function') {
            if (method.isConditional) {
                //Only call fire again if the method returns true
                if (method(data)) {
                    fireEvent(eventName, methodsToCall, data);
                }
            } else {
                method(data);
                fireEvent(eventName, methodsToCall, data);
            }
        }
    } else {
        //Actually trigger the event for Signal
        anaUtils.fireEventForTagManager(eventName, {
            detail: {
                data: data,
                specificEventName: data.specificEventName
            }
        });

        //Do any special post event actions
        postProcess(eventName, data);
    }
};

/**
 * Ensure that all promises are fulfilled, call all binding methods and
 * finally fire an event for the tag management system.
 * @param  {string} eventName     The name of the event to trigger
 * @param  {array}  methodsToCall The methods to call before firing the event
 * @return {[type]}               [description]
 */
const prepareToScheduleEvent = function (currentEventName, methodsToCall = [], currentData = {}) {
    const schedule = () => {
        EVENTS_POOL.push({
            eventName: currentEventName,
            data: currentData,
            methodsToCall: methodsToCall
        });
        methods.scheduleEvent();
    };

    //Resolve all promises before scheduling an event so it doesn't block other events
    if (methodsToCall[0] instanceof Promise) {
        const method = methodsToCall.shift();
        method.then(function (promiseData) {
            if (promiseData) {
                const currentEvent = anaUtils.getMostRecentEvent(currentEventName);
                deepExtend(currentEvent, { eventInfo: { attributes: promiseData } });
            }

            prepareToScheduleEvent(currentEventName, methodsToCall, currentData);
        });
    } else {
        schedule();
    }
};

const eventShouldFinish = function (event) {
    return event.data.doesNotTriggerAdobeTag || Cookies.isCCPAEnabled() || event.data.finishEventWithoutTimeout;
};

const methods = {
    scheduleEvent: function () {
        if (!eventRunning) {
            const event = EVENTS_POOL.shift();

            if (event) {
                eventRunning = true;

                // Do not set timeout for the initial pageLoadEvent call, ILLUPH-134799
                if (event.eventName !== anaConsts.PAGE_LOAD && !event.data.finishEventWithoutTimeout) {
                    eventTimeout = setTimeout(() => {
                        eventRunning = false;
                        clearTimeout(eventTimeout);

                        if (EVENTS_POOL.length) {
                            this.scheduleEvent();
                        }
                    }, 500);
                }

                fireEvent(event.eventName, event.methodsToCall, event.data);

                // The CCPA evaluation makes sure that no event remains unfinished.
                // Page Load event was not finishing when CCPA was enabled.
                if (eventShouldFinish(event)) {
                    //Does not trigger an adobe event, so we have to call finished ourselves
                    this.eventFinished();
                }
            }
        }
    },

    preprocess: {
        commonInteractions: data =>
            import(/* webpackMode: "eager" */ 'analytics/preprocess/preprocessCommonInteractions').then(preprocessCommonInteractions => {
                preprocessCommonInteractions.default(data);
            })
    },

    forceFireAllAnalytics: function () {
        const event = EVENTS_POOL.shift();

        if (event) {
            fireEvent(event.eventName, event.methodsToCall, event.data);
        }

        if (EVENTS_POOL.length) {
            methods.forceFireAllAnalytics();
        }
    }
}; //End methods
methods.process = debounceProcessEvents.call(methods, processEvents);

/*
 The event will fire only once per page cycle. To check that it has already been fired we
 try to get this event from event history throughout all page and find it there
 To find it we use checkAttr, which should be uniquely identifying this event among others
 Usually checkAttr is a data part of opts
 */
methods.processOnce = function (eventName, _, checkAttr) {
    const lastEvent = anaUtils.getMostRecentEvent(eventName, checkAttr);
    const isEventFiredAlready = Object.keys(lastEvent || {}).length;

    if (!isEventFiredAlready) {
        methods.process.apply(this, arguments);
    }
};

methods.eventFinished = function () {
    eventRunning = false;
    clearTimeout(eventTimeout);
    this.scheduleEvent();
};

export default methods;
