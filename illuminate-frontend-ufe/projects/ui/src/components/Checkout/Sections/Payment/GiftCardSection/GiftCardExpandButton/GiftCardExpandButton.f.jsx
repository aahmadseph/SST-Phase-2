import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { colors } from 'style/config';
import { Grid, Image } from 'components/ui';
import Chevron from 'components/Chevron/Chevron';
import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('components/Checkout/Sections/Payment/GiftCardSection/locales', 'GiftCardSection');

const GiftCardExpandButton = React.forwardRef((props, ref) => {
    return (
        <Grid
            ref={ref}
            columns='auto 1fr auto'
            alignItems='center'
            gap={3}
            marginTop={[4, 5]}
            paddingX={4}
            paddingY={3}
            borderRadius={2}
            borderWidth={1}
            borderColor='midGray'
            css={{ ':hover': { borderColor: colors.black } }}
            {...props}
        >
            <Image
                src='/img/ufe/payments/giftCard.svg'
                display='block'
                size={32}
            />
            <strong children={getText('addGiftCard')} />
            <Chevron direction='down' />
        </Grid>
    );
});

export default wrapFunctionalComponent(GiftCardExpandButton, 'GiftCardExpandButton');
