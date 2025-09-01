import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Flex } from 'components/ui';
import { colors } from 'style/config';
import localeUtils from 'utils/LanguageLocale';
import { DELIVERY_METHOD_TYPES } from 'constants/RwdBasket';

function OutOfStockFlag(props) {
    const getText = localeUtils.getLocaleResourceFile('components/RwdBasket/Carts/CartLayout/locales', 'CartLayout');
    const { itemDeliveryMethod } = props;

    return (
        <Flex
            color={colors.red}
            marginTop={3}
            fontSize={['sm', 'base']}
            fontWeight={'bold'}
            children={itemDeliveryMethod === DELIVERY_METHOD_TYPES.BOPIS ? getText('outOfStockAtSelectedStore') : getText('outOfStock')}
        />
    );
}

export default wrapFunctionalComponent(OutOfStockFlag, 'OutOfStockFlag');
