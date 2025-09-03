import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Image, Grid } from 'components/ui';
import { fontWeights } from 'style/config';
import basketConstants from 'constants/Basket';
import basketUtils from 'utils/Basket';
import { getBiFreeShippingText } from 'utils/getBiFreeShippingText';

const LOGO_PROPS = {
    display: 'block',
    marginX: 'auto',
    height: 18
};

const BasketMsg = ({ basket, localization, ...props }) => {
    let heading;
    let message;
    let textHeading = false;

    // select only messages, not warnings or errors
    const messages =
        basket.basketLevelMessages &&
        basket.basketLevelMessages.filter(item => item.type === 'message' && !item.messageContext.includes('basket.promotion'));

    if (basketUtils.shouldDisplayBiFreeShippingText()) {
        message = getBiFreeShippingText();
    } else if (messages && messages.length) {
        const lastMessage = messages.pop();

        switch (lastMessage.messageLogo) {
            case 'freeShipLogo':
                textHeading = true;
                heading = lastMessage.messageContext === basketConstants.FREE_SHIPPING_THRESHOLD && (
                    <strong css={{ textTransform: 'uppercase' }}>{localization.freeShipping}&nbsp;</strong>
                );

                break;
            case 'vibBiLogo':
                heading = (
                    <Image
                        {...LOGO_PROPS}
                        src='/img/ufe/bi/logo-vib.svg'
                        alt='VIB'
                    />
                );

                break;
            case 'vibRougeLogo':
                heading = (
                    <Image
                        {...LOGO_PROPS}
                        src='/img/ufe/bi/logo-rouge.svg'
                        alt='Rouge'
                    />
                );

                break;
            default:
                heading = null;
        }

        message = (
            <span
                css={{
                    '& [data-ship]': {
                        textTransform: 'uppercase',
                        fontWeight: fontWeights.bold
                    }
                }}
                dangerouslySetInnerHTML={{ __html: lastMessage.messages[0] }}
            />
        );
    }

    const ContentWrap = textHeading ? 'span' : React.Fragment;

    return heading || message ? (
        <Grid
            alignItems='center'
            gap={2}
            textAlign={textHeading || 'center'}
            {...props}
        >
            <ContentWrap>
                {heading}
                {message}
            </ContentWrap>
        </Grid>
    ) : null;
};

BasketMsg.propTypes = {
    basket: PropTypes.object.isRequired,
    localization: PropTypes.object.isRequired
};

export default wrapFunctionalComponent(BasketMsg, 'BasketMsg');
