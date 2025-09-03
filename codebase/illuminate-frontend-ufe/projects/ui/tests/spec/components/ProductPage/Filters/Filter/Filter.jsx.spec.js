// const React = require('react');
// const { shallow } = require('enzyme');
// const Filter = require('components/ProductPage/Filters/Filter/Filter').default;

// describe('<Filter />', () => {
//     let props;
//     let wrapper;

//     beforeEach(() => {
//         props = {
//             key: 'key',
//             title: 'title',
//             id: 'id',
//             name: 'name',
//             selected: ['value1'],
//             dropDownDataAt: 'SomeDropDownDataAt',
//             sortBtnDataAt: 'sort',
//             applyFilters: () => {},
//             trigger: () => {},
//             content: () => {}
//         };
//         wrapper = shallow(<Filter {...props} />);
//     });

//     it('should render a Dropdown component', () => {
//         expect(wrapper.find('Dropdown').length).toEqual(1);
//     });

//     it('should render a DropdownTrigger component', () => {
//         expect(wrapper.find('DropdownTrigger').length).toEqual(1);
//     });

//     it('should render a DropdownMenu component', () => {
//         expect(wrapper.find('DropdownMenu').length).toEqual(1);
//     });

//     it('should render a DropdownMenu component data-at', () => {
//         const element = wrapper.findWhere(x => x.name() === 'DropdownMenu' && x.prop('data-at') === props.dropDownDataAt);

//         expect(element.exists()).toBeTruthy();
//     });

//     it('should render a Sort Btn data-at', () => {
//         const element = wrapper.findWhere(x => x.name() === 'DropdownTrigger' && x.prop('data-at') === props.sortBtnDataAt);

//         expect(element.exists()).toBeTruthy();
//     });

//     it('should render a Done button', () => {
//         const button = wrapper.findWhere(n => n.name() === 'Button' && n.props().children === 'Done');
//         expect(button.length).toEqual(1);
//     });

//     it('should render a Clear button', () => {
//         const button = wrapper.findWhere(n => n.name() === 'Link' && n.props().children === 'Clear');
//         expect(button.length).toEqual(1);
//     });
// });
