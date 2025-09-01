import ExpandableBasketItems from 'components/RwdCheckout/Sections/SddSections/ExpandableBasketItems/ExpandableBasketItems';
import BasketConstants from 'constants/Basket';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import itemsByBasketSelector from 'selectors/basket/itemsByBasket/itemsByBasketSelector';
import withLocaleInfo from 'hocs/withLocaleInfo';
import { showCheckoutExpandOrderListSelector } from 'viewModel/selectors/testTarget/showCheckoutExpandOrderListSelector';
import Empty from 'constants/empty';

const { BasketType } = BasketConstants;
const { wrapHOC } = FrameworkUtils;
const emptyBasket = [];

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
                    const sddBasket = itemsByBasket.find(item => item.basketType === 'SameDay') || Empty.Object;
                    sddTitle = sddBasket.sameDayTitle;

                    if ((sddBasket.items || []).length > 0) {
                        items = sddBasket.items;
                        itemsCount = sddBasket.itemsCount;
                    }
                } else {
                    const standardBasket = itemsByBasket.find(item => item.basketType === 'ShipToHome') || Empty.Object;

                    if ((standardBasket.items || []).length > 0) {
                        items = standardBasket.items;
                        itemsCount = standardBasket.itemsCount;
                    }
                }

                return {
                    isCanada,
                    isUS,
                    items,
                    showCheckoutExpandOrderList,
                    itemsCount,
                    sddTitle
                };
            }
        )
    )
);

export default compose(withLocaleInfo, withExpandableBasketItemsProps)(ExpandableBasketItems);
