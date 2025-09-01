import { fontWeights, lineHeights, space } from 'style/config';
import { Text } from 'components/ui';
import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';

const DeliveryInfo = ({ deliveryOnDate, deliveryOnText }) => (
    <>
        <Text
            is='p'
            css={styles.deliveryOnText}
        >
            {deliveryOnText}
        </Text>
        <Text
            is='p'
            css={styles.deliveryOnDate}
        >
            {deliveryOnDate}
        </Text>
    </>
);

const styles = {
    deliveryOnText: {
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.tight,
        marginTop: space[4]
    },
    deliveryOnDate: { lineHeight: lineHeights.tight }
};

DeliveryInfo.defaultProps = {};
DeliveryInfo.propTypes = {
    deliveryOnDate: PropTypes.string.isRequired,
    deliveryOnText: PropTypes.string.isRequired
};

export default wrapFunctionalComponent(DeliveryInfo, 'DeliveryInfo');
