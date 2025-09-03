const React = require('react');
const { shallow } = require('enzyme');
const ProductSort = require('components/Product/ProductSort/ProductSort').default;

describe('ProductSort component', () => {
    let shallowComponent;
    const sortOptions = [
        {
            code: 'recently',
            name: 'Recently Added'
        },
        {
            code: 'brandNameASC',
            name: 'Brand name A-Z'
        },
        {
            code: 'brandNameDESC',
            name: 'Brand name Z-A'
        },
        {
            code: 'priceHighToLow',
            name: 'Price high to low'
        },
        {
            code: 'priceLowToHigh',
            name: 'Price low to high'
        }
    ];

    describe('rendering component for desktop', () => {
        beforeEach(() => {
            spyOn(Sephora, 'isMobile').and.returnValue(false);
            shallowComponent = shallow(
                <ProductSort
                    sortOptions={sortOptions}
                    currentSortSelected='recently'
                />
            );
        });

        describe('ActionMenu', () => {
            let ActionMenu;

            beforeEach(() => {
                ActionMenu = shallowComponent.find('ActionMenu');
            });

            it('should have id of sort_menu', () => {
                expect(ActionMenu.prop('id')).toEqual('sort_menu');
            });

            it('should have an array of children with two elements', () => {
                expect(ActionMenu.prop('children').length).toEqual(2);
            });

            it('first child should be Sort By: ', () => {
                expect(ActionMenu.prop('children')[0]).toEqual('Sort by: ');
            });

            it('second child should be current selected sort option', () => {
                expect(ActionMenu.prop('children')[1].props.children).toEqual('Recently Added');
            });

            it('should pass a list of 5 options as a prop', () => {
                expect(ActionMenu.prop('options').length).toEqual(5);
            });

            it('each option should contain correct code, chldren, onClick props', () => {
                const options = ActionMenu.prop('options');

                for (let i = 0; i < options.length; i++) {
                    expect(options[i].code).toEqual(sortOptions[i].code);
                    expect(options[i].children).toEqual(sortOptions[i].name);
                    expect(typeof options[i].onClick).toBe('function');
                }
            });
        });
    });

    describe('rendering component for mobile', () => {
        beforeEach(() => {
            spyOn(Sephora, 'isMobile').and.returnValue(true);
            shallowComponent = shallow(
                <ProductSort
                    sortOptions={sortOptions}
                    currentSortSelected='recently'
                />
            );
        });

        describe('First Link', () => {
            let linkElem;

            beforeEach(() => {
                linkElem = shallowComponent.find('Link').get(0);
            });

            it('should have first child be Sort By: ', () => {
                expect(linkElem.props.children[0]).toEqual('Sort by: ');
            });

            it('should have second child be current selected sort option', () => {
                expect(linkElem.props.children[1].props.children).toEqual('Recently Added');
            });
        });

        describe('First Option Link', () => {
            let linkElem;

            beforeEach(() => {
                linkElem = shallowComponent.find('Link').get(1);
            });

            it('should contain option code as key', () => {
                expect(linkElem.key).toEqual(sortOptions[0].code);
            });

            it('should have an onClick function', () => {
                expect(typeof linkElem.props.onClick).toEqual('function');
            });

            it('should have child as option name', () => {
                expect(linkElem.props.children.props.children[0]).toEqual(sortOptions[0].name);
            });
        });

        describe('Second Option Link', () => {
            let linkElem;

            beforeEach(() => {
                linkElem = shallowComponent.find('Link').get(2);
            });

            it('should contain option code as key', () => {
                expect(linkElem.key).toEqual(sortOptions[1].code);
            });

            it('should have an onClick function', () => {
                expect(typeof linkElem.props.onClick).toEqual('function');
            });

            it('should have child as option name', () => {
                expect(linkElem.props.children.props.children[0]).toEqual(sortOptions[1].name);
            });
        });

        describe('Third Option Link', () => {
            let linkElem;

            beforeEach(() => {
                linkElem = shallowComponent.find('Link').get(3);
            });

            it('should contain option code as key', () => {
                expect(linkElem.key).toEqual(sortOptions[2].code);
            });

            it('should have an onClick function', () => {
                expect(typeof linkElem.props.onClick).toEqual('function');
            });

            it('should have child as option name', () => {
                expect(linkElem.props.children.props.children[0]).toEqual(sortOptions[2].name);
            });
        });

        describe('Fourth Option Link', () => {
            let linkElem;

            beforeEach(() => {
                linkElem = shallowComponent.find('Link').get(4);
            });

            it('should contain option code as key', () => {
                expect(linkElem.key).toEqual(sortOptions[3].code);
            });

            it('should have an onClick function', () => {
                expect(typeof linkElem.props.onClick).toEqual('function');
            });

            it('should have child as option name', () => {
                expect(linkElem.props.children.props.children[0]).toEqual(sortOptions[3].name);
            });
        });

        describe('Fifth Option Link', () => {
            let linkElem;

            beforeEach(() => {
                linkElem = shallowComponent.find('Link').get(5);
            });

            it('should contain option code as key', () => {
                expect(linkElem.key).toEqual(sortOptions[4].code);
            });

            it('should have an onClick function', () => {
                expect(typeof linkElem.props.onClick).toEqual('function');
            });

            it('should have child as option name', () => {
                expect(linkElem.props.children.props.children[0]).toEqual(sortOptions[4].name);
            });
        });
    });
});
