import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Image } from 'components/ui';
import UI from 'utils/UI';
import UrlUtils from 'utils/Url';
import ExperienceDetailsUtils from 'utils/ExperienceDetails';

const ExperienceImage = initProps => {
    const { activity, defaultSrc = ExperienceDetailsUtils.EXPERIENCE_DEFAULT_IMAGES[2], ...props } = initProps;

    const imageSrc =
        props.src ||
        (activity.images && Object.keys(activity.images).length > 0 && activity.images.baseImage ? activity.images.baseImage : defaultSrc);

    let isDefaultImage = false;
    const replaceWithDefaultImage = e => {
        isDefaultImage = true;
        e.target.src = UrlUtils.getImagePath(defaultSrc);
        e.target.srcset = UI.getSrcSet(defaultSrc);
    };

    return (
        <Image
            css={{
                position: 'absolute',
                top: 0,
                left: 0
            }}
            size='100%'
            onError={e => !isDefaultImage && replaceWithDefaultImage(e)}
            src={imageSrc}
            isPageRenderImg={true}
            srcSet={UI.getSrcSet(imageSrc)}
            {...props}
        />
    );
};

export default wrapFunctionalComponent(ExperienceImage, 'ExperienceImage');
