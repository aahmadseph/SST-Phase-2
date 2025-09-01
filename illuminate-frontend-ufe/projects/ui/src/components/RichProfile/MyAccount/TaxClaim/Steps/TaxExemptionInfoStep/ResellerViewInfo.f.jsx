import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Text } from 'components/ui';

const ResellerViewInfo = ({
    step4VariationData, taxClaimGetText, styles, defaultFirstName, defaultLastName
}) => {
    const {
        address1, address2, city, state, postalCode
    } = step4VariationData.r;

    const ccIssuedText = step4VariationData.r.creditCardIssued === true ? 'Yes' : 'No';

    return (
        <>
            <Box css={styles.flexContainer}>
                <Text css={styles.viewLabel}>{taxClaimGetText('businessPositionLabel')}:</Text>
                <Text css={styles.viewLabelData}>{step4VariationData.r.organizationPosition}</Text>
            </Box>
            <Box css={styles.flexContainer}>
                <Text css={styles.viewLabel}>{taxClaimGetText('businessNameLabel')}:</Text>
                <Text css={styles.viewLabelData}>{step4VariationData.r.organizationName}</Text>
            </Box>
            <Box css={styles.flexContainer}>
                <Text css={styles.viewLabel}>{taxClaimGetText('businessTypeLabel')}:</Text>
                <Text css={styles.viewLabelData}>{step4VariationData.r.organizationType}</Text>
            </Box>
            <Box css={styles.flexContainer}>
                <Text css={styles.viewLabel}>{taxClaimGetText('businessUrlLabel')}:</Text>
                <Text css={styles.viewLabelData}>{step4VariationData.r.organizationUrl}</Text>
            </Box>
            <Box css={styles.flexContainer}>
                <Text css={styles.viewLabel}>{taxClaimGetText('stateSalesTaxPermitNumberLabel')}:</Text>
                <Text css={styles.viewLabelData}>{step4VariationData.r.stateIssuedTaxExemptNumber}</Text>
            </Box>
            <Box css={styles.flexContainer}>
                <Text css={styles.viewLabel}>{taxClaimGetText('viewOrganizationPhoneNumberLabel')}:</Text>
                <Text css={styles.viewLabelData}>{step4VariationData.r.phoneNumber}</Text>
            </Box>
            <Box css={styles.flexContainer}>
                <Text css={styles.viewLabel}>{taxClaimGetText('viewHeadquarterAddressLabel')}:</Text>
                <Text css={styles.viewLabelData}>
                    {address1} {address2} {city}, {state}, {postalCode}
                </Text>
            </Box>
            <Box css={styles.flexContainer}>
                <Text css={styles.viewLabel}>{taxClaimGetText('viewNameOnCreditCardLabel')}:</Text>
                <Text css={styles.viewLabelData}>
                    {step4VariationData.r.firstName || defaultFirstName} {step4VariationData.r.lastName || defaultLastName}
                </Text>
            </Box>
            <Box css={styles.flexContainer}>
                <Text css={styles.viewLabel}>{taxClaimGetText('viewCreditCardIssuedLabel')}:</Text>
                <Text css={styles.viewLabelData}>{ccIssuedText}</Text>
            </Box>
        </>
    );
};

export default wrapFunctionalComponent(ResellerViewInfo, 'NPRCOViewInfo');
