import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { modal, space } from 'style/config';
import { Grid, Button } from 'components/ui';
import store from 'store/Store';
import actions from 'Actions';
import anaUtils from 'analytics/utils';
import Location from 'utils/Location';
import authUtils from 'utils/Authentication';
import Avatar from 'components/Avatar';

import localeUtils from 'utils/LanguageLocale';
import GreetingText from 'components/GreetingText';
import Markdown from 'components/Markdown/Markdown';
import { HEADER_VALUE } from 'constants/authentication';

const { getLocaleResourceFile } = localeUtils;
const getText = getLocaleResourceFile('components/Header/AccountGreeting/locales', 'AccountGreeting');

const signIn = onDismiss => {
    const navInfo = anaUtils.buildNavPath(['top nav', 'account', 'sign-in']);

    store.dispatch(
        actions.showSignInModal({
            isOpen: true,
            source: authUtils.SIGN_IN_SOURCES.ACCOUNT_GREETING,
            analyticsData: { navigationInfo: navInfo },
            callback: onDismiss ? onDismiss : null,
            extraParams: { headerValue: HEADER_VALUE.USER_CLICK }
        })
    );
};

const register = onDismiss => {
    const navInfo = anaUtils.buildNavPath(['top nav', 'account', 'register']);
    const openPostBiSignUpModal = !Location.isCheckout() && !Location.isMySephoraPage();
    store.dispatch(
        actions.showRegisterModal({
            isOpen: true,
            openPostBiSignUpModal,
            analyticsData: { navigationInfo: navInfo },
            callback: onDismiss ? onDismiss : null
        })
    );
};

function AccountGreeting({ isAnonymous, onDismiss }) {
    return (
        <div>
            <Grid
                columns='auto 1fr'
                alignItems='center'
                gap={3}
                lineHeight='tight'
                marginRight={[modal.xSize + space[3], null, 0]}
            >
                <Avatar size={52} />
                <div>
                    <GreetingText data-at={Sephora.debug.dataAt('person_greeting')} />
                    {isAnonymous && (
                        <Markdown
                            fontSize='sm'
                            marginTop={1}
                            maxWidth={[null, null, '18em']} // avoid widow
                            content={getText('lead')}
                        />
                    )}
                </div>
            </Grid>
            {isAnonymous && (
                <Grid
                    marginTop={3}
                    gap={3}
                    columns={2}
                >
                    <Button
                        onClick={() => signIn(onDismiss)}
                        data-at={Sephora.debug.dataAt('sign_in_menu')}
                        block={true}
                        variant='primary'
                        size='sm'
                        children={getText('signIn')}
                    />
                    <Button
                        onClick={() => register(onDismiss)}
                        data-at={Sephora.debug.dataAt('create_account_menu')}
                        block={true}
                        variant='secondary'
                        size='sm'
                        children={getText('createAccount')}
                    />
                </Grid>
            )}
        </div>
    );
}

export default wrapFunctionalComponent(AccountGreeting, 'AccountGreeting');
