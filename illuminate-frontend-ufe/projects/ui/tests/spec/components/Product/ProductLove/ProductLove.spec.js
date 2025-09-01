const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('ProductLove component', () => {
    let ProductLove, skuHelpers, isSkuLovedSpy, initialState;

    beforeEach(() => {
        ProductLove = require('components/Product/ProductLove/ProductLove').default;
        skuHelpers = require('utils/skuHelpers').default;

        isSkuLovedSpy = spyOn(skuHelpers, 'isSkuLoved');

        initialState = {
            isActive: false,
            hover: false
        };
    });

    describe('handleOnClick function', () => {
        let authenticationStub;

        beforeEach(() => {
            const Authentication = require('utils/Authentication').default;
            authenticationStub = spyOn(Authentication, 'requireAuthentication').and.returnValue({ then: () => ({ catch: () => {} }) });
        });

        it('should do an authentication check first', () => {
            // Arrange
            const event = {
                preventDefault: () => {},
                stopPropagation: () => {}
            };
            const props = {
                lovesource: 'productPage',
                sku: { skuId: '1234122' },
                productId: 'P123456'
            };

            // Act
            const wrapper = shallow(
                <ProductLove
                    {...props}
                    addLove={createSpy()}
                    removeLove={createSpy()}
                />
            );
            const component = wrapper.instance();
            component.handleOnClick(event, component.props.skuLoveData);

            // Assert
            expect(authenticationStub).toHaveBeenCalled();
        });

        it('should prevents the default action the browser makes on that event', () => {
            // Arrange
            const event = {
                preventDefault: createSpy('preventDefault'),
                stopPropagation: () => {}
            };

            // Act
            shallow(<ProductLove />)
                .instance()
                .handleOnClick(event);

            // Assert
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should stops the event from bubbling up the event chain', () => {
            // Arrange
            const event = {
                preventDefault: () => {},
                stopPropagation: createSpy('stopPropagation')
            };

            // Act
            shallow(<ProductLove />)
                .instance()
                .handleOnClick(event);

            // Assert
            expect(event.stopPropagation).toHaveBeenCalled();
        });
    });

    describe('handle love request', () => {
        let component, props;
        const addLove = createSpy();
        const removeLove = createSpy();

        beforeEach(() => {
            props = {
                lovesource: 'productPage',
                sku: { skuId: '1234122' },
                addLove,
                removeLove,
                skuLoveData: { productId: 'P123456' }
            };
            const wrapper = shallow(<ProductLove {...props} />);
            component = wrapper.instance();
        });

        it('should dispatch addLove action if sku is not loved', () => {
            component.handleLoveRequest(component.props.skuLoveData);
            expect(addLove).toHaveBeenCalled();
        });

        it('should dispatch removeLove action if sku is loved', () => {
            isSkuLovedSpy.and.returnValue(true);
            component.handleLoveRequest(component.props.skuLoveData);
            expect(removeLove).toHaveBeenCalled();
        });
    });

    describe('mouse events', () => {
        let event, component;

        beforeEach(() => {
            event = { stopPropagation: createSpy() };
            const props = {
                lovesource: 'productPage',
                sku: { skuId: '1234122' }
            };
            const wrapper = shallow(<ProductLove {...props} />);
            component = wrapper.instance();
        });

        it('should setState hover to true on mouseEnter', () => {
            component.mouseEnter(event);
            expect(event.stopPropagation).toHaveBeenCalled();
            expect(component.state.hover).toBe(!initialState.hover);
        });

        it('should setState hover to false on mouseLeave', () => {
            component.mouseLeave(event);
            expect(event.stopPropagation).toHaveBeenCalled();
            expect(component.state.hover).toBe(initialState.hover);
        });
    });

    it('should render child correctly when it is a function', () => {
        // Arrange
        const children = createSpy('children').and.callFake(() => null);
        const props = {
            lovesource: 'productPage',
            sku: { skuId: '1234122' },
            children
        };

        // Act
        shallow(<ProductLove {...props} />);

        // Assert
        expect(children).toHaveBeenCalled();
    });
});
