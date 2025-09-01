import AgentAwareAgreement from 'components/RwdCheckout/OrderSummary/OrderTotalSection/AgentAwareAgreement/AgentAwareAgreement';
import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { orderSelector } from 'selectors/order/orderSelector';
import orderActions from 'actions/OrderActions';
import itemsByBasketSelector from 'selectors/basket/itemsByBasket/itemsByBasketSelector';
import UserSubscriptionsSelector from 'selectors/user/userSubscriptions/userSubscriptionsSelector';
import agentAwareActions from 'actions/AgentAwareActions';

const { wrapHOC } = FrameworkUtils;
const { userSubscriptionsSelector } = UserSubscriptionsSelector;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const { openAgentAwareModal } = agentAwareActions;
const { updateAgentAwareTerms } = orderActions;

const getText = getLocaleResourceFile('components/Checkout/OrderSummary/OrderTotalSection/AgentAwareAgreement/locales', 'AgentAwareAgreement');

const fields = createSelector(
    orderSelector,
    itemsByBasketSelector,
    userSubscriptionsSelector,
    createStructuredSelector({
        sephoraSDU: getTextFromResource(getText, 'sephoraSDU'),
        confirm: getTextFromResource(getText, 'confirm'),
        and: getTextFromResource(getText, 'and'),
        autoReplenish: getTextFromResource(getText, 'autoReplenish'),
        toClient: getTextFromResource(getText, 'toClient'),
        sduModalTitle: getTextFromResource(getText, 'sduModalTitle'),
        sduModalBody: getTextFromResource(getText, 'sduModalBody'),
        autoReplenishModalTitle: getTextFromResource(getText, 'autoReplenishModalTitle'),
        autoReplenishModalBody: getTextFromResource(getText, 'autoReplenishModalBody')
    }),
    (order, itemsByBasket, userSubscriptions, { afterTrial, authorize, ...restTextResources }) => {
        const { acceptAgentAwareTerms } = order;

        return {
            ...restTextResources,
            acceptAgentAwareTerms
        };
    }
);

const functions = {
    openAgentAwareModal,
    updateAgentAwareTerms
};

const withAgentAwareAgreementProps = wrapHOC(connect(fields, functions));

export default withAgentAwareAgreementProps(AgentAwareAgreement);
