const React = require('react');
const { any } = jasmine;
const { shallow } = require('enzyme');

describe('RecentRewardActivity component', () => {
    let RecentRewardActivity;
    let RewardActions;
    let fetchRecentlyRedeemedRewardsSpy;
    let store;
    let props;
    let setAndWatchSpy;
    let dispatchSpy;
    let component;
    let profileId;
    let filter;
    let rewardsPurchasedGroups;

    beforeEach(() => {
        RecentRewardActivity = require('components/RichProfile/BeautyInsider/RecentRewardActivity/RecentRewardActivity').default;
        RewardActions = require('actions/RewardActions').default;
        store = require('store/Store').default;
        setAndWatchSpy = spyOn(store, 'setAndWatch');
        dispatchSpy = spyOn(store, 'dispatch');
        profileId = '1234';
        filter = { purchaseFilter: 'rewards' };

        props = { user: { profileId } };
    });

    describe('RecentRewardActivity controller initialization', () => {
        it('should not call store.dispatch when there is no profileId', () => {
            props.user.profileId = null;

            const wrapper = shallow(<RecentRewardActivity {...props} />);
            component = wrapper.instance();
            expect(dispatchSpy).not.toHaveBeenCalled();

            props.user.profileId = profileId;
        });

        it('should call the fetchRecentlyRedeemedRewards action', () => {
            const wrapper = shallow(<RecentRewardActivity {...props} />);
            component = wrapper.instance();

            fetchRecentlyRedeemedRewardsSpy = spyOn(RewardActions, 'fetchRecentlyRedeemedRewards');
            component.componentDidMount();
            expect(fetchRecentlyRedeemedRewardsSpy).toHaveBeenCalledWith(profileId, filter);
        });

        it('should call store.dispatch', () => {
            const wrapper = shallow(<RecentRewardActivity {...props} />);
            component = wrapper.instance();

            component.componentDidMount();
            expect(dispatchSpy).toHaveBeenCalled();
        });

        it('should set and watch rewards.rewardsPurchasedGroups', () => {
            const wrapper = shallow(<RecentRewardActivity {...props} />);
            component = wrapper.instance();
            expect(setAndWatchSpy).toHaveBeenCalledWith('rewards.rewardsPurchasedGroups', component, any(Function));
        });
    });

    describe('The getMostRecentRewards method', () => {
        beforeEach(() => {
            rewardsPurchasedGroups = [
                {
                    transactionDate: '12/3/15',
                    purchasedItems: [{ sku: { testDate: '12/3/15' } }]
                },
                {
                    transactionDate: '1/3/16',
                    purchasedItems: [{ sku: { testDate: '1/3/16' } }]
                },
                {
                    transactionDate: '2/3/16',
                    purchasedItems: [{ sku: { testDate: '2/3/16' } }]
                },
                {
                    transactionDate: '1/3/14',
                    purchasedItems: [{ sku: { testDate: '1/3/14' } }]
                }
            ];

            const wrapper = shallow(<RecentRewardActivity {...props} />);
            component = wrapper.instance();
        });

        it('should return an array of the two most recent rewards', () => {
            //Make a copy, because we do change the data in getMostRecentRewards
            const unalteredRewardsPurchasedGroups = rewardsPurchasedGroups.slice();
            const rewardsArray = component.getMostRecentRewards(rewardsPurchasedGroups, 2);
            expect(rewardsArray[0].testDate).toBe(unalteredRewardsPurchasedGroups[2].transactionDate);
        });
    });
});
