const React = require('react');
const { shallow } = require('enzyme');

describe('Categories component', () => {
    let props;
    let Categories;
    let wrapper;

    beforeEach(() => {
        Categories = require('components/Catalog/Categories/Categories').default;
        props = {
            categories: [
                {
                    displayName: 'Makeup',
                    isSelected: true,
                    level: 0,
                    categoryId: '1',
                    subCategories: [
                        {
                            displayName: 'Face',
                            isSelected: true,
                            categoryId: '12',
                            level: 0,
                            subCategories: [
                                {
                                    displayName: 'Foundation',
                                    isSelected: true,
                                    categoryId: '121',
                                    level: 0
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    });

    it('should render CategoryList', () => {
        wrapper = shallow(<Categories {...props} />);
        const renderCategoryList = wrapper.findWhere(n => n.name() === 'CategoryList');
        expect(renderCategoryList.length).toEqual(1);
    });

    it('should just pass one last SubCategories', () => {
        wrapper = shallow(<Categories {...props} />);
        const component = wrapper.instance();
        expect(component.getNthLevelCategories(props.categories).length).toEqual(1);
    });
});
