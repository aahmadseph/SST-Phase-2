/* eslint-disable object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Image } from 'components/ui';

const HeadImage = ({ isModal, src }) => (
    <Image
        marginX='auto'
        display='block'
        width={isModal ? 40 : 32}
        height={isModal ? 40 : 32}
        src={src}
        data-at={Sephora.debug.dataAt('apply_points_icon')}
    />
);

HeadImage.defaultProps = {
    isModal: false,
    src: '/img/ufe/icons/points.svg'
};
HeadImage.propTypes = {
    isModal: PropTypes.bool,
    src: PropTypes.string
};

export default wrapFunctionalComponent(HeadImage, 'HeadImage');
