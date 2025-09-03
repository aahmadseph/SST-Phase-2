const React = require('react');
// eslint-disable-next-line no-undef
const shallow = enzyme.shallow;

describe('<BiBackground/> component', function () {
    let BiBackground;
    let wrapper;

    beforeEach(() => {
        BiBackground = require('components/RichProfile/BeautyInsider/BiBackground/BiBackground').default;
    });
    it('should render element with data-at attribute', () => {
        wrapper = shallow(<BiBackground />);
        const dataAt = wrapper.findWhere(n => n.name() === 'Box' && n.prop('data-at') === `${Sephora.debug.dataAt('bi_section')}`);
        expect(dataAt.length).toEqual(1);
    });
});
