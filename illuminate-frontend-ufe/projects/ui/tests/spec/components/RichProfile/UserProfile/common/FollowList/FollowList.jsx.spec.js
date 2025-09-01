describe('<FollowList /> component', () => {
    let React;
    let FollowList;
    let shallowedComponent;

    beforeEach(() => {
        React = require('react');
        FollowList = require('components/RichProfile/UserProfile/common/FollowList/FollowList').default;
        shallowedComponent = enzyme.shallow(<FollowList isFollowers={true} />);
    });

    // it('should display back link when is logged user profile', () => {
    //     shallowedComponent.setState({
    //         ready: true,
    //         isMyProfile: true
    //     });

    //     const backLink = shallowedComponent.find('Link').at(0);
    //     expect(backLink.prop('children')).toEqual('Back to Profile');
    // });

    // it('should display back link when is to other user profile', () => {
    //     shallowedComponent.setState({
    //         ready: true,
    //         isMyProfile: false,
    //         nickname: 'nickname'
    //     });

    //     const backLink = shallowedComponent.find('Link').at(0);
    //     expect(backLink.prop('children')).toEqual('Back to nickname’s Profile');
    // });

    it('should display Text for followers', () => {
        shallowedComponent = enzyme.shallow(<FollowList isFollowers={true} />);
        const followText = shallowedComponent.find('Text').at(0);
        expect(followText.prop('children')).toEqual('Followers');
    });

    it('should display Text for following', () => {
        shallowedComponent = enzyme.shallow(<FollowList isFollowers={false} />);
        const followText = shallowedComponent.find('Text').at(0);
        expect(followText.prop('children')).toEqual('Following');
    });

    it('should display the following user elements', () => {
        const testUser = {
            login: '1',
            avatar: { avatar: '' },
            badges: [{ icon: '' }, { icon: '' }]
        };

        shallowedComponent.setState({
            ready: true,
            shouldSignIn: false,
            followList: [{ user: testUser }, { user: testUser }, { user: testUser }]
        });

        const followersLegacyContainer = shallowedComponent.find('LegacyContainer > LegacyGrid > LegacyGridCell');

        expect(followersLegacyContainer.length).toBe(3);
    });
});
