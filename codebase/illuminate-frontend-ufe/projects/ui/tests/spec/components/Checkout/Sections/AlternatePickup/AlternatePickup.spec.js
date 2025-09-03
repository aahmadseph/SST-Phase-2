// const { shallow, mount } = require('enzyme');
// const React = require('react');
// const AlternatePickup = require('components/Checkout/Sections/AlternatePickup').default;
// const Actions = require('Actions').default;
// const CheckoutApi = require('services/api/checkout').default;
// const localeUtils = require('utils/LanguageLocale').default;
// const anaConsts = require('analytics/constants').default;
// const processEvent = require('analytics/processEvent').default;
// const resourceWrapper = require('utils/framework/resourceWrapper').default;
// const getText = resourceWrapper(localeUtils.getLocaleResourceFile('components/Checkout/Sections/AlternatePickup/locales', 'AlternatePickup'));
// const altPickupNotes = {
//     add: 'To add an alternate pickup person, go to {0}.',
//     update: 'To modify or remove the alternate pickup person, go to {0}.'
// };

// describe('AlternatePickup component', () => {
//     let wrapper;
//     let props;
//     let processStub;
//     let fakeAddAlternatePickupPerson;
//     let fakeRejectAlternatePickupPerson;
//     let fakeRejectGenericAlternatePickupPerson;
//     let showInfoModalStub;

//     beforeEach(() => {
//         props = {
//             alternatePickupData: {
//                 firstName: 'FirstName',
//                 lastName: 'LastName',
//                 email: 'email@sephora.com'
//             }
//         };
//         fakeAddAlternatePickupPerson = {
//             then: function (resolve) {
//                 resolve({
//                     firstName: props.alternatePickupData.firstName,
//                     lastName: props.alternatePickupData.lastName
//                 });

//                 return fakeAddAlternatePickupPerson;
//             },
//             catch: function () {
//                 return function () {};
//             }
//         };
//         fakeRejectAlternatePickupPerson = {
//             then: function () {
//                 return fakeRejectAlternatePickupPerson;
//             },
//             catch: function (reject) {
//                 reject({
//                     errorCode: -1,
//                     errorMessages: ['Error message from API']
//                 });
//             }
//         };

//         fakeRejectGenericAlternatePickupPerson = {
//             then: function () {
//                 return fakeRejectGenericAlternatePickupPerson;
//             },
//             catch: function (reject) {
//                 reject();
//             }
//         };

//         processStub = spyOn(processEvent, 'process');
//         showInfoModalStub = spyOn(Actions, 'showInfoModal');
//         wrapper = shallow(<AlternatePickup {...props} />);
//     });

//     describe('Test Alternate Pickup Warnings', () => {
//         it('should display warning when user clicks Edit and isOmsAckedForAltPickupUpdate is false in Order Details', () => {
//             wrapper.setProps({
//                 isOrderDetails: true,
//                 isOMSAckedForAltPickupUpdate: false
//             });
//             const editBtn = wrapper.findWhere(n => n.key() === 'editBtn');
//             editBtn.simulate('click');

//             expect(showInfoModalStub).toHaveBeenCalledWith({
//                 isOpen: true,
//                 footerColumns: [1, 2],
//                 title: getText('alternatePickupPerson'),
//                 message: getText('cannotModifyMessage'),
//                 buttonText: getText('ok')
//             });
//         });

//         it('should display warning when user clicks Add alternate pickup person and isOmsAckedForAltPickupUpdate is false in Order Details', () => {
//             wrapper.setProps({
//                 isOrderDetails: true,
//                 isOMSAckedForAltPickupUpdate: false
//             });
//             wrapper.setState({ altPickupCaptured: false });

//             const addBtn = wrapper.findWhere(n => n.key() === 'addBtn');
//             addBtn.simulate('click');

//             expect(showInfoModalStub).toHaveBeenCalledWith({
//                 isOpen: true,
//                 footerColumns: [1, 2],
//                 title: getText('alternatePickupPerson'),
//                 message: getText('cannotModifyMessage'),
//                 buttonText: getText('ok')
//             });
//         });

