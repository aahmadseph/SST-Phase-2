import React from 'react';
import { Box, Text, Icon } from 'components/ui';
import { colors, fontSizes } from 'style/config';

const TaxClaimErrorBanner = ({ message, sticky }) => (
    <Box css={sticky ? styles.stickyBanner : styles.banner}>
        <Text css={styles.message}>
            <Icon
                css={styles.alert}
                name={'alert'}
                size={40}
            />
            {message}
        </Text>
    </Box>
);

const styles = {
    banner: {
        backgroundColor: colors.lightRed,
        width: '100%',
        minHeight: '42px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderRadius: '4px'
    },
    message: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        color: colors.red,
        fontSize: fontSizes.base
    },
    alert: {
        color: colors.red,
        height: '14px',
        marginRight: '18px'
    },
    stickyBanner: {
        backgroundColor: colors.lightRed,
        width: '100%',
        minHeight: '42px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderRadius: '4px',
        position: 'sticky',
        top: '24px',
        marginTop: '24px'
    }
};

export default TaxClaimErrorBanner;
