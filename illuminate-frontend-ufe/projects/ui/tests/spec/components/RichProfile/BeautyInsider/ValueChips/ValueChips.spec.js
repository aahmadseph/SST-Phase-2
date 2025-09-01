/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = require('enzyme');

describe('ValueChips component', () => {
    let Location;
    let profileApi;
    let ValueChips;
    let analyticsUtils;
    let processEvent;
    let anaConsts;
    let component;
    let store;
    let setAndWatchSpy;
    let setStateSpy;

    beforeEach(() => {
        Location = require('utils/Location').default;
        profileApi = require('services/api/profile').default;
        ValueChips = require('components/RichProfile/BeautyInsider/ValueChips/ValueChips').default;
        processEvent = require('analytics/processEvent').default;
        analyticsUtils = require('analytics/utils').default;
        anaConsts = require('analytics/constants').default;
        const wrapper = shallow(<ValueChips profileId='123456' />);
        component = wrapper.instance();
        setStateSpy = spyOn(component, 'setState');
    });

    describe('componentDidMount method', () => {
        beforeEach(() => {
            store = require('store/Store').default;
            setAndWatchSpy = spyOn(store, 'setAndWatch');
            // TODO: .withArgs
            // .withArgs(['beautyInsider.summary', 'user.beautyInsiderAccount'], component, any(Function));
            component.componentDidMount();
        });

        it('should call setAndWatch stub', () => {
            expect(setAndWatchSpy).toHaveBeenCalledTimes(1);
        });

        it('should call setState stub', () => {
            const data = {
                beautyInsiderAccount: { ccAccountandPrescreenInfo: { ccApprovalStatus: 'APPROVED' } },
                summary: {}
            };
            setAndWatchSpy.calls.first().args[2](data);
            expect(setStateSpy).toHaveBeenCalled();
        });

        it('should call setState stub with value', () => {
            const data = {
                beautyInsiderAccount: { ccAccountandPrescreenInfo: { ccApprovalStatus: 'APPROVED' } },
                summary: {}
            };
            setAndWatchSpy.calls.first().args[2](data);
            expect(setStateSpy).toHaveBeenCalledWith({ hasSephoraCard: true });
        });

        it('should call setState stub with value', () => {
            const data = {
                beautyInsiderAccount: { ccAccountandPrescreenInfo: { ccApprovalStatus: 'CLOSED' } },
                summary: {}
            };
            setAndWatchSpy.calls.first().args[2](data);
            expect(setStateSpy).toHaveBeenCalledWith({ hasSephoraCard: false });
        });
    });

    describe('handleChipClick', () => {
        let setNextPageDataSpy;
        let processSpy;
        let href;
        let title;

        beforeEach(() => {
            setNextPageDataSpy = spyOn(analyticsUtils, 'setNextPageData');
            processSpy = spyOn(processEvent, 'process');
            href = '/play';
            title = 'play';
        });

        it('should call setLocation with the href that we pass in', () => {
            const returnedFunction = component.handleChipClick(title, href);
            returnedFunction();
            expect(Location.setLocation).toHaveBeenCalledWith(href);
        });

        it('should call analyticsUtils.setNextPageData with the correct data', () => {
            const returnedFunction = component.handleChipClick(title, href);
            returnedFunction();

            const dataString = `${title}:subscribe now`;

            expect(setNextPageDataSpy).toHaveBeenCalledWith({
                events: [anaConsts.Event.EVENT_71, anaConsts.Event.BI_CHIP_SUBSCRIBE],
                linkData: dataString,
                biChipType: dataString
            });
        });

        it('should call processEvent.process with the correct data', () => {
            title = 'app';
            const returnedFunction = component.handleChipClick(title, 'appStoreLink');
            returnedFunction();

            const dataString = `${title}:subscribe now`;

            expect(processSpy).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    eventStrings: [anaConsts.Event.EVENT_71, anaConsts.Event.BI_CHIP_SUBSCRIBE],
                    linkName: dataString,
                    actionInfo: dataString,
                    biChipType: dataString
                }
            });
        });
    });
});
