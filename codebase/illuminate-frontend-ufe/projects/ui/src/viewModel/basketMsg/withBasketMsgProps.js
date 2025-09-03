import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import basketSelector from 'selectors/basket/basketSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/BasketMsg/locales', 'BasketMsg');

export default connect(
    createStructuredSelector({
        basket: basketSelector,
        localization: createStructuredSelector({
            freeShipping: getTextFromResource(getText, 'freeShipping')
        })
    })
);
