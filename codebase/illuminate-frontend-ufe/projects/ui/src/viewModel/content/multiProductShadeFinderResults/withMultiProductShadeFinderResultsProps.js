import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import reverseLookUpApi from 'services/api/sdn';
import Actions from 'actions/Actions';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { showInterstice } = Actions;
const getText = getLocaleResourceFile('components/Content/MultiProductShadeFinderResults/locales', 'MultiProductShadeFinderResults');

const getMultiProductMatch = shadeCode => () => {
    return reverseLookUpApi.getMultiMatch(shadeCode).then(matchProducts => {
        if (matchProducts.responseStatus >= 300 || matchProducts.error) {
            return { serverError: true };
        } else {
            return matchProducts;
        }
    });
};

const localization = createStructuredSelector({
    serverErrorMessage: getTextFromResource(getText, 'serverErrorMessage'),
    serverErrorAction: getTextFromResource(getText, 'serverErrorAction'),
    apiErrorMessage: getTextFromResource(getText, 'apiErrorMessage'),
    apiErrorAction: getTextFromResource(getText, 'apiErrorAction'),
    welcome: getTextFromResource(getText, 'welcome'),
    clickAbove: getTextFromResource(getText, 'clickAbove')
});

const fields = createSelector(localization, textResources => {
    return { localization: textResources };
});

const functions = {
    getMultiProductMatch,
    showInterstice
};

const withMultiProductShadeFinderResultsProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, localization, withMultiProductShadeFinderResultsProps
};
