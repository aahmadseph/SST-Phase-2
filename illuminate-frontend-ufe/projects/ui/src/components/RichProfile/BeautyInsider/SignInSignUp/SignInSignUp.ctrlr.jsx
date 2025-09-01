import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import auth from 'utils/Authentication';
import actions from 'Actions';
import store from 'store/Store';

import { Text, Button } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';

//I18n
import localeUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';

import { HEADER_VALUE } from 'constants/authentication';

class SignInSignUp extends BaseClass {
    constructor(props) {
        super(props);
    }

    signIn = e => {
        e.preventDefault();
        auth.requireAuthentication(false, null, null, null, false, HEADER_VALUE.USER_CLICK).catch(() => {});
    };

    register = e => {
        e.preventDefault();
        store.dispatch(actions.showRegisterModal({ isOpen: true, openPostBiSignUpModal: true }));
    };

    render() {
        const getText = resourceWrapper(
            localeUtils.getLocaleResourceFile('components/RichProfile/BeautyInsider/SignInSignUp/locales', 'SignInSignUp')
        );

        const isDesktop = Sephora.isDesktop();

        const btnProps = {
            variant: 'primary',
            size: isDesktop || 'sm',
            ...(isDesktop
                ? {
                    marginX: 'auto',
                    minWidth: '18.5em'
                }
                : localeUtils.isFRCanada()
                    ? {
                        block: true,
                        fontSize: 'xs'
                    }
                    : null)
        };

        return (
            <LegacyGrid
                fill={true}
                gutter={6}
                fontSize={isDesktop && 'md'}
                lineHeight='tight'
                fontWeight='bold'
                textAlign='center'
            >
                <LegacyGrid.Cell
                    borderRight={1}
                    borderColor='midGray'
                    display='flex'
                    flexDirection='column'
                >
                    <Text
                        is='p'
                        paddingBottom='.5em'
                        marginBottom='auto'
                    >
                        {getText('ready')}
                    </Text>
                    <Button
                        {...btnProps}
                        onClick={this.register}
                        children={getText('joinNow')}
                    />
                </LegacyGrid.Cell>
                <LegacyGrid.Cell
                    display='flex'
                    flexDirection='column'
                >
                    <Text
                        is='p'
                        paddingBottom='.5em'
                        marginBottom='auto'
                    >
                        {getText('alreadyBI')}
                    </Text>
                    <Button
                        {...btnProps}
                        onClick={this.signIn}
                        children={getText('signIn')}
                    />
                </LegacyGrid.Cell>
            </LegacyGrid>
        );
    }
}

export default wrapComponent(SignInSignUp, 'SignInSignUp', true);
