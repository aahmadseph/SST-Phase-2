import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import superChatActions from 'ai/actions/superChatActions';
import { getGENAIAnonymousId } from 'ai/utils/sessionStorage';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('ai/components/SuperChat/FeedbackCollection/locales', 'FeedbackCollection');

const localization = createStructuredSelector({
    thanksMessage: getTextFromResource(getText, 'thanksMessage'),
    close: getTextFromResource(getText, 'close')
});

const functions = {
    submitFeedback: superChatActions.submitFeedback
};

const fields = createSelector(localization, coreUserDataSelector, (locales, user) => {
    const clientId = user?.biId;
    let anonymousId = undefined;

    if (!Sephora.isNodeRender) {
        anonymousId = getGENAIAnonymousId();
    }

    return {
        localization: locales,
        clientId,
        anonymousId
    };
});

const withFeedbackCollectionProps = wrapHOC(connect(fields, functions));

export {
    withFeedbackCollectionProps, fields, functions
};
