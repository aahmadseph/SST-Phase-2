describe('<RewardsGrid /> component', () => {
    let React;
    let RewardsGrid;
    let shallowComponent;

    beforeEach(() => {
        React = require('react');
        RewardsGrid = require('components/RewardsBazaar/RewardsGrid/RewardsGrid').default;
    });

    it('should render grid elements sent', () => {
        shallowComponent = enzyme.shallow(
            <RewardsGrid
                items={[{}, {}]}
                title=''
            />
        );
        expect(shallowComponent.find('RewardItem').length).toBe(2);
    });

    it('should render title', () => {
        const gridTitle = 'Rewards Grid';
        shallowComponent = enzyme.shallow(
            <RewardsGrid
                items={[{}, {}]}
                title={gridTitle}
            />
        );
        expect(shallowComponent.find('Box').prop('children')).toBe(gridTitle);
    });

    it('should render id', () => {
        shallowComponent = enzyme.shallow(
            <RewardsGrid
                items={[{}, {}]}
                anchor={'20000+points'}
            />
        );
        expect(shallowComponent.find('Box').prop('id')).toBe('20000+points');
    });
});
