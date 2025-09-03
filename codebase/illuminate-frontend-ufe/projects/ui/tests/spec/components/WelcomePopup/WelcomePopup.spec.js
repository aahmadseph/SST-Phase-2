/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = require('enzyme');
const { createSpy, any } = jasmine;
const store = require('store/Store').default;
const WelcomePopup = require('components/WelcomePopup/WelcomePopup').default;
const urlUtils = require('utils/Url').default;
const Cookies = require('utils/Cookies').default;
const userUtils = require('utils/User').default;

describe('Welcome Popup Controller', () => {
    let cookieWriteStub;
    let initialPageLoadFiredOriginal;

    const getWrapper = props => {
        const getLastTimeSeenStub = createSpy();
        const updateWelcomeMatLastTimeSeenStub = createSpy();

        const wrapper = shallow(
            <WelcomePopup
                getLastTimeSeen={getLastTimeSeenStub}
                updateWelcomeMatLastTimeSeen={updateWelcomeMatLastTimeSeenStub}
                {...props}
            />
        );

        return {
            wrapper,
            getLastTimeSeenStub,
            updateWelcomeMatLastTimeSeenStub
        };
    };

    beforeEach(function () {
        cookieWriteStub = spyOn(Cookies, 'write');
        initialPageLoadFiredOriginal = Sephora.analytics.promises.initialPageLoadFired;
        Sephora.analytics.promises.initialPageLoadFired = { then: createSpy() };
    });

    afterEach(function () {
        Sephora.analytics.promises.initialPageLoadFired = initialPageLoadFiredOriginal;
    });

    describe('determines if the welcome popup should be displayed', () => {
        let component;
        let getParamsByNameStub;
        let getLastTimeSeenStub;
        let updateWelcomeMatLastTimeSeenStub;

        beforeEach(() => {
            getLastTimeSeenStub = createSpy();
            updateWelcomeMatLastTimeSeenStub = createSpy();

            const wrapper = shallow(
                <WelcomePopup
                    getLastTimeSeen={getLastTimeSeenStub}
                    updateWelcomeMatLastTimeSeen={updateWelcomeMatLastTimeSeenStub}
                />
            );

            component = wrapper.instance();
        });

        it('should show the welcome popup when user redirected to CA', () => {
            const shouldShowPopup = component.showWelcomePopup({ mediaId: '1111' });
            expect(component.state.showWelcomePopup).toBeTruthy();
        });
    });

    describe('sets welcome popup cookies', () => {
        it('should write the trackIntlPopup cookie', () => {
            spyOn(Sephora, 'isDesktop').and.returnValue(true);

            const { wrapper } = getWrapper();
            const component = wrapper.instance();

            component.setState({
                showWelcomePopup: true
            });

            component.setCookies();

            expect(cookieWriteStub).toHaveBeenCalledWith('trackIntlPopup', true, 1, true);
        });
    });

    describe('requests close', () => {
        let setStateStub;
        let component;
        let wrapper;
        let forceSignInStub;
        let updateWelcomeMatLastTimeSeen;

        beforeEach(() => {
            spyOn(Date, 'now').and.returnValue(1521504000000);

            const w = getWrapper();
            wrapper = w.wrapper;
            updateWelcomeMatLastTimeSeen = w.updateWelcomeMatLastTimeSeenStub;
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState').and.callFake((...args) => args[1]());
            forceSignInStub = spyOn(userUtils, 'forceSignIn');
            component.requestClose();
        });

        it('should call setState with correct args', () => {
            expect(setStateStub).toHaveBeenCalledWith({ showWelcomePopup: false }, any(Function));
        });

        it('should call force sign in', () => {
            expect(forceSignInStub).toHaveBeenCalled();
        });

        it('should set last seen time on close', () => {
            expect(updateWelcomeMatLastTimeSeen).toHaveBeenCalledWith(1521504000000);
        });
    });

    describe('initialization', () => {
        const Events = require('utils/framework/Events').default;
        beforeEach(() => {
            spyOn(Cookies, 'read').and.returnValue('GB');
        });
        it('should use getLastTimeSeen to set timeout', () => {
            const { getLastTimeSeenStub } = getWrapper();

            expect(getLastTimeSeenStub).toHaveBeenCalled();
        });

        it('should set timeout with 0 delay if last seen is unknown', () => {
            const setTimeoutStub = spyOn(global, 'setTimeout');

            spyOn(Date, 'now').and.returnValue(1521504000000);
            const getLastTimeSeenStub = createSpy().and.returnValue(1521504000000 - 1900000);
            getWrapper({
                getLastTimeSeen: getLastTimeSeenStub
            });

            expect(setTimeoutStub).toHaveBeenCalledWith(any(Function), 0);
        });

        it('should set timeout with diff delay if last seen is less than 30m', () => {
            const setTimeoutStub = spyOn(global, 'setTimeout');

            spyOn(Date, 'now').and.returnValue(1521504000000);
            const getLastTimeSeenStub = createSpy().and.returnValue(1521504000000 - 1300000);
            getWrapper({
                getLastTimeSeen: getLastTimeSeenStub
            });

            expect(setTimeoutStub).toHaveBeenCalledWith(any(Function), 500000);
        });

        it('should set timeout with 0 delay if last seen is more than 30m', () => {
            const setTimeoutStub = spyOn(global, 'setTimeout');

            spyOn(Date, 'now').and.returnValue(1521504000000);
            const getLastTimeSeenStub = createSpy().and.returnValue(1521504000000 - 4000000);
            getWrapper({
                getLastTimeSeen: getLastTimeSeenStub
            });

            expect(setTimeoutStub).toHaveBeenCalledWith(any(Function), 0);
        });
    });
});
