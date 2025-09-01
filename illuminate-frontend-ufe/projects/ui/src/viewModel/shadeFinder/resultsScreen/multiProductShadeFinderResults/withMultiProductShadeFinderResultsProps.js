import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import reverseLookUpApi from 'services/api/sdn';
import Actions from 'actions/Actions';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { showInterstice } = Actions;
const getText = getLocaleResourceFile('components/ShadeFinder/ResultsScreen/locales', 'ResultScreen');

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
    products: getTextFromResource(getText, 'products'),
    serverErrorMessage: getTextFromResource(getText, 'serverErrorMessage'),
    serverErrorAction: getTextFromResource(getText, 'serverErrorAction'),
    apiErrorMessage: getTextFromResource(getText, 'apiErrorMessage'),
    apiErrorAction: getTextFromResource(getText, 'apiErrorAction'),
    queryParamsErrorMessage: getTextFromResource(getText, 'queryParamsErrorMessage'),
    queryParamsErrorAction: getTextFromResource(getText, 'queryParamsErrorAction')
});

const fields = createSelector(localization, textRecources => {
    return { localization: textRecources };
});

const functions = {
    getMultiProductMatch,
    showInterstice
};

const withMultiProductShadeFinderResultsProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, localization, withMultiProductShadeFinderResultsProps
};
