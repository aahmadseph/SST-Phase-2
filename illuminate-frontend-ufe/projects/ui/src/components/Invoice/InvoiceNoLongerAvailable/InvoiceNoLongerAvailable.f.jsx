import React from 'react';
import { Button, Box, Text } from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import UrlUtils from 'utils/Url';

function InvoiceNoLongerAvailable() {
    const getText = localeUtils.getLocaleResourceFile('components/Invoice/InvoiceNoLongerAvailable/locales', 'InvoiceNoLongerAvailable');

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
                {getText('invoiceNoLongerAvailable')}
            </Text>
            <p>{getText('contactInfo')}</p>
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
                    {getText('homePage')}
                </Button>
            </Box>
        </Box>
    );
}

InvoiceNoLongerAvailable.defaultProps = {};

InvoiceNoLongerAvailable.propTypes = {};

export default wrapFunctionalComponent(InvoiceNoLongerAvailable, 'InvoiceNoLongerAvailable');
