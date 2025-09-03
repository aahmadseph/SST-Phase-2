const React = require('react');
const { shallow } = require('enzyme');
const BrandLaunch = require('components/Brand/BrandLaunch/BrandLaunch').default;

describe('BrandLaunch component', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = enzyme.shallow(<BrandLaunch />);
    });

    it('should render component', () => {
        shallow(<BrandLaunch />);
    });
    it('should render main Grid', () => {
        expect(wrapper.find('Grid').at(0)).not.toBeNull();
    });
    it('should render a Divider', () => {
        expect(wrapper.find('Divider').at(0)).not.toBeNull();
    });
    it('should render a Box', () => {
        expect(wrapper.find('Box').at(0)).not.toBeNull();
    });
});
