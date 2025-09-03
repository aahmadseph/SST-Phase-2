// const React = require('react');
// const { shallow } = require('enzyme');

// describe('BiInfoCard component', function () {
//     let userUtils;
//     let BiInfoCard;
//     let wrapper;
//     let mockedUser;
//     let getText;
//     let localeUtils;

//     beforeEach(() => {
//         userUtils = require('utils/User').default;
//         BiInfoCard = require('components/RichProfile/BeautyInsider/BiInfoCard/BiInfoCard').default;
//         localeUtils = require('utils/LanguageLocale').default;
//         getText = localeUtils.getLocaleResourceFile('components/RichProfile/BeautyInsider/BiInfoCard/locales', 'BiInfoCard');
//     });

//     it('should render BiUnavailable for corresponding flag', () => {
//         mockedUser = { user: { profileId: 1 } };
//         wrapper = shallow(
//             <BiInfoCard
//                 user={mockedUser}
//                 isBIPointsUnavailable={true}
//             />
//         );
//         expect(wrapper.find('BiUnavailable').length).toEqual(1);
//     });

//     describe('shoud render minimal', () => {
//         let user;
//         beforeEach(() => {
//             user = {
//                 profileId: 1,
//                 firstName: 'John'
//             };
//         });

//         it('should render tier greeting message for no celebration gift user', () => {
//             spyOn(userUtils, 'isCelebrationEligible').and.returnValue(false);
//             wrapper = shallow(
//                 <BiInfoCard
//                     user={user}
//                     isMinimal
//                     isBIPointsAvailable
//                 />,
//                 { disableLifecycleMethods: true }
//             );
//             expect(wrapper.find('Text').at(0).prop('children')).toBe('Hi, John');
//         });

//         it('should render tier greeting message for celebration gift user', () => {
//             spyOn(userUtils, 'isCelebrationEligible').and.returnValue(true);
//             wrapper = shallow(
//                 <BiInfoCard
//                     user={user}
//                     isMinimal
//                     isBIPointsAvailable
//                 />,
//                 { disableLifecycleMethods: true }
//             );
//             expect(wrapper.find('Text').at(0).prop('children')).toBe('Congrats John!');
//         });
//     });

//     describe('bi status logo', () => {
//         it('should display insider logo', () => {
//             mockedUser = {
//                 beautyInsiderAccount: { vibSegment: 'BI' },
//                 firstName: 'John'
//             };
//             wrapper = shallow(
//                 <BiInfoCard
//                     user={mockedUser}
//                     isBIPointsAvailable
//                 />,
//                 { disableLifecycleMethods: true }
//             );
//             const biStatusImg = wrapper.find('Image');
//             expect(biStatusImg.prop('src')).toBe('/img/ufe/bi/logo-insider.svg');
//         });

//         it('should display VIB logo', () => {
//             spyOn(userUtils, 'displayBiStatus').and.returnValue('vib');
//             mockedUser = {
//                 beautyInsiderAccount: { vibSegment: 'VIB' },
//                 firstName: 'John'
//             };
//             wrapper = shallow(
//                 <BiInfoCard
//                     user={mockedUser}
//                     isBIPointsAvailable
//                 />,
//                 { disableLifecycleMethods: true }
//             );
//             const biStatusImg = wrapper.find('Image');
//             expect(biStatusImg.prop('src')).toBe('/img/ufe/bi/logo-vib.svg');
//         });

//         it('should display Rouge logo', () => {
//             spyOn(userUtils, 'displayBiStatus').and.returnValue('rouge');
//             mockedUser = {
//                 beautyInsiderAccount: { vibSegment: 'ROUGE' },
//                 firstName: 'John'
//             };
//             wrapper = shallow(
//                 <BiInfoCard
//                     user={mockedUser}
//                     isBIPointsAvailable
//                 />,
//                 { disableLifecycleMethods: true }
//             );
//             const biStatusImg = wrapper.find('Image');
//             expect(biStatusImg.prop('src')).toBe('/img/ufe/bi/logo-rouge.svg');
//         });
//     });

//     it('should display real time VIB messages', () => {
//         mockedUser = {
//             profileId: 1,
//             firstName: 'John'
//         };
//         wrapper = shallow(
//             <BiInfoCard
//                 user={mockedUser}
//                 isMinimal={false}
//             />,
//             { disableLifecycleMethods: true }
//         );
//         wrapper.setState({
//             realTimeVIBMessages: ['', '', ''],
//             isBIPointsAvailable: true
//         });
//         expect(wrapper.find('Text').length).toBe(4);
//     });

//     it('should render greeting', () => {
//         spyOn(Sephora, 'isDesktop').and.returnValue(true);
//         mockedUser = { firstName: 'John' };
//         wrapper = shallow(
//             <BiInfoCard
//                 user={mockedUser}
//                 isBIPointsAvailable
//             />,
//             { disableLifecycleMethods: true }
//         );
//         expect(wrapper.find('Text').at(0).prop('children')).toBe('Your Beauty Insider Summary');
//     });

