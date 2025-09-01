const React = require('react');
const { shallow } = require('enzyme');
const RwdAdvocacy = require('components/Campaigns/RwdAdvocacy/RwdAdvocacy').default;
const urlUtils = require('utils/Url').default;
const Storage = require('utils/localStorage/Storage').default;
const userUtils = require('utils/userUtils').default;

describe('RwdAdvocacy Component', () => {
    let wrapper;
    let component;
    let props;
    let getAdvocacyContentAndValidateStub;
    let setErrorStateStub;
    const referrerCode = 'referrerCode';
    const campaignCode = 'campaignCode';
    const checksum = 'checksum';

    describe('ComponentDidMount', () => {
        it('should not call getAdvocacyContentAndValidate function if user is not initialized', () => {
            props = {
                user: {
                    isInitialized: false
                }
            };
            wrapper = shallow(<RwdAdvocacy {...props} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            getAdvocacyContentAndValidateStub = spyOn(component, 'getAdvocacyContentAndValidate');
            component.componentDidMount();
            expect(getAdvocacyContentAndValidateStub).toHaveBeenCalledTimes(0);
        });

        it('should call getAdvocacyContentAndValidate function if user is initialized', () => {
            props = {
                user: {
                    isInitialized: true,
                    profileStatus: 4,
                    beautyInsiderAccount: {
                        biAccountId: '1234'
                    }
                }
            };
            wrapper = shallow(<RwdAdvocacy {...props} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            getAdvocacyContentAndValidateStub = spyOn(component, 'getAdvocacyContentAndValidate');
            component.componentDidMount();
            expect(getAdvocacyContentAndValidateStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('getAdvocacyContentAndValidate function', () => {
        beforeEach(() => {
            props = {
                user: {
                    isInitialized: true,
                    beautyInsiderAccount: {
                        biAccountId: '123'
                    },
                    profileStatus: 4
                }
            };
            wrapper = shallow(<RwdAdvocacy {...props} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            setErrorStateStub = spyOn(component, 'setErrorState');
            component.componentDidMount();
            component.setState({
                isContentfulCallMade: false,
                profileStatus: null,
                biAccountId: null
            });
        });

        it('should call setErrorState function if any of page, referrerCode, campaignCode or checksum is missing', () => {
            spyOn(urlUtils, 'getPathStrings').and.returnValues(['sephora.com', '', referrerCode, campaignCode, checksum]);
            expect(setErrorStateStub).toHaveBeenCalledWith('ERR_CAMP_REF_INVALID');
        });
    });

    describe('RwdAdvocacy Component', () => {
        let enrollUserSDNStub;
        let enrollUserATGStub;
        const referralToken = 'referralToken';

        describe('enrollUser function', () => {
            beforeEach(() => {
                props = {
                    campaignData: { referralToken },
                    campaignCode,
                    referrerCode,
                    checksum,
                    hasCalledEnrolled: false
                };
                wrapper = shallow(<RwdAdvocacy {...props} />, { disableLifecycleMethods: true });
                component = wrapper.instance();
                enrollUserSDNStub = spyOn(component, 'enrollUserSDN');
                enrollUserATGStub = spyOn(component, 'enrollUserATG');
            });

            it('should return if hasCalledEnrolled or isEnrolled is true', async () => {
                component.setState({ hasCalledEnrolled: true });
                await component.enrollUser(true);
                expect(enrollUserSDNStub).not.toHaveBeenCalled();
                expect(enrollUserATGStub).not.toHaveBeenCalled();
            });

            it('should set biAccountId in state and call enrollUserSDN if isRMSWithSDNEnabled is true', async () => {
                const storedData = {
                    email: 'test@example.com',
                    firstName: 'Test',
                    lastName: 'User',
                    signupDate: '2021-01-01',
                    biAccountId: '12345'
                };
                spyOn(Storage.local, 'getItem').and.returnValue(storedData);
                spyOn(userUtils, 'getProfileEmail').and.returnValue(null);
                spyOn(userUtils, 'getProfileFirstName').and.returnValue(null);
                spyOn(userUtils, 'getProfileLastName').and.returnValue(null);
                spyOn(userUtils, 'formatUserRegistrationDate').and.returnValue(null);
                spyOn(component, 'getUserId').and.returnValue(null);
                Sephora.configurationSettings.isRMSWithSDNEnabled = true;

                await component.enrollUser(false);

                expect(component.state.biAccountId).toBe(storedData.biAccountId);
                expect(enrollUserSDNStub).toHaveBeenCalledWith(
                    false,
                    {
                        referrerCode,
                        campaignCode,
                        refereeUsaId: storedData.biAccountId,
                        refereeEmail: storedData.email,
                        refereeFirstName: storedData.firstName,
                        refereeLastName: storedData.lastName,
                        registrationDate: storedData.signupDate,
                        checksum
                    },
                    referralToken
                );
            });

            it('should call enrollUserATG if isRMSWithSDNEnabled is false', async () => {
                const storedData = {
                    email: 'test@example.com',
                    firstName: 'Test',
                    lastName: 'User',
                    signupDate: '2021-01-01',
                    biAccountId: '12345'
                };
                spyOn(Storage.local, 'getItem').and.returnValue(storedData);
                spyOn(userUtils, 'getProfileEmail').and.returnValue(null);
                spyOn(userUtils, 'getProfileFirstName').and.returnValue(null);
                spyOn(userUtils, 'getProfileLastName').and.returnValue(null);
                spyOn(userUtils, 'formatUserRegistrationDate').and.returnValue(null);
                spyOn(component, 'getUserId').and.returnValue(null);
                Sephora.configurationSettings.isRMSWithSDNEnabled = false;

                await component.enrollUser(false);

                expect(enrollUserATGStub).toHaveBeenCalledWith(
                    {
                        referrerCode,
                        campaignCode,
                        userId: null,
                        checksum
                    },
                    referralToken
                );
            });
        });
    });
});
