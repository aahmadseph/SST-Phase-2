import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import GalleryConstantsUtils from 'utils/GalleryConstants';

const { exploreGallerySkeleton } = GalleryConstantsUtils;
const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Community/GalleryGridMasonry/locales', 'GalleryGridMasonry');

const fields = createSelector(
    createStructuredSelector({
        showMore: getTextFromResource(getText, 'showMore'),
        viewing: getTextFromResource(getText, 'viewing'),
        results: getTextFromResource(getText, 'results')
    }),
    localization => {
        return {
            localization,
            gallerySkeleton: exploreGallerySkeleton
        };
    }
);

const functions = null;

const withGalleryGridMasonryProps = wrapHOC(connect(fields, functions));

export {
    withGalleryGridMasonryProps, fields, functions
};
