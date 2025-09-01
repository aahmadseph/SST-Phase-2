import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import PropTypes from 'prop-types';

import { Image } from 'components/ui';

import UI from 'utils/UI';
import urlUtils from 'utils/Url';
import experienceDetailsUtils from 'utils/ExperienceDetails';

// Image comp props:
// display
// (width, height) or size
// css
// disableLazyLoad
// alt
// src

function HappeningImg({ src, ...props }) {
    const defaultSrc = experienceDetailsUtils.EXPERIENCE_DEFAULT_IMAGES[2];
    const imageSrc = src || defaultSrc;

    let isDefaultImage = false;

    const handleImageError = e => {
        isDefaultImage = true;

        e.target.onerror = null;
        e.target.src = urlUtils.getImagePath(defaultSrc);
        e.target.srcset = UI.getSrcSet(defaultSrc);

        // Remove the <source> tag from parent <picture>
        const pictureElement = e.target.parentElement;
        const sourceElement = pictureElement.querySelector('source');

        if (sourceElement) {
            pictureElement.removeChild(sourceElement);
        }
    };

    return (
        <Image
            {...props}
            src={imageSrc}
            onError={!isDefaultImage && handleImageError}
        />
    );
}

HappeningImg.defaultProps = {
    display: 'block',
    css: { objectFit: 'contain' },
    disableLazyLoad: true
};

HappeningImg.propTypes = {
    src: PropTypes.string.isRequired
};

export default wrapFunctionalComponent(HappeningImg, 'HappeningImg');
