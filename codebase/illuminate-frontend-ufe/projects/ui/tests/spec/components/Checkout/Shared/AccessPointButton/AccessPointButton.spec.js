// const React = require('react');
// const { shallow } = require('enzyme');
// const { createSpy } = jasmine;

// const AccessPointButton = require('components/Checkout/Shared/AccessPointButton/AccessPointButton').default;
// const { getLocaleResourceFile } = require('utils/LanguageLocale').default;
// const getText = getLocaleResourceFile('components/Checkout/Shared/AccessPointButton/locales', 'AccessPointButton');

// const { ACCESS_POINT_INFO_MODAL } = require('utils/BCC').default.MEDIA_IDS;

// const infoModalOptions = {
//     isOpen: true,
//     mediaId: ACCESS_POINT_INFO_MODAL,
//     title: getText('accessPointInfoTitle'),
//     titleDataAt: 'accessPointInfoModalTitle',
//     width: 0
// };

// describe('AccessPointButton component', () => {
//     const wrapper = shallow(<AccessPointButton />);

//     it('should be rendered', () => {
//         expect(wrapper.isEmptyRender()).toBeFalsy();
//     });

//     describe('Test full variant', () => {
//         const fullWrapper = shallow(<AccessPointButton />);

//         it('should render full variant by default', () => {
//             const key = fullWrapper.findWhere(n => n.key() === 'variant-full');
//             expect(key.length).toBe(1);
//         });

//         const title = fullWrapper.findWhere(n => n.key() === 'title');

//         it('should render a title component', () => {
//             expect(title.length).toBe(1);
//         });

//         it('title text should say "Ship to FedEx Pickup Location"', () => {
//             expect(title.text()).toEqual(getText('shipToFedex'));
//         });

//         it('should render InfoButton', () => {
//             const infoButton = fullWrapper.find('InfoButton');
//             expect(infoButton.length).toBe(1);
//         });

//         it('should trigger media modal on InfoButton click', () => {
//             const props = {
//                 showMediaModal: createSpy(),
//                 globalModals: {}
//             };

//             const infoButton = shallow(<AccessPointButton {...props} />).find('InfoButton');
//             infoButton.simulate('click');

//             expect(props.showMediaModal).toHaveBeenCalledWith(infoModalOptions);
//         });

//         const modalTrigger = fullWrapper.findWhere(n => n.key() === 'modalTrigger');

//         it('should render a Link to trigger the Access Points modal', () => {
//             expect(modalTrigger.length).toBe(1);
//         });

//         it('link text should say "Select a location near you"', () => {
//             expect(modalTrigger.text()).toEqual(getText('selectLocationNearYou'));
//         });
//     });

//     describe('Test noTitle variant', () => {
//         const noTitleWrapper = shallow(<AccessPointButton variant='noTitle' />);

//         it('should render noTitle variant', () => {
//             const key = noTitleWrapper.findWhere(n => n.key() === 'variant-noTitle');
//             expect(key.length).toBe(1);
//         });

//         const modalTrigger = noTitleWrapper.findWhere(n => n.key() === 'modalTrigger');

//         it('should render a Link to trigger the Access Points modal', () => {
//             expect(modalTrigger.length).toBe(1);
//         });

//         it('link text should say "Or ship to a FedEx Pickup Location near you"', () => {
//             expect(modalTrigger.text()).toEqual(getText('orShipToFedexLocation'));
//         });

//         it('should render InfoButton', () => {
//             const infoButton = noTitleWrapper.findWhere(n => n.name() === 'InfoButton');
//             expect(infoButton.length).toBe(1);
//         });

//         it('should trigger media modal on InfoButton click', () => {
//             const props = {
//                 variant: 'noTitle',
//                 showMediaModal: createSpy(),
//                 globalModals: {}
//             };

//             const infoButton = shallow(<AccessPointButton {...props} />).find('InfoButton');
//             infoButton.simulate('click');

//             expect(props.showMediaModal).toHaveBeenCalledWith(infoModalOptions);
//         });
//     });

//     describe('Test linkOnly variant', () => {
//         const linkOnlyWrapper = shallow(<AccessPointButton variant='linkOnly' />);

//         it('should render linkOnly variant', () => {
//             const key = linkOnlyWrapper.findWhere(n => n.key() === 'variant-linkOnly');
//             expect(key.length).toBe(1);
//         });

//         const modalTrigger = linkOnlyWrapper.findWhere(n => n.key() === 'modalTrigger');

//         it('should render a Link to trigger the Access Points modal', () => {
//             expect(modalTrigger.length).toBe(1);
//         });

//         it('link text should say "Change alternate location"', () => {
//             expect(modalTrigger.text()).toEqual(getText('changeAlternateLocation'));
//         });
//     });

//     describe('Test iconOnly variant', () => {
//         const iconOnlyWrapper = shallow(<AccessPointButton variant='iconOnly' />);

//         it('should render iconOnly variant', () => {
//             const key = iconOnlyWrapper.findWhere(n => n.key() === 'variant-iconOnly');
//             expect(key.length).toBe(1);
//         });

//         it('should render InfoButton', () => {
//             const infoButton = iconOnlyWrapper.findWhere(n => n.name() === 'InfoButton');
//             expect(infoButton.length).toBe(1);
//         });

//         it('should trigger media modal on InfoButton click', () => {
//             const props = {
//                 variant: 'iconOnly',
//                 showMediaModal: createSpy(),
//                 globalModals: {}
//             };

//             const infoButton = shallow(<AccessPointButton {...props} />).find('InfoButton');
//             infoButton.simulate('click');

//             expect(props.showMediaModal).toHaveBeenCalledWith(infoModalOptions);
//         });
//     });
// });
