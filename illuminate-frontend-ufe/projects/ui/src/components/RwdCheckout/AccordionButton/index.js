import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import AccordionButton from 'components/RwdCheckout/AccordionButton/AccordionButton';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RwdCheckout/AccordionButton/locales', 'AccordionButton');

const localization = createStructuredSelector({
    saveContinueButton: getTextFromResource(getText, 'saveContinueButton')
});

const fields = createStructuredSelector({
    localization
});

const withComponentProps = wrapHOC(connect(fields, null));

export default withComponentProps(AccordionButton);
