import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Flex } from 'components/ui';
import { colors } from 'style/config';
import localeUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';

function FinalSaleMessage() {
    const getText = resourceWrapper(localeUtils.getLocaleResourceFile('components/RwdBasket/Carts/CartLayout/locales', 'CartLayout'));

    return (
        <Flex
            fontSize={'sm'}
            marginTop={3}
            color={colors.red}
            children={getText('finalSale', true)}
        />
    );
}

export default wrapFunctionalComponent(FinalSaleMessage, 'FinalSaleMessage');
