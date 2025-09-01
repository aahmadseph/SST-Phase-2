/*
const React = require('react');
const { shallow } = require('enzyme');
const { any } = jasmine;
const langLocale = require('utils/LanguageLocale').default;
const rewardsLabels = require('utils/User').default.rewardsLabels;

describe('RewardsBazaar component', () => {
    let RewardsBazaar;

    beforeEach(() => {
        RewardsBazaar = require('components/RewardsBazaar/RewardsBazaar').default;
    });

    describe('ctrlr', function () {
        let store;
        let Events;
        let userUtils;

        beforeEach(() => {
            store = require('store/Store').default;
            Events = require('utils/framework/Events').default;
            userUtils = require('utils/User').default;
        });

        it('should call onLastLoadEvent', function () {
            // Arrange
            const onLastLoadEvent = spyOn(Events, 'onLastLoadEvent');

            // Act
            shallow(<RewardsBazaar />).then(() => onLastLoadEvent.calls.first().args[2]());

            // Assert
            expect(onLastLoadEvent).toHaveBeenCalledWith(window, ['UserInfoReady'], any(Function));
        });

        it('should call setAndWatch for user', () => {
            // Arrange
            const onLastLoadEvent = spyOn(Events, 'onLastLoadEvent');
            const setAndWatch = spyOn(store, 'setAndWatch');

            // Act
            const component = shallow(<RewardsBazaar />).instance();
            onLastLoadEvent.calls.first().args[2]();

            // Assert
            expect(setAndWatch).toHaveBeenCalledWith('user', component, any(Function));
        });

        it('should update the state with user data', () => {
            // Arrange
            spyOn(userUtils, 'isBI').and.returnValue(true);
            spyOn(userUtils, 'isRouge').and.returnValue(true);
            spyOn(userUtils, 'isUserAtleastRecognized').and.returnValue(true);
            const onLastLoadEvent = spyOn(Events, 'onLastLoadEvent');
            const setAndWatch = spyOn(store, 'setAndWatch');

            // Act
            const wrapper = shallow(<RewardsBazaar />);
            onLastLoadEvent.calls.first().args[2]();
            setAndWatch.calls.argsFor(1)[2]({ user: {} });

            // Assert
            expect(wrapper.state()).toEqual({
                user: {},
                isUserBi: true,
                biRewardsCarrousels: [],
                biRewardsGrids: [],
                isUserReady: true,
                isUserAtleastRecognized: true
            });
        });

        it('should update the state with rewards grids data', () => {
            // Arrange
            const setAndWatch = spyOn(store, 'setAndWatch');
            spyOn(langLocale, 'getLocaleResourceFile').and.returnValue('Points');
            spyOn(userUtils, 'isAnonymous').and.returnValue(false);

            // Act
            const wrapper = shallow(<RewardsBazaar />);
            setAndWatch.calls.first().args[2]({
                biRewardGroups: {
                    '50 Points': [{}],
                    '100 Points': [{}]
                }
            });

            // Assert
            expect(wrapper.state()).toEqual({
                user: null,
                isUserBi: false,
                biRewardsCarrousels: [],
                biRewardsGrids: [
                    {
                        items: [{}],
                        anchor: '50points',
                        title: '50 Points',
                        isAnonymous: false,
                        isBIRBReward: true
                    },
                    {
                        items: [{}],
                        title: '100 Points',
                        anchor: '100points',
                        isAnonymous: false,
                        isBIRBReward: true
                    }
                ],
                isUserReady: false,
                isUserAtleastRecognized: false
            });
        });

        it('should update the state with rewards carrousel data', () => {
            // Arrange
            const setAndWatch = spyOn(store, 'setAndWatch');
            spyOn(userUtils, 'isAnonymous').and.returnValue(false);
            spyOn(userUtils, 'getRealTimeBiStatus').and.returnValue('Rouge');

            // Act
            const wrapper = shallow(<RewardsBazaar />);
            setAndWatch.calls.first().args[2]({ biRewardGroups: { 'Celebration Gift': [{}] } });

            // Assert
            expect(wrapper.state()).toEqual({
                user: null,
                isUserBi: false,
                biRewardsCarrousels: [
                    {
                        anchor: 'complimentary',
                        items: [{}],
                        subtitle: 'Congrats, Rouge!',
                        title: `Choose Your ${rewardsLabels.CELEBRATION_GIFT.TITLE}`
                    }
                ],
                biRewardsGrids: [],
                isUserReady: false,
                isUserAtleastRecognized: false
            });
        });

        it('should not add Tier Celebration carrousel for anonymous user', () => {
            // Arrange
            const setAndWatch = spyOn(store, 'setAndWatch');
            spyOn(userUtils, 'isAnonymous').and.returnValue(true);

            // Act
            const wrapper = shallow(<RewardsBazaar />);
            setAndWatch.calls.first().args[2]({ biRewardGroups: { 'Celebration Gift': [{}] } });

            // Assert
            expect(wrapper.state()).toEqual({
                user: null,
                isUserBi: false,
                biRewardsCarrousels: [],
                biRewardsGrids: [],
                isUserReady: false,
                isUserAtleastRecognized: false
            });
        });

        it('should call addEventListener to subscribe scrollTo', () => {
            // Arrange
            const addEventListenerStub = spyOn(window, 'addEventListener');

            // Act
            shallow(<RewardsBazaar />);

            // Assert
            expect(addEventListenerStub).toHaveBeenCalledWith('hashchange', any(Function));
        });
    });

    describe('scrollTo', () => {
        let helpersUtils;
        let locationUtils;

        beforeEach(() => {
            helpersUtils = require('utils/Helpers').default;
            locationUtils = require('utils/Location').default;
        });

        it('should not call to scrollTo util', () => {
            // Arrange
            const scrollTo = spyOn(helpersUtils, 'scrollTo');

            // Act
            shallow(<RewardsBazaar />)
                .instance()
                .scrollTo();

            // Assert
            expect(scrollTo).not.toHaveBeenCalled();
        });

        it('should call to scrollTo util', () => {
            // Arrange
            const scrollTo = spyOn(helpersUtils, 'scrollTo');
            spyOn(locationUtils, 'getWindowLocation').and.callFake(() => ({
                ...window.location,
                hash: '#myhash'
            }));

            // Act
            const rewardsBazaarComponent = shallow(<RewardsBazaar />).instance();
            rewardsBazaarComponent.rewardsBazaar.current = {};
            rewardsBazaarComponent.scrollTo();

            // Assert
            expect(scrollTo).toHaveBeenCalledWith({}, '[id=\'myhash\']', 100, 0);
        });
    });

    it('componentWillUnmount should call removeEventListener to unsubscribe scrollTo', () => {
        // Arrange
        const removeEventListener = spyOn(window, 'removeEventListener');

        // Act
        shallow(<RewardsBazaar />)
            .instance()
            .componentWillUnmount();

        // Assert
        expect(removeEventListener).toHaveBeenCalledWith('hashchange', any(Function));
    });
});
*/