//         it('should display warning when API returns an errorCode -1', () => {
//             spyOn(CheckoutApi, 'addAlternatePickupPerson').and.returnValue(fakeRejectAlternatePickupPerson);
//             wrapper = mount(<AlternatePickup {...props} />);
//             wrapper.setState({
//                 editMode: true,
//                 altPickupCaptured: false
//             });

//             const saveBtn = wrapper.findWhere(n => n.key() === 'saveBtn');
//             saveBtn.simulate('click');

//             expect(showInfoModalStub).toHaveBeenCalledWith({
//                 isOpen: true,
//                 footerColumns: [1, 2],
//                 title: getText('alternatePickupPerson'),
//                 message: 'Error message from API',
//                 buttonText: getText('ok')
//             });
//         });

//         it('should display generic warning message when there is not error response in API', () => {
//             spyOn(CheckoutApi, 'addAlternatePickupPerson').and.returnValue(fakeRejectGenericAlternatePickupPerson);
//             wrapper = mount(<AlternatePickup {...props} />);
//             wrapper.setState({
//                 editMode: true,
//                 altPickupCaptured: false
//             });

//             const saveBtn = wrapper.findWhere(n => n.key() === 'saveBtn');
//             saveBtn.simulate('click');

//             expect(showInfoModalStub).toHaveBeenCalledWith({
//                 isOpen: true,
//                 footerColumns: [1, 2],
//                 title: getText('alternatePickupPerson'),
//                 message: getText('genericErrorMessage'),
//                 buttonText: getText('ok')
//             });
//         });
//     });

//     describe('Test Analytics', () => {
//         it('should trigger a call when the user clicks Add alternate pickup person', () => {
//             wrapper.setState({ altPickupCaptured: false });

//             const addBtn = wrapper.findWhere(n => n.key() === 'addBtn');
//             addBtn.simulate('click');

//             expect(processStub).toHaveBeenCalledWith(anaConsts.ASYNC_PAGE_LOAD, {
//                 data: {
//                     pageName: anaConsts.ALT_PICKUP.PAGE_NAME,
//                     linkData: anaConsts.ALT_PICKUP.ADD,
//                     previousPageName: ''
//                 }
//             });
//         });

//         it('should trigger a call when the user clicks Edit alternate pickup person', () => {
//             const editBtn = wrapper.findWhere(n => n.key() === 'editBtn');
//             editBtn.simulate('click');

//             expect(processStub).toHaveBeenCalledWith(anaConsts.ASYNC_PAGE_LOAD, {
//                 data: {
//                     pageName: anaConsts.ALT_PICKUP.PAGE_NAME,
//                     linkData: anaConsts.ALT_PICKUP.EDIT,
//                     previousPageName: ''
//                 }
//             });
//         });

//         it('should trigger a call when the user clicks Save button', () => {
//             spyOn(CheckoutApi, 'addAlternatePickupPerson').and.returnValue(fakeAddAlternatePickupPerson);
//             wrapper = mount(<AlternatePickup {...props} />);
//             wrapper.setState({
//                 editMode: true,
//                 altPickupCaptured: false
//             });

//             const saveBtn = wrapper.findWhere(n => n.key() === 'saveBtn');
//             saveBtn.simulate('click');

//             expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
//                 data: {
//                     pageName: anaConsts.ALT_PICKUP.PAGE_NAME,
//                     linkName: anaConsts.ALT_PICKUP.SAVE,
//                     actionInfo: anaConsts.ALT_PICKUP.SAVE
//                 }
//             });
//         });

//         it('should trigger a call when the user confirms Remove', () => {
//             spyOn(CheckoutApi, 'removeAlternatePickupPerson').and.returnValue(fakeAddAlternatePickupPerson);
//             wrapper.setState({
//                 altPickupCaptured: false,
//                 editMode: true
//             });
//             const component = wrapper.instance();

//             component.removeAltPickupAndResetState();

