// const React = require('react');
// const { createSpy } = jasmine;
// const { shallow } = require('enzyme');

// describe('<AccountName /> component', () => {
//     let AccountName;
//     let shallowedComponent;
//     let setEditSectionSpy;

//     beforeEach(() => {
//         AccountName = require('components/RichProfile/MyAccount/AccountInfo/AccountName/AccountName').default;
//         setEditSectionSpy = createSpy();
//     });

//     describe('on display mode', () => {
//         beforeEach(() => {
//             shallowedComponent = shallow(
//                 <AccountName
//                     user={{
//                         firstName: 'User',
//                         lastName: 'Name'
//                     }}
//                     isEditMode={false}
//                     setEditSection={setEditSectionSpy}
//                 />
//             );
//         });

//         it('should display a LegacyGrid', () => {
//             expect(shallowedComponent.find('LegacyGrid').length).toBe(1);
//         });

//         it('should have name text rendered', () => {
//             expect(shallowedComponent.find('Text').prop('children')).toBe('Name');
//         });

//         it('should have user login text rendered', () => {
//             const userLoginLegacyGridCell = shallowedComponent.find('LegacyGridCell').at(1);
//             expect(userLoginLegacyGridCell.prop('children')).toEqual(['User', ' ', 'Name']);
//         });

//         it('should have edit link rendered', () => {
//             expect(shallowedComponent.find('Link').prop('children')).toBe('Edit');
//         });

//         it('should call setEditSection prop if user clicks on link', () => {
//             shallowedComponent.find('Link').simulate('click');
//             expect(setEditSectionSpy).toHaveBeenCalledWith('name');
//         });
//     });

//     describe('on edit mode', () => {
//         beforeEach(() => {
//             setEditSectionSpy = createSpy();
//             shallowedComponent = shallow(
//                 <AccountName
//                     user={{
//                         firstName: 'User',
//                         lastName: 'Name'
//                     }}
//                     isEditMode={true}
//                     setEditSection={setEditSectionSpy}
//                 />
//             );
//         });

//         // it('it should display a edit form', () => {
//         //     expect(shallowedComponent.find('form').length).toBe(1);
//         // });

//         // it('should call submitForm prop if user submit form', () => {
//         //     const component = shallowedComponent.instance();
//         //     const submitFormSpy = spyOn(component, 'submitForm');
//         //     component.forceUpdate();
//         //     shallowedComponent.update();
//         //     shallowedComponent.find('form').simulate('submit');
//         //     expect(submitFormSpy).toHaveBeenCalled();
//         // });

//         it('it should display a ErrorList', () => {
//             expect(shallowedComponent.find('ErrorList').length).toBe(1);
//         });

//         it('it should display first name field', () => {
//             expect(shallowedComponent.find('TextInput').at(0).prop('label')).toBe('First Name');
//         });

//         it('it should display last name field', () => {
//             expect(shallowedComponent.find('TextInput').at(1).prop('label')).toBe('Last Name');
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
//     });

//     describe('data at for display mode', () => {
//         beforeEach(() => {
//             setEditSectionSpy = createSpy();
//             shallowedComponent = shallow(
//                 <AccountName
//                     user={{
//                         firstName: 'User',
//                         lastName: 'Name'
//                     }}
//                     isEditMode={false}
//                     setEditSection={setEditSectionSpy}
//                 />
//             );
//         });

//         it('should find data-at attribute element for account name', () => {
//             expect(shallowedComponent.find('LegacyGrid[data-at="account_name_field"]').exists()).toEqual(true);
//         });
//     });
// });
