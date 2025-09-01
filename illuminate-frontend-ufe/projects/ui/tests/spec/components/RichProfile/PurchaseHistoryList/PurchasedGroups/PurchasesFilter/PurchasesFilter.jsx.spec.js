const React = require('react');
const { shallow } = require('enzyme');

describe('<PurchasesFilter>', () => {
    let PurchasesFilter;
    let shallowComponent;

    const filterOptions = [
        {
            code: 'both',
            name: 'All'
        },
        {
            code: 'online',
            name: 'Online Purchases'
        }
    ];

    // eslint-disable-next-line prefer-const
    PurchasesFilter = require('components/RichProfile/PurchaseHistoryList/PurchasesFilter/PurchasesFilter').default;

    describe('rendering component for desktop', () => {
        beforeEach(() => {
            spyOn(Sephora, 'isMobile').and.returnValue(false);
            shallowComponent = shallow(
                <PurchasesFilter
                    filterOptions={filterOptions}
                    currentFilterSelected='both'
                />
            );
        });

        describe('ActionMenu', () => {
            let actionMenuElem;

            beforeEach(() => {
                actionMenuElem = shallowComponent.find('ActionMenu').get(0);
            });

            it('should have id of filter_menu', () => {
                expect(actionMenuElem.props.id).toEqual('filter_menu');
            });

            it('should have an array of children with two elements', () => {
                expect(actionMenuElem.props.children.length).toEqual(2);
            });

            it('first child should be Sort By: ', () => {
                expect(actionMenuElem.props.children[0]).toEqual('Filter by: ');
            });

            it('second child should be current selected sort option', () => {
                expect(actionMenuElem.props.children[1].props.children).toEqual('All');
            });

            it('should pass a list of 5 options as a prop', () => {
                expect(actionMenuElem.props.options.length).toEqual(2);
            });

            it('each option should contain correct code, chldren, onClick props', () => {
                for (let i = 0; i < actionMenuElem.props.options.length; i++) {
                    expect(actionMenuElem.props.options[i].code).toEqual(filterOptions[i].code);
                    expect(actionMenuElem.props.options[i].children).toEqual(filterOptions[i].name);
                    expect(typeof actionMenuElem.props.options[i].onClick).toBe('function');
                }
            });
        });
    });

    describe('rendering component for mobile', () => {
        beforeEach(() => {
            spyOn(Sephora, 'isMobile').and.returnValue(true);
            shallowComponent = shallow(
                <PurchasesFilter
                    filterOptions={filterOptions}
                    currentFilterSelected='both'
                />
            );
        });

        describe('First Link', () => {
            let linkElem;

            beforeEach(() => {
                linkElem = shallowComponent.find('Link').get(0);
            });

            it('should have first child be Sort By: ', () => {
                expect(linkElem.props.children[0]).toEqual('Filter by: ');
            });

            it('should have second child be current selected sort option', () => {
                expect(linkElem.props.children[1].props.children).toEqual('All');
            });
        });

        describe('First Option Link', () => {
            let linkElem;

            beforeEach(() => {
                linkElem = shallowComponent.find('Link').get(1);
            });

            it('should contain option code as key', () => {
                expect(linkElem.key).toEqual(filterOptions[0].code);
            });

            it('should have an onClick function', () => {
                expect(typeof linkElem.props.onClick).toEqual('function');
            });

            it('should have child as option name', () => {
                expect(linkElem.props.children.props.children[0]).toEqual(filterOptions[0].name);
            });
        });

        describe('Second Option Link', () => {
            let linkElem;

            beforeEach(() => {
                linkElem = shallowComponent.find('Link').get(2);
            });

            it('should contain option code as key', () => {
                expect(linkElem.key).toEqual(filterOptions[1].code);
            });

            it('should have an onClick function', () => {
                expect(typeof linkElem.props.onClick).toEqual('function');
            });

            it('should have child as option name', () => {
                expect(linkElem.props.children.props.children[0]).toEqual(filterOptions[1].name);
            });
        });
    });
});
