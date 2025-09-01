const React = require('react');
const { shallow } = require('enzyme');

describe('<PurchasedGroups /> component', () => {
    let shallowedComponent;
    let component;
    let PurchasedGroups;
    let state;
    let props;
    let mockData;

    beforeEach(() => {
        state = { currentPage: 1 };
        props = {
            itemsPerPage: 10,
            currentUserId: '123456789',
            showYouMayAlsoLikeLink: true,
            sortOptions: [
                {
                    name: 'Sort1',
                    code: 'sortone'
                },
                {
                    name: 'Sort2',
                    code: 'sorttwo'
                }
            ],
            filterOptions: [
                {
                    name: 'Filter1',
                    code: 'filterone'
                },
                {
                    name: 'Filter2',
                    code: 'filtertwo'
                }
            ]
        };

        PurchasedGroups = require('components/RichProfile/PurchaseHistoryList/PurchasedGroups/PurchasedGroups').default;
        shallowedComponent = shallow(<PurchasedGroups {...props} />);
        component = shallowedComponent.instance();
    });

    it('should display the correct number of purchased SKUs', () => {
        component.state = Object.assign({}, state, { purchasedGroups: [] });

        mockData = {
            purchasedGroups: [
                {
                    transactionDate: '09/18/2012',
                    storeNumber: '0700',
                    purchasedItems: [
                        {
                            quantity: 1,
                            sku: { skuId: '1234' }
                        },
                        {
                            quantity: 1,
                            sku: {
                                skuId: '4321',
                                type: 'Standard'
                            }
                        }
                    ]
                },
                {
                    transactionDate: '10/18/2012',
                    storeNumber: '0700',
                    purchasedItems: [
                        {
                            quantity: 1,
                            sku: { skuId: '7890' }
                        },
                        {
                            quantity: 1,
                            sku: { skuId: '0987' }
                        }
                    ]
                }
            ],
            purchasedItemsCount: 4
        };

        component.setPurchasedGroups(mockData, 1);
        expect(shallowedComponent.find('ProductListItem').length).toBe(4);
    });
});
