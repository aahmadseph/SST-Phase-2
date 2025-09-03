// const { BasketType } = require('constants/Basket').default;
// const { createSpy, objectContaining } = jasmine;
// const React = require('react');

// describe('AddToBasketButton component', () => {
//     // eslint-disable-next-line no-undef
//     const shallow = enzyme.shallow;
//     let skuUtils;
//     let AddToBasketButton;
//     let sku;
//     let locationUtils;
//     let e;
//     let defProps;

//     beforeEach(() => {
//         skuUtils = require('utils/Sku').default;
//         locationUtils = require('utils/Location').default;
//         AddToBasketButton = require('components/AddToBasketButton/AddToBasketButton').default;
//         sku = {
//             isSample: false,
//             type: 'standard',
//             isOutOfStock: false
//         };
//         defProps = {
//             pickupBasketItems: []
//         };
//         global.braze = { logCustomEvent: createSpy() };

//         spyOn(locationUtils, 'isCheckout').and.returnValue(false);
//         spyOn(locationUtils, 'isBasketPage').and.returnValue(false);

//         e = {
//             preventDefault: () => {},
//             stopPropagation: () => {}
//         };
//     });

//     it('it should render Out Of Stock button if product is out of stock', () => {
//         sku.isOutOfStock = true;
//         const shallowComponent = shallow(
//             <AddToBasketButton
//                 sku={sku}
//                 {...defProps}
//             />
//         );
//         expect(shallowComponent.exists('OutOfStockButton')).toBeTruthy();
//     });

//     it('should pass analyticsContext property from own props to OutOfStockButton component if product is out of stock', () => {
//         // Arrange
//         const props = {
//             sku: {
//                 ...sku,
//                 isOutOfStock: true
//             },
//             analyticsContext: 'analyticsContext',
//             ...defProps
//         };
//         const { analyticsContext } = props;

//         // Act
//         const wrapper = shallow(<AddToBasketButton {...props} />);

//         // Assert
//         expect(wrapper.find('OutOfStockButton').props()).toEqual(objectContaining({ analyticsContext }));
//     });

//     it('should dispatch action when "showAddToBasketModal" function is invoked', () => {
//         // Arrange
//         const props = {
//             sku,
//             product: 'product',
//             analyticsContext: 'analyticsContext',
//             quantity: 1,
//             basketType: BasketType.Standard,
//             showAddToBasketModal: createSpy(),
//             ...defProps
//         };

//         const wrapper = shallow(<AddToBasketButton {...props} />);
//         const action = {
//             isOpen: true,
//             product: props.product,
//             preferredStoreName: undefined,
//             sku,
//             basketType: BasketType.Standard,
//             quantity: props.quantity,
//             analyticsContext: props.analyticsContext,
//             replenishmentFrequency: '',
//             replenishmentSelected: undefined,
//             isAutoReplenMostCommon: undefined
//         };

//         // Act
//         wrapper.instance().showAddToBasketModal();

//         // Assert
//         expect(props.showAddToBasketModal).toHaveBeenCalledWith(action);
//     });

//     it('it should render with proper default text', () => {
//         const shallowComponent = shallow(
//             <AddToBasketButton
//                 sku={sku}
//                 preferredStore={{ preferredStoreInfo: {} }}
//                 {...defProps}
//             />
//         );

//         const buttonContent = shallowComponent.children().text();
//         expect(buttonContent).toBe('Add to Basket');
//     });

//     it('it should render with proper sent text', () => {
//         const shallowComponent = shallow(
//             <AddToBasketButton
//                 sku={sku}
//                 text='Add'
//                 preferredStore={{ preferredStoreInfo: {} }}
//                 {...defProps}
//             />
//         );
//         const buttonContent = shallowComponent.children().text();
//         expect(buttonContent).toBe('Add');
//     });

//     it('should calls addClickModal if button is not on RRC T&C modal', done => {
//         spyOn(skuUtils, 'isRougeRewardCard').and.returnValue(true);
//         const setBasketType = createSpy();

