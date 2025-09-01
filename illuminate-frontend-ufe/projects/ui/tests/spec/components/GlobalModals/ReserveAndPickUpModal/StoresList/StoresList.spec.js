// const React = require('react');
// const { shallow } = require('enzyme');

// describe('StoresList component', () => {
//     let StoresList;
//     let wrapper;

//     beforeEach(() => {
//         Sephora.configurationSettings.isBOPISEnabled = true;
//         Sephora.configurationSettings.isROPISEnabled = true;
//         const stores = [
//             {
//                 availabilityStatus: 'In Stock',
//                 displayName: 'Union Street',
//                 distance: 1,
//                 inStoreAvailability: 3,
//                 isBopisable: false,
//                 isRopisable: true,
//                 storeHours: {
//                     closedDays: 'Call your local store for operating hours.',
//                     fridayHours: '11:00AM-7:00PM',
//                     mondayHours: '11:00AM-7:00PM',
//                     saturdayHours: '11:00AM-7:00PM',
//                     sundayHours: '12:00PM-6:00PM',
//                     textColor: 'Black',
//                     thursdayHours: '11:00AM-7:00PM',
//                     timeZone: 'PST8PDT',
//                     tuesdayHours: '11:00AM-7:00PM',
//                     wednesdayHours: '11:00AM-7:00PM'
//                 },
//                 address: {
//                     address1: '',
//                     city: '',
//                     state: '',
//                     postalCode: ''
//                 }
//             },
//             {
//                 availabilityStatus: 'Out Of Stock',
//                 displayName: 'Laurel Village',
//                 distance: 1,
//                 inStoreAvailability: 0,
//                 isBopisable: true,
//                 isRopisable: false,
//                 storeHours: {
//                     closedDays: 'Call your local store for operating hours.',
//                     fridayHours: '11:00AM-7:00PM',
//                     mondayHours: '11:00AM-7:00PM',
//                     saturdayHours: '11:00AM-7:00PM',
//                     sundayHours: '12:00PM-6:00PM',
//                     textColor: 'Black',
//                     thursdayHours: '11:00AM-7:00PM',
//                     timeZone: 'PST8PDT',
//                     tuesdayHours: '11:00AM-7:00PM',
//                     wednesdayHours: '11:00AM-7:00PM'
//                 },
//                 address: {
//                     address1: '',
//                     city: '',
//                     state: '',
//                     postalCode: ''
//                 }
//             }
//         ];

//         StoresList = require('components/GlobalModals/ReserveAndPickUpModal/StoresList').default;
//         wrapper = shallow(<StoresList stores={stores} />);
//     });

//     describe('<StoresList />', () => {
//         it('should have a flag if it\'s ROPIS', () => {
//             const flag = wrapper.find('Flag').at(0).children(0).text();
//             expect(flag).toEqual('PAY IN STORE');
//         });

//         it('should have a flag if it\'s BOPIS', () => {
//             const flag = wrapper.find('Flag').at(1).children(0).text();
//             expect(flag).toEqual('PAY ONLINE');
//         });

//         it('radio button should be disabled if item is Out Of Stock and disableOutOfStockStores is true', () => {
//             const stores = [
//                 {
//                     availabilityStatus: 'out of stock',
//                     displayName: 'Laurel Village',
//                     distance: 1,
//                     inStoreAvailability: 0,
//                     isBopisable: false,
//                     isRopisable: false,
//                     storeHours: {
//                         closedDays: 'Call your local store for operating hours.',
//                         fridayHours: '11:00AM-7:00PM',
//                         mondayHours: '11:00AM-7:00PM',
//                         saturdayHours: '11:00AM-7:00PM',
//                         sundayHours: '12:00PM-6:00PM',
//                         textColor: 'Black',
//                         thursdayHours: '11:00AM-7:00PM',
//                         timeZone: 'PST8PDT',
//                         tuesdayHours: '11:00AM-7:00PM',
//                         wednesdayHours: '11:00AM-7:00PM'
//                     },
//                     address: {
//                         address1: '',
//                         city: '',
//                         state: '',
//                         postalCode: ''
//                     }
//                 }
//             ];
//             wrapper = shallow(
//                 <StoresList
//                     disableOutOfStockStores={true}
//                     stores={stores}
//                 />
//             );

//             const radioButton = wrapper.find('Radio[disabled=true]');

//             expect(radioButton.length).toEqual(1);
//         });

