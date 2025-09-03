/* eslint-disable object-curly-newline */
describe('Swatches component', () => {
    let React;
    // eslint-disable-next-line no-undef
    let shallow;
    let Swatches;
    let store;
    let state = {};

    beforeEach(() => {
        React = require('react');
        // eslint-disable-next-line no-undef
        shallow = enzyme.shallow;
        store = require('Store').default;
        Swatches = require('components/AddReview/SelectShade/Swatches/Swatches').default;
    });

    it('should contain "data-at" attribute set to "product_refinement"', () => {
        // Arrange
        spyOn(Sephora.debug, 'dataAt').and.callFake(value => value);
        store.getState().page = state = {
            product: {
                regularChildSkus: [
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
                ],
                skuSelectorType: 'Image'
            }
        };

        // Act
        const wrapper = shallow(<Swatches />).setState(state);

        // Assert
        expect(wrapper.find({ 'data-at': 'product_refinement' }).exists()).toBeTruthy();
    });

    it('should output one or more ProductSwatchItem components within Quick Look', () => {
        // Arrange
        const props = {
            isQuickLookModal: true
        };

        store.getState().page = {
            product: {
                regularChildSkus: [
                    {
                        typeDisplayName: '',
                        skuId: '123'
                    }
                ],
                skuSelectorType: 'Image'
            }
        };

        // Act
        const wrapper = shallow(<Swatches {...props} />);

        state = {
            toggledSku: {
                skuId: '123'
            }
        };

        wrapper.setState(state);

        // Assert
        expect(wrapper.find('ProductSwatchItem').length).toEqual(1);
    });
});
