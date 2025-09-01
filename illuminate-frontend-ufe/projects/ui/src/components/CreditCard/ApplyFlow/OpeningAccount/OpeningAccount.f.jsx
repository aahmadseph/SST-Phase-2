/* eslint-disable max-len */
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text } from 'components/ui';
import ApplyFlowSection from 'components/CreditCard/ApplyFlow/ApplyFlowSection/ApplyFlowSection';
import localeUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';

const OpeningAccount = props => {
    const getText = resourceWrapper(localeUtils.getLocaleResourceFile('components/CreditCard/ApplyFlow/OpeningAccount/locales', 'OpeningAccount'));
    const { isPrivateLabel } = props;

    return (
        <ApplyFlowSection title={getText('openingAccountTitle')}>
            <Text
                is='p'
                marginBottom='1em'
            >
                {getText('importantInfoText', true)}
            </Text>
            <Text
                is='p'
                marginBottom='1em'
            >
                {getText('caResidentsText', true)}
            </Text>
            <Text
                is='p'
                marginBottom='1em'
            >
                {getText('nyRiVtResidentsText', true)}
            </Text>
            <Text
                is='p'
                marginBottom='1em'
            >
                {getText('ohResidentsText', true)}
            </Text>
            <Text
                is='p'
                marginBottom='1em'
            >
                {getText('wiResidentsText', true)}
            </Text>
            {!isPrivateLabel && <Text is='p'>{getText('nyResidentsText', true)}</Text>}
        </ApplyFlowSection>
    );
};

export default wrapFunctionalComponent(OpeningAccount, 'OpeningAccount');
