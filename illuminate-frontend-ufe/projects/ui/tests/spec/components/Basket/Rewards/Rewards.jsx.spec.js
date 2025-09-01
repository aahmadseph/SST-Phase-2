// const React = require('react');
// const { shallow } = require('enzyme');

// describe('<Rewards /> component', () => {
//     let Rewards;
//     let shallowComponent;
//     let Events;
//     let biUtils;

//     beforeEach(() => {
//         Rewards = require('components/Rewards/Rewards').default;
//         Events = require('utils/framework/Events').default;
//         spyOn(Events, 'onLastLoadEvent');
//         shallowComponent = shallow(<Rewards />);
//         biUtils = require('utils/BiProfile').default;
//     });

//     describe('in desktop', () => {
//         beforeEach(() => {
//             spyOn(Sephora, 'isDesktop').and.returnValue(true);
//             shallowComponent = shallow(<Rewards />);
//             shallowComponent.setState({
//                 rewardGroups: {
//                     [biUtils.REWARD_GROUPS.CELEBRATION]: [{}, {}],
//                     'Carousel 1': [{}],
//                     'Carousel 2': [{}, {}]
//                 },
//                 currentTab: 'Carousel 1'
//             });
//         });

//         it('should render titles', () => {
//             expect(shallowComponent.find('Link').length).toEqual(3);
//         });

//         it('should hard code the title of the celebration gifts', () => {
//             expect(shallowComponent.find('Link').at(0).prop('children')).toEqual('Tier Celebration Gift');
//         });

//         it('should render a Carousel component', () => {
//             expect(shallowComponent.find('LegacyCarousel').length).toEqual(1);
//         });

//         it('should render sent items inside Carousel component', () => {
//             expect(shallowComponent.find('RewardItem').length).toEqual(1);
//         });

//         it('should use proper image size for desktop', () => {
//             const carouselComponent = shallowComponent.find('LegacyCarousel');
//             expect(carouselComponent.prop('controlHeight')).toEqual(135);
//         });

//         it('should send proper title to Reward Items', () => {
//             const rewardItemComponent = shallowComponent.find('RewardItem').at(0);
//             expect(rewardItemComponent.prop('rootContainerName')).toEqual('Carousel 1');
//         });
//     });

//     describe('in mobile', () => {
//         beforeEach(() => {
//             spyOn(Sephora, 'isMobile').and.returnValue(true);
//             shallowComponent = shallow(<Rewards />);
//             shallowComponent.setState({
//                 rewardGroups: {
//                     'Carousel 1': [{ skuId: 1 }],
//                     'Carousel 2': [{ skuId: 1 }, { skuId: 2 }]
//                 },
//                 currentTab: 'Carousel 1'
//             });
//         });

//         it('should render Rewards Carousel components', () => {
//             expect(shallowComponent.find('RewardsCarousel').length).toEqual(2);
//         });

//         it('should set proper title for Rewards Carousel components', () => {
//             const rewardsCarousels = shallowComponent.find('RewardsCarousel');
//             expect(rewardsCarousels.at(0).prop('title')).toEqual('Carousel 1');
//             expect(rewardsCarousels.at(1).prop('title')).toEqual('Carousel 2');
//         });
//     });
// });
