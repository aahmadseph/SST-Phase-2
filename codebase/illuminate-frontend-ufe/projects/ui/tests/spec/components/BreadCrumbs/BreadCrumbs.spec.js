const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('BreadCrumbs component', () => {
    let store;
    let dispatch;
    let props;
    let BreadCrumbs;
    let component;
    let breadcrumbsData;
    let setSearchCategory;
    let searchActions;
    let navClickBindings;
    let itemsMock;
    let breadcrumbNames;
    let trackNavClick;
    let replaceSpecialCharacters;

    beforeEach(() => {
        store = require('Store').default;
        dispatch = spyOn(store, 'dispatch');
        replaceSpecialCharacters = require('utils/replaceSpecialCharacters').default;
        searchActions = require('actions/SearchActions').default;
        BreadCrumbs = require('components/BreadCrumbs/BreadCrumbs').default;
        navClickBindings = require('analytics/bindingMethods/pages/all/navClickBindings').default;
        props = {
            catalogKeyName: 'keyword',
            currentId: 'red',
            items: [
                {
                    displayName: 'Makeup',
                    isSelected: true,
                    level: 0,
                    node: 1050000,
                    recordCount: '524'
                },
                {
                    displayName: 'Skincare',
                    level: 1,
                    node: 1050055,
                    recordCount: '129'
                },
                {
                    displayName: 'Fragrance',
                    level: 1,
                    node: 1050072,
                    recordCount: '84'
                }
            ],
            onClick: createSpy('onClick')
        };

        const wrapper = shallow(<BreadCrumbs {...props} />);
        component = wrapper.instance();
        trackNavClick = spyOn(navClickBindings, 'trackNavClick');
    });

    describe('Breadcrumbs component', () => {
        describe('buildBreadcrumbsData', () => {
            describe('if items.length !== 0', () => {
                beforeEach(() => {
                    spyOn(component, 'getCurrentItem');
                });

                it('should call getCurrentItem if items.lenght !== 1', () => {
                    itemsMock = {
                        catalogKeyName: 'keyword',
                        currentId: 'red'
                    };

                    component.buildBreadcrumbsData(itemsMock);
                    expect(component.getCurrentItem).toHaveBeenCalledWith(itemsMock);
                });
            });

            describe('if item.length === 1', () => {
                it('should push item[0] into component.items', () => {
                    const setStateStub = spyOn(component, 'setState');

                    itemsMock = [
                        {
                            displayName: 'Makeup',
                            isSelected: true,
                            level: 0,
                            node: 1050000,
                            recordCount: '524'
                        },
                        {
                            displayName: 'Skincare',
                            level: 1,
                            node: 1050055,
                            recordCount: '129'
                        }
                    ];

                    //createBreadcrumbs is calling buildBreadcrumbsData
                    component.buildBreadcrumbsData(itemsMock);
                    expect(setStateStub).toHaveBeenCalledWith({ items: [itemsMock[0]] });
                });
            });

            describe('if item.subCategories', () => {
                beforeEach(() => {
                    breadcrumbsData = spyOn(component, 'buildBreadcrumbsData');
                });

                it('should call buildBreadcrumbsData if item.subCategories', () => {
                    itemsMock = [
                        {
                            displayName: 'Makeup',
                            isSelected: true,
                            level: 0,
                            node: 1050000,
                            recordCount: '524',
                            subCategories: [
                                {
                                    displayName: 'Value & Gift Sets',
                                    level: 1,
                                    node: 1050048,
                                    recordCount: '49'
                                }
                            ]
                        }
                    ];

                    component.buildBreadcrumbsData(itemsMock);
                    expect(breadcrumbsData).toHaveBeenCalledWith(itemsMock);
                });
            });
        });

        describe('BreadCrumbs.prototype.onClick', () => {
            let setCategory;
            let catalog;
            let e;

            beforeEach(() => {
                setSearchCategory = spyOn(searchActions, 'setSearchCategory');
                setCategory = spyOn(searchActions, 'setCategory');

                e = { preventDefault: () => {} };
                catalog = {
                    catalogItem: {},
                    catalogItemId: ''
                };
                breadcrumbNames = component.props.items.map(item => replaceSpecialCharacters(item.displayName));
            });

            it('execute the correct functions if catalogItem.node && !catalogItem.targetUrl should dispatch setSearchCategory and call the onClick function', () => {
                catalog.catalogItem.node = 1050000;
                component.onClick(e, catalog.catalogItemId, catalog.catalogItem);

                expect(dispatch).toHaveBeenCalledWith(setSearchCategory(catalog.catalogItem.node));
                expect(component.props.onClick).toHaveBeenCalledWith(true, catalog.catalogItem.node);
            });

            it('execute the correct functions if catalogItem.nodeStr && !catalogItem.targetUrl should dispatch setSearchCategory and call the onClick function', () => {
                catalog.catalogItem.nodeStr = 'cat140006';
                component.onClick(e, catalog.catalogItemId, catalog.catalogItem);

                expect(dispatch).toHaveBeenCalledWith(setSearchCategory(catalog.catalogItem.nodeStr));
                expect(component.props.onClick).toHaveBeenCalledWith(true, catalog.catalogItem.nodeStr);
            });

            it('execute the correct functions if nodeValue is not defined and should dispatch setCategory', () => {
                catalog.catalogItem.targetUrl = '/shop/makeup-cosmetics';
                catalog.catalogItemId = '534';

                component.onClick(e, catalog.catalogItemId, catalog.catalogItem);

                expect(dispatch).toHaveBeenCalledWith(setCategory(catalog.catalogItem.targetUrl));
                expect(component.props.onClick).toHaveBeenCalledWith(true, catalog.catalogItemId);
            });

            it('should call trackNavClick with the correct information', () => {
                component.onClick(e, catalog.catalogItemId, catalog.catalogItem);
                expect(trackNavClick).toHaveBeenCalledWith(['breadcrumb nav', ...breadcrumbNames]);
            });
        });

        describe('BreadCrumbs.prototype.getCurrentItem', () => {
            it('should return the correct value', () => {
                itemsMock = [
                    {
                        displayName: 'Makeup',
                        isSelected: true,
                        level: 0,
                        node: 1050000,
                        recordCount: '524',
                        filter: () => {}
                    },
                    {
                        displayName: 'Skincare',
                        level: 1,
                        node: 1050055,
                        recordCount: '129'
                    }
                ];

                const result = component.getCurrentItem(itemsMock);
                expect(result).toEqual(itemsMock[0]);
            });
        });
    });
});
