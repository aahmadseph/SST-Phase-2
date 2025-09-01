// /* eslint-disable no-unused-vars */
// const React = require('react');
// const { mount } = require('enzyme');

// describe('HoursInformation Component', () => {
//     let wrapper;
//     let props;
//     let HoursInformation;
//     let HoursGrid;
//     let storeHoursUtils;
//     const storeHoursDisplay = [
//         {
//             label: 'Store Hours',
//             isTitle: true,
//             value: 'Open until 8:00 PM today',
//             valueColor: 'green'
//         },
//         {
//             label: 'Mon - Thu',
//             value: '10:00 AM - 8:00 PM'
//         },
//         {
//             label: 'Fri - Sat',
//             value: '10:00 AM - 9:00 PM'
//         },
//         {
//             label: 'Sun',
//             value: '11:00 AM - 7:00 PM'
//         }
//     ];

//     const curbsideHoursDisplay = [
//         {
//             label: 'Curbside Hours',
//             isTitle: true,
//             value: 'Unavailable',
//             valueColor: 'red'
//         },
//         {
//             label: 'Mon - Sun',
//             value: 'Unavailable today'
//         }
//     ];

//     beforeEach(() => {
//         HoursInformation = require('components/Content/Happening/StoreDetails/HoursInformation').default;
//         HoursGrid = require('components/Content/Happening/StoreDetails/HoursInformation/HoursGrid').default;
//         storeHoursUtils = require('utils/StoreHours').default;

//         props = {
//             store: {
//                 displayName: 'The Great Mall',
//                 address: {
//                     address1: '250 Great Mall Drive',
//                     address2: '',
//                     city: 'Milpitas',
//                     country: 'US',
//                     phone: '(408) 457-6000',
//                     postalCode: '95035',
//                     state: 'CA'
//                 },
//                 curbsideHours: {
//                     mondayHours: '10:00AM-08:00PM',
//                     tuesdayHours: '10:00AM-08:00PM',
//                     wednesdayHours: '10:00AM-08:00PM',
//                     thursdayHours: '10:00AM-08:00PM',
//                     fridayHours: '10:00AM-09:00PM',
//                     saturdayHours: '10:00AM-09:00PM',
//                     sundayHours: '11:00AM-07:00PM'
//                 },
//                 storeHours: {
//                     mondayHours: '10:00AM-08:00PM',
//                     tuesdayHours: '10:00AM-08:00PM',
//                     wednesdayHours: '10:00AM-08:00PM',
//                     thursdayHours: '10:00AM-08:00PM',
//                     fridayHours: '10:00AM-09:00PM',
//                     saturdayHours: '10:00AM-09:00PM',
//                     sundayHours: '11:00AM-07:00PM'
//                 },
//                 storeId: '1348',
//                 storeType: 'SEPHORA',
//                 latitude: 37.4,
//                 longitude: -121.9,
//                 timeZone: 'America/Los_Angeles',
//                 isBopisable: true,
//                 isCurbsideEnabled: false,
//                 isInStorePickupEnabled: true,
//                 isBeautyServicesEnabled: true,
//                 isStoreEventsEnabled: true,
//                 storeSpecialMessage:
//                     'For the health and safety of our clients and associates, store hours may vary. Call your local store for operating hours.'
//             }
//         };

//         spyOn(storeHoursUtils, 'getStoreHoursDisplay').withArgs(props.store).and.returnValue({ storeHoursDisplay, curbsideHoursDisplay });

//         spyOn(storeHoursUtils, 'getSpecialStoreHours').and.returnValue([]);
//         spyOn(storeHoursUtils, 'getStoreSpecialMessage').and.returnValue([
//             {
//                 message: props.store.storeSpecialMessage,
//                 color: 'red'
//             }
//         ]);
//         spyOn(storeHoursUtils, 'isCurbsideEnabled').and.returnValue(true);
//         spyOn(storeHoursUtils, 'isStoreTypeKohls').and.returnValue(false);
//         wrapper = mount(<HoursInformation {...props} />);
//     });

//     it('renders correctly with store hours', () => {
//         expect(wrapper.find('Flex').first().prop('children')[0].props.timeRange).toEqual(storeHoursDisplay);
//         expect(wrapper.find('Flex').first().prop('children')[1].props.timeRange).toEqual(curbsideHoursDisplay);
//     });

//     it('should render store special message if provided', () => {
//         expect(wrapper.find('Text').prop('children')).toEqual(props.store.storeSpecialMessage);
//     });
// });
