// const React = require('react');
// const { shallow } = require('enzyme');
// const anaUtils = require('analytics/utils').default;
// const CommunityDrop = require('components/Header/CommunityDrop/CommunityDrop').default;
// const { getCommunityUrl } = require('utils/Community').default;

// describe('Community Drop JSX File', () => {
//     let wrapper;
//     let element;
//     let setNextPageDataStub;
//     let buildNavPathStub;

//     beforeEach(() => {
//         wrapper = shallow(<CommunityDrop />);
//     });

//     describe('Main Component', () => {
//         it('should render Dropdown component', () => {
//             expect(wrapper.find('Dropdown').length).toEqual(1);
//         });

//         it('should render DropdownTrigger component', () => {
//             expect(wrapper.find('DropdownTrigger').length).toEqual(1);
//         });

//         it('DropdownTrigger should link to community', () => {
//             const href = wrapper.findWhere(n => n.name() === 'DropdownTrigger' && n.prop('href') === getCommunityUrl());

//             expect(href.length).toEqual(1);
//         });

//         it('should render DropdownTrigger label', () => {
//             const { getLocaleResourceFile } = require('utils/LanguageLocale').default;
//             const getText = text => getLocaleResourceFile('components/Header/locales', 'Header')(text);

//             const label = wrapper.findWhere(n => n.name() === 'span' && n.prop('children') === getText('community'));

//             expect(label.length).toEqual(1);
//         });

//         it('should render display community', () => {
//             const iconName = wrapper.findWhere(n => n.name() === 'Icon' && n.prop('name') === 'community');

//             expect(iconName.length).toEqual(1);
//         });

//         it('should render display community-active icon', () => {
//             wrapper.setState({ isOpen: true });

//             const activeIconName = wrapper.findWhere(n => n.name() === 'Icon' && n.prop('name') === 'communityActive');

//             expect(activeIconName.length).toEqual(1);
//         });

//         it('should render DropdownTrigger component', () => {
//             expect(wrapper.find('span').length).toEqual(1);
//         });

//         it('should render DropdownMenu component', () => {
//             expect(wrapper.find('DropdownMenu').length).toEqual(1);
//         });
//     });

//     describe('Top Nav :: Community', () => {
//         beforeEach(() => {
//             setNextPageDataStub = spyOn(anaUtils, 'setNextPageData');
//             buildNavPathStub = spyOn(anaUtils, 'buildNavPath').and.returnValue('NAV_PATH');
//         });

//         it('should perform analytics call when community link is clicked', () => {
//             element = wrapper.find('DropdownTrigger');
//             element.simulate('click');
//             expect(setNextPageDataStub).toHaveBeenCalled();
//         });

//         it('should call buildNavPath when community link is clicked', () => {
//             element = wrapper.find('DropdownTrigger');
//             element.simulate('click');
//             expect(buildNavPathStub).toHaveBeenCalledWith(['top nav', 'community', 'community home']);
//         });

//         it('should call setNextPageData with proper payload', () => {
//             element = wrapper.find('DropdownTrigger');
//             element.simulate('click');
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: 'NAV_PATH' });
//         });

//         it('should call buildNavPath with proper payload', () => {
//             element = wrapper.find('DropdownTrigger');
//             element.simulate('click');
//             expect(buildNavPathStub).toHaveBeenCalledWith(['top nav', 'community', 'community home']);
//         });
//     });

//     describe('test data-at attributes', () => {
//         it('should render data-at attribute set to "community_header"', () => {
//             const dataAt = wrapper.findWhere(n => n.name() === 'DropdownTrigger' && n.prop('data-at') === 'community_header');
//             expect(dataAt.length).toEqual(1);
//         });
//         it('should render data-at attribute set to "community_flyout_menu"', () => {
//             const dataAt = wrapper.findWhere(n => n.name() === 'DropdownMenu' && n.prop('data-at') === 'community_flyout_menu');
//             expect(dataAt.length).toEqual(1);
//         });
//     });
// });
