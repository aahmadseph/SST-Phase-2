// /* eslint-disable no-unused-vars */
// const React = require('react');
// const { shallow } = require('enzyme');
// const SingleSelect = require('components/Catalog/Filters/SingleSelect/SingleSelect').default;

// describe('<SingleSelect />', () => {
//     let props;
//     let wrapper;
//     let component;
//     let onClickSpy;

//     beforeEach(() => {
//         props = {
//             checked: false,
//             onClick: () => {}
//         };
//         onClickSpy = spyOn(props, 'onClick');
//         wrapper = shallow(<SingleSelect {...props} />);
//         component = wrapper.instance();
//     });

//     it('should render unselected Radio if not checked', () => {
//         const radio = wrapper.findWhere(x => x.name() === 'Radio' && x.prop('checked') === false);
//         expect(radio.exists()).toBeTruthy();
//     });

//     it('should render selected Radio if checked', () => {
//         wrapper.setProps({ checked: true });
//         const radio = wrapper.findWhere(x => x.name() === 'Radio' && x.prop('checked') === true);
//         expect(radio.exists()).toBeTruthy();
//     });

//     it('should render selected Radio not in bold', () => {
//         const radio = wrapper.findWhere(x => x.name() === 'Radio' && x.prop('fontWeight') !== 'bold');
//         expect(radio.exists()).toBeTruthy();
//     });

//     it('should render selected Radio in bold', () => {
//         wrapper.setProps({ checked: true });
//         const radio = wrapper.findWhere(x => x.name() === 'Radio' && x.prop('fontWeight') === 'bold');
//         expect(radio.exists()).toBeTruthy();
//     });

//     it('should render label text if title is not Rating', () => {
//         wrapper.setProps({
//             title: 'Price Range',
//             label: '$25 to $50'
//         });
//         const starRating = wrapper.findWhere(x => x.name() === 'span' && x.prop('children') === '$25 to $50');
//         expect(starRating.exists()).toBeTruthy();
//     });

//     it('should render StarRating if title is Rating', () => {
//         wrapper.setProps({
//             title: 'Rating',
//             label: '4 and up'
//         });
//         const starRating = wrapper.findWhere(x => x.name() === 'StarRating');
//         expect(starRating.exists()).toBeTruthy();
//     });
// });
