import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box, Image } from 'components/ui';
import { radii, space } from 'style/config';
import IncentivizedBadge from 'components/ProductPage/IncentivizedBadge/IncentivizedBadge';
import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('components/ProductPage/ReviewsImageCarousel/locales', 'ReviewsImageCarousel');

const CARD_TRANSITION_OFFSET = space[1];

class RatingImageCard extends BaseClass {
    ref = React.createRef();

    initializeIntersectionObserver = () => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                this.props.updateVisibleItems();
                observer.disconnect();
            }
        });

        if (this.ref.current) {
            observer.observe(this.ref.current);
        }
    };

    componentDidMount() {
        this.props.isObserved && this.initializeIntersectionObserver();
    }

    render() {
        const { imgSrc, onClickAction, isIncentivizedReview } = this.props;

        return (
            <button
                aria-label={getText('showReview')}
                css={styles.button}
                data-at={Sephora.debug.dataAt('rating_image_section')}
                onClick={onClickAction}
                ref={this.ref}
            >
                <Image
                    src={imgSrc}
                    size='100%'
                    borderRadius={2}
                    css={styles.image}
                />
                {isIncentivizedReview && (
                    <Box
                        position='absolute'
                        right={2}
                        bottom={2}
                    >
                        <IncentivizedBadge
                            tooltipProps={{
                                side: 'top',
                                isFixed: true,
                                stopPropagation: true
                            }}
                            isOverlay={true}
                        />
                    </Box>
                )}
            </button>
        );
    }
}

const styles = {
    button: {
        borderRadius: radii[2],
        overflow: 'hidden',
        width: '100%',
        position: 'relative',
        paddingBottom: '100%',
        marginTop: CARD_TRANSITION_OFFSET,
        transition: 'transform .2s',
        '.no-touch &': {
            willChange: 'transform'
        },
        '.no-touch &:hover, :focus': {
            transform: `translateY(-${CARD_TRANSITION_OFFSET}px)`
        }
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    }
};

export default wrapComponent(RatingImageCard, 'RatingImageCard', true);
