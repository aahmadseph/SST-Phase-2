import CheckoutLegalOptIn from 'components/FrictionlessCheckout/AutoReplenish/CheckoutLegalOptIn/CheckoutLegalOptIn';
import withGlobalModals from 'hocs/withGlobalModals';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import Actions from 'actions/Actions';
import FrameworkUtils from 'utils/framework';
import OrderActions from 'actions/OrderActions';
import { orderSelector } from 'selectors/order/orderSelector';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { showMediaModal } = Actions;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/AutoReplenish/CheckoutLegalOptIn/locales', 'CheckoutLegalOptIn');

const withCheckoutLegalOptInProps = wrapHOC(
    connect(
        createSelector(
            orderSelector,
            createStructuredSelector({
                termsOfUse: getTextFromResource(getText, 'termsOfUse'),
                andText: getTextFromResource(getText, 'andText'),
                privacyPolicy: getTextFromResource(getText, 'privacyPolicy'),
                iAgreeToAutoReplenish: getTextFromResource(getText, 'iAgreeToAutoReplenish'),
                termsAndConditions: getTextFromResource(getText, 'termsAndConditions'),
                forTheSubscription: getTextFromResource(getText, 'forTheSubscription'),
                byClickingPlaceOrder: getTextFromResource(getText, 'byClickingPlaceOrder'),
                andConditionsOfUseHaveRead: getTextFromResource(getText, 'andConditionsOfUseHaveRead'),
                confirmText: getTextFromResource(getText, 'confirmText'),
                autoReplenishSub: getTextFromResource(getText, 'autoReplenishSub'),
                consentText: getTextFromResource(getText, 'consentText')
            }),
            (order, textResources) => {
                const { acceptAutoReplenishTerms, confirmVerbalConsent } = order;

                return {
                    acceptAutoReplenishTerms,
                    confirmVerbalConsent,
                    ...textResources
                };
            }
        ),
        {
            showMediaModal,
            updateSephoraTerms: OrderActions.updateSephoraTerms,
            updateAutoReplenishTerms: OrderActions.updateAutoReplenishTerms,
            updateVerbalConsent: OrderActions.updateVerbalConsent
        }
    )
);

const ConnectedCheckoutLegalOptIn = withGlobalModals(withCheckoutLegalOptInProps(CheckoutLegalOptIn));

export default ConnectedCheckoutLegalOptIn;
