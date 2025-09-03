const React = require('react');
// eslint-disable-next-line no-undef
const shallow = enzyme.shallow;
const SizeAndItemNumber = require('components/Product/SizeAndItemNumber/SizeAndItemNumber').default;

describe('<SizeAndItemNumber />', () => {
    it('should render item number ', () => {
        // Arrange
        const props = {
            sku: {
                size: '10',
                variationType: 'Size',
                skuId: '123'
            }
        };

        // Act
        const wrapper = shallow(<SizeAndItemNumber {...props} />);

        // Assert
        expect(wrapper.props().children[1]).toEqual('ITEM 123');
    });

    describe('Test data-at attributes', () => {
        it('should render data-at attribute set to "sku_size"', () => {
            // Arrange
            const props = {
                sku: {
                    variationType: 'Color',
                    size: '0.003 oz',
                    skuId: '1056084'
                }
            };
            const wrapper = shallow(<SizeAndItemNumber {...props} />);

            // Act
            const dataAt = wrapper.findWhere(n => n.prop('data-at') === 'sku_size');

            // Assert
            expect(dataAt.length).toEqual(1);
        });

        it('should render data-at attribute set to "loves_page_size_and_item_number" when is a Loved Item', () => {
            // Arrange
            const props = {
                sku: {
                    variationType: 'Color',
                    size: '0.003 oz',
                    skuId: '1056084'
                },
                isLovedItemList: true
            };
            const wrapper = shallow(<SizeAndItemNumber {...props} />);

            // Act
            const dataAt = wrapper.findWhere(n => n.prop('data-at') === 'loves_page_size_and_item_number');

            // Assert
            expect(dataAt.length).toEqual(1);
        });

        it('should render data-at attribute set to "size_and_item_number" when is displayed in Purchase History page', () => {
            // Arrange
            const props = {
                sku: {
                    variationType: 'Color',
                    size: '0.003 oz',
                    skuId: '1056084'
                },
                isPurchaseHistoryItemList: true
            };
            const wrapper = shallow(<SizeAndItemNumber {...props} />);

            // Act
            const dataAt = wrapper.findWhere(n => n.prop('data-at') === 'size_and_item_number');

            // Assert
            expect(dataAt.length).toEqual(1);
        });
    });
});
