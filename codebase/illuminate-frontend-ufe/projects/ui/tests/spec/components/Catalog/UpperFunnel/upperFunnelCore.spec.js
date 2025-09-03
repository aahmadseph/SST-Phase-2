const { createSpy } = jasmine;
const { PICKUP } = require('constants/UpperFunnel');

describe('Test upper funnel filters configuration helpers', () => {
    let upperFunnelCore;
    let store;
    let dispatchSpy;
    beforeEach(() => {
        upperFunnelCore = require('components/Catalog/UpperFunnel/upperFunnelCore').default;
        store = require('Store').default;
        dispatchSpy = spyOn(store, 'dispatch');
    });
    describe('Test getUpperFunnelFilterValueStart function', () => {
        it('should return empty string if no key param is provided', () => {
            expect(upperFunnelCore.getUpperFunnelFilterValueStart()).toEqual('');
        });

        it('should return empty string with invalid key param', () => {
            expect(upperFunnelCore.getUpperFunnelFilterValueStart('INVALID')).toEqual('');
        });

        it('should return proper key value', () => {
            expect(upperFunnelCore.getUpperFunnelFilterValueStart(PICKUP)).toEqual('filters[Pickup]');
        });
    });

    describe('Test getPickupFilterValue', () => {
        it('should return empty string if no storeId is provided', () => {
            expect(upperFunnelCore.getPickupFilterValue()).toEqual('');
        });

        it('should return proper value including storeId', () => {
            const storeId = 1111;
            const result = `filters[Pickup]=${storeId}`;
            expect(upperFunnelCore.getPickupFilterValue(storeId)).toEqual(result);
        });
    });

    describe('Test showStoreSwitcherModal', () => {
        let e, options;
        beforeEach(() => {
            e = {
                preventDefault: createSpy('preventDefault'),
                stopPropagation: createSpy('stopPropagation')
            };
            options = {};
        });
        it('should call preventDefault', () => {
            upperFunnelCore.showStoreSwitcherModal(e, options);
            expect(e.preventDefault).toHaveBeenCalled();
        });
        it('should call stopPropagation', () => {
            upperFunnelCore.showStoreSwitcherModal(e, options);
            expect(e.stopPropagation).toHaveBeenCalled();
        });
        it('should dispatch show store switcher modal action', () => {
            upperFunnelCore.showStoreSwitcherModal(e, options);
            expect(dispatchSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('Test showZipCodeModal', () => {
        let e, options;
        beforeEach(() => {
            e = {
                preventDefault: createSpy('preventDefault'),
                stopPropagation: createSpy('stopPropagation')
            };
            options = {};
        });
        it('should call preventDefault', () => {
            upperFunnelCore.showZipCodeModal(e, options);
            expect(e.preventDefault).toHaveBeenCalled();
        });
        it('should call stopPropagation', () => {
            upperFunnelCore.showZipCodeModal(e, options);
            expect(e.stopPropagation).toHaveBeenCalled();
        });
        it('should dispatch show same day delivery location modal action', () => {
            upperFunnelCore.showZipCodeModal(e, options);
            expect(dispatchSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('Test upperFunnelCheckboxClick', () => {
        let e, options;
        beforeEach(() => {
            options = {
                title: 'Pickup & Delivery',
                filterVal: 'filters[SameDay]=94949',
                originalRemoveFilterValue: createSpy(),
                selectedFilters: { 'Pickup & Delivery': [] },
                originalSelectFilters: createSpy(),
                isSelected: false
            };
        });
        it('should remove filters if selected', () => {
            options.isSelected = true;
            upperFunnelCore.upperFunnelCheckboxClick(e, options);
            expect(options.originalRemoveFilterValue).toHaveBeenCalled();
        });
    });

    describe('Test updateFiltersModalState', () => {
        describe('when discardDraft parameter is true', () => {
            it('should dispatch user action to clear upperfunnel draft', () => {
                upperFunnelCore.updateFiltersModalState(false, true);
                expect(dispatchSpy).toHaveBeenCalledTimes(1);
            });
        });
    });
});
