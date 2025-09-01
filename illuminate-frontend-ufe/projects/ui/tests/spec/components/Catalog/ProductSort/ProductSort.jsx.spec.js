const React = require('react');
const { shallow } = require('enzyme');
const ProductSort = require('components/Catalog/ProductSort/ProductSort').default;

describe('<ProductSort />', () => {
    it('shoud render ActionMenu', () => {
        const props = {
            refinement: { values: [] },
            selectFilters: () => {}
        };

        const wrapper = shallow(<ProductSort {...props} />, { disableLifecycleMethods: true });
        const actionMenu = wrapper.find('ActionMenu');
        expect(actionMenu.exists()).toBeTruthy();
    });
});
