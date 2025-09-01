const React = require('react');
const { shallow } = require('enzyme');
const FilterItem = require('components/ProductPage/ShadeFilter/FilterItem').default;

describe('<FilterItem />', () => {
    let wrapper;
    let dataAt;

    describe('rendering', () => {
        it('should render an image', () => {
            wrapper = shallow(<FilterItem />);
            expect(wrapper.find('SwatchImage').length).toEqual(1);
        });

        it('should render a data-at attribute for the color swatch option', () => {
            wrapper = shallow(<FilterItem />);

            dataAt = wrapper.findWhere(n => n.prop('data-at') === 'color_swatch_option');

            expect(dataAt.length).toEqual(1);
        });

        it('should render a data-at attribute for the color swatch name', () => {
            wrapper = shallow(<FilterItem />);

            dataAt = wrapper.findWhere(n => n.prop('data-at') === 'color_swatch_name');

            expect(dataAt.length).toEqual(1);
        });
    });
});
