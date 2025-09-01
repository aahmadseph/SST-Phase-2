import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Flex, Image } from 'components/ui';

function GuestCheckoutMessagingItem(props) {
    const { iconUrl, text } = props;

    return (
        <Flex
            flexDirection='column'
            alignItems='center'
        >
            <Image
                src={iconUrl}
                size={36}
            />
            <Text
                marginTop={2}
                marginBottom={4}
                is='p'
                textAlign='center'
            >
                {text}
            </Text>
        </Flex>
    );
}

export default wrapFunctionalComponent(GuestCheckoutMessagingItem, 'GuestCheckoutMessagingItem');
