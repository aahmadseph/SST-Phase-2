import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import TopContentLayout from 'components/RwdBasket/RwdBasketLayout/TopContentMessages/TopContentLayout';
import {
    radii, fontSizes, lineHeights, colors, space
} from 'style/config';
import { Text, Flex, Icon } from 'components/ui';
import EnhancedMarkdown from 'components/EnhancedMarkdown/EnhancedMarkdown';

const textStyle = {
    width: 'max-content',
    fontSize: fontSizes.base,
    lineHeight: lineHeights.base,
    color: 'black',
    paddingX: space[3],
    baseCss: {
        borderRadius: radii[2],
        verticalAlign: 'middle',
        textTransform: 'uppercase'
    }
};

function CustomerLimitBox({ error }) {
    const sedPromoErrors = error?.messages;

    if (!error || Object.keys(error).length === 0) {
        return null;
    }

    const errorMessages = sedPromoErrors?.map(message => (
        <Text
            display='inline-block'
            marginBottom={2}
            fontSize='base'
            css={textStyle}
        >
            <EnhancedMarkdown content={message} />
        </Text>
    ));

    return (
        <TopContentLayout backgroundColor={colors.nearWhite}>
            <Flex
                gap={2}
                alignItems='flex-start'
                backgroundColor={colors.nearWhite}
                color={colors.gray}
                borderRadius={2}
                lineHeight='tight'
            >
                <Icon
                    size={16}
                    name='alert'
                />
                {errorMessages}
            </Flex>
        </TopContentLayout>
    );
}

export default wrapFunctionalComponent(CustomerLimitBox, 'CustomerLimitBox');
