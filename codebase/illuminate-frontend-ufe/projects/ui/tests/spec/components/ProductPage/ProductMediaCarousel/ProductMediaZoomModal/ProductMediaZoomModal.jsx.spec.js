// const { createSpy, any } = jasmine;
// const { shallow } = require('enzyme');
// const React = require('react');

// let sku;
// let product;

// describe('ProductMediaZoomModal component', () => {
//     let ProductMediaZoomModal;
//     let wrapper;

//     beforeEach(() => {
//         ProductMediaZoomModal = require('components/ProductPage/ProductMediaCarousel/ProductMediaZoomModal/ProductMediaZoomModal').default;
//         const isOpen = true;
//         product = {
//             currentSku: {
//                 alternateImages: [
//                     {
//                         altText: 'SEPHORA',
//                         image43: '/prouctImage/product/abc.jpg'
//                     }
//                 ]
//             },
//             productDetails: {
//                 brand: { displayName: 'Fenty' },
//                 displayName: 'Lipstick'
//             }
//         };
//         sku = {
//             skuImages: { image43: '/prouctImage/product/abc.jpg' },
//             alternateImages: [
//                 {
//                     altText: 'SEPHORA',
//                     image43: '/prouctImage/product/abc.jpg'
//                 }
//             ]
//         };
//         const mediaItems = [{ type: 'IMAGE' }];

//         wrapper = shallow(
//             <ProductMediaZoomModal
//                 isOpen={isOpen}
//                 product={product}
//                 sku={sku}
//             />
//         );

//         wrapper.setState({
//             selectedItemIndex: 0,
//             mediaList: mediaItems
//         });
//     });

//     it('should render a modal instance', () => {
//         expect(wrapper.find('Modal').length).toBe(1);
//     });

//     it('should render the correct modal title brand', () => {
//         expect(wrapper.find('ModalTitle').props().children).toBe('Fenty Lipstick');
//     });

//     it('should render PanZoom for smallview', () => {
//         wrapper.setState({ showZoom: true });
//         const modalBody = wrapper.find('ModalBody');
//         expect(modalBody.find('PanZoom').length).toBe(1);
//     });

//     it('should not render PanZoom for largeview', () => {
//         wrapper.setState({ showZoom: false });
//         const modalBody = wrapper.find('ModalBody');
//         expect(modalBody.find('PanZoom').length).toBe(0);
//     });

//     it('should render the thumbNail ', () => {
//         const modalFooter = wrapper.find('ModalFooter').props();
//         expect(modalFooter.children.length).toBe(1);
//     });

//     it('should render the Carousel for large view', () => {
//         wrapper.setState({
//             showZoom: false
//         });
//         expect(wrapper.find('Carousel').length).toBe(1);
//     });

//     it('should render the Carousel with simple arrows', () => {
//         wrapper.setState({
//             showZoom: false
//         });
//         const Carousel = wrapper.find('Carousel');
//         expect(Carousel.props().arrowVariant).toBe('simple');
//     });

//     it('should have render a ProductMediaZoom for video', () => {
//         wrapper.setState({ showZoom: false });
//         expect(wrapper.find('ProductMediaZoomItem').length).toBe(1);
//     });

//     it('should autoplay video on Zoom Modal if it’s selected', () => {
//         // Arrange
//         const model = new ProductMediaZoomModal({});
//         const onVideoSelectStub = createSpy('onVideoSelect');
//         model.state = {
//             showZoom: true
//         };
//         model.mediaListCompsRefs = [{ onVideoSelect: onVideoSelectStub }];
//         spyOn(model, 'setState').and.callFake((_, callback) => callback());

//         // Act
//         model.updateSelectedItem(0);

//         // Assert
//         expect(onVideoSelectStub).toHaveBeenCalledTimes(1);
//     });

//     it('should have render a ProductMediaZoom with hideBadge props', () => {
//         // Arrange
//         wrapper.setState({ showZoom: true });

//         // Act
//         const mediaItemElement = wrapper.find('ProductImage');

//         // Assert
//         expect(mediaItemElement.props().hideBadge).toBeTruthy();
//     });

//     describe('handleResize', () => {
//         it('should set showZoom as true if it is small view', () => {
//             // Arrange
//             const instance = wrapper.instance();
//             wrapper.setState({ showZoom: false });
//             const setStateSpy = spyOn(instance, 'setState');
//             spyOn(instance, 'isSmallView').and.returnValue(true);

//             // Act
//             instance.handleResize();

//             // Assert
//             expect(setStateSpy).toHaveBeenCalledWith({ showZoom: true });
//         });

//         it('should set showZoom as false if it is not small view', () => {
//             // Arrange
//             const model = new ProductMediaZoomModal({});
//             model.state = {
//                 showZoom: true,
//                 selectedItemIndex: 0,
//                 mediaList: [{}]
//             };
//             spyOn(model, 'isSmallView').and.returnValue(false);
//             const setStateStub = spyOn(model, 'setState');

//             // Act
//             model.handleResize();

//             // Assert
//             expect(setStateStub).toHaveBeenCalledWith({ showZoom: false }, any(Function));
//         });
//     });

//     describe('handleScroll', () => {
//         it('should not change state if showZoom is true', () => {
//             // Arrange
//             const instance = wrapper.instance();
//             wrapper.setState({ showZoom: true });
//             const index = 1;
//             const setStateSpy = spyOn(instance, 'setState');

//             // Act
//             instance.handleScroll(index);

//             // Assert
//             expect(setStateSpy).toHaveBeenCalledTimes(0);
//         });

//         it('should set state.selectedItemIndex from a given index if showZoom is false', () => {
//             // Arrange
//             const instance = wrapper.instance();
//             wrapper.setState({ showZoom: false });
//             const index = 1;
//             const setStateSpy = spyOn(instance, 'setState');

//             // Act
//             instance.handleScroll(index);

//             // Assert
//             expect(setStateSpy).toHaveBeenCalledWith({ selectedItemIndex: index });
//         });
//     });
// });
