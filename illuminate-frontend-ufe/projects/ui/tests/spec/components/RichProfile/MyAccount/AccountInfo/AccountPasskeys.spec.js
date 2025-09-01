const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('<AccountPasskeys /> component', () => {
    let AccountPasskeys;
    let shallowedComponent;
    let setEditSectionSpy;

    beforeEach(() => {
        AccountPasskeys = require('components/RichProfile/MyAccount/AccountInfo/AccountPasskeys/AccountPasskeys').default;
        setEditSectionSpy = createSpy();
    });

    describe('on display mode with invalid props', () => {
        it('should not display the component if undefined props is provided', () => {
            Sephora.configurationSettings.isPasskeyEnabled = true;

            shallowedComponent = shallow(
                <AccountPasskeys
                    user={{}}
                    isEditMode={false}
                    setEditSection={setEditSectionSpy}
                />
            );

            expect(shallowedComponent.find('LegacyGrid[data-at="account_passkeys_field"]').length).toBe(0);
        });

        it('should not display the component if an empty array of passkeys is provided', () => {
            Sephora.configurationSettings.isPasskeyEnabled = true;

            shallowedComponent = shallow(
                <AccountPasskeys
                    user={{
                        passkeys: []
                    }}
                    isEditMode={false}
                    setEditSection={setEditSectionSpy}
                />
            );

            expect(shallowedComponent.find('LegacyGrid[data-at="account_passkeys_field"]').length).toBe(0);
        });

        it('should not display the component if the KS is disabled', () => {
            Sephora.configurationSettings.isPasskeyEnabled = false;

            shallowedComponent = shallow(
                <AccountPasskeys
                    user={{
                        passkeys: [
                            {
                                passkeyId: 'ce0d757262028d9a',
                                created: '6/22/24',
                                identityId: '740555553fd3eed0',
                                state: 'ACTIVE',
                                metaInfo: {
                                    deviceName: 'iPhone 15 Pro (Sephora App)',
                                    os: 'Other null.null',
                                    browser: 'Other null.null'
                                }
                            },
                            {
                                passkeyId: 'fcd7724c191093af',
                                created: '8/8/24',
                                identityId: '740555553fd3eed0',
                                state: 'ACTIVE',
                                metaInfo: {
                                    deviceName: 'iPhone 15 Pro Max (Sephora App)',
                                    os: 'Other null.null',
                                    browser: 'Other null.null'
                                }
                            }
                        ]
                    }}
                    isEditMode={false}
                    setEditSection={setEditSectionSpy}
                />
            );

            expect(shallowedComponent.find('LegacyGrid[data-at="account_passkeys_field"]').length).toBe(0);
        });
    });

    describe('on display mode with valid props', () => {
        beforeEach(() => {
            Sephora.configurationSettings.isPasskeyEnabled = true;

            shallowedComponent = shallow(
                <AccountPasskeys
                    user={{
                        passkeys: [
                            {
                                passkeyId: 'ce0d757262028d9a',
                                created: '6/22/24',
                                identityId: '740555553fd3eed0',
                                state: 'ACTIVE',
                                metaInfo: {
                                    deviceName: 'iPhone 15 Pro (Sephora App)',
                                    os: 'Other null.null',
                                    browser: 'Other null.null'
                                }
                            },
                            {
                                passkeyId: 'fcd7724c191093af',
                                created: '8/8/24',
                                identityId: '740555553fd3eed0',
                                state: 'ACTIVE',
                                metaInfo: {
                                    deviceName: 'iPhone 15 Pro Max (Sephora App)',
                                    os: 'Other null.null',
                                    browser: 'Other null.null'
                                }
                            }
                        ]
                    }}
                    isEditMode={false}
                    setEditSection={setEditSectionSpy}
                />
            );
        });

        it('should display a LegacyGrid', () => {
            expect(shallowedComponent.find('LegacyGrid').length).toBe(1);
        });

        it('should display a LegacyGrid with data-at attribute', () => {
            expect(shallowedComponent.find('LegacyGrid[data-at="account_passkeys_field"]').length).toBe(1);
        });

        it('should have passkey text rendered', () => {
            expect(shallowedComponent.find('LegacyGridCell > Text').at(0).prop('children')).toBe('Passkey');
        });

        it('should display a InfoButton with data-at attribute', () => {
            expect(shallowedComponent.find('InfoButton').length).toBe(1);
        });
    });

    describe('on edit mode', () => {
        beforeEach(() => {
            Sephora.configurationSettings.isPasskeyEnabled = true;

            shallowedComponent = shallow(
                <AccountPasskeys
                    user={{
                        passkeys: [
                            {
                                passkeyId: 'ce0d757262028d9a',
                                created: '6/22/24',
                                identityId: '740555553fd3eed0',
                                state: 'ACTIVE',
                                metaInfo: {
                                    deviceName: 'iPhone 15 Pro (Sephora App)',
                                    os: 'Other null.null',
                                    browser: 'Other null.null'
                                }
                            },
                            {
                                passkeyId: 'fcd7724c191093af',
                                created: '8/8/24',
                                identityId: '740555553fd3eed0',
                                state: 'ACTIVE',
                                metaInfo: {
                                    deviceName: 'iPhone 15 Pro Max (Sephora App)',
                                    os: 'Other null.null',
                                    browser: 'Other null.null'
                                }
                            }
                        ]
                    }}
                    isEditMode={true}
                    setEditSection={setEditSectionSpy}
                />
            );
        });

        it('should render the given passkeys', () => {
            expect(shallowedComponent.find('Link[data-at="account_passkey_remove_button"]').length).toBe(2);
        });
    });
});
