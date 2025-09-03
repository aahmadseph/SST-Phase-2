const React = require('react');
const { objectContaining } = jasmine;
const { shallow } = require('enzyme');
const analyticsConstants = require('analytics/constants').default;
const LanguageLocale = require('utils/LanguageLocale').default;
const AddToBasketModal = require('components/GlobalModals/AddToBasketModal/AddToBasketModal').default;
const userUtils = require('utils/User').default;

// TODO  Look into re-enabling tests
xdescribe('AddToBasketModal component', () => {
    let props;
    let wrapper;
    let sku;

    beforeEach(() => {
        sku = {
            type: 'Standard',
            skuImages: {},
            biExclusiveLevel: '',
            actionFlags: {},
            targetUrl: '/product/test',
            listPrice: '$21.00'
        };
        props = {
            product: {
                brand: {},
                regularChildSkus: [],
                sku
            },
            sku
        };
        spyOn(LanguageLocale, 'getLocaleResourceFile').and.returnValue(text => text);
    });
    describe('components', () => {
        beforeEach(() => {
            wrapper = shallow(<AddToBasketModal {...props} />);
        });

        it('should render Modal', () => {
            const modal = wrapper.find('Modal');
            expect(modal.length).toBe(1);
        });

        it('should render Link', () => {
            const renderedLink = wrapper.find('Link');
            expect(renderedLink.length).toBe(1);
        });

        it('should set nextPageData analytics for Basket link', () => {
            // Arrange
            const setNextPageDataFunc = spyOn(wrapper.instance(), 'setNextPageData');
            wrapper.setState({ basket: null });
            const basketLink = wrapper.findWhere(e => e.name() === 'Link' && e.props().href === '/basket').at(0);

            // Act
            basketLink.simulate('click');

            // Assert
            expect(setNextPageDataFunc).toHaveBeenCalledWith('basket link');
        });

        it('should set nextPageData analytics for Checkout button', () => {
            // Arrange
            const setNextPageDataFunc = spyOn(wrapper.instance(), 'setNextPageData');
            wrapper.setState({ basket: null });
            const checkoutButton = wrapper.findWhere(e => e.name() === 'Button' && e.props().children === 'checkout').at(0);

            // Act
            checkoutButton.simulate('click');

            // Assert
            expect(setNextPageDataFunc).toHaveBeenCalledWith('checkout button');
        });

        it('should render ProductImage', () => {
            const image = wrapper.find('ProductImage');
            expect(image.length).toBe(1);
        });

        it('should render Button', () => {
            const btn = wrapper.find('Button');
            expect(btn.length).toBe(2);
        });

        it('should render urgency messaging if sku flag is true, user is anonymous, and on US site', () => {
            spyOn(LanguageLocale, 'isUS').and.returnValue(true);
            spyOn(userUtils, 'isAnonymous').and.returnValue(true);
            wrapper.setProps({
                sku: {
                    ...sku,
                    isOnlyFewLeft: true
                }
            });

            const flag = wrapper.find('Flag');
            expect(flag.length).toBe(1);
        });

        it('should not render urgency messaging if not US', () => {
            spyOn(LanguageLocale, 'isUS').and.returnValue(false);

            const flag = wrapper.find('Flag');
            expect(flag.length).toBe(0);
        });

        it('should not render urgency messaging if user is not anonymous', () => {
            spyOn(userUtils, 'isAnonymous').and.returnValue(false);

            const flag = wrapper.find('Flag');
            expect(flag.length).toBe(0);
        });

        it('should not render urgency messaging if sku property is false', () => {
            wrapper.setProps({
                sku: {
                    ...sku,
                    isOnlyFewLeft: false
                }
            });

            const flag = wrapper.find('Flag');
            expect(flag.length).toBe(0);
        });

        it('should set props property "analyticsContext" of BccCarousel component to PAGE_TYPES.ADD_TO_BASKET_MODAL when render', () => {
            // Arrange
            const {
                PAGE_TYPES: { ADD_TO_BASKET_MODAL }
            } = analyticsConstants;

            // Act
            wrapper = shallow(<AddToBasketModal {...props} />);

            // Assert
            expect(wrapper.find('BccCarousel').props()).toEqual(objectContaining({ analyticsContext: ADD_TO_BASKET_MODAL }));
        });
    });
});
