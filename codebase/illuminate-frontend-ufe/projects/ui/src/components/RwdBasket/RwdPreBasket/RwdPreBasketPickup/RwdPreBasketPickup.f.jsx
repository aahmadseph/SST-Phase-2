import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import { Icon } from 'components/ui';
import PreBasketCartLayout from 'components/RwdBasket/RwdPreBasket/PreBasketCartLayout/PreBasketCartLayout';
import BOPISHeader from 'components/RwdBasket/RwdPreBasket/CartHeaders/BOPIS/BOPISHeader';

import anaConsts from 'analytics/constants';

function RwdPreBasketPickup({
    title,
    items,
    pickupMessage,
    storeDetails,
    subtotal,
    subtotalMessage,
    promoMessage,
    goToPickUpBasket,
    totalQuantity,
    errors,
    dataAt,
    infoModalCallbacks
}) {
    return (
        <>
            <PreBasketCartLayout
                title={title}
                carts={[
                    {
                        items,
                        header: (
                            <BOPISHeader
                                pickupMessage={pickupMessage}
                                storeDetails={storeDetails}
                                icon={<Icon name='store' />}
                                isPickupMessageBold
                            />
                        ),
                        totalQuantity,
                        cartDataAt: {
                            productImg: 'prebasket_ropis_product_img',
                            seeAll: 'prebasket_bopis_see_all'
                        }
                    }
                ]}
                subtotalMessage={subtotalMessage}
                subtotal={subtotal}
                promoMessage={promoMessage}
                goToBasket={() =>
                    goToPickUpBasket({
                        prop55: anaConsts.LinkData.VIEW_ITEMS_AND_CHECKOUT_BOPIS,
                        items
                    })
                }
                infoOnClick={infoModalCallbacks.cartHeader}
                errors={errors}
                dataAt={dataAt}
            />
        </>
    );
}

export default wrapFunctionalComponent(RwdPreBasketPickup, 'RwdPreBasketPickup');
