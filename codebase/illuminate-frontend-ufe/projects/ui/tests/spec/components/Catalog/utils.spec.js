const catalogUtils = require('utils/Catalog').default;
const { REFINEMENT_TYPES, REFINEMENT_STATES } = require('utils/CatalogConstants');
const localeUtils = require('utils/LanguageLocale').default;
const getText = localeUtils.getLocaleResourceFile('components/Catalog/locales', 'Catalog');

describe('catalogUtils', () => {
    describe('getSortByApiValue()', () => {
        it('should return valid value for endeca BEST_SELLING if responseSource is endeca', () => {
            const expected = 'P_BEST_SELLING:1::P_RATING:1::P_PROD_NAME:0';

            const apiValue = catalogUtils.getSortByApiValue('endeca', 'BEST_SELLING');

            expect(apiValue).toEqual(expected);
        });

        it('should return valid value for NLP BEST_SELLING if responseSource is NLP', () => {
            const expected = '-1';

            const apiValue = catalogUtils.getSortByApiValue('NLP', 'RELEVANCY');

            expect(apiValue).toEqual(expected);
        });

        it('should return valid value for endeca fallaback BEST_SELLING if responseSource is not present', () => {
            const expected = 'P_BEST_SELLING:1::P_RATING:1::P_PROD_NAME:0';

            const apiValue = catalogUtils.getSortByApiValue(null, 'BEST_SELLING');

            expect(apiValue).toEqual(expected);
        });
    });

    describe('getSelectedOrDefaultSortOption()', () => {
        let refinementValues;

        beforeEach(() => {
            refinementValues = [
                {
                    refinementValue: '1',
                    refinementValueDisplayName: 'Option 1',
                    refinementValueStatus: REFINEMENT_STATES.INACTIVE
                },
                {
                    refinementValue: '2',
                    refinementValueDisplayName: 'Option 2',
                    refinementValueStatus: REFINEMENT_STATES.INACTIVE
                },
                {
                    refinementValue: '3',
                    refinementValueDisplayName: 'Option 3',
                    refinementValueStatus: REFINEMENT_STATES.INACTIVE
                }
            ];
        });

        it('should return selected option if it is CHECKED', () => {
            const expected = refinementValues.find(x => x.refinementValue === '2');
            expected.refinementValueStatus = REFINEMENT_STATES.CHECKED;

            const option = catalogUtils.getSelectedOrDefaultSortOption(refinementValues);

            expect(option).toEqual(expected);
        });

        it('should return selected option if it is Default, but no any CHECKED', () => {
            const expected = refinementValues.find(x => x.refinementValue === '3');
            expected.isDefault = true;

            const option = catalogUtils.getSelectedOrDefaultSortOption(refinementValues);

            expect(option).toEqual(expected);
        });
    });

    describe('createSortRefinement()', () => {
        let responseSource;
        let sortOptionCode;
        let selectedFilters;

        beforeEach(() => {
            responseSource = null;
            sortOptionCode = null;
            selectedFilters = [];
        });

        it('should create a sort refinement with a valid displayName', () => {
            const sortRefinement = catalogUtils.createSortRefinement(responseSource, sortOptionCode, selectedFilters);

            expect(sortRefinement.displayName).toEqual(getText('sort'));
        });

        it('should create a sort refinement with a valid type', () => {
            const sortRefinement = catalogUtils.createSortRefinement(responseSource, sortOptionCode, selectedFilters);

            expect(sortRefinement.type).toEqual(REFINEMENT_TYPES.SORT);
        });

        it('should create a sort refinement with a default BEST_SELLING for endeca', () => {
            responseSource = 'endeca';

            const sortRefinement = catalogUtils.createSortRefinement(responseSource, sortOptionCode, selectedFilters);

            const defaultValue = sortRefinement.values.find(x => x.isDefault === true);
            expect(defaultValue.refinementValue).toEqual('BEST_SELLING');
        });

        it('should create a sort refinement with a default RELEVANCY for NLP', () => {
            responseSource = 'NLP';

            const sortRefinement = catalogUtils.createSortRefinement(responseSource, sortOptionCode, selectedFilters);

            const defaultValue = sortRefinement.values.find(x => x.isDefault === true);
            expect(defaultValue.refinementValue).toEqual('RELEVANCY');
        });
    });

    describe('createFiltersWithSortRefinements()', () => {
        let catalog;
        let selectedFilters;

        beforeEach(() => {
            catalog = {
                responseSource: null,
                sortOptionCode: null,
                refinements: []
            };
            selectedFilters = [];
        });

        it('should add sort refinement unselected as a first alement', () => {
            const filtersAndRefinements = catalogUtils.createFiltersWithSortRefinements(catalog, selectedFilters);

            expect(filtersAndRefinements.withSortRefinements[0].type).toEqual('sort');
            expect(filtersAndRefinements.filters['Sort']?.length === 0).toBeTruthy();
        });

        it('should add refinements after the sort and set appropriate filters state', () => {
            catalog.refinements = [
                {
                    displayName: 'Refinement 1',
                    values: [
                        {
                            refinementValue: '1',
                            refinementValueStatus: REFINEMENT_STATES.INACTIVE
                        },
                        {
                            refinementValue: '2',
                            refinementValueStatus: REFINEMENT_STATES.CHECKED
                        }
                    ]
                }
            ];
            const filtersAndRefinements = catalogUtils.createFiltersWithSortRefinements(catalog, selectedFilters);

            expect(filtersAndRefinements.withSortRefinements[1].displayName).toEqual(catalog.refinements[0].displayName);
            expect(filtersAndRefinements.filters['Refinement 1']).toEqual(['2']);
        });
    });

    describe('addToSelection()', () => {
        const currentSelectedFilters = {
            Sort: ['Descending'],
            Color: ['Red', 'Green', 'Blue']
        };

        it('should add new key with the values if it is not present in current selection', () => {
            const filtersToSelect = { 'Skin Type': ['Combination', 'Dry'] };

            const expectedFilters = {
                Sort: ['Descending'],
                Color: ['Red', 'Green', 'Blue'],
                'Skin Type': ['Combination', 'Dry']
            };

            const newSelectedFilters = catalogUtils.addToSelection(currentSelectedFilters, filtersToSelect);

            expect(newSelectedFilters).toEqual(expectedFilters);
        });

        it('should update the values if they are present in current selection', () => {
            const filtersToSelect = {
                Sort: [],
                Color: ['Red', 'Blue']
            };

            const expectedFilters = {
                Sort: [],
                Color: ['Red', 'Blue']
            };

            const newSelectedFilters = catalogUtils.addToSelection(currentSelectedFilters, filtersToSelect);

            expect(newSelectedFilters).toEqual(expectedFilters);
        });
    });

    describe('removeValueFromSelection()', () => {
        const currentSelectedFilters = {
            Sort: ['Descending'],
            Color: ['Red', 'Green', 'Blue']
        };

        it('should remove appropriate value from a selection', () => {
            const expectedFilters = {
                Sort: ['Descending'],
                Color: ['Green', 'Blue']
            };

            const newSelectedFilters = catalogUtils.removeValueFromSelection(currentSelectedFilters, 'Color', 'Red');

            expect(newSelectedFilters).toEqual(expectedFilters);
        });
    });

    describe('createFiltersToApply()', () => {
        const refinements = [
            {
                displayName: 'Refinement 1',
                type: 'checkboxes',
                values: [
                    {
                        refinementValue: '11',
                        refinementValueStatus: REFINEMENT_STATES.INACTIVE
                    },
                    {
                        refinementValue: '12',
                        refinementValueStatus: REFINEMENT_STATES.CHECKED
                    }
                ]
            },
            {
                displayName: 'Refinement 2',
                type: 'checkboxes',
                values: [
                    {
                        refinementValue: '21',
                        refinementValueStatus: REFINEMENT_STATES.INACTIVE
                    },
                    {
                        refinementValue: '22',
                        refinementValueStatus: REFINEMENT_STATES.INACTIVE
                    },
                    {
                        refinementValue: '23',
                        refinementValueStatus: REFINEMENT_STATES.CHECKED
                    }
                ]
            }
        ];

        it('should apply sellected filters and map-reduce them by types', () => {
            const currentSelectedFilters = {
                'Refinement 1': ['11'],
                'Refinement 2': ['22', '23']
            };

            const expectedFilters = { checkboxes: ['11', '22', '23'] };

            const filtersToApply = catalogUtils.createFiltersToApply(currentSelectedFilters, refinements);

            expect(filtersToApply).toEqual(expectedFilters);
        });
    });

    describe('resetSelection()', () => {
        const currentSelectedFilters = {
            Sort: ['Descending'],
            Color: ['Red', 'Green', 'Blue']
        };

        it('should reset all selection if resetSortToDefault is true', () => {
            const expectedFilters = {
                Sort: [],
                Color: []
            };

            const newSelectedFilters = catalogUtils.resetSelection(currentSelectedFilters, true);

            expect(newSelectedFilters).toEqual(expectedFilters);
        });

        it('should reset selection, but keep the sort if resetSortToDefault is false', () => {
            const expectedFilters = {
                Sort: ['Descending'],
                Color: []
            };

            const newSelectedFilters = catalogUtils.resetSelection(currentSelectedFilters, false);

            expect(newSelectedFilters).toEqual(expectedFilters);
        });

        describe('parseCustomRangeValues()', () => {
            it('should map string to object', () => {
                const refinementValue = 'pl=10&ph=20&ptype=manual';
                const expectedValues = {
                    pl: '10',
                    ph: '20',
                    ptype: 'manual'
                };

                const values = catalogUtils.parseCustomRangeValues(refinementValue);

                expect(values).toEqual(expectedValues);
            });
        });

        describe('parseCustomRangeValues()', () => {
            it('should map to $10 - $20, if both min and max values specifed', () => {
                const value = 'pl=10&ph=20&ptype=manual';
                const expectedDisplayName = '$10 - $20';

                const displayName = catalogUtils.createCustomRangeDisplayName(value);

                expect(displayName).toEqual(expectedDisplayName);
            });

            it('should map to $0 - $20, if only max value specified', () => {
                const value = 'pl=min&ph=20&ptype=manual';
                const expectedDisplayName = '$0 - $20';

                const displayName = catalogUtils.createCustomRangeDisplayName(value);

                expect(displayName).toEqual(expectedDisplayName);
            });

            it('should map to displayName with $10 and above, if only min value specified', () => {
                const value = 'pl=10&ph=max&ptype=manual';
                const expectedDisplayName = `$10 ${getText('andAbove')}`;

                const displayName = catalogUtils.createCustomRangeDisplayName(value);

                expect(displayName).toEqual(expectedDisplayName);
            });
        });
    });
});
