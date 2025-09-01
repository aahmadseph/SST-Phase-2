import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'Store';
import Actions from 'Actions';

import { Text, Button } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';

class CreditCardApplyMessaging extends BaseClass {
    constructor(props) {
        super(props);
    }

    registerHandler = () => {
        store.dispatch(Actions.showSignInWithMessagingModal({ isOpen: false }));
        store.dispatch(
            Actions.showRegisterModal({
                isOpen: true,
                callback: this.props.callback,
                errback: this.props.errback,
                isCreditCardApply: true
            })
        );
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile(
            'components/GlobalModals/SignInWithMessagingModal/CreditCardApplyMessaging/locales',
            'CreditCardApplyMessaging'
        );

        return (
            <div>
                <Text
                    is='h2'
                    fontSize='md'
                    marginBottom='.5em'
                    fontWeight='bold'
                >
                    {getText('dontHaveAccountMessage')}
                </Text>
                <Text
                    is='p'
                    marginBottom='.5em'
                >
                    {getText('registerWithSephoraMessage')}
                </Text>
                <Button
                    variant='secondary'
                    block={true}
                    onClick={this.registerHandler}
                >
                    {getText('registerApplyButton')}
                </Button>
            </div>
        );
    }
}

export default wrapComponent(CreditCardApplyMessaging, 'CreditCardApplyMessaging');
