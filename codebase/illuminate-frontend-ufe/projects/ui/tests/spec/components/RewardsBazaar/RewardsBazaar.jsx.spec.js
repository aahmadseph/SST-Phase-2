describe('<RewardBazaar /> component', () => {
    let React;
    let RewardsBazaar;
    let shallowComponent;

    beforeEach(() => {
        React = require('react');
        RewardsBazaar = require('components/RewardsBazaar/RewardsBazaar').default;
        shallowComponent = enzyme.shallow(<RewardsBazaar />);
    });

    it('should not display user info if is non BI', () => {
        expect(shallowComponent.find('BiInfoCard').length).toEqual(0);
    });

    describe('BiInfoCard', () => {
        it('should display the user info if is BI', () => {
            const state = {
                user: {
                    profileId: 1,
                    firstName: 'Cristian',
                    beautyInsiderAccount: { vibSegment: 'ROUGE' }
                },
                isUserBi: true,
                isUserReady: true,
                isUserAtleastRecognized: true
            };

            shallowComponent.setState(state);
            expect(shallowComponent.find('BiInfoCard').prop('user')).toEqual(state.user);
        });
    });

    describe('Rewards Carrousels', () => {
        it('should not render if there is no rewards', () => {
            const state = { biRewardsCarrousels: [] };

            shallowComponent.setState(state);
            expect(shallowComponent.find('RewardsCarousel').length).toEqual(0);
        });

        xit('should render a divider if carrousels are present', () => {
            const state = { biRewardsCarrousels: [{}] };

            shallowComponent.setState(state);
            expect(shallowComponent.find('main > Divider').length).toEqual(1);
        });

        it('should render carrousels sent', () => {
            const state = {
                biRewardsCarrousels: [
                    {
                        items: [{}],
                        title: 'Choose Your Tier Celebration Gift',
                        isAnonymous: false
                    },
                    {
                        items: [{}],
                        title: 'Choose Your Birthday Gift',
                        isAnonymous: false
                    }
                ]
            };

            shallowComponent.setState(state);
            expect(shallowComponent.find('RewardsCarousel').length).toEqual(2);
        });
    });

    describe('Rewards Grids', () => {
        it('should not render if there is no rewards', () => {
            const state = { biRewardsGrids: undefined };

            shallowComponent.setState(state);
            expect(shallowComponent.find('RewardsGrid').length).toEqual(0);
        });

        it('should render if grids sent', () => {
            const state = {
                biRewardsGrids: [
                    {
                        items: [{}],
                        title: '50 Points',
                        isAnonymous: false
                    },
                    {
                        items: [{}],
                        title: '100 Points',
                        isAnonymous: false
                    }
                ]
            };

            shallowComponent.setState(state);
            expect(shallowComponent.find('RewardsGrid').length).toEqual(2);
        });
    });

    describe('BCC Component List', () => {
        let regions;

        beforeEach(() => {
            regions = {
                content: {},
                right: {}
            };
        });

        it('should display both regions', () => {
            shallowComponent = enzyme.shallow(<RewardsBazaar regions={regions} />);
            expect(shallowComponent.find('BccComponentList').length).toBe(2);
        });

        it('should display only the content region', () => {
            delete regions.right;
            shallowComponent = enzyme.shallow(<RewardsBazaar regions={regions} />);
            expect(shallowComponent.find('BccComponentList').length).toBe(1);
        });

        it('should display only the right region', () => {
            delete regions.content;
            shallowComponent = enzyme.shallow(<RewardsBazaar regions={regions} />);
            expect(shallowComponent.find('BccComponentList').length).toBe(1);
        });

        // TODO: add a test to make sure the content region is at the top,
        // once the other components are added to the BIRB page

        // TODO: add a test to make sure the right region is at the bottom,
        // once the other components are added to the BIRB page
    });
});
