describe('Filters component', () => {
    let React;
    let shallow;
    let Filters;
    let props;
    let wrapper;

    beforeEach(() => {
        React = require('react');
        shallow = enzyme.shallow;
        Filters = require('components/Catalog/Filters/Filters').default;
        props = {
            refinements: [
                {
                    displayName: 'Brand',
                    type: 'checkboxes'
                },
                {
                    displayName: 'price range',
                    type: 'range'
                }
            ],
            selectedFilters: {},
            appliedFilters: {}
        };

        wrapper = shallow(<Filters {...props} />);
    });

    it('should render a FilterGroup comp for each refinement group', () => {
        expect(wrapper.find('FilterGroup').length).toEqual(4);
    });
});
