/* eslint-disable max-len */
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Text, Link } from 'components/ui';
import ApplyFlowSection from 'components/CreditCard/ApplyFlow/ApplyFlowSection/ApplyFlowSection';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import { LINKS, SEPHORA_CARD_LABELS } from 'constants/CreditCard';
import localeUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';

const ElectronicConsent = props => {
    const getText = resourceWrapper(
        localeUtils.getLocaleResourceFile('components/CreditCard/ApplyFlow/ElectronicConsent/locales', 'ElectronicConsent')
    );
    const { updateConsentStatus, isPreApproved, isPrivateLabel, checked } = props;

    const cardType = isPrivateLabel ? SEPHORA_CARD_LABELS.PRIVATE_LABEL : SEPHORA_CARD_LABELS.CO_BRANDED;
    const env = Sephora.UFE_ENV === 'PROD' ? 'PROD' : 'QA';

    const printCopyLink = LINKS.PRINT_COPY[cardType][env];
    const accountTermsSrc = LINKS.ACCOUNT_TERMS[cardType][env];
    const financialTermsSrc = LINKS.FINANCIAL_TERMS[cardType][env];

    const bySigningCopy =
        !isPreApproved && cardType === SEPHORA_CARD_LABELS.CO_BRANDED
            ? getText('electronicConsentText')
            : getText('electronicConsentTextWithCardType', false, 'Visa');

    return (
        <ApplyFlowSection title={getText('sectionTitle')}>
            <Text
                is='p'
                marginBottom='1em'
            >
                {getText(
                    'mustReadText',
                    false,
                    <Link
                        color='blue'
                        underline={true}
                        href={printCopyLink}
                    >
                        {getText('printCopy')}
                    </Link>
                )}
            </Text>
            <Text
                is='p'
                marginBottom='1em'
                children={bySigningCopy}
            />
            <Text
                is='h3'
                fontSize='lg'
                fontWeight='bold'
                marginTop={5}
                marginBottom={4}
                lineHeight='tight'
            >
                {getText('consetToAccountTermsAndConditions')}
            </Text>
            <Box
                paddingX={2}
                borderColor='midGray'
                height={246}
                border={1}
                borderRadius={2}
                overflow='auto'
            >
                <Box
                    is='iframe'
                    src={accountTermsSrc}
                    width='100%'
                    height='100%'
                />
            </Box>
            <Text
                is='p'
                marginTop='1em'
                marginBottom='1em'
            >
                {getText('openDisclosureIn')}{' '}
                <Link
                    color='blue'
                    underline={true}
                    target='_blank'
                    href={accountTermsSrc}
                >
                    {getText('newTab')}
                </Link>
            </Text>
            <Text
                is='h3'
                fontSize='lg'
                fontWeight='bold'
                marginTop={5}
                marginBottom={4}
                lineHeight='tight'
            >
                {getText('consentToFinancialTermsOfTheAccount')}
            </Text>
            <Box
                paddingX={2}
                borderColor='midGray'
                height={246}
                border={1}
                borderRadius={2}
                overflow='auto'
            >
                <Box
                    is='iframe'
                    src={financialTermsSrc}
                    width='100%'
                    height='100%'
                />
            </Box>
            <Text
                is='p'
                marginTop='1em'
                marginBottom='1em'
            >
                {getText('openDisclosureIn')}{' '}
                <Link
                    color='blue'
                    underline={true}
                    target='_blank'
                    href={financialTermsSrc}
                >
                    {getText('newTab')}
                </Link>
                .
            </Text>
            <Box marginTop={5}>
                <Checkbox
                    checked={checked}
                    onClick={updateConsentStatus}
                    name='consentCheckbox'
                    html={getText('checkboxCopyText')}
                />
            </Box>
        </ApplyFlowSection>
    );
};

export default wrapFunctionalComponent(ElectronicConsent, 'ElectronicConsent');
