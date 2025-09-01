import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import Actions from 'Actions';
import localeUtils from 'utils/LanguageLocale';
import trustMarkBindings from 'analytics/bindingMethods/pages/productPage/trustMarkBindings';

const { wrapHOC } = FrameworkUtils;
const { showInfoModal } = Actions;
const getText = localeUtils.getLocaleResourceFile('components/ProductPage/RatingsAndReviews/TrustMark/locales', 'TrustMark');
const { triggerAPLAnalytics, triggerSOTAnalytics } = trustMarkBindings;

const fields = createStructuredSelector({
    localization: createStructuredSelector({
        legalMessage: localeUtils.getTextFromResource(getText, 'legalMessage'),
        modalTitle: localeUtils.getTextFromResource(getText, 'modalTitle'),
        modalBody: localeUtils.getTextFromResource(getText, 'modalBody'),
        modalLink: localeUtils.getTextFromResource(getText, 'modalLink'),
        openModalLabel: localeUtils.getTextFromResource(getText, 'openModalLabel')
    })
});

const functions = {
    showInfoModal,
    triggerAPLAnalytics,
    triggerSOTAnalytics
};

const withTrustMarkProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withTrustMarkProps
};
