import PRIORITY_PAGES from '../../../../config/priorityPagesList.mjs';

/* eslint-disable no-console */
const loadPriorityOrNonPriorityPages = async (pageTemplate = '') => {
    const isAPriorityPage = isPriorityPage(pageTemplate);

    if (isAPriorityPage) {
        const priorityModule = await import(/* webpackChunkName: "priority" */ '../pages/priorityIndex.js');
        console.log('Priority bundle loaded:', priorityModule);

        return priorityModule;
    } else {
        const nonPriorityModule = await import(/* webpackChunkName: "components" */ '../pages/index.js');
        console.log('Non-priority bundle loaded:', nonPriorityModule);

        return nonPriorityModule;
    }
};

/**
 * Check if the current page is a priority page
 * @param {string} template - Template to check against.
 * @returns {boolean} - Returns true if it's a priority page.
 */
const isPriorityPage = (template = '') => {
    const pageTemplate = (Sephora !== undefined && Sephora?.renderedData?.template) || template;

    return !!PRIORITY_PAGES.includes(pageTemplate);
};

export {
    isPriorityPage, loadPriorityOrNonPriorityPages
};
