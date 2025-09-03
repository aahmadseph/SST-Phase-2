import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import { Text } from 'components/ui';
import ShippingHeaderLayout from 'components/RwdBasket/RwdPreBasket/CartHeaders/ShippingHeaderLayout';
import BiFreeShipping from 'components/RwdBasket/Messages/BiFreeShipping/BiFreeShipping';

import localeUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';

import { colors } from 'style/config';

function StandardHeader({ itemCount, hasMetFreeShippingThreshhold, isSignedInBIUser }) {
    const getText = resourceWrapper(
        localeUtils.getLocaleResourceFile('components/RwdBasket/RwdPreBasket/CartHeaders/Standard/locales', 'StandardHeader')
    );

    return (
        <ShippingHeaderLayout
            iconName={'truck'}
            title={`${getText('standard')} (${itemCount})`}
            subHeader={
                <Text
                    is={'p'}
                    fontSize={['sm', 'base']}
                    color={'green'}
                    paddingY={1}
                    css={{ whiteSpace: 'normal' }}
                    children={
                        <BiFreeShipping
                            hasMetFreeShippingThreshhold={hasMetFreeShippingThreshhold}
                            isSignedInBIUser={isSignedInBIUser}
                            baseColor={colors.green}
                            fontWeight='bold'
                        />
                    }
                    data-at={Sephora.debug.dataAt('prebasket_shipping_message')}
                />
            }
            dataAt={{
                basketLabel: 'bsk_standard_items_label'
            }}
        />
    );
}

export default wrapFunctionalComponent(StandardHeader, 'StandardHeader');
