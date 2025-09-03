// const React = require('react');
// const { shallow } = require('enzyme');
// const { createSpy } = jasmine;
// const anaConsts = require('analytics/constants').default;

// describe('Homepage component', () => {
//     let generalBindings;
//     let Homepage;
//     let props;

//     beforeEach(() => {
//         generalBindings = require('analytics/bindingMethods/pages/all/generalBindings').default;
//         Homepage = require('components/Homepage/Homepage').default;
//         props = {
//             setPageLoadAnalytics: createSpy().and.callFake(() => {
//                 digitalData.page.pageInfo.pageName = anaConsts.PAGE_NAMES.HOMEPAGE;
//                 digitalData.page.category.pageType = anaConsts.PAGE_TYPES.HOMEPAGE;
//                 digitalData.page.attributes.world = 'n/a';
//                 digitalData.page.attributes.additionalPageInfo = '';
//                 digitalData.page.attributes.sephoraPageInfo = {
//                     pageName: generalBindings.getSephoraPageName()
//                 };
//             }),
//             getPersonalizedEnabledComponents: createSpy(),
//             setPersonalizationAnalyticsData: createSpy(),
//             updateRequestData: createSpy(),
//             p13n: {
//                 isInitialized: true
//             }
//         };
//     });

//     it('should set digitalData Page Load Analytics on Mount', () => {
//         const wrapper = shallow(<Homepage {...props} />);
//         const component = wrapper.instance();
//         component.componentDidMount();

//         expect(digitalData.page.category.pageType).toBe('home page');
//         expect(digitalData.page.pageInfo.pageName).toBe('home page');
//         expect(digitalData.page.attributes.world).toBe('n/a');
//         expect(digitalData.page.attributes.additionalPageInfo).toBe('');
//         expect(digitalData.page.attributes.sephoraPageInfo.pageName).toBe('home page:home page:n/a:*');
//     });

//     it('should not call showConsumerPrivacyModal unless window.location.search = ccpa=true', () => {
//         Sephora.configurationSettings.isClaripPrivacyEnabled = false;
//         Sephora.renderQueryParams.country = 'US';
//         const showConsumerPrivacyModal = createSpy();

//         const wrapper = shallow(
//             <Homepage
//                 showConsumerPrivacyModal={showConsumerPrivacyModal}
//                 {...props}
//             />
//         );

//         const component = wrapper.instance();
//         component.componentDidMount();

//         expect(showConsumerPrivacyModal).not.toHaveBeenCalledWith({ isOpen: true });
//     });

//     describe('should call', () => {
//         describe('fetchP13Data 0 times', () => {
//             it('on Update when there are no items', () => {
//                 // Arrange
//                 props = {
//                     testTargetOffers: false,
//                     user: { userId: 1 },
//                     getPersonalizedEnabledComponents: createSpy()
//                 };
//                 const component = new Homepage(props);

//                 // Act
//                 component.componentDidUpdate({ ...props, user: { userId: 1 } });

//                 // Assert
//                 expect(props.getPersonalizedEnabledComponents).toHaveBeenCalledTimes(0);
//             });
//         });
//     });

//     describe('should render', () => {
//         it('seo header if it exists', () => {
//             const header1 = 'header1';
//             const home = {
//                 seo: {
//                     header1
//                 }
//             };
//             const headerText = home.seo.header1 || 'Sephora Homepage';

//             const wrapper = shallow(
//                 <Homepage
//                     headerText={headerText}
//                     items={[]}
//                     {...props}
//                 />
//             );

//             const h1 = wrapper.find('h1');
//             expect(h1.text()).toBe(header1);
//         });

//         it('default header if seo header does not exist', () => {
//             const home = {
//                 seo: {}
//             };
//             const headerText = home.seo.header1 || 'Sephora Homepage';
//             const wrapper = shallow(
//                 <Homepage
//                     {...props}
//                     items={[]}
//                     headerText={headerText}
//                 />
//             );

//             const h1 = wrapper.find('h1');
//             expect(h1.text()).toBe('Sephora Homepage');
//         });

//         it('seo data', () => {
//             const domPrefix = 'www';
//             const seoJSON = {
//                 '@context': 'https://schema.org',
//                 '@type': 'WebSite',
//                 url: 'https://' + domPrefix + '.sephora.com/',
//                 potentialAction: {
//                     '@type': 'SearchAction',
//                     target: 'https://' + domPrefix + '.sephora.com/search?keyword={search_term_string}',
//                     'query-input': 'required name=search_term_string'
//                 }
//             };

//             const wrapper = shallow(
//                 <Homepage
//                     seoJSON={seoJSON}
//                     items={[]}
//                     {...props}
//                 />
//             );

//             const script = wrapper.find('script');
//             expect(script.at(0).html()).toContain(JSON.stringify(seoJSON));
//         });

//         // it('seo site navigation', () => {
//         //     const siteNavigation = 'siteNavigation';

//         //     const wrapper = shallow(
//         //         <Homepage
//         //             siteNavigation={siteNavigation}
//         //             items={[]}
//         //             {...props}
//         //         />
//         //     );

//         //     const script = wrapper.find('script');
//         //     expect(script.at(1).html()).toContain(siteNavigation);
//         // });

//         it('ComponentList when 1 item is passed', () => {
//             const items = [
//                 {
//                     items: [
//                         {
//                             personalization: {
//                                 isEnabled: true,
//                                 context: 'context'
//                             }
//                         }
//                     ]
//                 }
//             ];

//             const wrapper = shallow(
//                 <Homepage
//                     items={items}
//                     p13n={{ isInitialized: true }}
//                     {...props}
//                     user={{ isAnonymous: true }}
//                 />
//             );

//             const compList = wrapper.find('ComponentList');
//             expect(compList).toBeDefined();
//         });
//     });
// });
