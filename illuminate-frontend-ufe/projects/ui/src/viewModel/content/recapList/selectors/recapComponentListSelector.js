import { createSelector } from 'reselect';
import { homeSelector } from 'selectors/page/home/homeSelector';
import ContentSelector from 'selectors/page/content/contentSelector';
import templateSelector from 'selectors/page/templateInformation/templateSelector';
import PageTemplateType from 'constants/PageTemplateType';
import contentConsts from 'constants/content';

const { contentSelector } = ContentSelector;
const {
    COMPONENT_TYPES,
    RECAP_CAROUSEL: { ITEM_URLS }
} = contentConsts;

const recapComponentListSelector = createSelector(
    homeSelector,
    contentSelector,
    templateSelector,
    ({ items = [] }, { layout: { content = [] } = {} }, template) => {
        let components;

        if (template === PageTemplateType.Homepage) {
            components = items;
        } else if (template === PageTemplateType.Content) {
            components = content;
        }

        const componentList = components.find(({ type }) => type === COMPONENT_TYPES.RECAP)?.items;

        const output = {
            componentList
        };

        if (componentList == null) {
            return output;
        }

        const getRequiredData = (acc, component) => {
            const targetUrl = component?.action?.targetUrl;

            if (targetUrl === ITEM_URLS.BASKET) {
                acc.basket = true;
            }

            if (targetUrl === ITEM_URLS.PURCHASE_HISTORY) {
                acc.purchaseHistory = true;
            }

            if (targetUrl === ITEM_URLS.LOVES) {
                acc.currentLovesData = true;
            }

            if (targetUrl === ITEM_URLS.RECENTLY_VIEWED) {
                acc.rvData = true;
            }

            if (targetUrl === ITEM_URLS.BEAUTY_RECOMMENDATIONS) {
                acc.beautyRecommendations = true;
            }

            return acc;
        };

        return componentList.reduce(getRequiredData, output);
    }
);

export default recapComponentListSelector;
