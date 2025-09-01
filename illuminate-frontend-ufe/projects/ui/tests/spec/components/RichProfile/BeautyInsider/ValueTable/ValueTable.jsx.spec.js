// const React = require('react');
// const { shallow } = require('enzyme');

// describe('<ValueTable /> component', () => {
//     let ValueTable;
//     let shallowComponent;

//     beforeEach(() => {
//         ValueTable = require('components/RichProfile/BeautyInsider/ValueTable/ValueTable').default;
//         window.Sephora.fantasticPlasticConfigurations.isGlobalEnabled = true;
//         shallowComponent = shallow(
//             <ValueTable
//                 clientSummary={{
//                     currentYear: {
//                         year: 2018,
//                         dollarsSaved: {
//                             value: 15,
//                             text: '$15'
//                         },
//                         rougeRcDollar: {
//                             value: 10,
//                             text: '$10'
//                         },
//                         cashApplied: {
//                             value: 20,
//                             text: '$20'
//                         },
//                         referralPtsEarned: {
//                             value: 25,
//                             text: '$25'
//                         }
//                     }
//                 }}
//                 rewardsTotal={25}
//             />
//         );
//     });

//     it('should display the correct amount of Promos & Discounnts applied', () => {
//         const promosAndDiscounts = shallowComponent.find('span').at(1).children().text();
//         expect(promosAndDiscounts).toEqual('$15');
//     });

//     it('should display the correct amount of Credit Card Rewards Earned', () => {
//         const creditCardRewards = shallowComponent.find('span').at(3).children().text();
//         expect(creditCardRewards).toEqual('$25');
//     });

//     it('should display the correct amount of Beauty Insider Cash applied', () => {
//         const creditCardRewards = shallowComponent.find('span').at(5).children().text();
//         expect(creditCardRewards).toEqual('$20');
//     });

//     it('should display the correct amount of Rouge Rewards earned', () => {
//         const creditCardRewards = shallowComponent.find('span').at(7).children().text();
//         expect(creditCardRewards).toEqual('$10');
//     });

//     it('should display the correct amount of Referral Points earned', () => {
//         const referralPointsEarned = shallowComponent.find('span').at(9).children().text();
//         expect(referralPointsEarned).toEqual('$25 points');
//     });

//     it('should display default element if user has no rougeRcDollar, dollarsSaved, cashApplied or credit card rewards', () => {
//         shallowComponent = shallow(
//             <ValueTable
//                 clientSummary={{
//                     currentYear: {
//                         year: 2018,
//                         dollarsSaved: {},
//                         rougeRcDollar: {},
//                         cashApplied: {}
//                     }
//                 }}
//             />
//         );

//         const firstMessage = shallowComponent.find('Text').at(0).children().text();
//         const secondMessage = shallowComponent.find('Text').at(1).children().text();
//         const defaultMessage = firstMessage + secondMessage;
//         expect(defaultMessage).toEqual('Your 2018 earnings will appear here' + 'Keep shopping to get rewards, benefits, and discounts!');
//     });

//     it('should not render the default element if the user has at least rougeRcDollar', () => {
//         shallowComponent = shallow(
//             <ValueTable
//                 clientSummary={{
//                     currentYear: {
//                         rougeRcDollar: {
//                             value: 10,
//                             text: '$10'
//                         }
//                     }
//                 }}
//             />,
//             { disableLifecycleMethods: true }
//         );
//         const component = shallowComponent.instance();
//         const dispatchRenderDefault = spyOn(component, 'renderDefault');
//         shallowComponent.render();
//         expect(dispatchRenderDefault).not.toHaveBeenCalled();
//     });

//     it('should not render the default element if the user has at least rougeRcDollar', () => {
//         shallowComponent = shallow(
//             <ValueTable
//                 clientSummary={{
//                     currentYear: {
//                         rougeRcDollar: {
//                             value: 10,
//                             text: '$10'
//                         }
//                     }
//                 }}
//             />,
//             { disableLifecycleMethods: true }
//         );
//         const component = shallowComponent.instance();
//         const dispatchRenderDefault = spyOn(component, 'renderDefault');
//         shallowComponent.render();
//         expect(dispatchRenderDefault).not.toHaveBeenCalled();
//     });

//     it('should not render the default element if the user has at least dollars saved', () => {
//         shallowComponent = shallow(
//             <ValueTable
//                 clientSummary={{
//                     currentYear: {
//                         dollarsSaved: {
//                             value: 15,
//                             text: '$15'
//                         }
//                     }
//                 }}
//             />,
//             { disableLifecycleMethods: true }
//         );
//         const component = shallowComponent.instance();
//         const dispatchRenderDefault = spyOn(component, 'renderDefault');
//         shallowComponent.render();
//         expect(dispatchRenderDefault).not.toHaveBeenCalled();
//     });

//     it('should not render the default element if the user has at least cash applied', () => {
//         shallowComponent = shallow(
//             <ValueTable
//                 clientSummary={{
//                     currentYear: {
//                         cashApplied: {
//                             value: 20,
//                             text: '$20'
//                         }
//                     }
//                 }}
//             />,
//             { disableLifecycleMethods: true }
//         );
//         const component = shallowComponent.instance();
//         const dispatchRenderDefault = spyOn(component, 'renderDefault');
//         shallowComponent.render();
//         expect(dispatchRenderDefault).not.toHaveBeenCalled();
//     });

//     it('should not render the default element if the user has at least rewards', () => {
//         shallowComponent = shallow(<ValueTable rewardsTotal={25} />, { disableLifecycleMethods: true });
//         const component = shallowComponent.instance();
//         const dispatchRenderDefault = spyOn(component, 'renderDefault');
//         shallowComponent.render();
//         expect(dispatchRenderDefault).not.toHaveBeenCalled();
//     });

//     it('should not render the default element if the user has at least referral points earned', () => {
//         shallowComponent = shallow(
//             <ValueTable
//                 clientSummary={{
//                     currentYear: {
//                         referralPtsEarned: {
//                             value: 25,
//                             text: '$25'
//                         }
//                     }
//                 }}
//             />,
//             { disableLifecycleMethods: true }
//         );
//         const component = shallowComponent.instance();
//         const dispatchRenderDefault = spyOn(component, 'renderDefault');
//         shallowComponent.render();
//         expect(dispatchRenderDefault).not.toHaveBeenCalled();
//     });

//     it('should link to correct path', () => {
//         shallowComponent = shallow(<ValueTable clientSummary={{ currentYear: { year: 2018 } }} />);
//         const anchor = '/';
//         const buttonLink = shallowComponent.findWhere(n => n.name() === 'Button' && n.prop('href') === anchor);
//         expect(buttonLink.length).toEqual(1);
//     });
// });
