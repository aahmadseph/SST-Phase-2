/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';

import InvoiceComponent from 'components/Invoice';

class Invoice extends BaseClass {
    render() {
        return (
            <div>
                <InvoiceComponent />
            </div>
        );
    }
}

export default wrapComponent(Invoice, 'Invoice', true);
