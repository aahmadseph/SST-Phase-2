import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import AccountLayout from 'components/RichProfile/MyAccount/AccountLayout/AccountLayout';
import Email from 'components/RichProfile/MyAccount/AccountInfo/AccountEmail/AccountEmail';
import PhoneNumber from 'components/RichProfile/MyAccount/AccountInfo/AccountPhone/AccountPhone';
import Name from 'components/RichProfile/MyAccount/AccountInfo/AccountName/AccountName';
import Passkeys from 'components/RichProfile/MyAccount/AccountInfo/AccountPasskeys';
import Password from 'components/RichProfile/MyAccount/AccountInfo/AccountPassword/AccountPassword';
import Birthday from 'components/RichProfile/MyAccount/AccountInfo/AccountBirthday/AccountBirthday';
import Ownership from 'components/RichProfile/MyAccount/AccountInfo/AccountOwnership';
import Tax from 'components/RichProfile/MyAccount/AccountInfo/AccountTax/AccountTax';
import LinkedAccounts from 'components/RichProfile/MyAccount/AccountInfo/AccountLinkedAccounts/AccountLinkedAccounts';
import PleaseSignInBlock from 'components/RichProfile/MyAccount/PleaseSignIn';
import { Box, Divider } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import watch from 'redux-watch';
import processEvent from 'analytics/processEvent';
import analyticsConsts from 'analytics/constants';
import sessionExtensionService from 'services/SessionExtensionService';
import Location from 'utils/Location';
import { withEnsureUserIsSignedIn } from 'hocs/withEnsureUserIsSignedIn';

const { getLocaleResourceFile } = localeUtils;

const trackEditClick = section => {
    //Analytics
    let pageName = '';
    let shouldTrack = false;
    let trackValue = '';

    switch (section) {
        case 'email':
            pageName = ':my account:email:edit';

            break;
        case 'name':
            shouldTrack = true;
            trackValue = 'user profile:my account:name:edit';

            break;
        case 'password':
            shouldTrack = true;
            trackValue = 'user profile:my account:password:edit';

            break;
        default:
    }

    if (pageName) {
        //Prevent unnecessary tracking calls
        processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
            data: {
                eventStrings: [analyticsConsts.Event.EVENT_71],
                linkName: digitalData.page.category.pageType + pageName,
                actionInfo: digitalData.page.category.pageType + pageName
            }
        });
    } else if (shouldTrack) {
        processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
            data: {
                eventStrings: [analyticsConsts.Event.EVENT_71],
                linkName: trackValue,
                actionInfo: trackValue
            }
        });
    }
};

class AccountInfo extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            isUserReady: false,
            editSection: ''
        };
    }

    componentDidMount() {
        this.setAccountInfoState();
        Sephora.isDesktop() && sessionExtensionService.setExpiryTimer(this.props.requestCounter);

        if (Location.hasAnchor('editPassword')) {
            this.setState({ editSection: 'password' });
        }
    }

    setAccountInfoState = () => {
        // subscribe to user to update name, email, or password display
        const userWatch = watch(store.getState, 'user');
        store.subscribe(
            userWatch(watched => {
                this.setState({ user: watched, isUserReady: true });
            }),
            this
        );
    };

    setEditSection = section => {
        this.setState({ editSection: section });

        trackEditClick(section);
    };

    isUserAuthenticated = () => {
        return this.state.user && this.state.user.login;
    };

    render() {
        const getText = getLocaleResourceFile('components/RichProfile/MyAccount/AccountInfo/locales', 'AccountInfo');

        return (
            <AccountLayout
                section='account'
                page='account info'
                title={getText('accountInfoTitle')}
            >
                {!Sephora.isNodeRender && this.state.isUserReady && (
                    <div>
                        {!this.isUserAuthenticated() && <PleaseSignInBlock />}

                        {this.isUserAuthenticated() && (
                            <Box marginY={5}>
                                <Name
                                    user={this.state.user}
                                    isEditMode={this.state.editSection === 'name'}
                                    setEditSection={this.setEditSection}
                                />
                                <Divider marginY={5} />
                                <Email
                                    user={this.state.user}
                                    isEditMode={this.state.editSection === 'email'}
                                    setEditSection={this.setEditSection}
                                />
                                <Divider
                                    id='editPassword'
                                    marginY={5}
                                />
                                {Sephora.configurationSettings.enablePhoneSectionMyAccountBP1 && (
                                    <>
                                        <PhoneNumber
                                            user={this.state.user}
                                            isEditMode={this.state.editSection === 'phoneNumber'}
                                            setEditSection={this.setEditSection}
                                        />
                                        <Divider marginY={5} />
                                    </>
                                )}
                                <Password
                                    isEditMode={this.state.editSection === 'password'}
                                    setEditSection={this.setEditSection}
                                />
                                <Divider marginY={5} />
                                {Sephora.configurationSettings.isPasskeyEnabled && (
                                    <Passkeys
                                        isEditMode={this.state.editSection === 'passkeys'}
                                        setEditSection={this.setEditSection}
                                        user={this.state.user}
                                    />
                                )}
                                <Birthday user={this.state.user} />
                                <LinkedAccounts user={this.state.user} />
                                <Ownership />
                                {Sephora.configurationSettings.isTaxExemptionEnabled && <Tax tax={this.state.user?.tax} />}
                            </Box>
                        )}
                    </div>
                )}
            </AccountLayout>
        );
    }
}

const AccountInfoComponent = wrapComponent(AccountInfo, 'AccountInfo', true);

export default withEnsureUserIsSignedIn(AccountInfoComponent);
