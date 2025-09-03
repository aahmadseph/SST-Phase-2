const React = require('react');
const { shallow } = require('enzyme');
const FilterGroup = require('components/ProductPage/ShadeFilter/FilterGroup').default;

describe('<FilterGroup />', () => {
    let wrapper;
    let skus;
    let selectedFilters;

    beforeEach(() => {
        skus = [
            {
                skuId: '123',
                smallImage: 'image/smallImage.jpg',
                variationValue: 'variationValue',
                variationDesc: 'variationDesc'
            },
            {
                skuId: '124',
                smallImage: 'image/smallImage.jpg',
                variationValue: 'variationValue',
                variationDesc: 'variationDesc'
            }
        ];
        selectedFilters = ['1234567, 1234568'];
    });

    describe('rendering', () => {
        beforeEach(() => {
            wrapper = shallow(<FilterGroup />);
        });

        it('should render a Dropdown component', () => {
            expect(wrapper.find('Dropdown').length).toEqual(1);
        });

        // it('should render a DropdownTrigger component', () => {
        //     expect(wrapper.find('DropdownTrigger').length).toEqual(1);
        // });

        it('should render a DropdownMenu component', () => {
            expect(wrapper.find('DropdownMenu').length).toEqual(1);
        });

        describe('FilterItem', () => {
            it('should not render a FilterItem component if sku is Falsy', () => {
                wrapper = shallow(<FilterGroup />);
                expect(wrapper.find('FilterItem').length).toEqual(0);
            });

            it('should render the FilterItems if sku is not Falsy', () => {
                wrapper = shallow(
                    <FilterGroup
                        skus={skus}
                        selectedFilters={selectedFilters}
                    />
                );
                expect(wrapper.find('FilterItem').length).toEqual(skus.length);
            });
        });
    });

    describe('Small view modal', () => {
        let props;

        beforeEach(() => {
            props = { isSmallView: true };
            wrapper = shallow(<FilterGroup {...props} />);
        });

        it('should render data-at attribute for the modal title', () => {
            const dataAt = wrapper.findWhere(n => n.prop('data-at') === 'shade_menu_title');

            expect(dataAt.length).toEqual(1);
        });
    });
});
