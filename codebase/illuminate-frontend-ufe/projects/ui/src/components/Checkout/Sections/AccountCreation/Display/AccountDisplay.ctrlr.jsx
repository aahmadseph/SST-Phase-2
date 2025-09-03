/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';

class AccountDisplay extends BaseClass {
    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/Sections/AccountCreation/locales', 'AccountCreation');
        const { login, firstName, lastName } = this.props;

        return login ? (
            <div>
                {getText('emailLabel')}: {login}
                <br />
                {getText('nameLabel')}: {firstName} {lastName}
            </div>
        ) : null;
    }
}

export default wrapComponent(AccountDisplay, 'AccountDisplay');
