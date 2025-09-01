/* eslint-disable no-console */

/* eslint-disable class-methods-use-this */
import { isUfeEnvLocal, isUfeEnvQA } from 'utils/Env';
import SpaUtils from 'utils/Spa';
import StringUtils from 'utils/String';

const HOCWrappingIsDisabled = Sephora.configurationSettings.core.disableHOCWrapping === true;
const LocalOrQAEnvironment = isUfeEnvQA || isUfeEnvLocal;
const ROUNDING_PRECISION = 6;
const TABLE_ROW_MASK_TIME = '/**         {0}: {1} ms';
const TABLE_ROW_MASK = '/**         {0}: {1}';
const HEADER = '/**********************************************************************************************************/';
const HEADER_ROW_LENGTH = HEADER.length - 3;

let _components;
let _hocs;

class RenderTime {
    constructor() {
        _components = {};
        _hocs = {};
        this.wrapComponentRender = 0;
        this.wrapComponentRenderCallsCounter = 0;
    }

    get components() {
        return _components;
    }

    get hocs() {
        return _hocs;
    }

    getComponentDataByName = name => {
        let dictionaryEntry = _components[name];

        if (!dictionaryEntry) {
            dictionaryEntry = {
                counter: 0,
                renderTime: 0,
                renderFunctionTime: 0,
                rootRenderTime: 0
            };
            _components[name] = dictionaryEntry;
        }

        return dictionaryEntry;
    };

    getHOCByName = name => {
        let hoc = _hocs[name];

        if (!hoc) {
            hoc = {
                counter: 0,
                renderFunctionTime: 0,
                renderTime: 0
            };
            _hocs[name] = hoc;
        }

        return hoc;
    };

    increaseComponentRenderTime = (name, renderTime) => {
        const component = this.getComponentDataByName(name);
        component.counter++;
        component.renderTime += renderTime;
    };

    increaseHOCsRenderFunctionTime = (name, renderFunctionTime) => {
        const hoc = this.getHOCByName(name);
        hoc.renderFunctionTime += renderFunctionTime;
        hoc.counter++;
    };

    increaseHOCsRenderTime = (name, renderTime) => {
        const hoc = this.getHOCByName(name);
        hoc.renderTime += renderTime;
    };

    clear = () => {
        _components = {};
        _hocs = {};
        this.wrapComponentRender = 0;
        this.wrapComponentRenderCallsCounter = 0;
        Sephora.Util.InflatorComps.totalRenderTime = 0;
    };

    printOutStatistics = () => {
        if (HOCWrappingIsDisabled || !LocalOrQAEnvironment) {
            return;
        }

        this.printOutHOCsStatistics();
        this.printOutComponentStatistics();
    };

    createTableHeaderRow = (text, time, addTimeLabel = true) => {
        const mask = addTimeLabel ? TABLE_ROW_MASK_TIME : TABLE_ROW_MASK;
        let formatedHeaderRow = StringUtils.format(mask, text, Number(time.toFixed(ROUNDING_PRECISION)));

        while (formatedHeaderRow.length < HEADER_ROW_LENGTH) {
            formatedHeaderRow += ' ';
        }

        return formatedHeaderRow + '**/';
    };

    printOutHOCsStatistics = () => {
        let reactTime = 0;
        let renderTime = 0;
        let renderFunctionTime = 0;
        let hocsCallsCounter = 0;
        const results = {};

        Object.keys(this.hocs).forEach(key => {
            const item = { ...this.hocs[key] };
            hocsCallsCounter += item.counter;
            item.reactTime = item.renderTime - item.renderFunctionTime;
            renderFunctionTime += item.renderFunctionTime;
            renderTime += item.renderTime;
            reactTime += item.reactTime;
            item['counter (times)'] = item.counter;
            item['renderFunctionTime (ms)'] = Number(item.renderFunctionTime.toFixed(ROUNDING_PRECISION));
            item['renderTime (ms)'] = Number(item.renderTime.toFixed(ROUNDING_PRECISION));
            item['reactTime (ms)'] = Number(item.reactTime.toFixed(ROUNDING_PRECISION));
            delete item.counter;
            delete item.renderFunctionTime;
            delete item.renderTime;
            delete item.reactTime;
            results[key] = item;
        });

        console.log('');
        console.log('');
        console.log(HEADER);
        console.log('/**     HOCs totals (all time related data is in milliseconds):                                          **/');
        console.log(this.createTableHeaderRow('Browser DOM update time', renderTime));
        console.log(this.createTableHeaderRow('React time', reactTime));
        console.log(this.createTableHeaderRow('Number of HOCs invocations', hocsCallsCounter, false));
        console.log(this.createTableHeaderRow('User code (render function) time', renderFunctionTime));

        if (digitalData.performance.renderTime) {
            console.log(this.createTableHeaderRow('Initial page render time', digitalData.performance.renderTime));
            const percentage = Number(((renderFunctionTime * 100) / digitalData.performance.renderTime).toFixed(ROUNDING_PRECISION));
            console.log(`/**         HOCs rendering took ${percentage}% of initial page render time                                    **/`);
        }

        console.log('/**                                                                                                      **/');
        console.log('/**     Columns:                                                                                         **/');
        console.log('/**         counter: number of times HOC was rendered                                                    **/');
        console.log('/**         renderFunctionTime: amount of time taken to execute HOCs render function with selectors     **/');
        console.log('/**         renderTime: time taken from the beginning of render function till componentDidMount event    **/');
        console.log('/**         reactTime: time taken by React framework                                                     **/');
        console.log(HEADER);

        if (console.table) {
            console.table(results);
        }
    };

