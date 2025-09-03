describe('BIRB page', () => {
    let React;
    let Rewards;
    let shallowComponent;
    let regions;

    beforeEach(() => {
        React = require('react');
        Rewards = require('pages/Rewards/Rewards').default;
        regions = {
            content: {},
            right: {}
        };
    });

    describe('RewardsBazaar component', () => {
        beforeEach(() => {
            shallowComponent = enzyme.shallow(<Rewards regions={regions} />);
        });

        it('should render the RewardsBazaar component', () => {
            expect(shallowComponent.find('RewardsBazaar').length).toEqual(1);
        });

        it('should render the RewardsBazaar component', () => {
            expect(shallowComponent.find('RewardsBazaar').props().regions).toBeDefined();
        });
    });
});
