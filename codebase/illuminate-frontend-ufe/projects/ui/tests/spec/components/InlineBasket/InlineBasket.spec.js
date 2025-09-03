const React = require('react');
const { shallow } = require('enzyme');

describe('InlineBasket component', () => {
    let InlineBasket;
    let component;
    let ReactDOM;
    let BasketUtils;
    let UrlUtils;
    let anaUtils;
    let event;
    let preventDefaultStub;
    let Location;
    let isBasketPageStub;
    let isCheckoutStub;

    beforeEach(() => {
        UrlUtils = require('utils/Url').default;
        spyOn(UrlUtils, 'redirectTo');
        Location = require('utils/Location').default;
        isBasketPageStub = spyOn(Location, 'isBasketPage');
        isCheckoutStub = spyOn(Location, 'isCheckout');
        InlineBasket = require('components/InlineBasket/InlineBasket').default;
        BasketUtils = require('utils/Basket').default;
        anaUtils = require('analytics/utils').default;
        preventDefaultStub = jasmine.createSpy();
        event = { preventDefault: preventDefaultStub };
    });

    describe('render', () => {
        let instance;
        let toggleOpenSpy;
        let desktop;
        let dropdown;

        beforeEach(() => {
            ReactDOM = require('react-dom');
            spyOn(ReactDOM, 'findDOMNode');
            component = shallow(<InlineBasket />);

            instance = component.instance();
            instance.state = {
                basket: {
                    itemCount: 0,
                    pickupBasket: { itemCount: 0 }
                }
            };
            desktop = instance.getBasketDropdown();
            desktop = shallow(desktop);
            dropdown = desktop.find('Dropdown');
            toggleOpenSpy = spyOn(instance, 'toggleOpen');
        });

        xit('should bind toggleOpen to dropdown on Large view', () => {
            // Arrange
            instance.isLargeView = true;

            // Act
            dropdown.props().onTrigger();

            // Assert
            expect(toggleOpenSpy).toHaveBeenCalled();
        });

        xit('should not bind toggleOpen to dropdown on Large view', () => {
            // Arrange
            instance.isLargeView = false;

            // Act
            dropdown.props().onTrigger();

            // Assert
            expect(toggleOpenSpy).not.toHaveBeenCalled();
        });
    });

    describe('onCheckoutClick', () => {
        let setNextPageDataSpy;

        beforeEach(() => {
            const wrapper = shallow(<InlineBasket />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            ReactDOM = require('react-dom');
            spyOn(ReactDOM, 'findDOMNode');
            component.componentDidMount();
            setNextPageDataSpy = spyOn(anaUtils, 'setNextPageData');
            spyOn(anaUtils, 'buildNavPath').and.returnValues('top nav:hover basket:checkout:checkout:checkout');
        });

        it('should set analytics with linkData for mobile', () => {
            spyOn(Sephora, 'isMobile').and.returnValues(true);
            component.onCheckoutClick();
            expect(setNextPageDataSpy).toHaveBeenCalledTimes(1);
            expect(setNextPageDataSpy).toHaveBeenCalledWith({
                navigationInfo: 'top nav:hover basket:checkout:checkout:checkout',
                linkData: 'inline basket modal:checkout button'
            });
        });

        it('should set analytics with linkData for desktop', () => {
            component.onCheckoutClick();
            expect(setNextPageDataSpy).toHaveBeenCalledTimes(1);
            expect(setNextPageDataSpy).toHaveBeenCalledWith({
                navigationInfo: 'top nav:hover basket:checkout:checkout:checkout',
                linkData: 'inline basket modal:checkout button'
            });
        });

        it('should redirect', () => {
            component.onCheckoutClick();
            expect(UrlUtils.redirectTo).toHaveBeenCalledTimes(1);
            expect(UrlUtils.redirectTo).toHaveBeenCalledWith(BasketUtils.PAGE_URL);
        });

        it('should prevent default href redirect', () => {
            component.onCheckoutClick(event);
            expect(preventDefaultStub).toHaveBeenCalled();
        });
    });

    describe('onBasketClick', () => {
        // let historyService;
        let setNextPageDataSpy;

        beforeEach(() => {
            const wrapper = shallow(<InlineBasket />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            ReactDOM = require('react-dom');
            spyOn(ReactDOM, 'findDOMNode');
            component.componentDidMount();
            setNextPageDataSpy = spyOn(anaUtils, 'setNextPageData');
            spyOn(anaUtils, 'buildNavPath').and.returnValues('top nav:basket:basket:basket:basket');
            // historyService = require('services/History').default;
        });

        it('should set analytics', () => {
            component.onBasketClick();
            expect(setNextPageDataSpy).toHaveBeenCalledTimes(1);
            expect(setNextPageDataSpy).toHaveBeenCalledWith({
                navigationInfo: 'top nav:basket:basket:basket:basket',
                linkData: null
            });
        });

        it('should redirect', () => {
            Sephora.configurationSettings.spaEnabled = true;
            const navigateToSpy = spyOn(Location, 'navigateTo');
            isCheckoutStub.and.returnValue(false);
            isBasketPageStub.and.returnValue(false);

            component.onBasketClick();

            expect(navigateToSpy).toHaveBeenCalledTimes(1);
        });

        it('should prevent default href redirect', () => {
            component.onBasketClick(event);
            expect(preventDefaultStub).toHaveBeenCalled();
        });
    });

    describe('onBasketHoverClick', () => {
        let setNextPageDataSpy;

        beforeEach(() => {
            const wrapper = shallow(<InlineBasket />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            ReactDOM = require('react-dom');
            spyOn(ReactDOM, 'findDOMNode');
            component.componentDidMount();
            setNextPageDataSpy = spyOn(anaUtils, 'setNextPageData');
            spyOn(anaUtils, 'buildNavPath').and.returnValues('top nav:hover basket:basket link:basket link:basket link');
        });

        it('should do nothing if state.isBasketPage is true', () => {
            component.setState({ isBasketPage: true });
            component.onBasketHoverClick();
            expect(setNextPageDataSpy).not.toHaveBeenCalledTimes(1);
        });

        it('should set analytics', () => {
            component.setState({ isBasketPage: false });
            component.onBasketHoverClick();
            expect(setNextPageDataSpy).toHaveBeenCalledTimes(1);
            expect(setNextPageDataSpy).toHaveBeenCalledWith({
                navigationInfo: 'top nav:hover basket:basket link:basket link:basket link',
                linkData: null
            });
        });

        it('should redirect', () => {
            component.setState({ renderBasket: true });
            component.onBasketHoverClick();
            expect(UrlUtils.redirectTo).toHaveBeenCalledTimes(1);
            expect(UrlUtils.redirectTo).toHaveBeenCalledWith(BasketUtils.PAGE_URL);
        });

        it('should prevent default href redirect', () => {
            component.onBasketHoverClick(event);
            expect(preventDefaultStub).toHaveBeenCalled();
        });
    });
});
