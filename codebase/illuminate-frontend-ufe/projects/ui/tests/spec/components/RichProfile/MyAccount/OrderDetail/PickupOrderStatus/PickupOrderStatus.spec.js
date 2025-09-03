// const React = require('react');
// const { shallow } = require('enzyme');
// const PickupOrderStatus = require('components/RichProfile/MyAccount/OrderDetail/PickupOrderStatus/PickupOrderStatus').default;

// describe('PickupOrderStatus Component', () => {
//     let component;
//     const props = {
//         isPickedUp: false,
//         isCanceledPickupOrder: false,
//         isReadyToPickUp: true,
//         isProcessing: false,
//         orderStatusDisplayName: 'orderStatusDisplayName',
//         pickupOrder: {
//             email: 'test@sephora.com',
//             firstname: 'First',
//             lastName: 'Last',
//             pickedUpDate: 'January 19, 2021',
//             storeDetails: {
//                 address: {
//                     address1: 'Address 1',
//                     address2: 'Addres 2',
//                     city: 'City',
//                     country: 'US',
//                     crossStreet: '',
//                     fax: '',
//                     mallName: '',
//                     phone: '(514) 352-9924',
//                     postalCode: '1234',
//                     state: 'CA'
//                 },
//                 displayName: 'Store Name',
//                 distance: 0,
//                 isBopisable: true,
//                 isRopisable: false,
//                 latitude: 45.601,
//                 longitude: -73.565,
//                 seoCanonicalUrl: '/happening/stores/montreal-anjou',
//                 storeHours: {
//                     closedDays:
//                         'For the health and safety of our clients and associates, store hours may vary. Call your local store for operating hours.',
//                     fridayHours: 'Closed',
//                     mondayHours: '11:00AM-7:00PM',
//                     saturdayHours: 'Closed',
//                     sundayHours: '11:00AM-5:00PM',
//                     textColor: 'Black',
//                     thursdayHours: '11:00AM-7:00PM',
//                     timeZone: 'EST5EDT',
//                     tuesdayHours: '11:00AM-7:00PM',
//                     wednesdayHours: '11:00AM-7:00PM'
//                 },
//                 storeId: '0586',
//                 targetUrl: '/happening/stores/montreal-anjou'
//             },
//             altPickupPersonDetails: {
//                 firstName: 'a',
//                 lasteName: 'a',
//                 email: 'a@a.com'
//             },
//             pickupMethods: [
//                 {
//                     isSelected: false,
//                     pickupMethodDescription: 'In-Store Pickup',
//                     pickupMethodId: '0'
//                 }
//             ]
//         },
//         isGuestOrder: false,
//         orderLocale: 'CA',
//         paymentGroups: [
//             {
//                 paymentGroup: {
//                     address: {
//                         address1: '1254 Greenbrook Lane',
//                         address2: '1254 Greenbrook Lane',
//                         city: 'Hixson',
//                         country: 'US',
//                         extensionNumber: '123',
//                         firstName: 'Jane',
//                         lastName: 'Smith',
//                         phone: '4237047043',
//                         postalCode: '37343',
//                         state: 'TN'
//                     },
//                     amount: '$78.33',
//                     cardNumber: 'xxxx-xxxx-xxxx-1111',
//                     cardType: 'VISA',
//                     creditCardId: 'usercc9020590000',
//                     expirationMonth: '12',
//                     expirationYear: '2023',
//                     firstName: 'Jane',
//                     lastName: 'Smith',
//                     paymentDisplayInfo: 'VISA ending in 1111',
//                     paymentGroupId: 'pg30080766676'
//                 },
//                 paymentGroupType: 'CreditCardPaymentGroup'
//             }
//         ],
//         status: 'Picked Up',
//         email: 'test@sephora.com'
//     };

//     describe('Test data-at', () => {
//         beforeEach(() => {
//             component = shallow(<PickupOrderStatus {...props} />);
//         });

//         it('should render data-at attribute set to "order_status_label"', () => {
//             const dataAt = component.findWhere(n => n.name() === 'strong' && n.prop('data-at') === 'order_status_label');
//             expect(dataAt.length).toBe(1);
//         });

//         it('should render data-at attribute set to "order_pickup_store_label"', () => {
//             const dataAt = component.findWhere(n => n.name() === 'strong' && n.prop('data-at') === 'order_pickup_store_label');
//             expect(dataAt.length).toBe(1);
//         });

//         it('should render data-at attribute set to "order_pickup_person_label"', () => {
//             const dataAt = component.findWhere(n => n.name() === 'strong' && n.prop('data-at') === 'order_pickup_person_label');
//             expect(dataAt.length).toBe(1);
//         });

//         it('should render data-at attribute set to "order_pickup_person_info"', () => {
//             const dataAt = component.findWhere(n => n.name() === 'div' && n.prop('data-at') === 'order_pickup_person_info');
//             expect(dataAt.length).toBe(1);
//         });

//         it('should render data-at attribute set to "order_billing_label"', () => {
//             const dataAt = component.findWhere(n => n.name() === 'h4' && n.prop('data-at') === 'order_billing_label');
//             expect(dataAt.length).toBe(1);
//         });

//         it('should render data-at attribute set to "order_billing_info"', () => {
//             const dataAt = component.findWhere(n => n.name() === 'div' && n.prop('data-at') === 'order_billing_info');
//             expect(dataAt.length).toBe(1);
//         });

