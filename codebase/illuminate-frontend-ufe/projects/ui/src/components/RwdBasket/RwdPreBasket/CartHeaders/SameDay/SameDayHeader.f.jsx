import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import SDDDeliveryInfo from 'components/RwdBasket/DeliveryInfo/SDD/SDDDeliveryInfo';
import ShippingHeaderLayout from 'components/RwdBasket/RwdPreBasket/CartHeaders/ShippingHeaderLayout';

import addressUtils from 'utils/Address';

const { formatZipCode } = addressUtils;

function SameDayHeader({
    title, message, preferredZipCode, infoModalCallback, sameDayIsAvailable
}) {
    return (
        <ShippingHeaderLayout
            iconName={'bag'}
            title={title}
            infoOnClick={infoModalCallback}
            subHeader={
                <SDDDeliveryInfo
                    zipCode={formatZipCode(preferredZipCode)}
                    message={message}
                    isMessageBold
                    sameDayIsAvailable={sameDayIsAvailable}
                />
            }
            dataAt={{
                basketLabel: 'bsk_sameday_items_label',
                infoIcon: 'bsk_sameday_info_icon'
            }}
        />
    );
}

export default wrapFunctionalComponent(SameDayHeader, 'SameDayHeader');
