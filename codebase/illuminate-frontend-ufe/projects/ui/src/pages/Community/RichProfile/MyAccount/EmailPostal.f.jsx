import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import MailingPrefs from 'components/RichProfile/MyAccount/MailingPrefs';
import ufeApi from 'services/api/ufeApi';

const EmailPostal = () => {
    return (
        <div>
            <MailingPrefs requestCounter={ufeApi.getCallsCounter()} />
        </div>
    );
};

export default wrapFunctionalComponent(EmailPostal, 'EmailPostal');
