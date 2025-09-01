import React from 'react';
import PropTypes from 'prop-types';
import FrameworkUtils from 'utils/framework';
import { Text } from 'components/ui';
import { colors } from 'style/config';

const { wrapFunctionalComponent } = FrameworkUtils;

const Badge = ({ badge, color }) => (
    <Text
        children={badge}
        is='span'
        backgroundColor={color || colors.red}
        color={colors.white}
        fontWeight='bold'
        fontSize={10}
        lineHeight='14px'
        paddingY={0.5}
        paddingX='6px'
        style={{ borderRadius: '4px' }}
    />
);

Badge.propTypes = {
    badge: PropTypes.string.isRequired,
    color: PropTypes.string
};

export default wrapFunctionalComponent(Badge, 'Badge');
