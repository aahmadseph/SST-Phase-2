import React from 'react';
import { Link } from 'components/ui';
import StarRating from 'components/StarRating/StarRating';
import localeUtils from 'utils/LanguageLocale';
import { wrapFunctionalComponent } from 'utils/framework';
import numberUtils from 'utils/Number';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import UI from 'utils/UI';

const { getLocaleResourceFile } = localeUtils;
const { formatReviewCount } = numberUtils;

const ReviewsAnchor = props => {
    const getText = getLocaleResourceFile('components/ProductPage/ReviewsAnchor/locales', 'ReviewsAnchor');

    const clickHandler = e => {
        e.preventDefault();
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                eventStrings: ['event71'],
                linkName: 'D=c55',
                actionInfo: 'jumplink:ratings and reviews'
            }
        });
        UI.scrollTo({ elementId: 'ratings-reviews-container' });
    };

    let {
        // eslint-disable-next-line prefer-const
        rating,
        reviews
    } = props;

    reviews = reviews === undefined ? 0 : reviews;

    const formattedReviewCount = formatReviewCount(reviews);

    return (
        <Link
            href='#ratings-reviews-container'
            onClick={clickHandler}
            display='flex'
        >
            {reviews > 0 ? (
                <React.Fragment>
                    <StarRating rating={rating} />
                    <span
                        data-at={Sephora.debug.dataAt('number_of_reviews')}
                        css={[styles.count, styles.textOffset]}
                        children={getText('reviewsLabel', [formattedReviewCount, reviews])}
                    />
                </React.Fragment>
            ) : (
                <span
                    css={styles.textOffset}
                    children={getText('writeReview')}
                />
            )}
        </Link>
    );
};

const styles = {
    count: {
        fontWeight: 'var(--font-weight-bold)',
        marginLeft: '.4em'
    },
    textOffset: {
        position: 'relative',
        top: '.09em'
    }
};

export default wrapFunctionalComponent(ReviewsAnchor, 'ReviewsAnchor');