//     describe('Birthday drop link', () => {
//         beforeEach(() => {
//             spyOn(Sephora, 'isDesktop').and.returnValue(true);
//             wrapper = shallow(
//                 <BiInfoCard
//                     user={mockedUser}
//                     isBIPointsAvailable
//                 />,
//                 { disableLifecycleMethods: true }
//             );
//         });

//         describe('during birthday period', () => {
//             beforeEach(() => {
//                 wrapper.setState({ eligibleForBirthdayGift: true });
//             });

//             it('should be present', () => {
//                 const birthdayLink = wrapper.findWhere(n => n.name() === 'Link' && n.contains(getText('birthdayGiftTitle')));
//                 expect(birthdayLink.length).toEqual(1);
//             });

//             it('should link to the correct anchor', () => {
//                 const { COMPONENT_ID } = require('components/RichProfile/BeautyInsider/constants');
//                 const anchor = `#${COMPONENT_ID.BIRTHDAY}`;
//                 const birthdayLink = wrapper.findWhere(n => n.name() === 'Link' && n.prop('href') === anchor);
//                 expect(birthdayLink.length).toEqual(1);
//             });
//         });

//         it('should not be present when not applicable', () => {
//             const birthdayLink = wrapper.findWhere(n => n.name() === 'Link' && n.contains(getText('birthdayGiftTitle')));
//             expect(birthdayLink.length).toEqual(0);
//         });
//     });

//     describe('Year at a Glance drop link', () => {
//         beforeEach(() => {
//             spyOn(Sephora, 'isDesktop').and.returnValue(true);
//         });

//         describe('during dollarsSaved period', () => {
//             beforeEach(() => {
//                 const cashApplied = {
//                     text: '$10',
//                     value: 10
//                 };
//                 const biSummary = {
//                     clientSummary: {
//                         currentYear: {
//                             year: 2020,
//                             cashApplied
//                         },
//                         dollarsSaved: 10
//                     }
//                 };
//                 wrapper = shallow(
//                     <BiInfoCard
//                         user={mockedUser}
//                         biSummary={biSummary}
//                         isBIPointsAvailable
//                     />,
//                     { disableLifecycleMethods: true }
//                 );
//             });

//             it('should be present', () => {
//                 const yearLink = wrapper.find('span[data-at="savings_msg"]');
//                 expect(yearLink.exists()).toBe(true);
//             });

//             it('should link to the correct anchor', () => {
//                 const { COMPONENT_ID } = require('components/RichProfile/BeautyInsider/constants');
//                 const anchor = `#${COMPONENT_ID.YEAR_AT_A_GLANCE}`;
//                 const yeatAtAGlanceLink = wrapper.find(`Link[href="${anchor}"]`);
//                 expect(yeatAtAGlanceLink.length).toEqual(1);
//             });
//         });

//         it('should not be present when not applicable', () => {
//             wrapper = shallow(
//                 <BiInfoCard
//                     user={mockedUser}
//                     isBIPointsAvailable
//                 />,
//                 { disableLifecycleMethods: true }
//             );
//             const birthdayLink = wrapper.findWhere(n => n.name() === 'Text' && n.contains(getText('Your 2020 savings at a glance')));
//             expect(birthdayLink.length).toEqual(0);
//         });
//     });

//     describe('Points for discounts', () => {
//         let getLink;

//         beforeEach(() => {
//             const { COMPONENT_ID } = require('components/RichProfile/BeautyInsider/constants');
//             getLink = comp => comp.find('[href="#' + COMPONENT_ID.POINTS_FOR_DISCOUNT + '"]');
//             mockedUser = { user: { profileId: 1 } };
//             spyOn(Sephora, 'isDesktop').and.returnValue(true);
//             spyOn(Sephora, 'isMobile').and.returnValue(false);
//         });

//         describe('if PFD is active', () => {
//             let link;

//             beforeEach(() => {
//                 const biSummary = { biPercentageOffAvailabilityMessage: 'Points for Discount Event: Apply **1,000 points** for upto **10% off**' };
//                 wrapper = shallow(
//                     <BiInfoCard
//                         user={mockedUser}
//                         biSummary={biSummary}
//                     />,
//                     { disableLifecycleMethods: true }
//                 );

//                 link = getLink(wrapper);
//             });

//             it('should render points for discount link', () => {
//                 expect(link.exists()).toBe(true);
//             });

//             it('should render element with data-at attribute', () => {
//                 const dataAtComp = link.find('span[data-at="pfd_msg"]');
//                 expect(dataAtComp.exists()).toBe(true);
//             });

//             it('should render correct points for discount text', () => {
//                 const textComp = link.find('Markdown');
//                 expect(textComp.prop('content')).toEqual('Points for Discount Event: Apply *1,000 points* for upto *10% off*');
//             });
//         });

