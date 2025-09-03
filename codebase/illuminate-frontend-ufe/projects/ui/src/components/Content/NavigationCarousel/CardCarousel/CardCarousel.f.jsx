import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import PageCard from 'components/Content/PageCard';
import Carousel from 'components/Carousel';
import { space } from 'style/config';

const CardCarousel = ({ navigation }) => {
    const { items } = navigation;

    return (
        <Carousel
            itemWidth={'240px'}
            paddingY={2}
            scrollPadding={[3, 'container']}
            marginX={[`-${space[1]}`, '-container']}
            hasShadowHack={true}
            gap={[2, 3]}
            items={items?.map(item => (
                <PageCard
                    key={item.label}
                    sid={item.label}
                    label={item.label}
                    description={item.description}
                    pageLayout={item.action?.page?.layout?.type || ''}
                    action={item.action}
                    media={item.media}
                />
            ))}
        />
    );
};

CardCarousel.propTypes = {
    navigation: PropTypes.object
};

export default wrapFunctionalComponent(CardCarousel, 'CardCarousel');
