const React = require('react');
const { shallow } = require('enzyme');
const BackTopButton = require('components/BackToTopButton/BackToTopButton').default;

describe('BackToTopButton', () => {
    it('should display button with the correct data-at', () => {
        // Arrange
        const wrapper = shallow(<BackTopButton />);
        wrapper.instance().setState({ isShown: true });

        // Act
        const button = wrapper.find('[data-at="back_to_top"]').exists();

        // Assert
        expect(button).toBe(true);
    });
});

/* TODO: fix tests
describe('BackToTopButton component', () => {
    let BackToTopButton;
    let component;
    let shallowComponent;
    let scrollTopSpy;
    let UI;

    beforeEach(() => {
        BackToTopButton = require('components/BackToTopButton/BackToTopButton');
        shallowComponent = shallow(<BackToTopButton />);
        component = shallowComponent.instance();
    });

    describe('ctrlr', () => {
        it('should attach an event handler for scrolling', () => {
            const Events = require('utils/framework/Events').default;
            const addEventStub = spyOn(window, 'addEventListener');

            spyOn(shallowComponent.instance().handleScroll, 'bind');

            shallowComponent.instance().ctrlr();
            expect(addEventStub).toHaveBeenCalledWith(Events.DebouncedScroll, undefined);
        });
    });

    describe('onClick', () => {
        let fireAnalyticsStub;

        beforeEach(() => {
            UI = require('utils/UI').default;
            scrollTopSpy = spyOn(UI, 'scrollToTop');
            fireAnalyticsStub = spyOn(component, 'fireAnalytics');
            shallowComponent.setState({ isShown: true });
            shallowComponent.simulate('click');
        });

        it('should call fireAnalytics', () => {
            expect(fireAnalyticsStub).toHaveBeenCalled();
        });

        it('should call onClick function correctly', () => {
            expect(shallowComponent.instance().state.isShown).toBe(false);
            expect(scrollTopSpy).toHaveBeenCalled();
        });
    });

    describe('fireAnalytics', () => {
        let anaConsts;
        let processEvent;
        let processSpy;

        beforeEach(() => {
            anaConsts = require('analytics/constants').default;
            processEvent = require('analytics/processEvent').default;
            processSpy = spyOn(processEvent, 'process');
        });

        it('should not call processEvent w/o analyticsLinkName prop', () => {
            component.fireAnalytics();
            expect(processSpy).not.toHaveBeenCalled();
        });

        describe('with analyticsLinkName prop', () => {
            beforeEach(() => {
                shallowComponent.setProps({ analyticsLinkName: 'fakeAnalyticsLinkName' });
                component.fireAnalytics();
            });

            it('should call processEvent', () => {
                expect(processSpy).toHaveBeenCalledTimes(1);
            });

            it('should call processEvent with correct args', () => {
                const expectedData = {
                    eventStrings: [anaConsts.Event.EVENT_71],
                    linkName: 'fakeAnalyticsLinkName',
                    actionInfo: 'fakeAnalyticsLinkName'
                };
                expect(processSpy).toHaveBeenCalledWith(
                    anaConsts.LINK_TRACKING_EVENT, { data: expectedData }
                );
            });
        });
    });

    describe('handleScroll function', () => {
        beforeEach(() => {
            window.pageYOffset = 943;
        });

        it('should set correctly the state to show the button if pageYOffset > 942', () => {
            shallowComponent.instance().handleScroll();
            expect(shallowComponent.instance().state.isShown).toBe(true);
        });
    });
});
*/
