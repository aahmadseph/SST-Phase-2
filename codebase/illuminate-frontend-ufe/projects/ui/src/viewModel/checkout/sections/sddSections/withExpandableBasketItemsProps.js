import BasketConstants from 'constants/Basket';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import itemsByBasketSelector from 'selectors/basket/itemsByBasket/itemsByBasketSelector';
import localeUtils from 'utils/LanguageLocale';
import withLocaleInfo from 'hocs/withLocaleInfo';
import { showCheckoutExpandOrderListSelector } from 'viewModel/selectors/testTarget/showCheckoutExpandOrderListSelector';

const { BasketType } = BasketConstants;
const { wrapHOC } = FrameworkUtils;
const emptyBasket = [];
const getText = localeUtils.getLocaleResourceFile('components/Checkout/Sections/SddSections/ExpandableBasketItems/locales', 'ExpandableBasketItems');

const withExpandableBasketItemsProps = wrapHOC(
    connect(
        createSelector(
            itemsByBasketSelector,
            (_state, ownProps) => ({
                basketType: ownProps.basketType,
                isCanada: ownProps.isCanada,
                isUS: ownProps.isUS
            }),
            showCheckoutExpandOrderListSelector,
            (itemsByBasket = [], { basketType, isCanada, isUS }, showCheckoutExpandOrderList) => {
                let items = emptyBasket;
                let itemsCount = 0;
                let sddTitle = '';

                if (basketType === BasketType.SameDay) {
                    const sddBasket = itemsByBasket.find(item => item.basketType === 'SameDay') || {};
                    sddTitle = sddBasket.sameDayTitle;

                    if ((sddBasket.items || []).length > 0) {
                        items = sddBasket.items;
                        itemsCount = sddBasket.itemsCount;
                    }
                } else {
                    const standardBasket = itemsByBasket.find(item => item.basketType === 'ShipToHome') || {};

                    if ((standardBasket.items || []).length > 0) {
                        items = standardBasket.items;
                        itemsCount = standardBasket.itemsCount;
                    }
                }

                const itemsText = items.length > 1 ? getText('itemsInOrder') : getText('itemInOrder');
                const title = `${itemsText} (${items.length})`;
                const viewBasket = getText('viewBasket');
                const viewBasketLink = '/basket?icid2=checkout:view-basket-link';

                return {
                    isCanada,
                    isUS,
                    items,
                    title,
                    viewBasket,
                    viewBasketLink,
                    showCheckoutExpandOrderList,
                    itemsCount,
                    sddTitle
                };
            }
        )
    )
);

export default compose(withLocaleInfo, withExpandableBasketItemsProps);
