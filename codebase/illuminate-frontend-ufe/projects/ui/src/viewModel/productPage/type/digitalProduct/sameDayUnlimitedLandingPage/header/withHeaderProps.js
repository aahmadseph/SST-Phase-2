import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { getLocaleResourceFile, getTextFromResource } from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const getText = getLocaleResourceFile('components/ProductPage/Type/DigitalProduct/SameDayUnlimitedLandingPage/Header/locales', 'Header');

const fields = createStructuredSelector({
    title: getTextFromResource(getText, 'subscribeToSephora'),
    subTitle: getTextFromResource(getText, 'sameDayUnlimited')
});

const withHeaderProps = wrapHOC(connect(fields));

export {
    withHeaderProps, fields
};
