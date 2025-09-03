import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import languageLocale from 'utils/LanguageLocale';
import numberUtils from 'utils/Number';

const { formatReviewCount } = numberUtils;
const { getLocaleResourceFile } = languageLocale;

const getText = getLocaleResourceFile('components/Product/ReviewCount/locales', 'ReviewCount');

function ReviewCount({ productReviewCount, showReviewsText, showParentheses, ...props }) {
    const count = Number(productReviewCount) || 0;

    if (count < 1) {
        return null;
    }

    let text = `${formatReviewCount(count)}`;

    if (showReviewsText) {
        if (count === 1) {
            text = `${formatReviewCount(count)} ${getText('review')}`;
        } else {
            text = `${formatReviewCount(count)} ${getText('reviews')}`;
        }
    }

    if (showParentheses) {
        text = `(${text})`;
    }

    return (
        <span
            {...props}
            data-at={Sephora.debug.dataAt('review_count')}
            aria-label={`${formatReviewCount(count)} ${getText('reviews')}`}
            children={text}
        />
    );
}

export default wrapFunctionalComponent(ReviewCount, 'ReviewCount');
