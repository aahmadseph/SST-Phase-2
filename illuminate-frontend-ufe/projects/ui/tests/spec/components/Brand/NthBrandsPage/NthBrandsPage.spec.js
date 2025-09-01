/* eslint-disable no-unused-vars */
describe('NthBrandsPage', () => {
    let React;
    let NthBrandsPage;
    let component;
    let catalogUtils;
    const props = {
        catalog: {
            contextId: '123',
            categoryId: 'someCategoryId'
        },
        dispatchMarketingParams: () => {}
    };

    beforeEach(() => {
        React = require('react');
        catalogUtils = require('utils/Catalog').default;
        NthBrandsPage = require('components/Brand/NthBrandsPage/NthBrandsPage').default;
        component = enzyme.shallow(<NthBrandsPage {...props} />);
        component.setState({
            selectedFilters: {},
            prevContextId: '123'
        });
    });

    describe('selectFilters', () => {
        let response;
        let applySelectionIfChangedStub;
        let addToSelectionStub;

        const findSelection = filtersToSelect => {
            return (response = component.instance().selectFilters(component.state.selectedFilters, filtersToSelect));
        };

        beforeEach(() => {
            applySelectionIfChangedStub = spyOn(component.instance(), 'applySelectionIfChanged');
            addToSelectionStub = spyOn(catalogUtils, 'addToSelection');
            component.setState({
                selectedFilters: { existingValue: 'someValue' }
            });
        });

        it('should apply selected filters', () => {
            const newSelection = findSelection('someSelection');
            expect(applySelectionIfChangedStub).toHaveBeenCalled();
        });

        it('should call addToSelection method', () => {
            const newSelection = findSelection('someSelection');
            expect(addToSelectionStub).toHaveBeenCalled();
        });
    });

    describe('removeFilterValue', () => {
        let response;
        let applySelectionIfChangedStub;
        let removeValueFromSelectionStub;

        const removeSelection = (filterKey, filterValue) => {
            return (response = component.instance().removeFilterValue(component.state.selectedFilters, filterKey, filterValue));
        };

        beforeEach(() => {
            applySelectionIfChangedStub = spyOn(component.instance(), 'applySelectionIfChanged');
            removeValueFromSelectionStub = spyOn(catalogUtils, 'removeValueFromSelection');
            component.setState({
                selectedFilters: { existingValue: 'someValue' }
            });
        });

        it('should apply selected filters', () => {
            const newSelection = removeSelection('existingValue', 'someValue');
            expect(applySelectionIfChangedStub).toHaveBeenCalled();
        });

        it('should call removeValueFromSelection method', () => {
            const newSelection = removeSelection('existingValue', 'someValue');
            expect(removeValueFromSelectionStub).toHaveBeenCalled();
        });
    });

    describe('clearFiltersSelection', () => {
        let response;
        let resetSelectionStub;
        let clearFiltersSelectionStub;

        const clearSelection = (applyFilters, resetSortToDefault) => {
            return (response = component.instance().clearFiltersSelection(applyFilters, resetSortToDefault));
        };

        beforeEach(() => {
            resetSelectionStub = spyOn(catalogUtils, 'resetSelection');
            clearFiltersSelectionStub = spyOn(component.instance(), 'clearFiltersSelection');
            component.setState({
                selectedFilters: { existingValue: 'someValue' }
            });
        });

        it('should call clearFiltersSelection method', () => {
            const newSelection = clearSelection('existingValue', 'someValue');
            expect(clearFiltersSelectionStub).toHaveBeenCalled();
        });
    });

    describe('render', () => {
        it('should render the div component', () => {
            expect(component.find('div').length).toBe(1);
        });

        it('should render the CatalogLayout component', () => {
            expect(component.find('CatalogLayout').length).toBe(1);
        });
    });
});
