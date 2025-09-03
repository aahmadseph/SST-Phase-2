import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { localeSelector } from 'viewModel/selectors/locale/localeSelector';
import LanguageLocale from 'utils/LanguageLocale';

const getText = LanguageLocale.getLocaleResourceFile('components/GlobalModals/ModifySubscriptionErrorModal/locales', 'ModifySubscriptionErrorModal');

const withModifySubscriptionErrorModalProps = connect(
    createSelector(localeSelector, () => {
        const modifySubscription = getText('modifySubscription');
        const errorMessage = getText('errorMessage');
        const done = getText('done');

        return {
            modifySubscription,
            errorMessage,
            done
        };
    })
);

export { withModifySubscriptionErrorModalProps };
