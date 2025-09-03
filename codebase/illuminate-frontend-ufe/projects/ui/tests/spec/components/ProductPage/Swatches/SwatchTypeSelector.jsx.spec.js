const { mount } = require('enzyme');
const React = require('react');
const SwatchTypeSelector = require('components/ProductPage/Swatches/SwatchTypeSelector').default;

describe('SwatchTypeSelector', () => {
    const props = {
        options: ['GRID', 'LIST'],
        onSelect: () => {},
        activeType: 'GRID'
    };

    it('Should render default, grid, list text option', () => {
        // Control
        const wrapper = mount(<SwatchTypeSelector {...props} />);
        expect(wrapper.find('[data-at="grid_btn"]')).toBeDefined();
        expect(wrapper.find('[data-at="list_btn"]')).toBeDefined();
    });
});
