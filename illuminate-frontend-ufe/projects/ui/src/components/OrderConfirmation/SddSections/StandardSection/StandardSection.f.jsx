import React from 'react';
import PropTypes from 'prop-types';
import {
    Box, Icon, Text, Divider
} from 'components/ui';
import {
    fontSizes, fontWeights, lineHeights, mediaQueries, space, borders, colors
} from 'style/config';
import ShippingGroups from 'components/OrderConfirmation/SddSections/StandardSection/ShippingGroups';
import { wrapFunctionalComponent } from 'utils/framework';

const StandardSection = ({
    deliveryInfo,
    multipleShippingGroups,
    orderDetailsLink,
    title,
    showTotals = true,
    shippingGroup,
    hasStandardItems,
    showSplitEDD
}) => (
    <>
        {showSplitEDD || <Divider css={hasStandardItems ? styles.blackDivider : styles.divider} />}
        {showSplitEDD || (
            <LegacyHeader
                title={title}
                multipleShippingGroups={multipleShippingGroups}
                deliveryInfo={deliveryInfo}
            />
        )}

        <ShippingGroups
            orderDetailsLink={orderDetailsLink}
            showTotals={showTotals}
            shippingGroup={shippingGroup}
            showSplitEDD={showSplitEDD}
        />
    </>
);

const LegacyHeader = ({ title, multipleShippingGroups, deliveryInfo }) => {
    return (
        <Box css={styles.header}>
            <Icon
                name='truck'
                css={styles.icon}
            />
            <Box>
                <Text
                    is='p'
                    css={styles.title}
                >
                    {title}
                </Text>
                {!multipleShippingGroups && (
                    <Text
                        is='p'
                        css={styles.deliveryInfo}
                    >
                        {deliveryInfo}
                    </Text>
                )}
            </Box>
        </Box>
    );
};

const styles = {
    header: {
        alignItems: 'center',
        display: 'flex'
    },
    icon: { marginRight: space[3] },
    title: {
        fontSize: fontSizes.base,
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.tight,
        [mediaQueries.md]: {
            fontSize: fontSizes.md,
            lineHeight: '20px'
        }
    },
    deliveryInfo: {
        fontSize: fontSizes.sm,
        lineHeight: '14px',
        marginTop: '1px',
        [mediaQueries.md]: { marginTop: '2px' }
    },
    divider: {
        border: borders[0],
        borderTop: `${borders[3]} ${colors.nearWhite}`,
        margin: `${space[4]}px -${space[4]}px`,
        [mediaQueries.md]: {
            border: `${borders[1]} ${colors.nearWhite}`,
            margin: `${space[5]}px 0`
        }
    },
    blackDivider: {
        border: borders[0],
        borderTop: `${borders[3]} ${colors.nearWhite}`,
        margin: `${space[4]}px -${space[4]}px`,
        [mediaQueries.md]: {
            border: `${borders[1]} ${colors.black}`,
            margin: `${space[5]}px 0`
        }
    }
};

StandardSection.defaultProps = {};
StandardSection.propTypes = {
    deliveryInfo: PropTypes.string.isRequired,
    multipleShippingGroups: PropTypes.bool.isRequired,
    orderDetailsLink: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};

export default wrapFunctionalComponent(StandardSection, 'StandardSection');
