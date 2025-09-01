import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Icon } from 'components/ui';
import ErrorMsg from 'components/ErrorMsg';
import localeUtils from 'utils/LanguageLocale';

const UpdateError = function () {
    const getText = localeUtils.getLocaleResourceFile('components/Checkout/Shared/locales', 'UpdateError');

    return (
        <ErrorMsg
            fontSize='inherit'
            marginBottom='0'
        >
            <Icon
                name='alert'
                size='1.25em'
                marginRight='.5em'
            />
            <span data-at={Sephora.debug.dataAt('collapsed_accordion_error')}>{getText('pleaseUpdateInfoMessage')}</span>
        </ErrorMsg>
    );
};

export default wrapFunctionalComponent(UpdateError, 'UpdateError');
