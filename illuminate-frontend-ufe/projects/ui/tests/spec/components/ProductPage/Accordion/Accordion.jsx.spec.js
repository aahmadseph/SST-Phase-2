// const React = require('react');
// const { shallow } = require('enzyme');
// const Accordion = require('components/ProductPage/Accordion/Accordion').default;

// describe('<Accordion />', () => {
//     let props;
//     let wrapper;

//     beforeEach(() => {
//         props = {
//             title: 'Title of the Accordion',
//             id: 'howtouse'
//         };
//         wrapper = shallow(<Accordion {...props} />);
//     });

//     it('should render a Divider component', () => {
//         expect(wrapper.find('Divider').length).toEqual(1);
//     });

//     // it('should render a Flex component', () => {
//     //     expect(wrapper.find('Flex').length).toEqual(1);
//     // });

//     it('should render a Text component', () => {
//         expect(wrapper.find('Text').length).toEqual(1);
//     });

//     it('should render a Text component with an id attribute matching the id prop', () => {
//         expect(wrapper.find('Text').prop('id')).toEqual('howtouse_heading');
//     });

//     it('should render a Icon component', () => {
//         expect(wrapper.find('Icon').length).toEqual(1);
//     });

//     it('should set component\'s height to zero if isOpen false', () => {
//         wrapper.setState({ isOpen: false });
//         expect(wrapper.find('div').prop('style')).toEqual({ height: 0 });
//     });

//     it('should set component\'s height to more than zero if isOpen true', () => {
//         wrapper.setState({ isOpen: true });
//         expect(wrapper.find('div').prop('style')).not.toEqual({ height: 0 });
//     });
// });
