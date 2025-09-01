describe('FilterPills component', () => {
    let React;
    let shallow;
    let FilterPills;
    let wrapper;
    let catalogUtils;

    beforeEach(() => {
        React = require('react');
        shallow = enzyme.shallow;
        FilterPills = require('components/Catalog/Filters/FilterPills/FilterPills').default;
        catalogUtils = require('utils/Catalog').default;
    });

    it('should render the selected filter', () => {
        const brandProps = {
            selectedFilters: { Brand: ['filters[Brand]=bareMinerals'] },
            refinements: [
                {
                    displayName: 'Brand',
                    type: 'checkboxes',
                    values: [
                        {
                            count: 123,
                            refinementValue: 'filters[Brand]=bareMinerals',
                            refinementValueDisplayName: 'bareMinerals',
                            refinementValueStatus: 1
                        }
                    ]
                }
            ]
        };

        wrapper = shallow(<FilterPills {...brandProps} />);

        const compType = wrapper.findWhere(n => n.name() === 'Pill' && n.props().children === 'Brand');

        expect(compType.length).toEqual(1);
    });

    it('should render the selected sort option', () => {
        const sortProps = {
            selectedFilters: { Sort: ['BEST_SELLING'] },
            refinements: [
                {
                    displayName: 'Sort',
                    type: 'sort',
                    values: [
                        {
                            refinementValue: 'BEST_SELLING',
                            refinementValueDisplayName: 'Bestselling',
                            refinementValueStatus: 2
                        }
                    ]
                }
            ]
        };

        const selectedSortOpt = {
            refinementValue: 'BEST_SELLING',
            refinementValueDisplayName: 'Bestselling',
            refinementValueStatus: 2
        };

        spyOn(catalogUtils, 'getSelectedOrDefaultSortOption').and.returnValue(selectedSortOpt);
        wrapper = shallow(<FilterPills {...sortProps} />);

        const compType = wrapper.findWhere(n => n.name() === 'Pill' && n.props().children === 'Sort: Bestselling');

        expect(compType.length).toEqual(1);
    });
});