//             expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
//                 data: {
//                     pageName: anaConsts.ALT_PICKUP.PAGE_NAME,
//                     linkName: anaConsts.ALT_PICKUP.REMOVE,
//                     actionInfo: anaConsts.ALT_PICKUP.REMOVE
//                 }
//             });
//         });
//     });

//     describe('Add Alternate Pickup Person', () => {
//         it('should display confirmation message in Order Details page', () => {
//             const fullName = `${props.alternatePickupData.firstName} ${props.alternatePickupData.lastName}`;

//             spyOn(CheckoutApi, 'addAlternatePickupPerson').and.returnValue(fakeAddAlternatePickupPerson);
//             wrapper = mount(<AlternatePickup {...props} />);
//             wrapper.setState({
//                 editMode: true,
//                 altPickupCaptured: false
//             });
//             wrapper.setProps({ isOrderDetails: true });

//             const saveBtn = wrapper.findWhere(n => n.key() === 'saveBtn');
//             saveBtn.simulate('click');

//             expect(showInfoModalStub).toHaveBeenCalledWith({
//                 isOpen: true,
//                 footerColumns: [1, 2],
//                 title: getText('addedAlternatePickup'),
//                 message: getText('addedAlternatePickupMsg', false, <strong>{fullName}</strong>),
//                 buttonText: getText('ok')
//             });
//         });

//         it('should render save button with the text "Save & Continue" in Checkout page', () => {
//             wrapper.setState({
//                 editMode: true,
//                 altPickupCaptured: false
//             });
//             wrapper.setProps({ isCheckout: true });

//             const saveBtn = wrapper.findWhere(n => n.key() === 'saveBtn');

//             expect(saveBtn.text()).toEqual('Save & Continue');
//         });

//         it('should render save button with the text "Save"', () => {
//             wrapper.setState({
//                 editMode: true,
//                 altPickupCaptured: false
//             });
//             wrapper.setProps({ isCheckout: false });

//             const saveBtn = wrapper.findWhere(n => n.key() === 'saveBtn');

//             expect(saveBtn.text()).toEqual('Save');
//         });
//     });

//     describe('Allow Edit', () => {
//         it('should display Edit link when allowEdit is true', () => {
//             wrapper.setProps({ allowEdit: true });
//             const editBtn = wrapper.findWhere(n => n.key() === 'editBtn');
//             expect(editBtn.length).toEqual(1);
//         });

//         it('should not display Edit link when allowEdit is false', () => {
//             wrapper.setProps({ allowEdit: false });
//             const editBtn = wrapper.findWhere(n => n.key() === 'editBtn');
//             expect(editBtn.length).toEqual(0);
//         });
//     });

//     describe('Alternate Pickup note', () => {
//         beforeEach(() => {
//             wrapper.setProps({ isOrderConfirmation: true });
//         });

//         it('should display Update note on confirmation page', () => {
//             const altPickupNote = wrapper.findWhere(n => n.key() === 'altPickupNote');
//             const altPickupNoteMsg = altPickupNote.children().prop('content');

//             expect(altPickupNoteMsg).toEqual(altPickupNotes.update);
//         });

//         it('should display pickup note on confirmation page when showAltPickupNote is true', () => {
//             wrapper.setProps({ showAltPickupNote: true });
//             const altPickupNote = wrapper.findWhere(n => n.key() === 'altPickupNote');

//             expect(altPickupNote.length).toEqual(1);
//         });

//         it('should not display pickup note on confirmation page when showAltPickupNote is false', () => {
//             wrapper.setProps({ showAltPickupNote: false });
//             const altPickupNote = wrapper.findWhere(n => n.key() === 'altPickupNote');

//             expect(altPickupNote.length).toEqual(0);
//         });

//         it('should display Update note on confirmation page', () => {
//             wrapper.setProps({ alternatePickupData: null });

//             const altPickupNote = wrapper.findWhere(n => n.key() === 'altPickupNote');
//             const altPickupNoteMsg = altPickupNote.children().prop('content');

//             expect(altPickupNoteMsg).toEqual(altPickupNotes.add);
//         });
//     });
// });
