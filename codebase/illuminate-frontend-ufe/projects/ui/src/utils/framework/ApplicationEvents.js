import { EventType } from 'constants/events';
import Empty from 'constants/empty';

/**
 * Class to encapsulate any work with events within the application.
 * @class ApplicationEvents
 */
class ApplicationEvents {
    /**
     * This function makes sure that once a given list of dependencies had happened then an the given callback is triggered.
     *
     * @memberof ApplicationEvents
     */
    static onLastLoadEvent = Sephora.Util.onLastLoadEvent;

    /**
     * The `dispatchEvent()` method of the `ApplicationEvents` sends an `Event` to the `window`,
     * (synchronously) invoking the affected `EventListeners` in the appropriate order.
     *  The normal event processing rules (including the capturing and optional bubbling phase)
     *  also apply to events dispatched manually with `dispatchEvent()`.
     *
     * @param {string} eventName A string with the name of the event. It is case-sensitive.
     * @param {object} eventArguments An event-dependent configuration object associated with the event.
     * @memberof ApplicationEvents
     */
    static dispatchEvent = (eventName, eventArguments) => {
        if (typeof eventArguments === 'object') {
            window.dispatchEvent(new CustomEvent(eventName, eventArguments));
        } else {
            window.dispatchEvent(new CustomEvent(eventName));
        }
    };

    /**
     * Function does dispatch of browser window event and
     * creates a `timestamp` in the browser's performance entry buffer with the given name.
     * Performance entry is added before firing window event.
     *
     * @param {string} serviceName Service name.
     * @param {string} [eventType = EventType.Default] Event type.
     * @param {boolean} [dispatchPerformanceEventAfterServiceEvent = false] Should be `true` to create performance entry after firing window event.
     * @memberof ApplicationEvents
     */
    static dispatchServiceEvent = (serviceName, eventType = EventType.Default, dispatchPerformanceEventAfterServiceEvent = false) => {
        const performanceEventName = `${serviceName} ${eventType}`.trim();

        if (!dispatchPerformanceEventAfterServiceEvent) {
            Sephora.Util.Perf.report(performanceEventName);
        }

        const serviceEventName = `${serviceName}${eventType.replace(/ /g, Empty.String)}`;
        Sephora.Util.InflatorComps.services.loadEvents[serviceEventName] = true;
        ApplicationEvents.dispatchEvent(serviceEventName, { detail: {} });

        if (dispatchPerformanceEventAfterServiceEvent) {
            Sephora.Util.Perf.report(performanceEventName);
        }
    };
}

export default ApplicationEvents;
