import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import SpaUtils from 'utils/Spa';

const deliveryOptionsSelector = createSelector(pageSelector, page => {
    const template = page.templateInformation?.template;
    const { pageName } = SpaUtils.getSpaTemplateInfoByTemplate(template) || {};

    return page[pageName]?.deliveryOptions;
});

export { deliveryOptionsSelector };
