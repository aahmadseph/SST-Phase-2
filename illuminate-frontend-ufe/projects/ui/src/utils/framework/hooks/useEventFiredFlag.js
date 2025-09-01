import { useEffect, useState } from 'react';

const EmptyArray = [];
const EmptyObject = {};

/**
 * @description Custom HOOK to check whether event has fired already or not.
 *
 * @param {String} eventName Event name.
 *
 * @return {Boolean} Result of check. It will be `true` when event fired.
 */
const useEventFiredFlag = eventName => {
    const [isEventFired, setEventFired] = useState(() => {
        const { loadEvents = EmptyObject } = Sephora.Util.InflatorComps.services || EmptyObject;
        const initialEventState = loadEvents[eventName];

        return initialEventState;
    });

    useEffect(() => {
        let shouldUnsubscribe = !isEventFired;
        const eventHandler = () => {
            window.removeEventListener(eventName, eventHandler);
            shouldUnsubscribe = false;
            setEventFired(true);
        };
        window.addEventListener(eventName, eventHandler);

        return () => {
            if (shouldUnsubscribe) {
                window.removeEventListener(eventName, eventHandler);
            }
        };
    }, EmptyArray);

    return isEventFired;
};

export default useEventFiredFlag;
