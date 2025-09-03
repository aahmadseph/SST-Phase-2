import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import Carousel from 'components/Carousel';
import { modal, space, mediaQueries } from 'style/config';
import { Box } from 'components/ui';
import constants from 'constants/content';

const { CONTEXTS, COMPONENT_SPACING } = constants;

const GAPS = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large'
};

function getGap(gap) {
    switch (gap) {
        case GAPS.MEDIUM:
            return 3;
        case GAPS.LARGE:
            return 5;
        default:
            return null;
    }
}

const LargeCarousel = React.forwardRef((props, ref) => {
    const {
        sid, context, marginBottom, marginTop, banners, width, largeWidth, gap, shadowPadding, onImpression, personalization = {}
    } = props;
    const isContained = context === CONTEXTS.CONTAINER;
    const isModal = context === CONTEXTS.MODAL;
    const itemWidth = width && largeWidth ? [width, largeWidth] : width;

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
                marginX={isModal && modal.outdentX}
                scrollPadding={[2, isModal ? modal.paddingX[1] : 'container']}
                itemWidth={itemWidth}
                gap={[2, getGap(gap)]}
                paddingY={shadowPadding && 2}
                items={banners}
                dotsShown={banners.length}
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
        width: '100vw',
        left: '50%',
        marginLeft: '-50vw'
    }
};

LargeCarousel.propTypes = {
    context: PropTypes.oneOf([CONTEXTS.CONTAINER, CONTEXTS.MODAL]).isRequired,
    sid: PropTypes.string,
    gap: PropTypes.oneOf([GAPS.SMALL, GAPS.LARGE]),
    banners: PropTypes.array,
    width: PropTypes.number.isRequired,
    largeWidth: PropTypes.number,
    marginTop: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    marginBottom: PropTypes.oneOfType([PropTypes.array, PropTypes.number])
};

LargeCarousel.defaultProps = {
    sid: null,
    gap: GAPS.SMALL,
    banners: null,
    largeWidth: null,
    marginTop: COMPONENT_SPACING.SM,
    marginBottom: COMPONENT_SPACING.SM
};

export default wrapFunctionalComponent(LargeCarousel, 'LargeCarousel');
