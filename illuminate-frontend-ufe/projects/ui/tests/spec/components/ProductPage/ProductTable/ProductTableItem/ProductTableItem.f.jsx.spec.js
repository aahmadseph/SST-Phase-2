const React = require('react');
// eslint-disable-next-line no-undef
const { shallow } = enzyme;
const anaUtils = require('analytics/utils').default;
const anaConsts = require('analytics/constants').default;
const ProductTableItem = require('components/ProductPage/ProductTable/ProductTableItem/ProductTableItem').default;
const Location = require('utils/Location').default;

describe('ProductTableItem Component', () => {
    let setNextPageDataStub;
    let wrapper;
    let navigateToSpy;

    beforeEach(() => {
        setNextPageDataStub = spyOn(anaUtils, 'setNextPageData');
        navigateToSpy = spyOn(Location, 'navigateTo');
    });

    it('should call setNextPageData with product data if clicking on See Details button', async () => {
        wrapper = shallow(
            <ProductTableItem
                sku={{ productId: 'P141516' }}
                index={2}
            />
        );

        const seeDetailsButton = wrapper.findWhere(n => n.name() === 'Button' && n.contains('See Details')).at(0);
        seeDetailsButton.simulate('click', { preventDefault: () => {} });

        // Wait for asynchronous operations to complete
        await new Promise(resolve => setTimeout(resolve, 0)); // Adjust timeout if necessary

        // Assertions after the asynchronous operations complete
        expect(setNextPageDataStub).toHaveBeenCalled();
        expect(setNextPageDataStub).toHaveBeenCalledWith({
            recInfo: {
                isExternalRec: 'sephora',
                componentTitle: anaConsts.PAGE_TYPES.COMPARE_SIMILAR_PRODUCTS
            },
            linkData: `${anaConsts.PAGE_TYPES.COMPARE_SIMILAR_PRODUCTS}:p141516:product 1`,
            internalCampaign: `${anaConsts.PAGE_TYPES.COMPARE_SIMILAR_PRODUCTS}:p141516:product`
        });

        expect(navigateToSpy).toHaveBeenCalled();
    });
});
