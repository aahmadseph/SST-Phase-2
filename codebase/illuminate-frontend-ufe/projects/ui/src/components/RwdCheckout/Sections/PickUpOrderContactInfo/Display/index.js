import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import PickUpOrderContactInfo from 'components/RwdCheckout/Sections/PickUpOrderContactInfo/Display/PickUpOrderContactInfo';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/RwdCheckout/Sections/PickUpOrderContactInfo/locales', 'PickUpOrderContactInfo');

const localization = createStructuredSelector({
    contactMessage1: getTextFromResource(getText, 'contactMessage1'),
    confirmEmail: getTextFromResource(getText, 'confirmEmail'),
    or: getTextFromResource(getText, 'or'),
    photoId: getTextFromResource(getText, 'photoId'),
    ready: getTextFromResource(getText, 'ready')
});

const fields = createStructuredSelector({
    localization
});

const withPickUpOrderContactInfoProps = wrapHOC(connect(fields, null));

export default withPickUpOrderContactInfoProps(PickUpOrderContactInfo);