//         const shallowComponent = shallow(
//             <AddToBasketButton
//                 sku={sku}
//                 isRRCModal={false}
//                 product={{ type: 'standard' }}
//                 preferredStore={{ preferredStoreInfo: {} }}
//                 setBasketType={setBasketType}
//                 {...defProps}
//             />
//         );

//         const component = shallowComponent.instance();
//         const addClickModalStub = spyOn(component, 'addClickModal');

//         // Update elements to use stubbed functions
//         component.forceUpdate();
//         shallowComponent.update();

//         shallowComponent.find('Button').simulate('click', e);

//         setTimeout(() => {
//             expect(addClickModalStub).toHaveBeenCalled();
//             done();
//         }, 100);
//     });

//     it('should calls handleAddClick if button is on RRC T&C modal', done => {
//         spyOn(skuUtils, 'isRougeRewardCard').and.returnValue(true);
//         const setBasketType = createSpy();

//         const shallowComponent = shallow(
//             <AddToBasketButton
//                 sku={sku}
//                 isRRCModal={true}
//                 product={{ type: 'standard' }}
//                 preferredStore={{ preferredStoreInfo: {} }}
//                 setBasketType={setBasketType}
//                 {...defProps}
//             />
//         );

//         const component = shallowComponent.instance();
//         const handleAddClickStub = spyOn(component, 'handleAddClick');

//         // Update elements to use stubbed functions
//         component.forceUpdate();
//         shallowComponent.update();

//         shallowComponent.find('Button').simulate('click', e);
//         setTimeout(() => {
//             expect(handleAddClickStub).toHaveBeenCalled();
//             done();
//         }, 100);
//     });

//     it('it should render Remove text if product is on basket and it is a sample', () => {
//         const shallowComponent = shallow(
//             <AddToBasketButton
//                 sku={sku}
//                 text='Add'
//                 removeText
//                 preferredStore={{ preferredStoreInfo: {} }}
//                 {...defProps}
//             />
//         ).setState({
//             isInBasket: true,
//             isSample: true
//         });
//         const buttonContent = shallowComponent.children().text();
//         expect(buttonContent).toBe('Remove');
//     });

//     it('it should render Remove text if product is on basket and it is a RRC', () => {
//         spyOn(skuUtils, 'isRougeRewardCard').and.returnValue(true);
//         const shallowComponent = shallow(
//             <AddToBasketButton
//                 sku={sku}
//                 text='Add'
//                 preferredStore={{ preferredStoreInfo: {} }}
//             />
//         ).setState({
//             isInBasket: true,
//             isSample: false
//         });
//         const buttonContent = shallowComponent.children().text();
//         expect(buttonContent).toBe('Remove');
//     });

//     it('it should render Remove text if product is on basket and it is a BI Reward', () => {
//         spyOn(skuUtils, 'isBiReward').and.returnValue(true);
//         const shallowComponent = enzyme
//             .mount(
//                 <AddToBasketButton
//                     sku={sku}
//                     text='Remove'
//                     preferredStore={{ preferredStoreInfo: {} }}
//                 />
//             )
//             .setState({
//                 isInBasket: true,
//                 isSample: false
//             });
//         const buttonContent = shallowComponent.props().text;
//         expect(buttonContent).toBe('Remove');
//     });

//     it('it should disable button if isRopis and reservation is not offered for sku', () => {
//         spyOn(skuUtils, 'isReservationNotOffered').and.returnValue(true);
//         const shallowComponent = shallow(
//             <AddToBasketButton
//                 sku={sku}
//                 isPickup
//                 preferredStore={{ preferredStoreInfo: {} }}
//             />
//         );
//         expect(shallowComponent.prop('disabled')).toBe(true);
//     });

//     it('it should disable button if it is a reward item that is not eligible or rewards are disabled', () => {
//         spyOn(skuUtils, 'isEligible').and.returnValue(true);
//         spyOn(skuUtils, 'isRewardDisabled').and.returnValue(true);

//         const shallowComponent = shallow(
//             <AddToBasketButton
//                 sku={sku}
//                 isRewardItem
//                 preferredStore={{ preferredStoreInfo: {} }}
//             />
//         );
//         expect(shallowComponent.prop('disabled')).toBe(true);
//     });
// });
