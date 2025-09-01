const React = require('react');
const { shallow } = require('enzyme');

describe('Privacy component', () => {
    const Privacy = require('components/RichProfile/EditMyProfile/Content/Privacy/Privacy').default;
    const decorators = require('utils/decorators').default;
    const profileApi = require('services/api/profile').default;
    const userUtils = require('utils/User').default;
    let component;

    beforeEach(() => {
        spyOn(decorators, 'withInterstice').and.callFake(arg0 => arg0);
        const wrapper = shallow(<Privacy />);
        component = wrapper.instance();
    });

    describe('componentDidMount', () => {
        it('should call getPublicProfileByNicknameStub with proper data', function () {
            const getPublicProfileByNicknameStub = spyOn(profileApi, 'getPublicProfileByNickname').and.returnValue({ then: () => {} });
            spyOn(userUtils, 'getNickname').and.returnValue('nickname');
            component.componentDidMount();
            expect(getPublicProfileByNicknameStub).toHaveBeenCalledWith('nickname');
        });

        it('should set state with data received from getPublicProfileByNickname', done => {
            const fakePromise = {
                then: resolve => {
                    resolve({
                        biPrivate: true,
                        isPrivate: true
                    });

                    expect(component.state).toEqual({
                        biPrivate: true,
                        isProfilePrivate: true,
                        isUserReady: true,
                        personalizedInformation: {}
                    });

                    done();

                    return fakePromise;
                }
            };

            spyOn(profileApi, 'getPublicProfileByNickname').and.returnValue(fakePromise);
            component.componentDidMount();
        });
    });

    describe('getData', () => {
        it('should return data from current state', () => {
            const dataReceived = component.getData();
            expect(dataReceived).toEqual({ biPrivate: { biPrivate: false } });
        });
    });
});
