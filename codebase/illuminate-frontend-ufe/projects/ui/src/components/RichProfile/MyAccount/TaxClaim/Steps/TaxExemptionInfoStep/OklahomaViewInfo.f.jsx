import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Text } from 'components/ui';

const OklahomaVeteranInfo = ({ step4VariationData, taxClaimGetText, styles }) => {
    return (
        <>
            <Box>
                <div css={styles.flexContainer}>
                    <Text css={styles.viewLabel}>{taxClaimGetText('effectiveDateLabel')}:</Text>
                    <Text css={styles.viewLabelData}>{step4VariationData.dvifo.veteranEffectiveDate}</Text>
                </div>
            </Box>
            <Box>
                <div css={styles.flexContainer}>
                    <Text css={styles.viewLabel}>{taxClaimGetText('exemptionNumberLabel')}:</Text>
                    <Text css={styles.viewLabelData}>{step4VariationData.dvifo.veteranExemptionNumber}</Text>
                </div>
            </Box>
            <Box>
                <div css={styles.flexContainer}>
                    <Text css={styles.viewLabel}>{taxClaimGetText('streetAddress')}:</Text>
                    <Text css={styles.viewLabelData}>{step4VariationData.dvifo.address1}</Text>
                </div>
            </Box>
            <Box>
                <div css={styles.flexContainer}>
                    <Text css={styles.viewLabel}>{taxClaimGetText('address2Label') ?? taxClaimGetText('none')}:</Text>
                    <Text css={styles.viewLabelData}>{step4VariationData.dvifo.address2}</Text>
                </div>
            </Box>
            <Box>
                <div css={styles.flexContainer}>
                    <Text css={styles.viewLabel}>{taxClaimGetText('city')}:</Text>
                    <Text css={styles.viewLabelData}>{step4VariationData.dvifo.city}</Text>
                </div>
            </Box>
            <Box>
                <div css={styles.flexContainer}>
                    <Text css={styles.viewLabel}>{taxClaimGetText('zipCode')}:</Text>
                    <Text css={styles.viewLabelData}>{step4VariationData.dvifo.postalCode}</Text>
                </div>
            </Box>
            <Box>
                <div css={styles.flexContainer}>
                    <Text css={styles.viewLabel}>{taxClaimGetText('state')}:</Text>
                    <Text css={styles.viewLabelData}>{step4VariationData.dvifo.state}</Text>
                </div>
            </Box>
        </>
    );
};

export default wrapFunctionalComponent(OklahomaVeteranInfo, 'OklahomaVeteranInfo');
