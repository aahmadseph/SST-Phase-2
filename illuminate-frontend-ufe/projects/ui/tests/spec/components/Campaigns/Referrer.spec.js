/* eslint-disable object-curly-newline */
const React = require('react');
const { shallow } = require('enzyme');
const { any } = jasmine;
const Referrer = require('components/Campaigns/Referrer/Referrer').default;
const { ACTION_TYPE } = require('components/Campaigns/Referrer/constants');
const utilityApi = require('services/api/utility').default;
const biProfileUtils = require('utils/BiProfile').default;
const store = require('Store').default;
const urlUtils = require('utils/Url').default;
const decorators = require('utils/decorators').default;

const { UserInfoReady } = require('constants/events');

describe('Referrer component', () => {
    let wrapper;
    let component;
    let dispatchStub;
    const referrerCode = 'referrerCode';
    const campaignCode = 'campaignCode';
    const checksum = 'checksum';

    describe('ComponentDidMount', () => {
        let onLastLoadEventStub;
        let setAndWatchStub;
        let getAdvocacyLandingPageContentStub;
        let page;
        let Events;

        beforeEach(() => {
            Events = Sephora.Util;
            onLastLoadEventStub = spyOn(Events, 'onLastLoadEvent');
            page = 'share';
            setAndWatchStub = spyOn(store, 'setAndWatch');
            spyOn(urlUtils, 'getPathStrings').and.returnValues(['sephora.com', 'share', referrerCode, campaignCode, checksum]);
            spyOn(biProfileUtils, 'isBiDown').and.returnValue(false);
            wrapper = shallow(<Referrer />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            dispatchStub = spyOn(component, 'dispatch');
            getAdvocacyLandingPageContentStub = spyOn(component, 'getAdvocacyLandingPageContent');
            component.componentDidMount();
        });

        it('dipatch SET_CAMPAIGN_DATA with the page, campaign and referrer codes from the URL', () => {
            expect(dispatchStub).toHaveBeenCalledWith({
                type: ACTION_TYPE.SET_CAMPAIGN_DATA,
                payload: {
                    referrerCode,
                    campaignCode,
                    page,
                    checksum
                }
            });
        });

        it('should call onLastLoadEvent with correct args', () => {
            expect(onLastLoadEventStub).toHaveBeenCalledWith(window, [UserInfoReady], any(Function));
        });

        describe('when there is a referral and campaign code', () => {
            beforeEach(() => {
                onLastLoadEventStub.calls.argsFor(0)[2]();
                setAndWatchStub.calls.first().args[2]({ user: {} });
            });

            it('should call update validation for all other scenarios', () => {
                expect(getAdvocacyLandingPageContentStub).toHaveBeenCalled();
            });

            it('should call update validation with args', () => {
                expect(getAdvocacyLandingPageContentStub).toHaveBeenCalledWith({
                    referrerCode,
                    campaignCode,
                    checksum
                });
            });
        });
    });

    describe('getAdvocacyLandingPageContent', () => {
        let getAdvocacyLandingPageContentStub;
        const userId = 123;

        beforeEach(() => {
            const fakePromise = {
                then: () => {
                    return fakePromise;
                },
                catch: () => {}
            };
            spyOn(biProfileUtils, 'getBiAccountId').and.returnValue(userId);
            spyOn(decorators, 'withInterstice').and.callFake(arg0 => arg0);
            getAdvocacyLandingPageContentStub = spyOn(utilityApi, 'getAdvocacyLandingPageContent').and.returnValue(fakePromise);
            wrapper = shallow(<Referrer />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            component.getAdvocacyLandingPageContent({
                campaignCode,
                referrerCode,
                checksum
            });
        });

        it('should call update validation api with correct args', () => {
            expect(getAdvocacyLandingPageContentStub).toHaveBeenCalledWith({
                referrerCode,
                campaignCode,
                userId,
                checksum
            });
        });
    });
});
