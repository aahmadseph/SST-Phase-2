import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { getLocaleResourceFile, getTextFromResource } from 'utils/LanguageLocale';
import { userSubscriptionsSelector } from 'selectors/user/userSubscriptions/userSubscriptionsSelector';

const { wrapHOC } = FrameworkUtils;
const getText = getLocaleResourceFile('components/ProductPage/Type/DigitalProduct/SameDayUnlimitedLandingPage/FreeTrial/locales', 'FreeTrial');

const fields = createSelector(
    userSubscriptionsSelector,
    createStructuredSelector({
        freeTrial: getTextFromResource(getText, 'free30DayTrial'),
        then: getTextFromResource(getText, 'then'),
        annually: getTextFromResource(getText, 'annually'),
        joinFor: getTextFromResource(getText, 'joinForOnly')
    }),
    (userSubscriptions, textResources) => {
        const sduSubscriptions = userSubscriptions?.filter(subscription => subscription.type === 'SDU');
        const isUserTrialEligible = sduSubscriptions[0]?.isTrialEligible;

        return {
            ...textResources,
            isUserTrialEligible
        };
    }
);

const withFreeTrialProps = wrapHOC(connect(fields));

export {
    withFreeTrialProps, fields
};
