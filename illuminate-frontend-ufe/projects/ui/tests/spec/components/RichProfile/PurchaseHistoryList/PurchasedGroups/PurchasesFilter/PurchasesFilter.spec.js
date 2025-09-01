const React = require('react');
const { shallow } = require('enzyme');

describe('PurchasesFilter component', () => {
    let store;
    let urlUtils;
    let dispatchSpy;
    let watchActionSpy;
    let PurchasesFilter;
    let ProductActions;
    let historyService;
    let component;
    let filterOptions;
    let replaceLocationStub;

    beforeEach(() => {
        store = require('Store').default;
        urlUtils = require('utils/Url').default;
        dispatchSpy = spyOn(store, 'dispatch');
        watchActionSpy = spyOn(store, 'watchAction');
        PurchasesFilter = require('components/RichProfile/PurchaseHistoryList/PurchasesFilter/PurchasesFilter').default;
        ProductActions = require('actions/ProductActions').default;
        historyService = require('services/History').default;
        replaceLocationStub = spyOn(historyService, 'replaceLocation');
        filterOptions = require('components/RichProfile/PurchaseHistoryList/PurchasesFilter/PurchasesFilterOptions').LIST;
        const wrapper = shallow(<PurchasesFilter filterOptions={filterOptions} />);
        component = wrapper.instance();
    });

    describe('ctrlr function', () => {
        it('should set rewards as selected if url as filterby params set as rewards', () => {
            spyOn(urlUtils, 'getParamValueAsSingleString').and.returnValue('rewards');
            const wrapper = shallow(<PurchasesFilter filterOptions={filterOptions} />);
            component = wrapper.instance();
            expect(component.state.selectedOption).toEqual(filterOptions[3]);
        });

        it('should set first element as default is there is not filter selected', () => {
            expect(component.state.selectedOption).toEqual(filterOptions[0]);
        });

        it('should set state after get a filter change', () => {
            const mockedSelectedOption = {
                code: 'filterone',
                name: 'Filter One'
            };
            watchActionSpy.calls.first().args[1]({ filterOption: mockedSelectedOption });

            expect(component.state.selectedOption).toEqual(mockedSelectedOption);
        });
    });

    describe('handleModal function', () => {
        it('should set active flag to open/close modal', () => {
            component.handleModal();
            expect(component.state.isActive).toBeTruthy();
            component.handleModal();
            expect(component.state.isActive).toBeFalsy();
        });
    });

    describe('handleSelect function', () => {
        it('should dispacth selectFilterOption action', () => {
            component.handleSelect('filterone', 'Filter One');
            expect(dispatchSpy).toHaveBeenCalledWith(ProductActions.selectFilterOption('filterone', 'Filter One'));
        });

        it('should remove filterby params if exists and it changing filter', () => {
            spyOn(urlUtils, 'getParamValueAsSingleString').and.returnValue('rewards');
            component.handleSelect('filterone', 'Filter One');
            expect(replaceLocationStub).toHaveBeenCalledWith(
                historyService.normalizeLocation({
                    path: '/purchase-history',
                    queryParams: {}
                })
            );
        });
    });

    describe('getFilterOptionDisplayNameByCode function', () => {
        it('should return proper display name based on option code', () => {
            expect(component.getFilterOptionDisplayNameByCode('online')).toEqual('Online Purchases');
        });
    });
});
