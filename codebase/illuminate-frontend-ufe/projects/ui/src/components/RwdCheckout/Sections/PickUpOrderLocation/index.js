import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import PickUpOrderLocation from 'components/RwdCheckout/Sections/PickUpOrderLocation/PickUpOrderLocation';
import Actions from 'Actions';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RwdCheckout/Sections/PickUpOrderLocation/locales', 'PickUpOrderLocation');

const localization = createStructuredSelector({
    storeDetails: getTextFromResource(getText, 'storeDetails'),
    choosePickupMethod: getTextFromResource(getText, 'choosePickupMethod'),
    inStorePickup: getTextFromResource(getText, 'inStorePickup'),
    curbsideConcierge: getTextFromResource(getText, 'curbsideConcierge'),
    errorTitle: getTextFromResource(getText, 'errorTitle'),
    ok: getTextFromResource(getText, 'ok')
});

const fields = createStructuredSelector({
    localization
});

const functions = {
    showFindInStoreMapModal: Actions.showFindInStoreMapModal
};

const withComponentProps = wrapHOC(connect(fields, functions));

export default withComponentProps(PickUpOrderLocation);
