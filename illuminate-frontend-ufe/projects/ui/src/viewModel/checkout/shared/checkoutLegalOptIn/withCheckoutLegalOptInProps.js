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
const getText = getLocaleResourceFile('components/Checkout/Sections/Review/locales', 'ReviewText');

const withCheckoutLegalOptInProps = wrapHOC(
    connect(
        createSelector(
            orderSelector,
            createStructuredSelector({
                termsOfService: getTextFromResource(getText, 'termsOfService'),
                andText: getTextFromResource(getText, 'andText'),
                privacyPolicy: getTextFromResource(getText, 'privacyPolicy'),
                iAgreeToAutoReplenish: getTextFromResource(getText, 'iAgreeToAutoReplenish'),
                termsAndConditions: getTextFromResource(getText, 'termsAndConditions'),
                forTheSubscription: getTextFromResource(getText, 'forTheSubscription'),
                byClickingPlaceOrder: getTextFromResource(getText, 'byClickingPlaceOrder'),
                andConditionsOfUseHaveRead: getTextFromResource(getText, 'andConditionsOfUseHaveRead')
            }),
            (order, textResources) => {
                const { acceptAutoReplenishTerms } = order;

                return {
                    acceptAutoReplenishTerms,
                    ...textResources
                };
            }
        ),
        {
            showMediaModal,
            updateSephoraTerms: OrderActions.updateSephoraTerms,
            updateAutoReplenishTerms: OrderActions.updateAutoReplenishTerms
        }
    )
);

export { withCheckoutLegalOptInProps };
