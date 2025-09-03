const React = require('react');
const { shallow } = require('enzyme');
const ProductListItem = require('components/Product/ProductListItem/ProductListItem').default;

const props = {
    sku: {
        actionFlags: {
            backInStockReminderStatus: 'notApplicable',
            isAddToBasket: true,
            isBuyNow: true,
            isFullSizeSkuOrderable: false,
            myListStatus: 'notAdded',
            showAddReview: true
        },
        productId: 'P202633',
        productName: 'Brow Wiz',
        size: '0.003 oz',
        skuId: '1056084'
    },
    isPurchaseHistoryItemList: true
};

xdescribe('ProductListItem Component', () => {
    describe('Test data-at attributes', () => {
        it('should render data-at attribute set to "purchase_history_item"', () => {
            // Arrange
            const wrapper = shallow(<ProductListItem {...props} />);

            // Act
            const dataAt = wrapper.findWhere(n => n.prop('data-at') === 'purchase_history_item');

            // Assert
            expect(dataAt.length).toEqual(1);
        });
        it('should NOT render data-at attribute set to "purchase_history_item" when component is not displayed in Purchase History page', () => {
            // Arrange
            const newProps = {
                ...props,
                isPurchaseHistoryItemList: false
            };
            const wrapper = shallow(<ProductListItem {...newProps} />);

            // Act
            const dataAt = wrapper.findWhere(n => n.prop('data-at') === 'purchase_history_item');

            // Assert
            expect(dataAt.length).toEqual(0);
        });
    });
});
