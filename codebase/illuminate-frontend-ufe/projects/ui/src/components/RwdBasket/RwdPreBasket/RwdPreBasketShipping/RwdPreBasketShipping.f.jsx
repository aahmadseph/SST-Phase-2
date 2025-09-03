import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import * as rwdBasketConstants from 'constants/RwdBasket';

import {
    Grid, Text, Link, Divider, Box
} from 'components/ui';
import PreBasketCartLayout from 'components/RwdBasket/RwdPreBasket/PreBasketCartLayout/PreBasketCartLayout';

import StandardHeader from 'components/RwdBasket/RwdPreBasket/CartHeaders/Standard/StandardHeader';
import SameDayHeader from 'components/RwdBasket/RwdPreBasket/CartHeaders/SameDay/SameDayHeader';
import AutoReplenishmentHeader from 'components/RwdBasket/RwdPreBasket/CartHeaders/AutoReplenishment/AutoReplenishmentHeader';
import localeUtils from 'utils/LanguageLocale';
import anaConsts from 'analytics/constants';

const {
    DC_BASKET_TYPES: { SAMEDAY_BASKET, AUTOREPLENISH_BASKET, STANDARD_BASKET }
} = rwdBasketConstants;
const { getLocaleResourceFile } = localeUtils;

function EmptyShippingBasket({ title, message, linkText, linkOnClick }) {
    return (
        <Box
            borderRadius={2}
            padding={4}
            lineHeight='tight'
            boxShadow='light'
        >
            <Text
                fontSize={['md', 'lg']}
                fontWeight='bold'
                marginBottom={3}
                data-at={Sephora.debug.dataAt('prebasket_shipped_title')}
            >
                {title}
            </Text>
            <Divider
                marginLeft={-3}
                marginY={3}
            />
            <Grid
                columns={'1fr'}
                gap={1}
                paddingY={[2, 4]}
            >
                <Text data-at={Sephora.debug.dataAt('prebasket_shipped_empty_message')}>{message}</Text>
                <Link
                    color={'blue'}
                    onClick={linkOnClick}
                    data-at={Sephora.debug.dataAt('prebasket_shipped_view_basket')}
                >
                    {linkText}
                </Link>
            </Grid>
        </Box>
    );
}

function RwdPreBasketShipping({
    getTitle,
    promoMessage,
    subtotalMessage,
    linkText,
    linkMessage,
    cartInfo,
    subtotal,
    goToDCBasket,
    errors,
    dataAt,
    infoModalCallbacks
}) {
    const carts = [];

    if (cartInfo[SAMEDAY_BASKET].isAvailable) {
        const {
            items, totalQuantity, sameDayDeliveryMessage, sameDayTitle, isSDUOnlyInBasket, preferredZipCode
        } = cartInfo[SAMEDAY_BASKET];

        const getText = getLocaleResourceFile('components/RwdBasket/RwdPreBasket/locales', 'RwdPreBasket');
        const sddTitle = sameDayTitle || getText('sameDayDelivery');

        carts.push({
            items,
            header: (
                <SameDayHeader
                    message={sameDayDeliveryMessage}
                    title={`${sddTitle} (${totalQuantity})`}
                    preferredZipCode={preferredZipCode}
                    isSDUOnlyInBasket={isSDUOnlyInBasket}
                    infoModalCallback={infoModalCallbacks[SAMEDAY_BASKET].cartHeader}
                    sameDayIsAvailable={cartInfo[SAMEDAY_BASKET].isSDDAvailableAfterZipChange}
                />
            ),
            totalQuantity,
            cartDataAt: {
                productImg: 'prebasket_same_day_product_img',
                seeAll: 'prebasket_same_day_see_all'
            }
        });
    }

    if (cartInfo[STANDARD_BASKET].isAvailable) {
        const { items, totalQuantity, hasMetFreeShippingThreshhold, isSignedInBIUser } = cartInfo[STANDARD_BASKET];
        carts.push({
            items,
            header: (
                <StandardHeader
                    itemCount={totalQuantity}
                    hasMetFreeShippingThreshhold={hasMetFreeShippingThreshhold}
                    isSignedInBIUser={isSignedInBIUser}
                />
            ),
            totalQuantity,
            cartDataAt: {
                productImg: 'prebasket_shipped_product_img',
                seeAll: 'prebasket_shipped_see_all'
            }
        });
    }

    if (cartInfo[AUTOREPLENISH_BASKET].isAvailable) {
        const { items, totalQuantity } = cartInfo[AUTOREPLENISH_BASKET];
        carts.push({
            items,
            header: (
                <AutoReplenishmentHeader
                    itemCount={totalQuantity}
                    infoModalCallback={infoModalCallbacks[AUTOREPLENISH_BASKET].cartHeader}
                />
            ),
            totalQuantity,
            cartDataAt: {
                productImg: 'prebasket_auto_replenish_product_img',
                seeAll: 'prebasket_auto_replenish_see_all'
            }
        });
    }

    if (carts.length === 0) {
        return (
            <EmptyShippingBasket
                title={getTitle(0)}
                message={linkMessage}
                linkText={linkText}
                linkOnClick={goToDCBasket}
            />
        );
    }

    return (
        <PreBasketCartLayout
            title={getTitle(cartInfo.getTotalItemsShippingBaskets())}
            carts={carts}
            subtotalMessage={subtotalMessage}
            subtotal={subtotal}
            promoMessage={promoMessage}
            goToBasket={() =>
                goToDCBasket({
                    prop55: anaConsts.LinkData.VIEW_ITEMS_AND_CHECKOUT_SHIPPED,
                    items: cartInfo.getAllSaDItems()
                })
            }
            infoOnClick={null}
            errors={errors}
            dataAt={dataAt}
        />
    );
}

export default wrapFunctionalComponent(RwdPreBasketShipping, 'RwdPreBasketShipping');
