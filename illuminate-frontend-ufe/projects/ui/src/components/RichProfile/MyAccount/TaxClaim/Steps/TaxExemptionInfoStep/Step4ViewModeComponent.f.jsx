import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Text } from 'components/ui';

const Step4ViewModeComponent = ({ label, value, styles }) => (
    <Box>
        <div css={styles.flexContainer}>
            <Text css={styles.viewLabel}>{label}:</Text>
            <Text css={styles.viewLabelData}>{value}</Text>
        </div>
    </Box>
);

export default wrapFunctionalComponent(Step4ViewModeComponent, 'Step4ViewModeComponent');