//         it('should render data-at attribute set to "map_button"', () => {
//             const dataAt = component.findWhere(n => n.name() === 'Link' && n.prop('data-at') === 'map_button');
//             expect(dataAt.length).toBe(1);
//         });

//         it('should render data-at attribute set to "store_details_button"', () => {
//             const dataAt = component.findWhere(n => n.name() === 'Link' && n.prop('data-at') === 'store_details_button');
//             expect(dataAt.length).toBe(1);
//         });

//         it('should render data-at attribute set to "order_picked_up_label"', () => {
//             component.setProps({ isPickedUp: true });

//             const dataAt = component.findWhere(n => n.name() === 'strong' && n.prop('data-at') === 'order_picked_up_label');

//             expect(dataAt.length).toBe(1);
//         });

//         it('should render data-at attribute set to "order_picked_up_info"', () => {
//             component.setProps({ isPickedUp: true });

//             const dataAt = component.findWhere(n => n.name() === 'span' && n.prop('data-at') === 'order_picked_up_info');

//             expect(dataAt.length).toBe(1);
//         });
//     });

//     describe('Curbside Pickup Indicator', () => {
//         let curbsideProps;

//         beforeEach(() => {
//             curbsideProps = {
//                 ...props,
//                 isBopisOrder: true,
//                 pickupOrder: {
//                     ...props.pickupOrder,
//                     storeDetails: {
//                         ...props.pickupOrder.storeDetails,
//                         isBopisable: true,
//                         isCurbsideEnabled: true
//                     }
//                 }
//             };
//         });

//         it('should render when BOPIS is enabled and store isBopisable and isCurbsideEnabled', () => {
//             Sephora.configurationSettings.isBOPISEnabled = true;
//             component = shallow(<PickupOrderStatus {...curbsideProps} />);

//             const curbsideIndicator = component.find('CurbsidePickupIndicator');

//             expect(curbsideIndicator.length).toEqual(1);
//         });

//         it('should not render order is not BOPIS', () => {
//             Sephora.configurationSettings.isBOPISEnabled = true;
//             curbsideProps.isBopisOrder = false;
//             component = shallow(<PickupOrderStatus {...curbsideProps} />);

//             const curbsideIndicator = component.find('CurbsidePickupIndicator');

//             expect(curbsideIndicator.length).toEqual(0);
//         });

//         it('should not render when BOPIS is disabled', () => {
//             Sephora.configurationSettings.isBOPISEnabled = false;
//             component = shallow(<PickupOrderStatus {...curbsideProps} />);

//             const curbsideIndicator = component.find('CurbsidePickupIndicator');

//             expect(curbsideIndicator.length).toEqual(0);
//         });

//         it('should not render when BOPIS is enabled and store isBopisable is set to false', () => {
//             Sephora.configurationSettings.isBOPISEnabled = true;
//             curbsideProps.pickupOrder.storeDetails.isBopisable = false;
//             component = shallow(<PickupOrderStatus {...curbsideProps} />);

//             const curbsideIndicator = component.find('CurbsidePickupIndicator');

//             expect(curbsideIndicator.length).toEqual(0);
//         });

//         it('should not render when BOPIS is enabled and store isCurbsideEnabled is set to false', () => {
//             Sephora.configurationSettings.isBOPISEnabled = true;
//             curbsideProps.pickupOrder.storeDetails.isCurbsideEnabled = false;
//             component = shallow(<PickupOrderStatus {...curbsideProps} />);

//             const curbsideIndicator = component.find('CurbsidePickupIndicator');

//             expect(curbsideIndicator.length).toEqual(0);
//         });

//         it('should render when BOPIS is enabled and store isBopisable and isCurbsideEnabled are set to false', () => {
//             Sephora.configurationSettings.isBOPISEnabled = true;
//             curbsideProps.pickupOrder.storeDetails.isBopisable = false;
//             curbsideProps.pickupOrder.storeDetails.isCurbsideEnabled = false;
//             component = shallow(<PickupOrderStatus {...curbsideProps} />);

//             const curbsideIndicator = component.find('CurbsidePickupIndicator');

//             expect(curbsideIndicator.length).toEqual(0);
//         });

//         it('should render data-at attribute set to "curbside_indicator_label"', () => {
//             Sephora.configurationSettings.isBOPISEnabled = true;
//             component = shallow(<PickupOrderStatus {...curbsideProps} />);

//             const dataAt = component.find('CurbsidePickupIndicator[dataAt="curbside_indicator_label"]');

//             expect(dataAt.length).toEqual(1);
//         });
//     });
//     describe('Alt Pickup person section', () => {
//         beforeEach(() => {
//             component = shallow(<PickupOrderStatus {...props} />);
//         });
//         it('should render AlternatePickup component if present in order details', () => {
//             const AlternatePickup = component.findWhere(n => n.name() === 'AlternatePickup');
//             expect(AlternatePickup.length).toBe(1);
//         });

//         it('should render AlternatePickup component when order is canceled', () => {
//             component.setProps({ isCanceledPickupOrder: true });
//             const AlternatePickup = component.findWhere(n => n.name() === 'AlternatePickup');

//             expect(AlternatePickup.length).toBe(1);
//         });

//         it('should not render Edit button on AlternatePickup component when order is canceled', () => {
//             component.setProps({ isCanceledPickupOrder: true });
//             const AlternatePickup = component.findWhere(n => n.name() === 'AlternatePickup');

//             expect(AlternatePickup.prop('allowEdit')).toBe(false);
//         });
//     });
// });
