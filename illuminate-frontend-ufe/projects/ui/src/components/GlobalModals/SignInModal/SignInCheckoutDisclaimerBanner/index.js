import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import SignInCheckoutDisclaimerBanner from 'components/GlobalModals/SignInModal/SignInCheckoutDisclaimerBanner/SignInCheckoutDisclaimerBanner';

import basketSelector from 'selectors/basket/basketSelector';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/SignInModal/SignInForm/locales', 'SignInForm');

const localization = createStructuredSelector({
    disclaimerBannerText: getTextFromResource(getText, 'disclaimerBannerText')
});

const fields = createStructuredSelector({
    basket: basketSelector,
    localization
});

const withComponentProps = wrapHOC(connect(fields, null));

export default withComponentProps(SignInCheckoutDisclaimerBanner);
