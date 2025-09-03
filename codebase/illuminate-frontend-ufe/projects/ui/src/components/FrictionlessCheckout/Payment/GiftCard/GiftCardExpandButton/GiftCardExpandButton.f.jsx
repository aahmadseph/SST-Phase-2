import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { colors } from 'style/config';
import { Flex, Image, Text } from 'components/ui';
import Chevron from 'components/Chevron/Chevron';

const GiftCardExpandButton = React.forwardRef((props, ref) => {
    return (
        <Flex
            ref={ref}
            alignItems='center'
            justifyContent={['space-between', !props.isEditMode ? 'left' : 'space-between']}
            gap={['6px', '6px', 4]}
            {...(!props.isEditMode
                ? {
                    paddingX: [4, 5],
                    paddingTop: 4
                }
                : {
                    paddingX: 3,
                    paddingY: 4
                })}
            borderColor='midGray'
            css={[styles.giftCardBox, props.isEditMode && styles.withBorder]}
            width={['100%', !props.isEditMode ? 'auto' : '100%']}
            onClick={props.onClick}
        >
            <Flex
                gap={2}
                alignItems='center'
            >
                <Image
                    src='/img/ufe/payments/giftCard.svg'
                    display='block'
                    height={props.isEditMode ? 20 : 16}
                    {...(!props.isEditMode && { border: 1 })}
                    borderRadius='2px'
                />
                <Text
                    children={props.useGiftCard}
                    fontWeight='bold'
                />
            </Flex>
            <Chevron
                direction={!props.isEditMode ? 'right' : 'down'}
                color='#888888'
                css={styles.chevron}
            />
        </Flex>
    );
});

const styles = {
    giftCardBox: {
        ':hover': { borderColor: colors.black }
    },
    chevron: {
        width: '16px',
        height: '16px'
    },
    withBorder: {
        border: '1px solid',
        borderRadius: 2,
        borderColor: colors.midGray
    }
};

export default wrapFunctionalComponent(GiftCardExpandButton, 'GiftCardExpandButton');