//         it('radio button should be disabled if store is not BOPIS and disableNonBopisStores is true', () => {
//             const stores = [
//                 {
//                     availabilityStatus: 'in stock',
//                     displayName: 'Laurel Village',
//                     distance: 1,
//                     inStoreAvailability: 0,
//                     isBopisable: false,
//                     isRopisable: false,
//                     storeHours: {
//                         closedDays: 'Call your local store for operating hours.',
//                         fridayHours: '11:00AM-7:00PM',
//                         mondayHours: '11:00AM-7:00PM',
//                         saturdayHours: '11:00AM-7:00PM',
//                         sundayHours: '12:00PM-6:00PM',
//                         textColor: 'Black',
//                         thursdayHours: '11:00AM-7:00PM',
//                         timeZone: 'PST8PDT',
//                         tuesdayHours: '11:00AM-7:00PM',
//                         wednesdayHours: '11:00AM-7:00PM'
//                     },
//                     address: {
//                         address1: '',
//                         city: '',
//                         state: '',
//                         postalCode: ''
//                     }
//                 }
//             ];
//             wrapper = shallow(
//                 <StoresList
//                     disableNonBopisStores={true}
//                     stores={stores}
//                 />
//             );

//             const radioButton = wrapper.find('Radio[disabled=true]');

//             expect(radioButton.length).toEqual(1);
//         });
//     });

//     describe('Curbside Pickup Indicator', () => {
//         let curbsideEnabledStores;
//         beforeEach(() => {
//             curbsideEnabledStores = [
//                 {
//                     availabilityStatus: 'In Stock',
//                     displayName: 'Union Street',
//                     distance: 1,
//                     inStoreAvailability: 3,
//                     isBopisable: true,
//                     isCurbsideEnabled: true,
//                     storeHours: {
//                         closedDays: 'Call your local store for operating hours.',
//                         fridayHours: '11:00AM-7:00PM',
//                         mondayHours: '11:00AM-7:00PM',
//                         saturdayHours: '11:00AM-7:00PM',
//                         sundayHours: '12:00PM-6:00PM',
//                         textColor: 'Black',
//                         thursdayHours: '11:00AM-7:00PM',
//                         timeZone: 'PST8PDT',
//                         tuesdayHours: '11:00AM-7:00PM',
//                         wednesdayHours: '11:00AM-7:00PM'
//                     },
//                     address: {
//                         address1: '',
//                         city: '',
//                         state: '',
//                         postalCode: ''
//                     }
//                 }
//             ];
//         });

//         it('should render when BOPIS is enabled and store isBopisable and isCurbsideEnabled', () => {
//             Sephora.configurationSettings.isBOPISEnabled = true;
//             wrapper = shallow(<StoresList stores={curbsideEnabledStores} />);

//             const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

//             expect(curbsideIndicator.length).toEqual(1);
//         });

//         it('should not render when BOPIS is disabled', () => {
//             Sephora.configurationSettings.isBOPISEnabled = false;
//             wrapper = shallow(<StoresList stores={curbsideEnabledStores} />);

//             const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

//             expect(curbsideIndicator.length).toEqual(0);
//         });

//         it('should not render when BOPIS is enabled and store isBopisable is set to false', () => {
//             Sephora.configurationSettings.isBOPISEnabled = true;
//             curbsideEnabledStores[0].isBopisable = false;
//             wrapper = shallow(<StoresList stores={curbsideEnabledStores} />);

//             const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

//             expect(curbsideIndicator.length).toEqual(0);
//         });

//         it('should not render when BOPIS is enabled and store isCurbsideEnabled is set to false', () => {
//             Sephora.configurationSettings.isBOPISEnabled = true;
//             curbsideEnabledStores[0].isCurbsideEnabled = false;
//             wrapper = shallow(<StoresList stores={curbsideEnabledStores} />);

//             const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

//             expect(curbsideIndicator.length).toEqual(0);
//         });

//         it('should render when BOPIS is enabled and store isBopisable and isCurbsideEnabled are set to false', () => {
//             Sephora.configurationSettings.isBOPISEnabled = true;
//             curbsideEnabledStores[0].isBopisable = false;
//             curbsideEnabledStores[0].isCurbsideEnabled = false;
//             wrapper = shallow(<StoresList stores={curbsideEnabledStores} />);

//             const curbsideIndicator = wrapper.find('CurbsidePickupIndicator');

//             expect(curbsideIndicator.length).toEqual(0);
//         });

//         describe('Test data-at attribues', () => {
//             it('should render data-at attribute set to "store_curbside_indicator_label"', () => {
//                 Sephora.configurationSettings.isBOPISEnabled = true;
//                 wrapper = shallow(<StoresList stores={curbsideEnabledStores} />);

//                 const dataAt = wrapper.find('CurbsidePickupIndicator[dataAt="store_curbside_indicator_label"]');

//                 expect(dataAt.length).toEqual(1);
//             });
//         });
//     });
// });
