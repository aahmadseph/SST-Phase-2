const React = require('react');
const { shallow } = require('enzyme');
const { objectContaining } = jasmine;

describe('Rewards List', () => {
    const CELEBRATION_GIFT_GROUP_TITLE = 'Celebration Gift';
    const BIRTHDAY_GIFT_GROUP_TITLE = 'Birthday Gift';
    const rewardsLabels = require('utils/User').default.rewardsLabels;
    let Rewards;

    beforeEach(() => {
        Rewards = require('components/Rewards/Rewards').default;
    });

    describe('setRewards stub', () => {
        let wrapper;
        let component;
        let setRewardsStub;

        beforeEach(() => {
            wrapper = shallow(
                <Rewards
                    rewards={{
                        rewards: {
                            biRewardGroups: {
                                'Rouge Reward': [{}],
                                '100 Points': [{}]
                            }
                        }
                    }}
                />
            );
            component = wrapper.instance();
            setRewardsStub = spyOn(component, 'setRewards');
        });

        it('should subscribe to rewards and remove one time RRC if present', () => {
            // Arrange
            const updatedrewardsResponse = { biRewardGroups: { '100 Points': [{}] } };
            component.setState({ rewardGroups: [] });
            component.componentDidUpdate({});
            expect(setRewardsStub).toHaveBeenCalledWith(updatedrewardsResponse);
        });
    });

    describe('set rewards', () => {
        let wrapper;
        let component;
        const rewardsResponseWithOnlyComplimentary = { complimentary: [{ skuId: '1889617' }] };

        beforeEach(() => {
            Rewards = require('components/Rewards/Rewards').default;
            wrapper = shallow(<Rewards />);
            component = wrapper.instance();
        });

        describe('setRewards', () => {
            it('should include complimentary rewards if present', () => {
                const setStateStub = spyOn(component, 'setState');

                component.setRewards(rewardsResponseWithOnlyComplimentary);

                const setStateResult = setStateStub.calls.first().args[0]({ currentTab: null });

                const rewardGroups = setStateResult.rewardGroups;

                expect(Object.keys(rewardGroups).length).toEqual(1);
                expect(rewardGroups.Complimentary.length).toEqual(1);
            });
        });

        describe('getHeaderText', () => {
            it('should use the given key to set line2 of headerText', () => {
                const key = 'anything';
                const headerText = component.getHeaderText(key);
                expect(headerText).toEqual(
                    objectContaining({
                        line1: null,
                        line2: key,
                        line3: null
                    })
                );
            });

            it('should use the key to determine how to populate line1 and line2 of headerText in desktop', () => {
                spyOn(Sephora, 'isDesktop').and.returnValue(true);
                const key = CELEBRATION_GIFT_GROUP_TITLE;
                const userStatus = 'VIB';
                component.setState({ userStatus });
                const headerText = component.getHeaderText(key);

                expect(headerText).toEqual(
                    objectContaining({
                        line1: `Congrats, ${userStatus}!`,
                        line2: rewardsLabels.CELEBRATION_GIFT.TITLE,
                        line3: null
                    })
                );
            });

            it('should use the key to determine how to populate line1 and line2 of headerText in mobile', () => {
                spyOn(Sephora, 'isDesktop').and.returnValue(false);
                const key = CELEBRATION_GIFT_GROUP_TITLE;
                const userStatus = 'VIB';
                component.setState({ userStatus });
                const headerText = component.getHeaderText(key);

                expect(headerText).toEqual(
                    objectContaining({
                        line1: `Congrats, ${userStatus}!`,
                        line2: rewardsLabels.CELEBRATION_GIFT.TITLE,
                        line3: null
                    })
                );
            });

            it('should use the key to know that we need birthday specific headers', () => {
                const key = BIRTHDAY_GIFT_GROUP_TITLE;
                const firstName = 'mike';
                const giftLastDateToRedeem = '18 days left to choose';
                component.setState({
                    firstName,
                    giftLastDateToRedeem
                });

                const headerText = component.getHeaderText(key);

                expect(headerText).toEqual(
                    objectContaining({
                        line1: 'Happy B-Day, Mike!',
                        line2: 'Choose Your Birthday Gift',
                        line3: { inner: '<strong >18</strong> days left to choose' }
                    })
                );
            });

            it('should set the current tab to Complimentary if it\'s the only tab', () => {
                const setStateStub = spyOn(component, 'setState');

                component.setRewards(rewardsResponseWithOnlyComplimentary);

                const setStateResult = setStateStub.calls.first().args[0]({ currentTab: null });

                const currentTab = setStateResult.currentTab;

                expect(currentTab).toEqual('Complimentary');
            });
        });
    });
});
