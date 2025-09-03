import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text, Icon } from 'components/ui';
import {
    colors, space, radii, fontWeights
} from 'style/config';
import { wrapFunctionalComponent } from 'utils/framework';
import uiUtils from 'utils/UI';
const { SKELETON_TEXT } = uiUtils;

const VARIATION_TYPE_NONE = 'None';

function PreviouslyPurchased(props) {
    const {
        locales, frequency, lastPurchase, variationTypeDisplayName, variationValue, variationDesc, showSkeleton
    } = props;

    if (!frequency) {
        return null;
    }

    return (
        <Box style={styles.previouslyPurchasedContainer}>
            <Icon
                name={!showSkeleton && 'buyItAgain'}
                css={showSkeleton && { ...SKELETON_TEXT, ...styles.iconSkeleton }}
                style={styles.buyItAgainIcon}
            />
            <Box flex='1 1 auto'>
                <Text
                    is='p'
                    fontWeight={fontWeights.bold}
                    css={showSkeleton && SKELETON_TEXT}
                    {...(showSkeleton && { marginBottom: '2px' })}
                >
                    {locales.purchased} {frequency} {frequency === 1 ? locales.time : locales.times}
                </Text>
                <Text
                    is='p'
                    css={showSkeleton && SKELETON_TEXT}
                >
                    <Text
                        is='span'
                        fontWeight={fontWeights.bold}
                    >
                        {locales.lastPurchase}
                    </Text>
                    {` ${lastPurchase}`}
                    {variationTypeDisplayName && variationTypeDisplayName !== VARIATION_TYPE_NONE && (
                        <>
                            {' | '}
                            <Text
                                is='span'
                                fontWeight={fontWeights.bold}
                            >
                                {`${variationTypeDisplayName}: `}
                            </Text>
                            {`${variationValue}`}
                            {variationDesc && ` - ${variationDesc}`}
                        </>
                    )}
                </Text>
            </Box>
        </Box>
    );
}

const styles = {
    previouslyPurchasedContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: '6px',
        backgroundColor: colors.nearWhite,
        padding: space[3],
        borderRadius: radii[2],
        marginTop: space[4],
        marginBottom: space[4]
    },
    buyItAgainIcon: {
        fontSize: 24,
        marginTop: '2px',
        ariaHidden: true,
        viewBox: '0 0 20 20',
        marginLeft: space[1]
    },
    iconSkeleton: {
        background: `${colors.lightGray}`,
        borderRadius: radii.full
    }
};

PreviouslyPurchased.propTypes = {
    locales: PropTypes.shape({
        purchasedXTimes: PropTypes.string
    }),
    frequency: PropTypes.number,
    lastPurchase: PropTypes.string,
    variationTypeDisplayName: PropTypes.string,
    variationValue: PropTypes.string,
    variationDesc: PropTypes.string,
    showSkeleton: PropTypes.bool
};

PreviouslyPurchased.defaultProps = {
    locales: {},
    frequency: 0,
    lastPurchase: '1 Jan, 2025',
    variationTypeDisplayName: '',
    variationValue: '',
    variationDesc: '',
    showSkeleton: false
};

export default wrapFunctionalComponent(PreviouslyPurchased, 'PreviouslyPurchased');
