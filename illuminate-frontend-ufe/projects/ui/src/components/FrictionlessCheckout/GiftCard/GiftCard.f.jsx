import AddGiftMessage from 'components/AddGiftMessage';
import { Box } from 'components/ui';
import { colors } from 'style/config';
import { wrapFunctionalComponent } from 'utils/framework';

function GiftCard({ orderId, giftMessagingStatus }) {
    return (
        <Box
            lineHeight='tight'
            boxShadow='light'
            borderRadius={2}
            marginTop={[4, 4, 5]}
        >
            <AddGiftMessage
                orderId={orderId}
                giftMessagingStatus={giftMessagingStatus}
                chevronColor={colors.inputGray}
                marginTop={[0, 0]}
                marginBottom={[0, 0]}
                paddingX={[4, 4, 5]}
                paddingY={[3, 3, 4]}
                chevronIsThicker={false}
                chevronMarginRight={[0, 0]}
            />
        </Box>
    );
}

export default wrapFunctionalComponent(GiftCard, 'GiftCard');
