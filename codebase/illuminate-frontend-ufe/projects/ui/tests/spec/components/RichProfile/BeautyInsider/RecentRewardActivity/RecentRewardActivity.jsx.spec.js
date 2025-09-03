const React = require('react');

describe('RecentRewardActivity component', () => {
    let RecentRewardActivity;
    let shallowComponent;

    beforeEach(() => {
        RecentRewardActivity = require('components/RichProfile/BeautyInsider/RecentRewardActivity/RecentRewardActivity').default;
    });

    describe('without recent rewards', () => {
        beforeEach(() => {
            shallowComponent = enzyme.shallow(<RecentRewardActivity />);
        });

        it('should not render ProductListItem', () => {
            expect(shallowComponent.find('ProductListItem').length).toEqual(0);
        });

        it('should render Button', () => {
            expect(shallowComponent.find('Button').length).toEqual(1);
        });
    });

    it('with recent rewards should render sent items', () => {
        const recentRewards = [{}, {}, {}];
        shallowComponent = enzyme.shallow(<RecentRewardActivity />);
        shallowComponent.setState({ recentRewards });
        expect(shallowComponent.find('ProductListItem').length).toEqual(3);
    });

    it('render viewAll if more than 3 items should render viewAll', () => {
        const recentRewards = [{}, {}, {}, {}];
        shallowComponent = enzyme.shallow(<RecentRewardActivity />);
        shallowComponent.setState({ recentRewards });
        expect(shallowComponent.find('Link').at(0).props().children).toEqual('View all');
    });
});
