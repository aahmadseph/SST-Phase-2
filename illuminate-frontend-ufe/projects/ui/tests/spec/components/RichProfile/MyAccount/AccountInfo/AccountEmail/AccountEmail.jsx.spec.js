// const React = require('react');
// const { createSpy } = jasmine;
// const { shallow } = require('enzyme');

// describe('<AccountEmail /> component', () => {
//     let AccountEmail;
//     let shallowedComponent;
//     let setEditSectionSpy;

//     beforeEach(() => {
//         AccountEmail = require('components/RichProfile/MyAccount/AccountInfo/AccountEmail/AccountEmail').default;
//         setEditSectionSpy = createSpy();
//     });

//     describe('on display mode', () => {
//         beforeEach(() => {
//             shallowedComponent = shallow(
//                 <AccountEmail
//                     user={{ login: 'Logged In User' }}
//                     isEditMode={false}
//                     setEditSection={setEditSectionSpy}
//                 />
//             );
//         });

//         it('should display a LegacyGrid', () => {
//             expect(shallowedComponent.find('LegacyGrid').length).toBe(1);
//         });

//         it('should have email text rendered', () => {
//             expect(shallowedComponent.find('Text').prop('children')).toBe('Email');
//         });

//         // it('should have user login text rendered', () => {
//         //     const userLoginLegacyGridCell = shallowedComponent.find('LegacyGridCell').at(1);
//         //     expect(userLoginLegacyGridCell.prop('children')).toBe('Logged In User');
//         // });

//         it('should have edit link rendered', () => {
//             expect(shallowedComponent.find('Link').prop('children')).toBe('Edit');
//         });

//         it('should call setEditSection prop if user clicks on link', () => {
//             shallowedComponent.find('Link').simulate('click');
//             expect(setEditSectionSpy).toHaveBeenCalledWith('email');
//         });
//     });

//     describe('on edit mode', () => {
//         beforeEach(() => {
//             shallowedComponent = shallow(
//                 <AccountEmail
//                     user={{ login: 'Logged In User' }}
//                     isEditMode={true}
//                     setEditSection={setEditSectionSpy}
//                 />
//             );
//         });

//         it('it should display a edit form', () => {
//             expect(shallowedComponent.find('form').length).toBe(1);
//         });

//         it('should call submitForm prop if user submit form', () => {
//             const component = shallowedComponent.instance();
//             const submitFormSpy = spyOn(component, 'submitForm');
//             component.forceUpdate();
//             shallowedComponent.update();
//             shallowedComponent.find('form').simulate('submit');
//             expect(submitFormSpy).toHaveBeenCalled();
//         });

//         it('it should display a ErrorList', () => {
//             expect(shallowedComponent.find('ErrorList').length).toBe(1);
//         });

//         it('it should display email field', () => {
//             expect(shallowedComponent.find('InputEmail').at(0).prop('label')).toBe('Email');
//         });

//         it('it should display email confirmation field', () => {
//             expect(shallowedComponent.find('InputEmail').at(1).prop('label')).toBe('Confirm email');
//         });

//         it('should display a LegacyGrid', () => {
//             expect(shallowedComponent.find('LegacyGrid').length).toBe(1);
//         });

//         it('it should display cancel button', () => {
//             expect(shallowedComponent.find('Button').at(0).prop('children')).toBe('Cancel');
//         });

//         it('should call setEditSection prop if user clicks on cancel button', () => {
//             shallowedComponent.find('Button').at(0).simulate('click');
//             expect(setEditSectionSpy).toHaveBeenCalledWith('');
//         });

//         it('it should display update button', () => {
//             expect(shallowedComponent.find('Button').at(1).prop('children')).toBe('Update');
//         });

//         it('should call checkAndFireAnalytics prop if user clicks on cancel button', () => {
//             const component = shallowedComponent.instance();
//             const checkAndFireAnalyticsStub = spyOn(component, 'checkAndFireAnalytics');
//             component.forceUpdate();
//             shallowedComponent.update();
//             shallowedComponent.find('Button').at(1).simulate('click');
//             expect(checkAndFireAnalyticsStub).toHaveBeenCalled();
//         });
//     });

//     describe('data at for display mode', () => {
//         beforeEach(() => {
//             shallowedComponent = shallow(
//                 <AccountEmail
//                     user={{ login: 'Logged In User' }}
//                     isEditMode={false}
//                     setEditSection={setEditSectionSpy}
//                 />
//             );
//         });

//         it('should find data-at attribute element for account email', () => {
//             expect(shallowedComponent.find('LegacyGrid[data-at="account_email_field"]').exists()).toEqual(true);
//         });
//     });
// });
