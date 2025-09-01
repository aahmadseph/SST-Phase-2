/* eslint-disable guard-for-in, no-console */
import { EventType } from 'constants/events';
import { isUfeEnvQA, isUfeEnvLocal } from 'utils/Env';
import HistoryLocationActions from 'actions/framework/HistoryLocationActions';
import {
    OPEN_SPA_PAGE,
    OPEN_SPA_PAGE_API_LOADED,
    OPEN_SPA_PAGE_DOM_UPDATED,
    OPEN_SPA_PAGE_IMAGES_PRELOADING,
    OPEN_SPA_PAGE_START,
    PAGE,
    PAGE_LOADING,
    PAGE_RENDERED
} from 'constants/performance/marks';

const Perf = Sephora.isNodeRender ? {} : Sephora.Util.Perf;

function normalizeTime(time) {
    return Math.round(time * 1000) / 1000;
}

Perf.getLogs = function (outputAsTable = false) {
    if (outputAsTable) {
        const table = Perf.loadEvents.map(event => {
            const output = { time: normalizeTime(event.time) };
            output.data = Array.isArray(event.data) ? event.data[0] : event.data;

            return output;
        });

        console.table(table);
    } else {
        for (var i = 0, max = Perf.loadEvents.length; i < max; i++) {
            const event = Perf.loadEvents[i];
            const time = normalizeTime(event.time);
            const prefix = time + ':';

            if (typeof event.data === 'string') {
                console.log(prefix + ' ' + event.data);
            } else if (Array.isArray(event.data)) {
                // Support for reports with multiple console arguments
                const logData = event.data.slice();
                logData.unshift(prefix);
                console.log.apply(console, logData);
            }
        }
    }
};

Perf.getSummary = function () {
    const summary = {};
    Perf.loadEvents.filter(event => event.timestamp).forEach(event => (summary[event.label] = normalizeTime(event.time)));

    console.table(summary);

    Sephora.performance.renderTime.printOutDynatraceStatistics();

    if (Perf.logRenderPerf) {
        Perf.logRenderPerf();
    }
};

