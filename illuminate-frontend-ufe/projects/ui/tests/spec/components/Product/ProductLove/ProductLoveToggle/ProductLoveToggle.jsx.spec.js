const React = require('react');
const { shallow } = require('enzyme');
const ProductLoveToggle = require('components/Product/ProductLove/ProductLoveToggle/ProductLoveToggle').default;

describe('ProductLoveToggle component', () => {
    let props;
    let wrapper;

    it('should set value for Icon', () => {
        props = { sku: { skuId: '1234' } };
        wrapper = shallow(<ProductLoveToggle {...props} />);

        wrapper.setState({ hasHeart: true });
        expect(wrapper.find('Icon').props().name).toBe('heart');
    });
});
