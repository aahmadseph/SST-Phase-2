const React = require('react');
const { shallow } = require('enzyme');

describe('BeautyInsider component', () => {
    let BeautyInsider;
    let component;
    let userUtils;
    let rewardsLabels;
    let biConsts;

    beforeEach(() => {
        userUtils = require('utils/User').default;
        rewardsLabels = require('utils/User').default.rewardsLabels;
        BeautyInsider = require('components/RichProfile/BeautyInsider/BeautyInsider').default;
        biConsts = require('components/RichProfile/BeautyInsider/constants');
        const wrapper = shallow(<BeautyInsider />);
        component = wrapper.instance();

        spyOn(userUtils, 'getRealTimeBiStatus').and.returnValue('Rouge');
        spyOn(userUtils, 'isCelebrationEligible').and.returnValue(true);
        spyOn(userUtils, 'isBirthdayGiftEligible').and.returnValue(true);
        spyOn(userUtils, 'getGiftLastDateToRedeem').and.returnValue('');

        component.setState({ user: { firstName: 'User' } });
    });

    describe('setBiRewards', () => {
        it('should update the state with biRewards in correct order', () => {
            const biRewardGroups = {
                'Celebration Gift': [{}],
                'Reward Yourself': [{}],
                'Birthday Gift': [{}]
            };

            component.setBiRewards(biRewardGroups);

            const actual = component.state.biRewards;
            const expected = [
                {
                    key: 'celebrationGifts',
                    items: [{}],
                    title: `Choose Your ${rewardsLabels.CELEBRATION_GIFT.TITLE}`,
                    subtitle: 'Congrats, Rouge!'
                },
                {
                    key: 'bdayGifts',
                    items: [{}],
                    title: rewardsLabels.BIRTHDAY_GIFT.TITLE,
                    subtitle: 'Happy B-Day, User!',
                    secondSubtitle: { inner: '<strong ></strong>' },
                    componentId: biConsts.COMPONENT_ID.BIRTHDAY
                },
                {
                    key: 'ccRewards',
                    type: component.SECTION_TYPES.CC_REWARDS,
                    componentId: biConsts.COMPONENT_ID.CREDIT_CARD_REWARDS
                },
                {
                    key: 'BiCashRewards',
                    type: component.SECTION_TYPES.BI_CASH,
                    componentId: biConsts.COMPONENT_ID.BI_CASH_BACK
                },
                {
                    key: 'biRewards',
                    items: [{}],
                    title: rewardsLabels.REWARDS.TITLE,
                    hasViewAll: true,
                    componentId: biConsts.COMPONENT_ID.REWARDS
                }
            ];
            expect(actual).toEqual(expected);
        });
    });

    describe('renderBiCard', () => {
        it('should render the BiUnavailable scenario', () => {
            const shallowed = enzyme.mount(<BeautyInsider />);
            shallowed.setState({
                user: 'me',
                isUserBi: false,
                biSummary: [],
                biDown: true
            });

            component = shallowed.instance();
            const biCard = component.renderBiCard();
            const biUnavailable = biCard.props.children.find(item => item.type.class === 'BiUnavailable');
            expect(biUnavailable).not.toBeNull();
        });
    });
});