Perf.getMeasurements = function () {
    const eventMap = {};
    const measurements = {};

    // Group load events by event type
    Perf.loadEvents
        .filter(event => event.timestamp)
        .forEach(event => {
            const eventPrefix = event.data.split(' ')[0];

            if (!eventMap[eventPrefix]) {
                eventMap[eventPrefix] = [event.data];
            } else {
                eventMap[eventPrefix].push(event.data);
                eventMap[eventPrefix].sort((a, b) => a.time - b.time);
            }
        });

    // Set measurement between first and last recorded events of every event type
    Object.keys(eventMap).forEach(event => {
        const events = eventMap[event];
        const eventsLength = events.length;

        /*jshint ignore:start*/
        function addEntry(...entries) {
            entries.forEach(({ name, eventStart: originalEventStart, eventEnd }) => {
                let eventStart = originalEventStart;
                let duration;

                if (eventStart) {
                    performance.measure(name, eventStart, eventEnd);
                    const entry = performance.getEntriesByName(name, 'measure');
                    duration = normalizeTime(entry[entry.length - 1].duration);
                    performance.clearMeasures(name);
                } else {
                    eventStart = 'Browser context was created';
                    const entry = performance.getEntriesByName(eventEnd, 'mark');

                    if (entry.length) {
                        const [{ startTime }] = entry;
                        duration = normalizeTime(startTime);
                    }
                }

                measurements[name] = {
                    eventStart,
                    eventEnd,
                    duration
                };
            });
        }
        /*jshint ignore:end*/

        switch (event) {
            case OPEN_SPA_PAGE: {
                addEntry(
                    {
                        name: event,
                        eventStart: events[0],
                        eventEnd: events[events.length - 1]
                    },
                    {
                        name: `${event} (API loaded)`,
                        eventStart: events[0],
                        eventEnd: events[events.findIndex(pageEvent => pageEvent === OPEN_SPA_PAGE_API_LOADED)]
                    },
                    {
                        name: `${event} (image preload triggered)`,
                        eventStart: events[events.findIndex(pageEvent => pageEvent === OPEN_SPA_PAGE_API_LOADED)],
                        eventEnd: events[events.findIndex(pageEvent => pageEvent === OPEN_SPA_PAGE_IMAGES_PRELOADING)]
                    },
                    {
                        name: `${event} (DOM updated)`,
                        eventStart: events[events.findIndex(pageEvent => pageEvent === OPEN_SPA_PAGE_IMAGES_PRELOADING)],
                        eventEnd: events[events.findIndex(pageEvent => pageEvent === OPEN_SPA_PAGE_DOM_UPDATED)]
                    }
                );

                break;
            }
            case PAGE: {
                const pageRenderedEventExists = !!performance.getEntriesByName(PAGE_RENDERED).length;
                const afterSPANavigation = !!performance.getEntriesByName(OPEN_SPA_PAGE_START).length;

                if (pageRenderedEventExists) {
                    const eventStart = afterSPANavigation ? OPEN_SPA_PAGE_START : PAGE_LOADING;
                    const duration = normalizeTime(digitalData.page.renderTime);
                    measurements[PAGE] = {
                        eventStart,
                        eventEnd: PAGE_RENDERED,
                        duration
                    };
                }

                break;
            }
            default: {
                switch (eventsLength) {
                    case 0: {
                        // Do nothing
                        break;
                    }
                    case 3: {
                        // Service entries have 3 different deltas we want to measure
                        addEntry(
                            {
                                name: `${event} ${EventType.Loaded}`,
                                eventEnd: events[0]
                            },
                            {
                                name: `${event} ${EventType.Ready}`,
                                eventStart: events[0],
                                eventEnd: events[1]
                            },
                            {
                                name: `${event} Total`,
                                eventStart: events[0],
                                eventEnd: events[2]
                            }
                        );

                        break;
                    }
                    default: {
                        addEntry({
                            name: event,
                            eventEnd: events[0]
                        });

                        // For all others we measure delta between first and last associated events
                        for (let eventIndex = 1; eventIndex < events.length; eventIndex++) {
                            addEntry({
                                name: events[eventIndex],
                                eventStart: events[0],
                                eventEnd: events[eventIndex]
                            });
                        }

                        break;
                    }
                }
            }
        }
    });

    if (typeof console.table === 'function') {
        console.table(measurements);
    }
};

Perf.getEntrySize = function (filepath) {
    const perfEntries = performance.getEntries();
    let transferSize = 0;

    for (let i = 0; i < perfEntries.length; i++) {
        const entry = perfEntries[i];

        if ('transferSize' in entry) {
            if (entry.name.indexOf(filepath) > -1) {
                transferSize = entry.transferSize;
            }
        }
    }

    console.log(`Transfer size of ${filepath}: ${transferSize}`);

    return transferSize;
};

if ((isUfeEnvQA || isUfeEnvLocal) && !Sephora.isNodeRender) {
    Perf.logRenderPerf = function () {
        console.log('------------------');
        console.log('Total Render Function Time: ' + Sephora.Util.InflatorComps.totalRenderTime + ' ms');
        console.log('------------------');
        console.log('------------------');
        console.log('Total Render Function Time On Page Render: ' + Sephora.Util.InflatorComps.totalReactTimeOnPageRender + ' ms');
        console.log('------------------');
        console.log('------------------');
        console.log('Total rootRenderTime Time: ' + Sephora.Util.InflatorComps.rootRenderTime + ' ms');
        console.log('------------------');

        // Print out the statistics for the ShouldComponentUpdate Issues
        const shouldComponentUpdateIssues = Sephora.performance.shouldComponentUpdateIssues;

        if (Object.keys(shouldComponentUpdateIssues).length > 0) {
            console.log('------------------');
            console.log('ShouldComponentUpdate Issues:');
            console.log('------------------');
            console.table(shouldComponentUpdateIssues);
        }

        Sephora.performance.renderTime.printOutStatistics();
    };

    Perf.HistoryLocationActions = HistoryLocationActions;
}

export default Perf;
