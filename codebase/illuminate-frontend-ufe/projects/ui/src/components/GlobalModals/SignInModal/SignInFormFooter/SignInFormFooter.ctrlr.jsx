/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import store from 'Store';
import TermsAndConditionsActions from 'actions/TermsAndConditionsActions';
import actions from 'Actions';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { Text, Link } from 'components/ui';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const { showModal: showTermsConditions } = TermsAndConditionsActions;

class SignInFormFooter extends BaseClass {
    registerHandler = e => {
        e.stopPropagation();
        store.dispatch(actions.showSignInModal({ isOpen: false }));
        store.dispatch(actions.showRegisterModal({ isOpen: true }));
    };

    showPrivacyPolicy = e => {
        const getText = getLocaleResourceFile('components/GlobalModals/SignInModal/SignInFormFooter/locales', 'SignInFormFooter');
        e.preventDefault();
        const mediaId = '12300066';
        const title = getText('privacyPolicyTitle');
        store.dispatch(showTermsConditions(true, mediaId, title));
    };

    showTermsOfUse = e => {
        const getText = getLocaleResourceFile('components/GlobalModals/SignInModal/SignInFormFooter/locales', 'SignInFormFooter');
        e.preventDefault();
        const mediaId = '11300018';
        const title = getText('termsOfUseTitle');
        store.dispatch(showTermsConditions(true, mediaId, title));
    };

    render() {
        const getText = getLocaleResourceFile('components/GlobalModals/SignInModal/SignInFormFooter/locales', 'SignInFormFooter');

        return (
            <Text
                is='p'
                color='gray'
                fontSize='sm'
                textAlign='center'
            >
                <Link
                    color='blue'
                    underline={true}
                    padding={2}
                    margin={-2}
                    data-at={Sephora.debug.dataAt('terms_of_use')}
                    onClick={this.showTermsOfUse}
                    children={getText('termsOfUseLink')}
                />
                {' & '}
                <Link
                    color='blue'
                    underline={true}
                    padding={2}
                    margin={-2}
                    data-at={Sephora.debug.dataAt('privacy_policy')}
                    onClick={this.showPrivacyPolicy}
                    children={getText('privacyPolicyLink')}
                />
            </Text>
        );
    }
}

export default wrapComponent(SignInFormFooter, 'SignInFormFooter');
