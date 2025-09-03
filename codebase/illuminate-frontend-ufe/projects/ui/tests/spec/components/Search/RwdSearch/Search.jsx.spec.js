describe('Search Component', () => {
    let React;
    let component;
    let Search;
    let catalogUtils;
    const props = {
        catalog: {
            contextId: '123',
            categoryId: 'someCategoryId'
        },
        getSponsorProducts: () => undefined,
        clearSponsorProducts: () => undefined,
        dispatchMarketingParams: () => {}
    };

    beforeEach(() => {
        React = require('react');
        catalogUtils = require('utils/Catalog').default;
        Search = require('components/Search/Search').default;
        component = enzyme.shallow(<Search {...props} />);
    });

    describe('render method', () => {
        // it('should render div element', () => {
        //     const element = component.find('div');
        //     expect(element.length).toBe(1);
        // });

        it('should render CatalogLayout element', () => {
            const element = component.find('CatalogLayout');
            expect(element.length).toBe(1);
        });
    });

    describe('selectFilters method', () => {
        let applySelectionIfChangedStub;
        let addToSelectionStub;

        const findSelection = filtersToSelect => {
            return component.instance().selectFilters(component.state.selectedFilters, filtersToSelect);
        };

        beforeEach(() => {
            applySelectionIfChangedStub = spyOn(component.instance(), 'applySelectionIfChanged');
            addToSelectionStub = spyOn(catalogUtils, 'addToSelection');
            component.setState({
                selectedFilters: { existingValue: 'someValue' }
            });
        });

        it('should apply selected filters', () => {
            findSelection('someSelection');
            expect(applySelectionIfChangedStub).toHaveBeenCalled();
        });

        it('should call addToSelection method', () => {
            findSelection('someSelection');
            expect(addToSelectionStub).toHaveBeenCalled();
        });
    });

    describe('removeFilterValue', () => {
        let applySelectionIfChangedStub;
        let removeValueFromSelectionStub;

        const removeSelection = (filterKey, filterValue) => {
            return component.instance().removeFilterValue(component.state.selectedFilters, filterKey, filterValue);
        };

        beforeEach(() => {
            applySelectionIfChangedStub = spyOn(component.instance(), 'applySelectionIfChanged');
            removeValueFromSelectionStub = spyOn(catalogUtils, 'removeValueFromSelection');
            component.setState({
                selectedFilters: { existingValue: 'someValue' }
            });
        });

        it('should apply selected filters', () => {
            removeSelection('existingValue', 'someValue');
            expect(applySelectionIfChangedStub).toHaveBeenCalled();
        });

        it('should call removeValueFromSelection method', () => {
            removeSelection('existingValue', 'someValue');
            expect(removeValueFromSelectionStub).toHaveBeenCalled();
        });
    });

    describe('clearFiltersSelection', () => {
        let clearFiltersSelectionStub;

        const clearSelection = (applyFilters, resetSortToDefault) => {
            return component.instance().clearFiltersSelection(applyFilters, resetSortToDefault);
        };

        beforeEach(() => {
            spyOn(catalogUtils, 'resetSelection');
            clearFiltersSelectionStub = spyOn(component.instance(), 'clearFiltersSelection');
            component.setState({
                selectedFilters: { existingValue: 'someValue' }
            });
        });

        it('should call clearFiltersSelection method', () => {
            clearSelection('existingValue', 'someValue');
            expect(clearFiltersSelectionStub).toHaveBeenCalled();
        });
    });

    describe('discardSelection method', () => {
        let applySelectionIfChangedStub;

        const discardSelection = applyFilters => {
            return component.instance().discardSelection(component.state.selectedFilters, applyFilters);
        };

        beforeEach(() => {
            applySelectionIfChangedStub = spyOn(component.instance(), 'applySelectionIfChanged');
            component.setState({
                selectedFilters: { existingValue: 'someValue' }
            });
        });

        it('should discard selected filters', () => {
            discardSelection(true);
            expect(applySelectionIfChangedStub).toHaveBeenCalled();
        });
    });

    describe('getCurrentPageFromCatalog method', () => {
        const getCurrentPageFromCatalog = ({ currentPage }) => {
            return component.instance().getCurrentPageFromCatalog({ currentPage });
        };

        it('should return current page as default value', () => {
            const pageNumber = getCurrentPageFromCatalog({ currentPage: 0 });
            expect(pageNumber).toEqual(1);
        });

        it('should return current page as set value', () => {
            const pageNumber = getCurrentPageFromCatalog({ currentPage: 5 });
            expect(pageNumber).toEqual(5);
        });
    });
});
