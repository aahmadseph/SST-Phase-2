import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import dateUtils from 'utils/Date';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import UserSubscriptionsSelector from 'selectors/user/userSubscriptions/userSubscriptionsSelector';

const { wrapHOC } = FrameworkUtils;
const { userSubscriptionsSelector } = UserSubscriptionsSelector;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Product/ProductSDU/locales', 'ProductSDU');

const fields = createSelector(
    userSubscriptionsSelector,
    (_state, ownProps) => dateUtils.getDateInMMDDYYYYShortMonth(ownProps.date),
    createStructuredSelector({
        sephoraSubscription: getTextFromResource(getText, 'sephoraSubscription'),
        sameDayUnlimited: getTextFromResource(getText, 'sameDayUnlimited'),
        qty: getTextFromResource(getText, 'qty'),
        free: getTextFromResource(getText, 'free')
    }),
    (userSubscriptions, date, textResources) => {
        const { sephoraSubscription, sameDayUnlimited, qty, free } = textResources;
        const sduSubscriptions = userSubscriptions.filter(subscription => subscription.type === 'SDU')[0];
        const isTrial = sduSubscriptions?.isTrialEligible;

        return {
            sephoraSubscription,
            qty,
            sameDayUnlimited,
            isTrial,
            date,
            free
        };
    }
);

const withProductSDUProps = wrapHOC(connect(fields));

export {
    withProductSDUProps, fields
};
