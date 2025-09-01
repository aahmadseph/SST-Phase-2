import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text } from 'components/ui';
import ApplyFlowSection from 'components/CreditCard/ApplyFlow/ApplyFlowSection/ApplyFlowSection';
import localeUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';

const ContentInformationRules = props => {
    const getText = resourceWrapper(
        localeUtils.getLocaleResourceFile('components/CreditCard/ApplyFlow/ContentInformationRules/locales', 'ContentInformationRules')
    );
    const { isPreApproved, isPrivateLabel } = props;

    const statusPrefix = !isPreApproved ? 'nonPreapproved' : isPrivateLabel ? 'privateLabel' : 'coBranded';

    return (
        <ApplyFlowSection title={getText('contentInfoAndRulesTitle')}>
            <Text is='p'>{getText(statusPrefix + 'Issuer', true)}</Text>
            {statusPrefix === 'nonPreapproved' && <Text is='p'>{getText(statusPrefix + 'Review', true)}</Text>}
            <Text
                marginBottom='1em'
                is='p'
            >
                {getText(statusPrefix + 'Conditional', true)}
            </Text>
        </ApplyFlowSection>
    );
};

export default wrapFunctionalComponent(ContentInformationRules, 'ContentInformationRules');