    printOutComponentStatistics = () => {
        let domRenderTime = 0;
        const results = {};
        Object.keys(_components).forEach(key => {
            const { counter, renderTime, renderFunctionTime } = _components[key];
            domRenderTime += renderTime;

            if (renderTime > 0 || renderFunctionTime > 0) {
                results[key] = {
                    ['counter (times)']: counter,
                    ['renderFunctionTime (ms)']: Number(renderFunctionTime.toFixed(ROUNDING_PRECISION)),
                    ['renderTime (ms)']: Number(renderTime.toFixed(ROUNDING_PRECISION))
                };
            }
        });

        console.log('');
        console.log('');
        console.log(HEADER);
        console.log('/**     Components totals (all time related data is in milliseconds):                                    **/');
        console.log(this.createTableHeaderRow('Browser DOM update time', domRenderTime));
        console.log(this.createTableHeaderRow('Number of render function invocations', this.wrapComponentRenderCallsCounter, false));
        console.log(this.createTableHeaderRow('Framework render time', this.wrapComponentRender));

        if (digitalData.performance.renderTime) {
            console.log(this.createTableHeaderRow('Initial page render time', digitalData.performance.renderTime));
            const percentage = Number(((this.wrapComponentRender * 100) / digitalData.performance.renderTime).toFixed(ROUNDING_PRECISION));
            console.log(`/**         Framework took ${percentage}% of initial page render time                                         **/`);
        }

        console.log('/**                                                                                                      **/');
        console.log('/**     Columns:                                                                                         **/');
        console.log('/**         counter: number of times Component was rendered                                              **/');
        console.log('/**         renderTime: time taken from the beginning of render function till componentDidMount event    **/');
        console.log(HEADER);

        if (console.table) {
            console.table(results);
        }
    };

    getFirstEventOrDefault = eventName => performance.getEntriesByName(eventName)[0] || { startTime: 0 };

    updateDigitalData = SpaUtils.updateDigitalData;

    printOutDynatraceStatistics = () => {
        this.printOutDynatracePageLoadStatistics();
        this.printOutDynatraceSPAPageLoadStatistics();
    };

    printOutDynatracePageLoadStatistics = () => {
        const { performance } = digitalData;
        const data = [
            {
                key: 'Head Script Runtime',
                value: performance.headScriptRuntime
            },
            {
                key: 'Application Starting',
                value: performance.applicationStart
            },
            {
                key: 'InPageComps Applied',
                value: performance.inPageCompsApplied
            },
            {
                key: 'Hydration Finished',
                value: performance.hydrationFinished
            },
            {
                key: 'Page Render Time',
                value: performance.renderTime
            },
            {
                key: 'PostLoad Rendered',
                value: performance.postLoadRendered
            },
            {
                key: 'UserInfo Loaded',
                value: performance.userInfoLoaded
            },
            {
                key: 'UserInfo Applied',
                value: performance.userInfoApplied
            },
            {
                key: 'TestTarget Loaded',
                value: performance.testTargetLoaded
            },
            {
                key: 'TestTarget Applied',
                value: performance.testTargetApplied
            }
        ];
        const results = {};
        data.sort((itemOne, itemTwo) => itemOne.value - itemTwo.value).forEach(
            item => (results[item.key] = { 'time (ms)': Number((item.value || 0).toFixed(ROUNDING_PRECISION)) })
        );

        console.log('');
        console.log('');
        console.log(HEADER);
        console.log('/**     Page hard reload metrics (all time is in milliseconds):                                          **/');
        console.log('/**                                                                                                      **/');
        console.log('/**     Columns:                                                                                         **/');
        console.log('/**         time: time taken from the beginning of browser started loading and rendering content         **/');
        console.log(HEADER);

        if (console.table) {
            console.table(results);
        }
    };

    printOutDynatraceSPAPageLoadStatistics = () => {
        const { performance } = digitalData;
        const data = [
            {
                key: 'Page Render Time',
                value: performance.renderTime
            },
            {
                key: 'API Call Time',
                value: performance.spaAPITime
            },
            {
                key: 'Images Preload Time',
                value: performance.spaPreloadImagesTime
            },
            {
                key: 'SPA Open Page JavaScript Time',
                value: performance.spaDOMUpdateTime
            },
            {
                key: 'SPA Open Page JavaScript Time Without API',
                value: performance.spaDOMUpdateWithoutAPITime
            }
        ];
        const results = {};
        data.forEach(item => (results[item.key] = { 'time (ms)': Number((item.value || 0).toFixed(ROUNDING_PRECISION)) }));

        console.log('');
        console.log('');
        console.log(HEADER);
        console.log('/**     SPA page render metrics (all time is in milliseconds):                                           **/');
        console.log('/**                                                                                                      **/');
        console.log('/**     Columns:                                                                                         **/');
        console.log('/**         time: time taken from the beginning of SPA navigation till some certain event                **/');
        console.log(HEADER);

        if (console.table) {
            console.table(results);
        }
    };
}

export default RenderTime;
