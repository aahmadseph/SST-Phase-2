const React = require('react');
const { shallow } = require('enzyme');
const ProductBreadCrumbs = require('components/ProductPage/ProductBreadCrumbs/ProductBreadCrumbs').default;

describe('<ProductBreadCrumbs />', () => {
    let parentCategory;
    beforeEach(() => {
        parentCategory = {
            categoryId: 'cat920041',
            displayName: 'Shampoo',
            targetUrl: '/shop/Shampoo',
            parentCategory: {
                categoryId: 'cat9200',
                displayName: 'Shampoo & Conditioner',
                targetUrl: '/shop/Shampoo&Conditioner'
            }
        };
    });
    it('should be rendered BreadCrumb', () => {
        // Act
        const wrapper = shallow(<ProductBreadCrumbs parentCategory={parentCategory} />);
        expect(wrapper.find('BreadCrumbs').length).toEqual(1);
    });

    it('should set items with breadCrumbs array', () => {
        const result = [
            {
                displayName: 'Shampoo & Conditioner',
                targetUrl: '/shop/Shampoo&Conditioner'
            },
            {
                displayName: 'Shampoo',
                targetUrl: '/shop/Shampoo'
            }
        ];
        // Act
        const wrapper = shallow(<ProductBreadCrumbs parentCategory={parentCategory} />);
        expect(JSON.stringify(wrapper.find('BreadCrumbs').props().items)).toEqual(JSON.stringify(result));
    });
});
