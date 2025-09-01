// const React = require('react');
// const { shallow } = require('enzyme');
// const Footer = require('components/Footer/Footer').default;

// describe('CompactFooter component', () => {
//     let wrapper;

//     beforeEach(() => {
//         const props = {
//             isCompact: false
//         };

//         wrapper = shallow(<Footer {...props} />);
//     });

//     it('renders without crashing', () => {
//         expect(wrapper.exists()).toBe(true);
//     });

//     it('calls fakeSetNextPageLoadAnalyticsData on click', () => {
//         const fakeSetNextPageLoadAnalyticsData = spyOn(wrapper.instance(), 'setNextPageLoadAnalyticsData');
//         wrapper.find('Container>div>a[href="/happening/stores/sephora-near-me"]').simulate('click');
//         expect(fakeSetNextPageLoadAnalyticsData).toHaveBeenCalledWith('toolbar nav', 'find a store', 'find a store', 'find a store', 'find a store');
//     });

//     it('will not call setNextPageLoadAnalyticsForToolbar if <a> is not clicked', () => {
//         const fakesetNextPageLoadAnalyticsForToolbar = spyOn(wrapper.instance(), 'setNextPageLoadAnalyticsForToolbar');
//         expect(fakesetNextPageLoadAnalyticsForToolbar).toHaveBeenCalledTimes(0);
//     });

//     describe('\n all data-at attributes are assigned correctly; ', () => {
//         it('h2 with dataAt = personalized_footer_msg ', () => {
//             expect(wrapper.findWhere(node => node.name() === 'h2' && node.prop('data-at') === 'personalized_footer_msg').exists()).toBe(true);
//         });
//         it('<a> with dataAt = sephora_near_me', () => {
//             expect(wrapper.findWhere(node => node.name() === 'a' && node.prop('data-at') === 'sephora_near_me').exists()).toBe(true);
//         });
//         it('div with dataAt=footer_legal_section', () => {
//             expect(wrapper.findWhere(node => node.name() === 'div' && node.prop('data-at') === 'footer_legal_section').exists()).toBe(true);
//         });
//         it('div with dataAt=footer_social_links', () => {
//             expect(wrapper.findWhere(node => node.name() === 'div' && node.prop('data-at') === 'footer_social_links').exists()).toBe(true);
//         });
//         it('h2 with dataAt=app_title', () => {
//             expect(wrapper.findWhere(node => node.name() === 'h2' && node.prop('data-at') === 'app_title').exists()).toBe(true);
//         });
//         it('no new values have been added without validating', () => {
//             expect(wrapper.find('[data-at]').length).toBe(5);
//         });
//     });
// });
