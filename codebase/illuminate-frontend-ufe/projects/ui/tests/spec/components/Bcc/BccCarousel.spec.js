const React = require('react');
const { shallow } = require('enzyme');
const BccCarousel = require('components/Bcc/BccCarousel/BccCarousel').default;

describe('BccCarousel component', () => {
    let processCircleStub;
    let setStateStub;
    let carouselTitleStub;
    let component;
    let props;

    beforeEach(() => {
        const carItems = [
            { item: { skuid: 238473 } },
            { item: { skuid: 238473 } },
            { item: { skuid: 238473 } },
            { item: { skuid: 238473 } },
            { item: { skuid: 238473 } },
            { item: { skuid: 238473 } },
            { item: { skuid: 238473 } },
            { item: { skuid: 238473 } }
        ];
        props = {
            carouselItems: carItems,
            displayCount: 4,
            totalItems: 8,
            componentType: 54,
            showABTestNumbers: false
        };
    });

    describe('Circle carousel setup', () => {
        beforeEach(() => {
            props.isEnableCircle = true;
        });

        it('should call processCircle if its a circle carousel', () => {
            // Arrange
            component = shallow(<BccCarousel {...props} />).instance();
            processCircleStub = spyOn(component, 'processCircle');

            // Act
            component.updateCarouselState({ carouselItems: component.props.carouselItems });

            // Assert
            expect(processCircleStub).toHaveBeenCalledWith(component.props.carouselItems);
        });

        it('should copy the first slide skus and add to end of array', () => {
            // Arrange
            spyOn(Sephora, 'isMobile').and.returnValue(false);
            component = shallow(<BccCarousel {...props} />).instance();

            // Act
            component.updateCarouselState({ carouselItems: component.props.carouselItems });

            // Assert
            expect(component.state.carouselItems[0]).toEqual(component.state.carouselItems[8]);
        });
    });

    it('Updating state with carousel items should update state with products', () => {
        // Arrange
        props.isEnableCircle = false;
        component = shallow(<BccCarousel {...props} />).instance();
        setStateStub = spyOn(component, 'setState');

        // Act
        component.updateCarouselState({ carouselItems: component.props.carouselItems });

        // Assert
        expect(setStateStub).toHaveBeenCalledWith({
            carouselItems: component.props.carouselItems,
            totalItems: component.props.carouselItems.length,
            shouldDegrade: component.props.carouselItems.length === 0,
            showSkeleton: false
        });
    });

    describe('Show title for carousel', () => {
        it('should use props.title for bcc carousel title', () => {
            // Arrange
            props.title = 'Use It With';
            component = shallow(<BccCarousel {...props} />).instance();
            carouselTitleStub = spyOn(component, 'getCarouselTitle');

            // Act
            component.render();

            // Assert
            expect(carouselTitleStub).toHaveBeenCalledWith(props.title);
        });

        it('should set subheading data at', () => {
            props.subHead = 'Sub Heading';
            component = shallow(<BccCarousel {...props} />);
            const element = component.findWhere(n => n.prop('data-at') === `${Sephora.debug.dataAt('product_carousel_subtext')}`);
            expect(element.exists()).toBeTruthy();
        });
    });

    describe('Numbers for carousel items', () => {
        it('should not display numbers for carousel items if not enabled in BCC', () => {
            // Arrange
            const newProps = {
                title: 'Use It With',
                showSKUNumbering: false,
                ...props
            };
            const wrapper = shallow(<BccCarousel {...newProps} />);
            component = wrapper.instance();
            const carouselItems = component.getCarouselItems();

            carouselItems.forEach(item => {
                expect(item.props.displayNumber).toBeFalsy();
            });
        });

        it('should display numbers for carousel items if enabled in BCC', () => {
            // Arrange
            const newProps = {
                title: 'Use It With',
                showSKUNumbering: true,
                ...props
            };
            const wrapper = shallow(<BccCarousel {...newProps} />);
            component = wrapper.instance();
            const carouselItems = component.getCarouselItems();

            carouselItems.forEach(item => {
                expect(item.props.displayNumber).toBeTruthy();
            });
        });
    });

    describe('"Show More" link', () => {
        it('should be shown when moreTarget targetUrl is defined', () => {
            props.subHead = 'Sub Heading';
            props.title = 'Use It With';
            props.moreTarget = { targetUrl: 'https://sephora.com/shop/makeup' };
            component = shallow(<BccCarousel {...props} />);
            const element = component.findWhere(n => n.prop('data-at') === 'product_carousel_more_link');
            expect(element.exists()).toBeTruthy();
        });
    });
});
