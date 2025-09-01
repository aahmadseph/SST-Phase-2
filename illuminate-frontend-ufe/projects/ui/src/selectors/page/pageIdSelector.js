import { createSelector } from 'reselect';
import { SpaTemplatesInfo } from 'constants/SpaTemplatesInfo';
import { pageSelector } from 'selectors/page/pageSelector';

export default createSelector(pageSelector, page => {
    const { template } = page.templateInformation;
    const { pageName } = SpaTemplatesInfo.find(x => x.template === template) || {};

    return page[pageName]?.contextId;
});
