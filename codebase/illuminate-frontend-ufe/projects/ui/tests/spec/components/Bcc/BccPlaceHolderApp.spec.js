// describe('BccPlaceHolderApp Component', () => {
//     let BccPlaceHolderApp;
//     let testingComponent;
//     let PLACEHOLDER_APPS;
//     let React;
//     let shallowComponent;

//     beforeEach(() => {
//         PLACEHOLDER_APPS = require('utils/BCC').default.PLACEHOLDER_APPS;
//         React = require('react');
//         BccPlaceHolderApp = require('components/Bcc/BccPlaceHolderApp/BccPlaceHolderApp').default;
//     });

//     describe('#render method', () => {
//         describe('"fixedLiveChatApp" placeHolderType', () => {
//             beforeEach(() => {
//                 shallowComponent = enzyme.shallow(<BccPlaceHolderApp placeHolderType={PLACEHOLDER_APPS.FIXEDLIVECHAT} />);
//                 testingComponent = shallowComponent.find('CustomerServiceChat').get(0);
//             });

//             it('should render the customer chat component ', () => {
//                 expect(testingComponent.type.displayName).toBe('CustomerServiceChat');
//             });

//             it('should set isFixed prop to true for the customer chat component', () => {
//                 expect(testingComponent.props.isFixed).toBe(true);
//             });
//         });

//         describe('"dynamicLiveChatApp" placeHolderType', () => {
//             beforeEach(() => {
//                 shallowComponent = enzyme.shallow(<BccPlaceHolderApp placeHolderType={PLACEHOLDER_APPS.DYNAMICLIVECHAT} />);
//                 testingComponent = shallowComponent.find('CustomerServiceChat').get(0);
//             });

//             it('should render the customer chat component', () => {
//                 expect(testingComponent.type.displayName).toBe('CustomerServiceChat');
//             });

//             it('should not set isFixed prop for customer chat component', () => {
//                 expect(testingComponent.props.isFixed).toBe(undefined);
//             });
//         });

//         describe('"giftCardLookupApp placeHolderType', () => {
//             beforeEach(() => {
//                 shallowComponent = enzyme.shallow(<BccPlaceHolderApp placeHolderType={PLACEHOLDER_APPS.GIFTCARDLOOKUP} />);
//                 testingComponent = shallowComponent.find('GiftCards').get(0);
//             });

//             it('should render the giftCard lookup component', () => {
//                 expect(testingComponent.type.displayName).toBe('GiftCards');
//             });

//             it('should not render title on giftCard lookup component', () => {
//                 expect(testingComponent.props.hasTitle).toBe(false);
//             });
//         });

//         afterEach(() => {
//             testingComponent = null;
//         });
//     });
// });
