/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = require('enzyme');

describe('TopNavItem component', () => {
    let TopNavItem;
    let shallowComponent;
    let props;
    let state;

    beforeEach(() => {
        TopNavItem = require('components/Header/TopNavItem/TopNavItem').default;
        state = { isOpen: false };
    });

    describe('render', () => {
        beforeEach(() => {
            props = {
                index: 1,
                item: {
                    componentName: 'Sephora RWD Link Component',
                    componentType: 92,
                    enableTesting: false,
                    isActive: 'true',
                    restrictedCountries: [],
                    targetWindow: 0,
                    titleText: 'Featured Groups',
                    componentList: [
                        {
                            componentName: 'Sephora RWD Link Component',
                            componentType: 92,
                            enableTesting: false,
                            isActive: 'true',
                            restrictedCountries: [],
                            targetUrl: 'https://community.sephora.com/t5/Skincare-Aware/bd-p/skincare-aware',
                            targetWindow: 0,
                            titleText: 'Skincare Aware'
                        },
                        {
                            componentName: 'Sephora RWD Link Component',
                            componentType: 92,
                            enableTesting: false,
                            isActive: 'true',
                            restrictedCountries: [],
                            targetUrl: '/beauty/beauty-best-sellers',
                            targetWindow: 0,
                            titleText: 'Bestsellers'
                        }
                    ]
                }
            };
            shallowComponent = shallow(<TopNavItem {...props} />);
        });

        it('should render a dropdown for items that have componentList', () => {
            expect(shallowComponent.find('Dropdown').length).toEqual(0);
        });

        it('should render a dropdown trigger for items that have componentList', () => {
            expect(shallowComponent.findWhere(n => n.key() === 'topNavItemTrigger').length).toEqual(0);
        });
    });

    describe('for items with no componentList', () => {
        beforeEach(() => {
            props = {
                index: 1,
                item: {
                    componentName: 'Sephora RWD Link Component',
                    componentType: 92,
                    enableTesting: false,
                    isActive: 'true',
                    restrictedCountries: [],
                    targetWindow: 0,
                    titleText: 'Featured Groups'
                }
            };
        });
        it('should render links for items that have no componentList', () => {
            shallowComponent = shallow(<TopNavItem {...props} />);
            expect(shallowComponent.findWhere(n => n.key() === 'topNavItemLink').length).toEqual(1);
        });
    });
});
