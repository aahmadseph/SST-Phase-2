/* eslint-disable no-unused-vars */
/* eslint max-len: 0 */
const { InPageCompsServiceCtrlrsApplied } = require('constants/events');

const haveAllElements = (arr, target) => target.every(v => arr.includes(v));

describe('PostLoad service', () => {
    let Events;
    let onLastLoadEventStub;
    let servicesUtils;
    let store;
    let dispatchStub;
    let InflateSPA;
    let InflatorComps;
    let locationUtils;
    let localeUtils;
    let PostLoad;
    let renderPostLoadRootComponentsStub;
    let loadScriptStub;

    beforeEach(() => {
        jasmine.clock().install();

        Sephora.analytics.initialLoadDependencies = [];
        Sephora.analytics.backendData.pageType = 'Homepage/Homepage';
        digitalData.page.category.pageType = 'home page';

        // Explicitly requiring these in beforeEach or else they are not found.
        servicesUtils = require('utils/Services').default;
        InflatorComps = require('utils/framework/InflateComponents').default;
        InflateSPA = require('utils/framework/InflateSPA').default;
        renderPostLoadRootComponentsStub = spyOn(InflateSPA, 'renderPostLoadRootComponents');
        store = require('store/Store').default;
        dispatchStub = spyOn(store, 'dispatch');
        Events = require('utils/framework/Events').default;
        onLastLoadEventStub = spyOn(Events, 'onLastLoadEvent');
        localeUtils = require('utils/LanguageLocale').default;
        locationUtils = require('utils/Location').default;
        PostLoad = require('services/PostLoad').default;
        loadScriptStub = spyOn(PostLoad, 'loadScript');
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    describe('initialization', () => {
        it('should set an initial onLastLoadEvent listener for load event', () => {
            onLastLoadEventStub.calls.reset();
            PostLoad.initialize();

            jasmine.clock().tick(20000);

            expect(onLastLoadEventStub.calls.first().args[1][0]).toEqual(Events.load);
        });

        it('should set a timeout for 20 seconds to fire the service as fallback', () => {
            jasmine.clock().uninstall();
            const setTimeoutStub = spyOn(window, 'setTimeout');
            onLastLoadEventStub.calls.reset();
            PostLoad.initialize();

            expect(setTimeoutStub.calls.argsFor(0)[1]).toEqual(servicesUtils.POST_LOAD_TIMEOUT);
        });
    });

    describe('first onLastLoadEvent callback', () => {
        let processEvent;
        let processEventStub;

        beforeEach(() => {
            processEvent = require('analytics/processEvent').default;
            processEventStub = spyOn(processEvent, 'process');
        });

        it('should fire analytics', () => {
            onLastLoadEventStub.calls.reset();
            PostLoad.initialize();

            onLastLoadEventStub.calls.argsFor(0)[2]();

            expect(processEventStub).toHaveBeenCalled();
        });
    });
});
