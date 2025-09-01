import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box } from 'components/ui';

const OverlayImage = ({ image, overlayImage, overlayPosition }) => (
    <Box position='relative'>
        {image}
        {overlayImage && (
            <Box
                position='absolute'
                {...overlayPosition}
            >
                {overlayImage}
            </Box>
        )}
    </Box>
);

OverlayImage.propTypes = {
    image: PropTypes.node.isRequired,
    overlayImage: PropTypes.node,
    overlayPosition: PropTypes.shape({
        top: PropTypes.number,
        bottom: PropTypes.number,
        left: PropTypes.number,
        right: PropTypes.number
    })
};

OverlayImage.defaultProps = {
    overlayPosition: {
        right: 0,
        top: 0
    }
};

export default wrapFunctionalComponent(OverlayImage, 'OverlayImage');
