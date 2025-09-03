import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import CheckoutItemsList from 'components/RwdCheckout/OrderSummary/CheckoutItemsList/CheckoutItemsList';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/RwdCheckout/OrderSummary/locales', 'OrderSummary');

const textResources = createStructuredSelector({
    seeAll: getTextFromResource(getText, 'seeAll'),
    itemsText: getTextFromResource(getText, 'items'),
    bopis: getTextFromResource(getText, 'bopis'),
    shipped: getTextFromResource(getText, 'shipped'),
    sameday: getTextFromResource(getText, 'sameday')
});

const withCheckoutItemsListProps = wrapHOC(
    connect(
        createSelector(
            textResources,
            (_state, ownProps) => ({
                basketType: ownProps.basketType
            }),
            ({
                seeAll, itemsText, bopis, shipped, sameday
            }) => {
                return {
                    seeAll,
                    itemsText,
                    basketTypeText: {
                        bopis,
                        shipped,
                        sameday
                    }
                };
            }
        )
    )
);

export default withCheckoutItemsListProps(CheckoutItemsList);
