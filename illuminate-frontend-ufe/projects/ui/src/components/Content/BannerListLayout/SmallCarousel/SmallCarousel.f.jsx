import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import Carousel from 'components/Carousel';
import { space, mediaQueries } from 'style/config';
import { Box } from 'components/ui';
import constants from 'constants/content';

const { CONTEXTS, COMPONENT_SPACING } = constants;

const GAPS = {
    SMALL: 'small',
    LARGE: 'large'
};

const SmallCarousel = React.forwardRef((props, ref) => {
    const {
        sid, context, marginBottom, marginTop, banners, width, gap, largeWidth, onImpression, customCardSize, personalization = {}
    } = props;
    const itemWidth = width && largeWidth ? [width, largeWidth] : width;
    const isContained = context === CONTEXTS.CONTAINER;

    return (
        <Box
            id={sid}
            marginTop={marginTop}
            marginBottom={marginBottom}
            css={isContained && styles.contained}
            ref={ref}
        >
            <Carousel
                id={sid}
                isLoading={banners === null}
                shouldCenterItems={true}
                marginX='-container'
                scrollPadding={[2, 'container']}
                itemWidth={itemWidth}
                gap={[2, gap === GAPS.SMALL ? null : 5]}
                items={banners}
                dotsShown={banners.length}
                hasShadowHack={true}
                customCardSize={customCardSize}
                onImpression={onImpression}
                personalization={personalization}
                dotsStyle={{
                    top: space[2],
                    left: width,
                    transform: `translateX(calc(-100% - ${space[2]}px))`,
                    [mediaQueries.sm]: {
                        display: 'none'
                    }
                }}
            />
        </Box>
    );
});

const styles = {
    contained: {
        position: 'relative',
        width: '100%',
        padding: 0,
        paddingLeft: '-15px'
    }
};

SmallCarousel.propTypes = {
    context: PropTypes.oneOf([CONTEXTS.CONTAINER, CONTEXTS.MODAL]).isRequired,
    sid: PropTypes.string,
    gap: PropTypes.oneOf([GAPS.SMALL, GAPS.LARGE]),
    banners: PropTypes.array,
    width: PropTypes.number.isRequired,
    largeWidth: PropTypes.number,
    marginTop: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    marginBottom: PropTypes.oneOfType([PropTypes.array, PropTypes.number])
};

SmallCarousel.defaultProps = {
    sid: null,
    gap: GAPS.SMALL,
    banners: null,
    largeWidth: null,
    marginTop: COMPONENT_SPACING.SM,
    marginBottom: COMPONENT_SPACING.SM
};

export default wrapFunctionalComponent(SmallCarousel, 'SmallCarousel');
