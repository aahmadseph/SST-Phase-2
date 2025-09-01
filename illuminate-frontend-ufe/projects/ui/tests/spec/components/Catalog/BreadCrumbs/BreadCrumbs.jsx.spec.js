const React = require('react');
const { shallow } = require('enzyme');

describe('BreadCrumbs component', () => {
    let props;
    let BreadCrumbs;
    let wrapper;

    beforeEach(() => {
        BreadCrumbs = require('components/Catalog/BreadCrumbs/BreadCrumbs').default;
    });

    describe('Breadcrumbs', () => {
        describe('BreadCrumb props', () => {
            describe('it should render up to 2 level', () => {
                beforeEach(() => {
                    props = {
                        categoryId: '12',
                        categories: [
                            {
                                displayName: 'Makeup',
                                level: 0,
                                categoryId: '1',
                                subCategories: [
                                    {
                                        displayName: 'Face',
                                        categoryId: '12',
                                        isSelected: true,
                                        level: 1,
                                        subCategories: [
                                            {
                                                displayName: 'Foundation',
                                                categoryId: '121',
                                                level: 2
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    };
                });

                it('Just CategoryID match second level, its should render Up to 2 level when id is equal', () => {
                    wrapper = shallow(<BreadCrumbs {...props} />);
                    expect(wrapper.find('li').length).toEqual(2);
                });
            });

            describe('it should render up to 3 level', () => {
                beforeEach(() => {
                    props = {
                        categoryId: '121',
                        categories: [
                            {
                                displayName: 'Makeup',
                                level: 0,
                                categoryId: '1',
                                subCategories: [
                                    {
                                        displayName: 'Face',
                                        categoryId: '12',
                                        level: 1,
                                        subCategories: [
                                            {
                                                displayName: 'Foundation',
                                                isSelected: true,
                                                categoryId: '121',
                                                level: 2
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    };
                });
                it('Just CategoryID match third level, its should render Up to 3 level when id is equal', () => {
                    wrapper = shallow(<BreadCrumbs {...props} />);
                    expect(wrapper.find('li').length).toEqual(3);
                });
            });
        });
    });
});
