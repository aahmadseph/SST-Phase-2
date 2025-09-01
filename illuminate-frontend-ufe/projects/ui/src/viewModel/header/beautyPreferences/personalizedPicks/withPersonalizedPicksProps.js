import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { CAROUSEL_ONE_TRAITS, CAROUSEL_TWO_TRAITS } from 'constants/beautyPreferences';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Header/BeautyPreferences/PersonalizedPicks/locales', 'PersonalizedPicks');

const fields = createSelector(
    (_state, ownProps) => ownProps.carouselTraitsCompleted,
    createStructuredSelector({
        blurryCarouselTitle: getTextFromResource(getText, 'title'),
        noRecommendationsMessage: getTextFromResource(getText, 'noRecommendationsMessage'),
        withRecommendationsMessage: getTextFromResource(getText, 'withRecommendationsMessage'),
        withRecommendationsTwoMessage: getTextFromResource(getText, 'withRecommendationsTwoMessage')
    }),
    (carouselTraitsCompleted, textResources) => {
        const { noRecommendationsMessage, withRecommendationsMessage, withRecommendationsTwoMessage, ...restTextResources } = textResources;
        const subTitle =
            carouselTraitsCompleted >= CAROUSEL_TWO_TRAITS
                ? withRecommendationsTwoMessage
                : carouselTraitsCompleted >= CAROUSEL_ONE_TRAITS
                    ? withRecommendationsMessage
                    : noRecommendationsMessage;
        const isMinRequiredTraits = carouselTraitsCompleted >= CAROUSEL_ONE_TRAITS;

        return {
            subTitle,
            isMinRequiredTraits,
            ...restTextResources
        };
    }
);

const withPersonalizedPicksProps = wrapHOC(connect(fields));

export {
    fields, withPersonalizedPicksProps
};
