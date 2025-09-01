import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box } from 'components/ui';
import AddGiftMessage from 'components/AddGiftMessage';
import { colors } from 'style/config';

function AddGiftMessageBanner({ giftMessagingStatus, orderId, showBasketGreyBackground, backgroundColor }) {
    return (
        <Box
            lineHeight='tight'
            boxShadow='light'
            borderRadius={2}
            marginBottom={[2, 0]}
            paddingLeft={[0, 2]}
            {...(showBasketGreyBackground && { backgroundColor: backgroundColor })}
        >
            <AddGiftMessage
                giftMessagingStatus={giftMessagingStatus}
                orderId={orderId}
                marginTop={[0, 0]}
                marginBottom={[0, 0]}
                padding={[3, 4]}
                chevronColor={colors.gray}
                chevronIsThicker={false}
                chevronMarginRight={[0, 0]}
            />
        </Box>
    );
}

export default wrapFunctionalComponent(AddGiftMessageBanner, 'AddGiftMessageBanner');
