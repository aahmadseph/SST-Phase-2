import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Image, Text } from 'components/ui';
import { fontSizes, colors } from 'style/config';

function PreviewScreen({ giftMessageData, toText, fromText }) {
    return (
        <Box
            marginTop={1}
            height={'auto'}
            paddingY={4}
        >
            <Text
                is='p'
                marginBottom={2}
                fontSize={fontSizes.lg}
            >
                {`${toText}: ${giftMessageData.recipientName}`}
            </Text>
            <Image
                disableLazyLoad={true}
                border={`1px solid ${colors.midGray}`}
                borderRadius={2}
                src={giftMessageData.imageUrl}
                width='100%'
                height='100%'
                alt={giftMessageData.altText}
            />
            <Text
                is='p'
                fontSize={fontSizes.base}
            >
                {giftMessageData.giftMessage}
            </Text>
            <Text
                is='p'
                marginTop={1}
                fontSize={fontSizes.md}
            >
                {`${fromText}: ${giftMessageData.yourName}`}
            </Text>
        </Box>
    );
}

export default wrapFunctionalComponent(PreviewScreen, 'PreviewScreen');
