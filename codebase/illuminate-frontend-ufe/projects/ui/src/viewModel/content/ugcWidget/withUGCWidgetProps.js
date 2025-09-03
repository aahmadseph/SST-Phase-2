import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { p13nSelector } from 'selectors/p13n/p13nSelector';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import homepageActions from 'actions/HomepageActions';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Content/UgcWidget/locales', 'UgcWidget');

const withUGCWidgetProps = connect(
    createStructuredSelector({
        p13n: p13nSelector,
        user: coreUserDataSelector,
        localization: createStructuredSelector({
            seeItInRealLife: getTextFromResource(getText, 'seeItInRealLife'),
            mentionSephora: getTextFromResource(getText, 'mentionSephora'),
            addYourPhoto: getTextFromResource(getText, 'addYourPhoto')
        })
    }),
    {
        getPersonalizedEnabledComponents: homepageActions.getPersonalizedEnabledComponents
    }
);

export { withUGCWidgetProps };
