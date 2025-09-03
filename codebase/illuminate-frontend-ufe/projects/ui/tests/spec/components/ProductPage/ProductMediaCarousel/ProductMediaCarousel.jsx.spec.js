const { any, createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('ProductMediaCarousel component', () => {
    let Actions;
    let ProductMediaCarousel;
    let React;
    let store;
    let UI;
    let product;
    let sku;
    let productUtils;

    beforeEach(() => {
        Actions = require('actions/Actions').default;
        ProductMediaCarousel = require('components/ProductPage/ProductMediaCarousel/ProductMediaCarousel').default;
        React = require('react');
        store = require('store/Store').default;
        UI = require('utils/UI').default;
        productUtils = require('utils/product').default;

        sku = {
            skuId: '1',
            skuImages: {},
            alternateImages: [{}, {}]
        };
        product = {
            currentSku: sku
        };
    });

    describe('Product Images Carousel', () => {
        it('should render the carousel with product images', () => {
            // Arrange
            const component = shallow(
                <ProductMediaCarousel
                    sku={sku}
                    product={product}
                />,
                { disableLifecycleMethods: true }
            );
            component.setState({ isFullWidth: true });

            // Act
            const carouselComp = component.find('Carousel');

            // Assert
            expect(carouselComp.exists()).toBe(true);
        });

        it('should render the carousel with MouseEnter', () => {
            // Arrange
            const props = {
                product,
                sku
            };

            // Act
            const wrapper = shallow(<ProductMediaCarousel {...props} />, { disableLifecycleMethods: true });
            wrapper.setState({ isFullWidth: true });

            // Assert
            const carousel = wrapper.find('Carousel');
            expect(carousel.prop('onMouseEnter')).toEqual(any(Function));
        });

        it('should render the carousel with MouseLeave', () => {
            // Arrange
            const props = {
                product,
                sku
            };

            // Act
            const wrapper = shallow(<ProductMediaCarousel {...props} />, { disableLifecycleMethods: true });
            wrapper.setState({ isFullWidth: true });

            // Assert
            const carousel = wrapper.find('Carousel');
            expect(carousel.prop('onMouseLeave')).toEqual(any(Function));
        });

        it('should render PanZoom on hover', () => {
            // Arrange
            const wrapper = shallow(
                <ProductMediaCarousel
                    sku={sku}
                    product={product}
                />,
                { disableLifecycleMethods: true }
            );
            const component = wrapper.instance();
            spyOn(component, 'getLoopSize').and.returnValue(1);

            // Act
            wrapper.setState({
                enableZoom: true,
                isZoomLoopOpen: false
            });

            // Assert
            const panZoomWrapper = wrapper.find('PanZoom');
            expect(panZoomWrapper.exists()).toBe(true);
        });

        it('should show productImage on mouseEnter', () => {
            // Arrange
            const skuUtils = require('utils/Sku').default;
            spyOn(skuUtils, 'getImgSrc').and.returnValue('someSrc');
            const wrapper = shallow(
                <ProductMediaCarousel
                    sku={sku}
                    product={product}
                />,
                { disableLifecycleMethods: true }
            );
            const component = wrapper.instance();
            spyOn(component, 'getLoopSize').and.returnValue(1);

            // Act
            wrapper.setState({
                enableZoom: true,
                isZoomLoopOpen: true
            });

            // Assert
            const productImageWrapper = wrapper.find('ProductImage');
            expect(productImageWrapper.exists()).toEqual(true);
        });

        it('should be connected with Thumbnails Carousel on scroll event', () => {
            // Arrange
            const wrapper = shallow(
                <ProductMediaCarousel
                    sku={sku}
                    product={product}
                />,
                { disableLifecycleMethods: true }
            );
            wrapper.setState({
                imageSize: 1,
                isFullWidth: true
            });
            const component = wrapper.instance();
            component.thumbnailRef = { current: { scrollTo: createSpy() } };
            const carouselComp = wrapper.find('Carousel');
            const index = 3;

            // Act
            carouselComp.props().onScroll(index);

            // Assert
            expect(component.thumbnailRef.current.scrollTo).toHaveBeenCalledWith(index);
        });

        it('should pass proper carouselComp items prop based on product images', () => {
            // Arrange
            const wrapper = shallow(
                <ProductMediaCarousel
                    sku={sku}
                    product={product}
                />,
                { disableLifecycleMethods: true }
            );
            wrapper.setState({
                carouselsReady: true,
                imageSize: 1,
                isFullWidth: true
            });

            // Act
            const carouselComp = wrapper.find('Carousel');

            // Assert
            expect(carouselComp.props().items.length).toEqual(3);
        });
    });

    describe('Thumbnail Carousel', () => {
        it('should render the carousel of small images by default', () => {
            // Arrange
            const wrapper = shallow(
                <ProductMediaCarousel
                    sku={sku}
                    product={product}
                />,
                { disableLifecycleMethods: true }
            );
            wrapper.setState({ isFullWidth: false });

            // Act
            const thumbnailComp = wrapper.find('ThumbnailCarousel');

            // Assert
            expect(thumbnailComp.length).toEqual(1);
        });

        it('should render zoomed hover image without badge', () => {
            // Arrange
            const skuUtils = require('utils/Sku').default;
            spyOn(skuUtils, 'getImgSrc').and.returnValue('someSrc');
            const wrapper = shallow(
                <ProductMediaCarousel
                    sku={sku}
                    product={product}
                />,
                { disableLifecycleMethods: true }
            );
            const component = wrapper.instance();
            spyOn(component, 'getLoopSize').and.returnValue(1);

            // Act
            wrapper.setState({
                enableZoom: true,
                isZoomLoopOpen: true
            });

            // Assert
            const zoomedImage = wrapper.find(`ProductImage[id="${sku.skuId}"]`);
            expect(zoomedImage.props().hideBadge).toBeTruthy();
        });
    });

    describe('componentWillReceiveProps', () => {
        let component;
        let instance;
        let scrollToSpy;
        let newProps;
        beforeEach(() => {
            component = shallow(
                <ProductMediaCarousel
                    sku={sku}
                    product={product}
                />,
                { disableLifecycleMethods: true }
            );
            instance = component.instance();
            instance.carouselRef.current = {
                getCurrentIndex: () => {},
                scrollTo: () => {}
            };
            scrollToSpy = spyOn(instance.carouselRef.current, 'scrollTo');
            newProps = {
                product,
                sku: { skuId: '2' }
            };
        });

        it('should scroll carousel to the first item if new SKU (3 images) has less images than currentIndex', () => {
            // Arrange
            spyOn(instance.carouselRef.current, 'getCurrentIndex').and.returnValue(5);

            // Act
            instance.componentWillReceiveProps(newProps);

            // Assert
            expect(scrollToSpy).toHaveBeenCalledWith(0);
        });

        it('should not scroll carousel to the first item if new SKU (3 images) has not less images than currentIndex', () => {
            // Arrange
            spyOn(instance.carouselRef.current, 'getCurrentIndex').and.returnValue(1);

            // Act
            instance.componentWillReceiveProps(newProps);

            // Assert
            expect(scrollToSpy).toHaveBeenCalledTimes(0);
        });

        it('should not scroll carousel to the first item if new SKU (3 images) is the same as prev SKU', () => {
            // Arrange
            newProps.sku.skuId = sku.skuId;
            spyOn(instance.carouselRef.current, 'getCurrentIndex').and.returnValue(5);

            // Act
            instance.componentWillReceiveProps(newProps);

            // Assert
            expect(scrollToSpy).toHaveBeenCalledTimes(0);
        });
    });

    describe('launchProductZoomModal', () => {
        it('should dispatch showProductMediaZoomModal to store', () => {
            const { getMediaItems } = productUtils;
            // Arrange
            const component = shallow(
                <ProductMediaCarousel
                    sku={sku}
                    product={product}
                />,
                { disableLifecycleMethods: true }
            );
            const instance = component.instance();
            instance.state = { isFullWidth: true };
            const index = 0;
            const mediaItems = getMediaItems(product);
            const showAction = 'showProductMediaZoomModalAction';
            const showProductMediaZoomModalSpy = spyOn(Actions, 'showProductMediaZoomModal').and.returnValue(showAction);
            const dispatchSpy = spyOn(store, 'dispatch');

            // Act
            instance.launchProductZoomModal(index)();

            // Assert
            expect(showProductMediaZoomModalSpy).toHaveBeenCalledWith(true, product, index, mediaItems);
            expect(dispatchSpy).toHaveBeenCalledWith(showAction);
        });
    });

    describe('handleResize', () => {
        it('should change isFullWidth state to true if it is Small View', () => {
            // Arrange
            const component = shallow(
                <ProductMediaCarousel
                    sku={sku}
                    product={product}
                />,
                { disableLifecycleMethods: true }
            );
            const instance = component.instance();
            instance.state = { isFullWidth: false };
            const setStateSpy = spyOn(instance, 'setState');
            spyOn(instance, 'isSmallView').and.returnValue(true);

            // Act
            instance.handleResize();

            // Assert
            expect(setStateSpy).toHaveBeenCalledWith({ isFullWidth: true });
        });

        it('should change isFullWidth state to false if it is not Small View', () => {
            // Arrange
            const component = shallow(
                <ProductMediaCarousel
                    sku={sku}
                    product={product}
                />,
                { disableLifecycleMethods: true }
            );
            const instance = component.instance();
            instance.state = { isFullWidth: true };
            const setStateSpy = spyOn(instance, 'setState');
            spyOn(instance, 'isSmallView').and.returnValue(false);
            spyOn(instance, 'getImageSize').and.returnValue(0);

            // Act
            instance.handleResize();

            // Assert
            expect(setStateSpy).toHaveBeenCalledWith({ isFullWidth: false });
        });
    });

    describe('handleZoom function', () => {
        it('should not change state if it is full width', () => {
            // Arrange
            const props = {
                product,
                sku
            };
            const wrapper = shallow(<ProductMediaCarousel {...props} />, { disableLifecycleMethods: true });
            wrapper.setState({ isFullWidth: true });
            const component = wrapper.instance();
            const setState = spyOn(component, 'setState');
            const enableZoom = true;

            // Act
            component.handleZoom(enableZoom);

            // Assert
            expect(setState).toHaveBeenCalledTimes(0);
        });

        it('should not change state if enableZoom has not changed', () => {
            // Arrange
            const props = {
                product,
                sku
            };
            const wrapper = shallow(<ProductMediaCarousel {...props} />, { disableLifecycleMethods: true });
            const enableZoom = true;
            wrapper.setState({
                enableZoom,
                isFullWidth: true
            });
            const component = wrapper.instance();
            const setState = spyOn(component, 'setState');

            // Act
            component.handleZoom(enableZoom);

            // Assert
            expect(setState).toHaveBeenCalledTimes(0);
        });

        it('shoud assign given enableZoom to state if it is not full width', () => {
            // Arrange
            const props = {
                product,
                sku
            };
            const wrapper = shallow(<ProductMediaCarousel {...props} />, { disableLifecycleMethods: true });
            wrapper.setState({ isFullWidth: false });
            const component = wrapper.instance();
            const enableZoom = true;

            // Act
            component.handleZoom(enableZoom);

            // Assert
            expect(wrapper.state('enableZoom')).toEqual(true);
        });

        it('should invoke "Carousel.mouseMove" when enableZoom state property has changed from false to true', () => {
            // Arrange
            const props = {
                sku,
                product
            };
            const component = shallow(<ProductMediaCarousel {...props} />, { disableLifecycleMethods: true }).instance();
            const mouseMove = createSpy('mouseMove');
            component.carouselRef = { current: { mouseMove } };
            const event = new Event('onMouseEnter');
            const enableZoom = true;

            // Act
            component.handleZoom(enableZoom, event);

            // Assert
            expect(mouseMove).toHaveBeenCalledWith(event);
        });
    });

    describe('moveZoom', () => {
        let coordinates;
        let zoomedItem;
        let index;
        let mediaItems;

        beforeEach(() => {
            coordinates = {
                x: 1,
                y: 1
            };
            zoomedItem = {
                type: 'IMAGE',
                media: 'someData'
            };
            index = 0;
            mediaItems = [zoomedItem];
        });

        it('should set zoomLoop state and call renderSvgHeroImageMask with a given coordinates if it is not FullWidth and zoomedItem is IMAGE', () => {
            // Arrange
            const component = shallow(
                <ProductMediaCarousel
                    sku={sku}
                    product={product}
                />,
                { disableLifecycleMethods: true }
            );
            const instance = component.instance();
            instance.state = { isFullWidth: false };
            const setStateSpy = spyOn(instance, 'setState');
            const renderSvgHeroImageMaskSpy = spyOn(instance, 'renderSvgHeroImageMask');

            // Act
            instance.moveZoom(coordinates, index, mediaItems);

            // Assert
            expect(setStateSpy).toHaveBeenCalledWith({
                isZoomLoopOpen: true,
                zoomLoopImage: zoomedItem.media
            });
            expect(renderSvgHeroImageMaskSpy).toHaveBeenCalledWith(coordinates);
        });

        it('should not change state and call renderSvgHeroImageMask if zoomedItem is IMAGE, but it is FullWidth', () => {
            // Arrange
            const component = shallow(
                <ProductMediaCarousel
                    sku={sku}
                    product={product}
                />,
                { disableLifecycleMethods: true }
            );
            const instance = component.instance();
            instance.state = { isFullWidth: true };
            const setStateSpy = spyOn(instance, 'setState');
            const renderSvgHeroImageMaskSpy = spyOn(instance, 'renderSvgHeroImageMask');

            // Act
            instance.moveZoom(coordinates, index, mediaItems);

            // Assert
            expect(setStateSpy).toHaveBeenCalledTimes(0);
            expect(renderSvgHeroImageMaskSpy).toHaveBeenCalledTimes(0);
        });

        it('should not change state and call renderSvgHeroImageMask if it is not FullWidth, but zoomedItem is not IMAGE', () => {
            // Arrange
            const component = shallow(
                <ProductMediaCarousel
                    sku={sku}
                    product={product}
                />,
                { disableLifecycleMethods: true }
            );
            const instance = component.instance();
            instance.state = { isFullWidth: false };
            const setStateSpy = spyOn(instance, 'setState');
            const renderSvgHeroImageMaskSpy = spyOn(instance, 'renderSvgHeroImageMask');
            zoomedItem.type = 'NOT-IMAGE';

            // Act
            instance.moveZoom(coordinates, index, mediaItems);

            // Assert
            expect(setStateSpy).toHaveBeenCalledTimes(0);
            expect(renderSvgHeroImageMaskSpy).toHaveBeenCalledTimes(0);
        });
    });

    describe('getLoopCoords', () => {
        it('should return default coords (0,0) if Zoom Loop is not Open', () => {
            // Arrange
            const component = shallow(
                <ProductMediaCarousel
                    sku={sku}
                    product={product}
                />,
                { disableLifecycleMethods: true }
            );
            const instance = component.instance();
            instance.state = { isZoomLoopOpen: false };
            const coords = {
                x: 10,
                y: 10
            };

            // Act
            const actualCoords = instance.getLoopCoords(coords.x, coords.y);

            // Assert
            expect(actualCoords.x).toEqual(0);
            expect(actualCoords.y).toEqual(0);
        });
    });

    describe('renderSvgHeroImageMask function', () => {
        it('should call requestFrame', () => {
            // Arrange
            const requestFrameSpy = spyOn(UI, 'requestFrame');
            const component = shallow(
                <ProductMediaCarousel
                    sku={sku}
                    product={product}
                />,
                { disableLifecycleMethods: true }
            );
            const instance = component.instance();
            spyOn(instance, 'getLoopThumbSize').and.returnValue(100);
            spyOn(instance, 'getImageSize').and.returnValue(200);
            const coords = {
                x: 10,
                y: 10
            };

            // Act
            instance.renderSvgHeroImageMask(coords);

            // Assert
            expect(requestFrameSpy).toHaveBeenCalledWith(any(Function));
        });
    });
});