//         describe('if PFD is not active', () => {
//             beforeEach(() => {
//                 const biSummary = {};
//                 wrapper = shallow(
//                     <BiInfoCard
//                         user={mockedUser}
//                         biSummary={biSummary}
//                     />,
//                     { disableLifecycleMethods: true }
//                 );
//             });

//             it('should not render points for discount link', () => {
//                 const link = getLink(wrapper);
//                 expect(link.length).toEqual(0);
//             });
//         });
//     });

//     describe('BI Cash Rewards drop Link', () => {
//         beforeEach(() => {
//             spyOn(Sephora, 'isDesktop').and.returnValue(true);
//             const biSummary = { biCashBackAvailabilityMessage: 'You have: **test points**' };
//             wrapper = shallow(
//                 <BiInfoCard
//                     user={mockedUser}
//                     biSummary={biSummary}
//                 />,
//                 { disableLifecycleMethods: true }
//             );
//             wrapper.setState({ isBIPointsAvailable: true });
//         });

//         it('should render element with data-at attribute', () => {
//             const dataAt = wrapper.findWhere(n => n.name() === 'Markdown' && n.prop('data-at') === `${Sephora.debug.dataAt('bi_cash_drop')}`);
//             expect(dataAt.length).toEqual(1);
//         });

//         it('should link to the correct anchor', () => {
//             const { COMPONENT_ID } = require('components/RichProfile/BeautyInsider/constants');
//             const anchor = `#${COMPONENT_ID.BI_CASH_BACK}`;
//             const biCashLink = wrapper.findWhere(n => n.name() === 'Link' && n.prop('href') === anchor);
//             expect(biCashLink.length).toEqual(1);
//         });
//     });

//     it('Rewards Link should link to the correct anchor', () => {
//         spyOn(Sephora, 'isDesktop').and.returnValue(true);
//         const biSummary = { rewardBazarMessage: 'Get rewards' };
//         wrapper = shallow(
//             <BiInfoCard
//                 user={mockedUser}
//                 biSummary={biSummary}
//                 isBIPointsAvailable
//             />,
//             { disableLifecycleMethods: true }
//         );
//         const { COMPONENT_ID } = require('components/RichProfile/BeautyInsider/constants');
//         const anchor = `#${COMPONENT_ID.REWARDS}`;
//         const awardsLink = wrapper.findWhere(n => n.name() === 'Link' && n.prop('href') === anchor);
//         expect(awardsLink.length).toEqual(1);
//     });

//     describe('Credit Card Rewards drop link', () => {
//         let isUs;

//         beforeEach(() => {
//             isUs = spyOn(localeUtils, 'isUS');
//             spyOn(Sephora, 'isDesktop').and.returnValue(true);
//             Sephora.fantasticPlasticConfigurations.isGlobalEnabled = true;
//             const props = {
//                 user: mockedUser,
//                 isBIPointsAvailable: true
//             };
//             wrapper = shallow(<BiInfoCard {...props} />, { disableLifecycleMethods: true });
//         });

//         it('with CCR should be present', () => {
//             isUs.and.returnValue(true);
//             wrapper.setState({ bankRewards: { rewardsTotal: '260' } });
//             const ccrLink = wrapper.find('span[data-at="credit_card_msg"]');
//             expect(ccrLink.props().children).toEqual('Credit Card Rewards: $260');
//         });

//         it('should not be present when there is no CCR', () => {
//             isUs.and.returnValue(true);
//             const ccrLink = wrapper.find('span[data-at="credit_card_msg"]');
//             expect(ccrLink.exists()).toBe(false);
//         });

//         it('should not be present when in Canada locale', () => {
//             isUs.and.returnValue(false);
//             const ccrLink = wrapper.findWhere(n => n.name() === 'Text' && n.contains(getText('Credit Card Rewards: $260')));
//             expect(ccrLink.length).toEqual(0);
//         });

//         it('should not be present when the isGlobalEnabled is false', () => {
//             isUs.and.returnValue(true);
//             Sephora.fantasticPlasticConfigurations.isGlobalEnabled = false;
//             const ccrLink = wrapper.findWhere(n => n.name() === 'Text' && n.contains(getText('Credit Card Rewards: $260')));
//             expect(ccrLink.length).toEqual(0);
//         });
//     });

//     it('Shipping message should be rendered', () => {
//         // Arrange
//         spyOn(Sephora, 'isDesktop').and.returnValue(true);

//         // Act
//         wrapper = shallow(
//             <BiInfoCard
//                 user={mockedUser}
//                 isBIPointsAvailable
//             />,
//             { disableLifecycleMethods: true }
//         );

//         // Assert
//         const markdownWrapper = wrapper.find('Markdown[data-at="shipping_msg"]');
//         expect(markdownWrapper.exists()).toBe(true);
//     });
// });
