// const React = require('react');
// const { shallow } = require('enzyme');
// const MultiSelect = require('components/Catalog/Filters/MultiSelect/MultiSelect').default;
// const { REFINEMENT_TYPES } = require('utils/CatalogConstants');

// describe('MultiSelect component', () => {
//     let props;
//     let wrapper;

//     beforeEach(() => {
//         props = {
//             checked: false,
//             onClick: () => {}
//         };
//         wrapper = shallow(<MultiSelect {...props} />);
//     });

//     describe('Checkbox', () => {
//         beforeEach(() => {
//             wrapper.setProps({ type: REFINEMENT_TYPES.CHECKBOXES });
//         });

//         it('should not be bold when not checked', () => {
//             const checkbox = wrapper.findWhere(x => x.name() === 'Checkbox' && x.prop('fontWeight') !== 'bold');
//             expect(checkbox.exists()).toBeTruthy();
//         });

//         it('should be bold when checked', () => {
//             wrapper.setProps({ checked: true });
//             const checkbox = wrapper.findWhere(x => x.name() === 'Checkbox' && x.prop('fontWeight') === 'bold');
//             expect(checkbox.exists()).toBeTruthy();
//         });
//     });

//     describe('Color', () => {
//         beforeEach(() => {
//             wrapper.setProps({ type: REFINEMENT_TYPES.COLORS });
//         });

//         it('Link should not be bold when not checked', () => {
//             const link = wrapper.findWhere(x => x.name() === 'Link' && x.prop('fontWeight') !== 'bold');
//             expect(link.exists()).toBeTruthy();
//         });

//         it('Link should be bold when checked', () => {
//             wrapper.setProps({ checked: true });
//             const link = wrapper.findWhere(x => x.name() === 'Link' && x.prop('fontWeight') === 'bold');
//             expect(link.exists()).toBeTruthy();
//         });

//         it('Image borderColor should be transparent when not checked', () => {
//             const link = wrapper.findWhere(x => x.name() === 'Image' && x.prop('borderColor') === 'transparent');
//             expect(link.exists()).toBeTruthy();
//         });

//         it('Image borderColor should be black when checked', () => {
//             wrapper.setProps({ checked: true });
//             const link = wrapper.findWhere(x => x.name() === 'Image' && x.prop('borderColor') === 'black');
//             expect(link.exists()).toBeTruthy();
//         });

//         it('Image src should be valid for endeca', () => {
//             wrapper.setProps({ value: 'red' });
//             const src = '/img/ufe/catalog-colors/red.png';
//             const link = wrapper.findWhere(x => x.name() === 'Image' && x.prop('src') === src);
//             expect(link.exists()).toBeTruthy();
//         });

//         it('Image src should be valid for constructor', () => {
//             Sephora.configurationSettings.isNLPSearchEnabled = true;
//             wrapper.setProps({ displayName: 'red' });
//             const src = '/img/ufe/catalog-colors/100007.png';
//             const link = wrapper.findWhere(x => x.name() === 'Image' && x.prop('src') === src);
//             expect(link.exists()).toBeTruthy();
//         });
//     });
// });
