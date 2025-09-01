import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Text, Box, Icon, Grid, Flex
} from 'components/ui';
import InfoButton from 'components/InfoButton/InfoButton';
import isFunction from 'utils/functions/isFunction';
import { colors } from 'style/config';

function Header({
    title, iconName, iconColor, subHeader, cartType, infoOnClick
}) {
    return (
        <Grid
            columns={'auto'}
            borderBottom={`1px solid ${colors.lightGray}`}
            padding={[3, 4]}
            gap={0}
        >
            <Flex
                gap={3}
                alignItems={'center'}
            >
                <Icon
                    size={24}
                    name={iconName}
                    color={iconColor}
                    data-at={Sephora.debug.dataAt(`icon_${cartType}`)}
                />
                <Text
                    is='h2'
                    fontSize={['md', 'lg']}
                    display='inline-block'
                    fontWeight='bold'
                    data-at={Sephora.debug.dataAt(`bsk_${cartType}_items_label`)}
                >
                    {title}
                </Text>
                {isFunction(infoOnClick) && (
                    <InfoButton
                        size={16}
                        onClick={infoOnClick}
                    />
                )}
            </Flex>
            {subHeader}
        </Grid>
    );
}

function TextZoneContainer({ textZone }) {
    return textZone ? (
        <Box
            borderBottom={`1px solid ${colors.lightGray}`}
            padding={[3, 4]}
            css={{
                ':empty': { display: 'none' }
            }}
            data-at={Sephora.debug.dataAt('prebasket_shipping_message')}
        >
            {textZone}
        </Box>
    ) : null;
}

function ErrorContainer({ errors }) {
    if (!errors.isAvailable) {
        return null;
    }

    const { messages, ref } = errors;

    // Display only the first error so one shows at a time
    return (
        <Box
            borderBottom={`1px solid ${colors.lightGray}`}
            padding={[3, 4]}
            ref={ref}
        >
            {messages.map((error, index) => (
                <Box
                    key={`CartLayout_Error_${index}`}
                    paddingY={1}
                    color={colors.red}
                >
                    {error}
                </Box>
            ))}
        </Box>
    );
}

function CartSkuList({ items }) {
    return (
        <Flex
            flexDirection='column'
            css={{ '> :last-child': { borderBottom: 'none !important' } }}
        >
            {items}
        </Flex>
    );
}

function CartLayout({
    title,
    iconName,
    iconColor,
    errors,
    itemErrorMap,
    subHeader = null,
    textZone,
    skuItemComponents,
    cartType = '',
    confirmationBox,
    infoModalCallbacks,
    backgroundColor
}) {
    const showErrorIcon = errors.messages?.length > 0;

    return (
        <Box
            borderRadius={2}
            lineHeight='tight'
            boxShadow='light'
            backgroundColor={backgroundColor}
        >
            <Header
                title={title}
                iconName={showErrorIcon ? 'alert' : iconName}
                iconColor={showErrorIcon ? 'red' : iconColor}
                subHeader={subHeader}
                cartType={cartType}
                infoOnClick={infoModalCallbacks.cartHeader}
            />
            <ErrorContainer errors={errors} />
            <TextZoneContainer textZone={textZone} />
            {confirmationBox}
            <CartSkuList
                items={skuItemComponents}
                itemErrorMap={itemErrorMap}
            />
        </Box>
    );
}

export default wrapFunctionalComponent(CartLayout, 'CartLayout');
