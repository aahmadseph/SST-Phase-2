/* eslint-disable object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import BiUnavailable from 'components/Reward/BiUnavailable/BiUnavailable';

function NoPointsView({ isCarousel }) {
    return (
        <BiUnavailable
            borderRadius={2}
            {...(isCarousel && {
                padding: 5,
                iconWidth: 38
            })}
        />
    );
}

NoPointsView.defaultProps = {
    isCarousel: false
};
NoPointsView.propTypes = {
    isCarousel: PropTypes.bool
};

export default wrapFunctionalComponent(NoPointsView, 'NoPointsView');
