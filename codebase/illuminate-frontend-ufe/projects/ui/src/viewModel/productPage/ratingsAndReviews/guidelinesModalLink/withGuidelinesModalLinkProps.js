import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/ProductPage/RatingsAndReviews/GuidelinesModalLink/locales', 'GuidelinesModalLink');

const fields = createStructuredSelector({
    ratingsAndReviewsGuidelines: getTextFromResource(getText, 'ratingsAndReviewsGuidelines'),
    done: getTextFromResource(getText, 'done')
});

const withGuidelinesModalLinkProps = wrapHOC(connect(fields));

export {
    fields, withGuidelinesModalLinkProps
};
