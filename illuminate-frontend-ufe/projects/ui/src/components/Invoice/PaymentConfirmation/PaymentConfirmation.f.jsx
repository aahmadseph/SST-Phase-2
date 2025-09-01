import React from 'react';
import { Button, Box, Text } from 'components/ui';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import UrlUtils from 'utils/Url';

function PaymentConfirmation({ invoiceId }) {
    const getText = localeUtils.getLocaleResourceFile('components/Invoice/PaymentConfirmation/locales', 'PaymentConfirmation');

    return (
        <Box
            paddingX={[4, 9]}
            paddingTop={[6, 7]}
        >
            <Text
                fontSize='xl'
                fontWeight='bold'
                is={'p'}
            >
                {getText('paymentConfirmationTitle')}
            </Text>
            <p>{getText('confirmationEmail')}</p>
            <p>
                <strong children={getText('invoiceNumber')} />
                <Text>{invoiceId}</Text>
            </p>
            <Box
                marginTop={5}
                maxWidth={250}
            >
                <Button
                    type='submit'
                    variant='primary'
                    block={true}
                    onClick={() => UrlUtils.redirectTo('/')}
                >
                    {getText('continueShopping')}
                </Button>
            </Box>
        </Box>
    );
}

PaymentConfirmation.defaultProps = {};

PaymentConfirmation.propTypes = {
    invoiceId: PropTypes.string
};

export default wrapFunctionalComponent(PaymentConfirmation, 'PaymentConfirmation');
