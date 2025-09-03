import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Text } from 'components/ui';

const NPRCOViewInfo = ({
    step4VariationData, taxClaimGetText, styles, defaultFirstName, defaultLastName
}) => {
    const {
        address1, address2, city, state, postalCode
    } = step4VariationData.nprco;
    const ccIssuedText = step4VariationData.nprco.creditCardIssued === true ? 'Yes' : 'No';

    return (
        <>
            <Box css={styles.flexContainer}>
                <Text css={styles.viewLabel}>{taxClaimGetText('viewPositionLabel')}:</Text>
                <Text css={styles.viewLabelData}>{step4VariationData.nprco.organizationPosition}</Text>
            </Box>
            <Box css={styles.flexContainer}>
                <Text css={styles.viewLabel}>{taxClaimGetText('viewOrganizationNameLabel')}:</Text>
                <Text css={styles.viewLabelData}>{step4VariationData.nprco.organizationName}</Text>
            </Box>
            <Box css={styles.flexContainer}>
                <Text css={styles.viewLabel}>{taxClaimGetText('viewOrganizationUrlLabel')}:</Text>
                <Text css={styles.viewLabelData}>{step4VariationData.nprco.organizationUrl}</Text>
            </Box>
            <Box css={styles.flexContainer}>
                <Text css={styles.viewLabel}>{taxClaimGetText('viewStateIssuedTaxExemptNumberLabel')}:</Text>
                <Text css={styles.viewLabelData}>{step4VariationData.nprco.stateIssuedTaxExemptNumber}</Text>
            </Box>
            <Box css={styles.flexContainer}>
                <Text css={styles.viewLabel}>{taxClaimGetText('viewOrganizationPhoneNumberLabel')}:</Text>
                <Text css={styles.viewLabelData}>{step4VariationData.nprco.phoneNumber}</Text>
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
                    {step4VariationData.nprco.firstName || defaultFirstName} {step4VariationData.nprco.lastName || defaultLastName}
                </Text>
            </Box>
            <Box css={styles.flexContainer}>
                <Text css={styles.viewLabel}>{taxClaimGetText('viewCreditCardIssuedLabel')}:</Text>
                <Text css={styles.viewLabelData}>{ccIssuedText}</Text>
            </Box>
        </>
    );
};

export default wrapFunctionalComponent(NPRCOViewInfo, 'NPRCOViewInfo');
