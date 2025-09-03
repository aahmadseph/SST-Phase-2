import React from 'react';
import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import FrameworkUtils from 'utils/framework';
import AccountLayout from 'components/RichProfile/MyAccount/AccountLayout/AccountLayout';
import { Divider } from 'components/ui';
import PromotionalEmailsPrefs from 'components/RichProfile/MyAccount/MailingPrefs/PromotionalEmailsPrefs/PromotionalEmailsPrefs';
import NotificationsAndRemindersPrefs from 'components/RichProfile/MyAccount/MailingPrefs/NotificationsAndRemindersPrefs/NotificationsAndRemindersPrefs';
import PostalMailPrefs from 'components/RichProfile/MyAccount/MailingPrefs/PostalMailPrefs/PostalMailPrefs';
import PleaseSignInBlock from 'components/RichProfile/MyAccount/PleaseSignIn';
import languageLocaleUtils from 'utils/LanguageLocale';
const { getLocaleResourceFile } = languageLocaleUtils;
import UserUtils from 'utils/User';
import sessionExtensionService from 'services/SessionExtensionService';

const { wrapComponent } = FrameworkUtils;

class MailingPrefs extends BaseClass {
    state = {
        shouldShowPostalMailPrefs: UserUtils.getBiAccountInfo(this.props?.user)?.vibSegment !== UserUtils.types.NON_BI,
        sections: {
            PromotionalEmailsPrefs: { editMode: false },
            NotificationsAndRemindersPrefs: { editMode: false },
            PostalMailPrefs: { editMode: false }
        }
    };

    componentDidMount() {
        const userIsAnonymous = UserUtils.isAnonymous(this.props.auth);
        !userIsAnonymous && this.props.fetchAndStorePreferences();
        Sephora.isDesktop() && sessionExtensionService.setExpiryTimer(this.props.requestCounter);
    }

    componentDidUpdate(prevProps) {
        const userIsAnonymous = UserUtils.isAnonymous(this.props.auth);

        if (!userIsAnonymous && this.props.auth?.hasIdentity !== null && prevProps.user?.profileId !== this.props.user?.profileId) {
            this.props.fetchAndStorePreferences();
        }
    }

    handleSectionExpand = sectionComponent => {
        const sections = {
            PromotionalEmailsPrefs: { editMode: false },
            NotificationsAndRemindersPrefs: { editMode: false },
            PostalMailPrefs: { editMode: false }
        };

        sections[sectionComponent] = { editMode: true };

        this.setState({ sections });
    };

    render() {
        const { auth } = this.props;
        const getText = getLocaleResourceFile('components/RichProfile/MyAccount/MailingPrefs/locales', 'MailingPrefs');
        const userIsAnonymous = UserUtils.isAnonymous(auth);

        const sectionDivider = Sephora.isMobile() ? (
            <Divider
                height={3}
                color='nearWhite'
                marginX='-container'
            />
        ) : (
            <Divider />
        );

        return (
            <AccountLayout
                section='account'
                page='mail prefs'
                title={getText('emailAndMailPreferences')}
            >
                {!Sephora.isNodeRender && (
                    <div>
                        {userIsAnonymous && <PleaseSignInBlock />}

                        {!userIsAnonymous && (
                            <div>
                                <PromotionalEmailsPrefs
                                    ref={comp => (this._promotionalEmailPrefs = comp)}
                                    onExpand={() => this.handleSectionExpand('PromotionalEmailsPrefs')}
                                    viewMode={!this.state.sections['PromotionalEmailsPrefs'].editMode}
                                />

                                {sectionDivider}
                                <NotificationsAndRemindersPrefs
                                    ref={comp => (this._notificationsAndRemindersPrefs = comp)}
                                    onExpand={() => this.handleSectionExpand('NotificationsAndRemindersPrefs')}
                                    viewMode={!this.state.sections['NotificationsAndRemindersPrefs'].editMode}
                                />

                                {this.state.shouldShowPostalMailPrefs && (
                                    <div>
                                        {sectionDivider}
                                        <PostalMailPrefs
                                            ref={comp => (this._postalMailPrefs = comp)}
                                            onExpand={() => this.handleSectionExpand('PostalMailPrefs')}
                                            viewMode={!this.state.sections['PostalMailPrefs'].editMode}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </AccountLayout>
        );
    }
}

MailingPrefs.propTypes = {
    user: PropTypes.object,
    fetchAndStorePreferences: PropTypes.func,
    requestCounter: PropTypes.number
};

export default wrapComponent(MailingPrefs, 'MailingPrefs', true);
