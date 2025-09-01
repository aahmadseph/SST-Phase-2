import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text } from 'components/ui';
import ShippingHeaderLayout from 'components/RwdBasket/RwdPreBasket/CartHeaders/ShippingHeaderLayout';

import localeUtils from 'utils/LanguageLocale';

const AutoReplenishmentHeader = ({ itemCount, infoModalCallback }) => {
    const getText = localeUtils.getLocaleResourceFile(
        'components/RwdBasket/RwdPreBasket/CartHeaders/AutoReplenishment/locales',
        'AutoReplenishmentHeader'
    );

    return (
        <ShippingHeaderLayout
            iconName={'autoReplenish'}
            title={`${getText('autoReplenish')} (${itemCount})`}
            infoOnClick={infoModalCallback}
            subHeader={
                <Text
                    is={'p'}
                    fontSize={['sm', 'base']}
                    fontWeight='bold'
                    color={'green'}
                    paddingY={1}
                    children={getText('freeStandardShipping')}
                    data-at={Sephora.debug.dataAt('bsk_auto_replenish_label')}
                />
            }
            dataAt={{
                basketLabel: 'prebasket_auto_replenish_items_label',
                infoIcon: 'prebasket_auto_replenish_info_icon'
            }}
        />
    );
};

export default wrapFunctionalComponent(AutoReplenishmentHeader, 'AutoReplenishmentHeader');
