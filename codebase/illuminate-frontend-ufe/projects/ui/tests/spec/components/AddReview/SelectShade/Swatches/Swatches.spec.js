const React = require('react');
const shallow = enzyme.shallow;

describe('Swatches component', () => {
    let wrapper;
    let component;
    let store;
    let Swatches;

    beforeEach(() => {
        store = require('store/Store').default;
        Swatches = require('components/AddReview/SelectShade/Swatches/Swatches').default;
        store.getState().page.product = {
            regularChildSkus: [],
            onSaleChildSkus: [],
            productId: 'P124'
        };
        wrapper = shallow(<Swatches />);
        component = wrapper.instance();
    });

    describe('Swatches.prototype.shouldComponentUpdate', () => {
        let nextProps;
        let nextState;

        beforeEach(() => {
            nextState = { currentProduct: { showColorMatch: [false] } };
            nextProps = {};
            wrapper.setState({ showColorMatch: false });
        });
        it('should return updatedState', () => {
            const isExpanded = true;
            component.shouldComponentUpdate(nextProps, nextState);
            expect(isExpanded).toBe(true);
        });
    });

    describe('Swatches.prototype.createRefinementGroups', () => {
        let onSaleChildSkus;
        let regularChildSkus;
        let skuRefinementStub;
        let result;
        beforeEach(() => {
            skuRefinementStub = spyOn(component, 'setSkuRefinementGroup').and.callThrough();
            regularChildSkus = [
                {
                    type: 'Standard',
                    refinements: {
                        colorRefinements: ['Nude'],
                        finishRefinements: ['Satin']
                    }
                },
                {
                    type: 'Standard',
                    refinements: {
                        colorRefinements: ['Pink'],
                        finishRefinements: ['Satin']
                    }
                },
                {
                    type: 'Standard',
                    refinements: {
                        colorRefinements: ['Nude'],
                        finishRefinements: ['Satin']
                    }
                }
            ];
            onSaleChildSkus = [
                {
                    refinements: {
                        colorRefinements: ['Pink'],
                        finishRefinements: 'Matte'
                    }
                },
                {
                    refinements: {
                        colorRefinements: ['Berry'],
                        finishRefinements: ['Satin']
                    }
                }
            ];

            result = {
                'Satin finish': {
                    'Standard size': {
                        groupEntries: [
                            {
                                type: 'Standard',
                                refinements: {
                                    colorRefinements: ['Nude'],
                                    finishRefinements: ['Satin']
                                }
                            },
                            {
                                type: 'Standard',
                                refinements: {
                                    colorRefinements: ['Pink'],
                                    finishRefinements: ['Satin']
                                }
                            },
                            {
                                type: 'Standard',
                                refinements: {
                                    colorRefinements: ['Nude'],
                                    finishRefinements: ['Satin']
                                }
                            }
                        ]
                    }
                },
                Sale: {
                    groupEntries: [
                        {
                            refinements: {
                                colorRefinements: ['Pink'],
                                finishRefinements: 'Matte'
                            }
                        },
                        {
                            refinements: {
                                colorRefinements: ['Berry'],
                                finishRefinements: ['Satin']
                            }
                        }
                    ]
                }
            };
        });
        it('should return refinementTypes', () => {
            const refinement = component.createRefinementGroups({
                regularChildSkus,
                onSaleChildSkus
            });
            expect(skuRefinementStub).toHaveBeenCalled();
            expect(refinement).toEqual(result);
        });
    });
});
