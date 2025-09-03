import { createSelector } from 'reselect';
import RwdBasketUtils from 'utils/RwdBasket';
import Empty from 'constants/empty';
import basketSelector from 'selectors/basket/basketSelector';
import { customerLimitSelector as customerLimit } from 'selectors/profile/customerLimit/customerLimitSelector';
import DateUtils from 'utils/Date';
import localeUtils from 'utils/LanguageLocale';
import userUtils from 'utils/User';
import helperUtils from 'utils/Helpers';

const { formatDiscountPrice } = helperUtils;

// Selector for combined customer limit data
const customerLimitSelector = createSelector(
    customerLimit, // No need for customerLimitErrorSelector anymore
    basketSelector, // Use the imported basketSelector
    (customerLimitObject, basket) => {
        const getText = (text, vars) =>
            localeUtils.getLocaleResourceFile('components/Content/BeautyInsider/BeautyInsiderSummary/locales', 'BeautyInsiderSummary')(text, vars);

        // Calculate containsSephoraItems once and reuse the result
        const containsSephoraItems = RwdBasketUtils.basketHasSephoraCollection(basket);
        const isSephoraEmployee = userUtils.isSephoraEmployee();

        // Now we access the error directly from the customerLimit object
        const customerLimitError = customerLimitObject.error || null;
        const customerLimitErrorIsEmpty = customerLimitError === null;

        // Extract relevant fields from customerLimitBalance
        const customerLimitBalance = customerLimitObject.balance || Empty.Object;
        const { initial, initialExpiryDate, available } = customerLimitBalance;

        const formattedExpirationDate = DateUtils.getDateInShortFormat(initialExpiryDate);

        // Order matters for populating locale vars
        const discountVars = [formatDiscountPrice(available), formatDiscountPrice(initial), formattedExpirationDate];
        const cardTitle = getText('customerLimitTitle');
        const cardText = getText('customerLimitText', discountVars);
        // Extract formatted Card text to format the negative values.
        const cardTextWithoutMinusSign = String(cardText).replaceAll('$-', '-$');
        const dtsDownErrorMessage = getText('dtsDownErrorMessage');

        // Calculate the discount text once and return it with the other state
        const discountText = `*${cardTitle}*\n\n${cardTextWithoutMinusSign}`;

        // Return the data in the shape that was previously used in the HOC
        return {
            customerLimitBalance,
            customerLimitCurrency: customerLimitObject?.currency || 'USD',
            containsSephoraItems,
            customerLimitError,
            customerLimitErrorIsEmpty,
            discountText,
            isSephoraEmployee,
            dtsDownErrorMessage
        };
    }
);

export { customerLimitSelector };
