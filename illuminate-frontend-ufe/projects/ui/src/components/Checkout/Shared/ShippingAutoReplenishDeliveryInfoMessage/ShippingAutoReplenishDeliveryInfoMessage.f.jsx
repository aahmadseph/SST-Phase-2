import React from 'react';
import { Text, Flex } from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile(
    'components/Checkout/Shared/ShippingAutoReplenishDeliveryInfoMessage/locales',
    'ShippingAutoReplenishDeliveryInfoMessage'
);

function ShippingAutoReplenishDeliveryInfoMessage() {
    return (
        <>
            <Flex
                lineHeight='tight'
                backgroundColor='nearWhite'
                marginY={3}
                paddingX={3}
                paddingY={2}
                borderRadius={2}
            >
                <Text
                    is='p'
                    flex={1}
                    alignSelf='center'
                    data-at={Sephora.debug.dataAt('warning_label')}
                >
                    {getText('shippingAutoReplenishMessage')}
                </Text>
            </Flex>
        </>
    );
}

export default wrapFunctionalComponent(ShippingAutoReplenishDeliveryInfoMessage, 'ShippingAutoReplenishDeliveryInfoMessage');
