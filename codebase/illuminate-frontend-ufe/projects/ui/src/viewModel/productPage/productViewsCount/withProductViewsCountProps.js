import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import { productViewsSelector } from 'selectors/page/product/productViews/productViewsSelector';
import FrameworkUtils from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import anaUtils from 'analytics/utils';
const { wrapHOC } = FrameworkUtils;
const getText = localeUtils.getLocaleResourceFile('components/ProductPage/ProductViewsCount/locales', 'ProductViewsCount');

const fields = createSelector(
    createStructuredSelector({
        popularNow: localeUtils.getTextFromResource(getText, 'popularNow'),
        peopleViewed: localeUtils.getTextFromResource(getText, 'peopleViewed')
    }),
    productViewsSelector,
    (localization, productViews) => {
        const { peopleViewing = 0, thresholdForViews = 0, lookBackWindowForViews } = productViews;

        return {
            localization,
            peopleViewing,
            thresholdForViews: Number(thresholdForViews),
            lookBackWindowForViews
        };
    }
);

const functions = () => ({
    formatViewCount: viewCount => {
        if (viewCount >= 1000) {
            let formattedCount = (viewCount / 1000).toFixed(1);

            if (formattedCount.endsWith('.0')) {
                formattedCount = formattedCount.slice(0, -2);
            }

            return `${formattedCount}K`;
        } else {
            return viewCount.toString();
        }
    },
    setAnalytics: lookBackWindowForViews => {
        anaUtils.setNextPageData({
            linkData: `in-session:social proofing message:${lookBackWindowForViews}`
        });
    }
});

const withProductViewsCountProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withProductViewsCountProps
};
