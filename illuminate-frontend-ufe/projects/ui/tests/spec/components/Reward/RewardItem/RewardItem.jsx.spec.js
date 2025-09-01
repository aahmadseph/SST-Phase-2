const React = require('react');
const { shallow } = require('enzyme');
const RewardItem = require('components/Reward/RewardItem/RewardItem').default;
const skuUtils = require('utils/Sku').default;

describe('RewardItem component', () => {
    describe('points container', () => {
        it('should display FREE for free rewards', () => {
            spyOn(skuUtils, 'isFree').and.returnValue(true);
            const shallowComponent = shallow(<RewardItem />);
            expect(shallowComponent.find('Box > Box > Box').prop('children')).toBe('FREE');
        });

        it('should display bi type as points for a regular reward', () => {
            spyOn(skuUtils, 'isFree').and.returnValue(false);
            spyOn(skuUtils, 'isRougeRewardCard').and.returnValue(false);
            const shallowComponent = shallow(
                <RewardItem
                    biType={'Test'}
                    rewardPoints={2500}
                />
            );
            expect(shallowComponent.find('Box > Box > Box').prop('children')).toBe('test');
        });

        it('should display points for RRC', () => {
            spyOn(skuUtils, 'isFree').and.returnValue(false);
            spyOn(skuUtils, 'isRougeRewardCard').and.returnValue(true);
            const shallowComponent = shallow(<RewardItem rewardPoints={456600} />);
            expect(shallowComponent.find('Box > Box > Box').prop('children')).toBe('456600 points');
        });

        it('should have a link for RRC when is a basket reward', () => {
            spyOn(skuUtils, 'isRougeRewardCard').and.returnValue(true);
            const shallowComponent = shallow(<RewardItem isBasketReward={true} />);
            expect(shallowComponent.find('Link').length).toBe(1);
        });

        it('should display points for regular rewards', () => {
            spyOn(skuUtils, 'isFree').and.returnValue(false);
            spyOn(skuUtils, 'isRougeRewardCard').and.returnValue(false);
            const shallowComponent = shallow(<RewardItem rewardPoints={2500} />);
            expect(shallowComponent.find('Box > Box > Box').prop('children')).toBe('2500 points');
        });
    });
});
