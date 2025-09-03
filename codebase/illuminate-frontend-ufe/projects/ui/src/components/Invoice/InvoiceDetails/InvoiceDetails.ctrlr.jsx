import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import { Grid, Text } from 'components/ui';
import PropTypes from 'prop-types';
import localeUtils from 'utils/LanguageLocale';

class InvoiceDetails extends BaseClass {
    constructor(props) {
        super(props);
    }

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Invoice/InvoiceDetails/locales', 'InvoiceDetails');
        const {
            firstName = '', lastName = '', invoiceAmountDisplay = '', invoiceId = null, invoiceDate = ''
        } = this.props.invoiceDetails;
        const name = `${firstName} ${lastName}`;

        return (
            <Grid
                rowGap={[3, null, 4]}
                columnGap={4}
                gridTemplateColumns='[label] 8em [value] 1fr'
                css={{
                    '& > :nth-child(odd)': { gridColumn: 'label' },
                    '& > :nth-child(even)': { gridColumn: 'value' }
                }}
            >
                <strong children={getText('invoiceTo')} />
                <Text is={'p'}>{name}</Text>
                <strong children={getText('invoiceNumber')} />
                <Text>{invoiceId}</Text>
                <strong children={getText('invoiceDate')} />
                <Text>{invoiceDate}</Text>
                <strong children={getText('invoiceAmount')} />
                <Text>{invoiceAmountDisplay}</Text>
            </Grid>
        );
    }
}

InvoiceDetails.propTypes = {
    invoiceDetails: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        invoiceAmountDisplay: PropTypes.string,
        invoiceId: PropTypes.string
    })
};

export default wrapComponent(InvoiceDetails, 'InvoiceDetails');
