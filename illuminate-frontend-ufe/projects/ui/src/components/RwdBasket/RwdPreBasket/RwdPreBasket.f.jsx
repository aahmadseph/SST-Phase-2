import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import * as rwdBasketConstants from 'constants/RwdBasket';
import { Text, Grid } from 'components/ui';
import RwdPreBasketShipping from 'components/RwdBasket/RwdPreBasket/RwdPreBasketShipping/RwdPreBasketShipping';
import RwdPreBasketPickup from 'components/RwdBasket/RwdPreBasket/RwdPreBasketPickup/RwdPreBasketPickup';
import localeUtils from 'utils/LanguageLocale';

const {
    MAIN_BASKET_TYPES: { DC_BASKET, BOPIS_BASKET }
} = rwdBasketConstants;

function RwdPreBasket({
    cartInfo, paymentInfo, messageInfo, goToPickUpBasket, goToDCBasket, preBasketInfoModalCallbacks
}) {
    const getText = localeUtils.getLocaleResourceFile('components/RwdBasket/RwdPreBasket/locales', 'RwdPreBasket');

    return (
        <>
            <Text
                is={'h1'}
                alignItems={'center'}
                fontSize={['lg', null, 'xl']}
                fontWeight={'bold'}
                lineHeight={'none'}
                marginY={5}
                data-at={Sephora.debug.dataAt('basket_header')}
            >
                {getText('mainTitle')}
            </Text>
            <Grid gap={[3, 4]}>
                <RwdPreBasketPickup
                    title={getText('bopisTitle', [cartInfo.getTotalItemsBopisBaskets()])}
                    promoMessage={getText('bopisPromo')}
                    subtotalMessage={getText('bopisSubtotal')}
                    subtotal={paymentInfo[BOPIS_BASKET].subtotal}
                    goToPickUpBasket={goToPickUpBasket}
                    {...cartInfo[BOPIS_BASKET]}
                    errors={messageInfo[BOPIS_BASKET]}
                    dataAt={{
                        title: 'prebasket_bopis_title',
                        infoIcon: 'prebasket_reserve_info_icon',
                        subtotal: 'prebasket_bopis_items-subtotal',
                        checkoutButton: 'prebasket_view_and_reserve',
                        infoMessage: 'prebasket_ropis_info_message'
                    }}
                    infoModalCallbacks={preBasketInfoModalCallbacks[BOPIS_BASKET]}
                />
                <RwdPreBasketShipping
                    getTitle={n => getText('shippingTitle', [n])}
                    promoMessage={getText('shippingPromo')}
                    subtotalMessage={getText('shippingSubtotal')}
                    subtotal={paymentInfo[DC_BASKET].subtotal}
                    goToDCBasket={goToDCBasket}
                    linkText={getText('linkText')}
                    linkMessage={getText('linkMessage')}
                    cartInfo={cartInfo}
                    errors={messageInfo[DC_BASKET]}
                    infoModalCallbacks={preBasketInfoModalCallbacks[DC_BASKET]}
                    dataAt={{
                        title: 'prebasket_shipped_title',
                        subtotal: 'prebasket_items_subtotal',
                        checkoutButton: 'prebasket_view_and_checkout',
                        infoMessage: 'prebasket_shipped_info_message'
                    }}
                />
            </Grid>
        </>
    );
}

export default wrapFunctionalComponent(RwdPreBasket, 'RwdPreBasket');
