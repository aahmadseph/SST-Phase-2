const React = require('react');
const { shallow } = require('enzyme');
const BccComponentList = require('components/Bcc/BccComponentList/BccComponentList').default;
const { COMPONENT_NAMES } = require('utils/BCC').default;

describe('BccComponentList component', () => {
    describe('BccCarousel', () => {
        let items;
        let shallowComponent;
        let carousel;

        beforeEach(() => {
            items = [
                {
                    componentType: COMPONENT_NAMES.CAROUSEL,
                    skus: [{ skuId: 'a' }],
                    displayCount: 5
                }
            ];
        });

        describe('for the default scenario', () => {
            beforeEach(() => {
                shallowComponent = shallow(<BccComponentList items={items} />);
                carousel = shallowComponent.find('BccCarousel');
            });

            it('should render the BccCarousel', () => {
                expect(carousel.length).toBe(1);
            });

            it('should render with prop totalItems equal to skus length', () => {
                expect(carousel.props().totalItems).toBe(items[0].skus.length);
            });
        });

        it('should render Carousel with prop displayCount of 2 if mobile', () => {
            spyOn(Sephora, 'isMobile').and.returnValue(true);
            shallowComponent = shallow(<BccComponentList items={items} />);
            carousel = shallowComponent.find('BccCarousel');
            expect(carousel.props().displayCount).toBe(2);
        });

        it('should render Carousel with prop displayCount of "displayCount" if desktop', () => {
            spyOn(Sephora, 'isMobile').and.returnValue(false);
            shallowComponent = shallow(<BccComponentList items={items} />);
            carousel = shallowComponent.find('BccCarousel');
            expect(carousel.props().displayCount).toBe(items[0].displayCount);
        });

        it('should render Carousel with a default displayCount if displayCount is 0 for desktop', () => {
            items[0].displayCount = 0;
            spyOn(Sephora, 'isMobile').and.returnValue(false);
            shallowComponent = shallow(<BccComponentList items={items} />);
            carousel = shallowComponent.find('BccCarousel');
            expect(carousel.props().displayCount).toBe(4);
        });
    });

    describe('Rewards BccCarousel', () => {
        let items;
        let shallowComponent;
        let rewardsCarousel;

        beforeEach(() => {
            items = [
                {
                    componentType: COMPONENT_NAMES.REWARDS_CAROUSEL,
                    biRewards: [{ skuId: 'b' }],
                    displayCount: 10
                }
            ];
        });

        it('should render with prop totalItems equal to biRewards length', () => {
            shallowComponent = shallow(<BccComponentList items={items} />);
            rewardsCarousel = shallowComponent.find('BccCarousel');
            expect(rewardsCarousel.props().totalItems).toBe(items[0].biRewards.length);
        });
    });

    describe('BccGrid', () => {
        let items;
        let BccGrid;
        let shallowComponent;

        beforeEach(() => {
            items = [
                {
                    componentType: COMPONENT_NAMES.GRID,
                    mWebColumns: 1,
                    desktopColumns: 2,
                    // BccGrid requires an array of components
                    components: []
                }
            ];

            BccGrid = require('components/Bcc/BccGrid/BccGrid').default;
        });

        it('should render the BccGrid', () => {
            shallowComponent = shallow(<BccComponentList items={items} />);
            BccGrid = shallowComponent.find('BccGrid');
            expect(BccGrid.length).toBe(1);
        });

        it('should render BccGrid with prop cols of "mWebColumns" if mobile', () => {
            spyOn(Sephora, 'isMobile').and.returnValue(true);
            shallowComponent = shallow(<BccComponentList items={items} />);
            BccGrid = shallowComponent.find('BccGrid');
            expect(BccGrid.props().mWebColumns).toBe(items[0].mWebColumns);
        });

        it('should render BccGrid with prop cols of "desktopColumns" if desktop', () => {
            spyOn(Sephora, 'isMobile').and.returnValue(true);
            shallowComponent = shallow(<BccComponentList items={items} />);
            BccGrid = shallowComponent.find('BccGrid');
            expect(BccGrid.props().desktopColumns).toBe(items[0].desktopColumns);
        });
    });

    describe('BCCSkuGrid', () => {
        let items;
        let shallowComponent;

        beforeEach(() => {
            items = [
                {
                    componentType: COMPONENT_NAMES.SKU_GRID,
                    skus: [
                        {
                            componentName: 'Sephora Sku Component',
                            componentType: 13,
                            sku: { skuId: '1441583' }
                        }
                    ],
                    title: 'BCC Sku Grid'
                }
            ];
        });

        it('should render the BccSkuGrid', () => {
            shallowComponent = shallow(<BccComponentList items={items} />);
            expect(shallowComponent.find('BccSkuGrid').length).toBe(1);
        });
    });

    describe('BccImage', () => {
        let items;
        let shallowComponent;

        beforeEach(() => {
            items = [{ componentType: COMPONENT_NAMES.IMAGE }];

            shallowComponent = shallow(<BccComponentList items={items} />);
        });

        it('should render the BccImage', () => {
            expect(shallowComponent.find('BccImage').length).toBe(1);
        });
    });

    describe('BccLink', () => {
        let items;
        let BccLink;
        let shallowComponent;

        beforeEach(() => {
            items = [
                {
                    componentType: COMPONENT_NAMES.LINK,
                    targetScreen: {
                        // BccLink requires a target url
                        targetUrl: 'a'
                    }
                }
            ];

            BccLink = require('components/Bcc/BccLink/BccLink').default;
            shallowComponent = shallow(<BccComponentList items={items} />);
            BccLink = shallowComponent.find('BccLink');
        });

        it('should render the BccLink', () => {
            expect(BccLink.length).toBe(1);
        });
    });

    describe('BccLinkGroup', () => {
        let items;
        let shallowComponent;

        beforeEach(() => {
            items = [
                {
                    componentType: COMPONENT_NAMES.LINK_GROUP,
                    // BccLinkGroup requires an array of links
                    links: []
                }
            ];

            shallowComponent = shallow(<BccComponentList items={items} />);
        });

        it('should render the BccLinkGroup', () => {
            expect(shallowComponent.find('BccLinkGroup').length).toBe(1);
        });
    });

    describe('BccMarkdown', () => {
        let items;
        let shallowComponent;

        beforeEach(() => {
            items = [{ componentType: COMPONENT_NAMES.MARKDOWN }];

            shallowComponent = shallow(<BccComponentList items={items} />);
        });

        it('should render the BccMarkdown', () => {
            expect(shallowComponent.find('BccMarkdown').length).toBe(1);
        });
    });

    describe('BccSlideshow', () => {
        let items;
        let shallowComponent;

        beforeEach(() => {
            items = [
                {
                    componentType: COMPONENT_NAMES.SLIDESHOW,
                    // BccSlideshow requires an array of images
                    images: []
                }
            ];

            shallowComponent = shallow(<BccComponentList items={items} />);
        });

        it('should render the BccSlideshow', () => {
            expect(shallowComponent.find('BccSlideshow').length).toBe(1);
        });
    });

    describe('BccVideo', () => {
        let items;
        let shallowComponent;

        beforeEach(() => {
            items = [{ componentType: COMPONENT_NAMES.VIDEO }];

            shallowComponent = shallow(<BccComponentList items={items} />);
        });

        it('should render the BccVideo', () => {
            expect(shallowComponent.find('BccVideo').length).toBe(1);
        });
    });

    describe('BccTargeter', () => {
        let items;
        let shallowComponent;

        beforeEach(() => {
            items = [{ componentType: COMPONENT_NAMES.TARGETER }];

            shallowComponent = shallow(<BccComponentList items={items} />);
        });

        it('should render the BccTargeter', () => {
            expect(shallowComponent.find('BccTargeter').length).toBe(1);
        });
    });

    describe('BccProductFinder', () => {
        let items;
        let shallowComponent;

        beforeEach(() => {
            items = [{ componentType: COMPONENT_NAMES.PRODUCT_FINDER }];

            shallowComponent = shallow(<BccComponentList items={items} />);
        });

        it('should render the BccProductFinder', () => {
            expect(shallowComponent.find('BccProductFinder').length).toBe(1);
        });
    });

    describe('BccPromotion', () => {
        let items;
        let shallowComponent;

        beforeEach(() => {
            items = [{ componentType: COMPONENT_NAMES.PROMOTION }];

            shallowComponent = shallow(<BccComponentList items={items} />);
        });

        it('should render the BccPromotion', () => {
            expect(shallowComponent.find('BccPromotion').length).toBe(1);
        });
    });

    describe('BccPlaceHolderApp', () => {
        let items;
        let shallowComponent;

        beforeEach(() => {
            items = [{ componentType: COMPONENT_NAMES.PLACEHOLDERAPP }];

            shallowComponent = shallow(<BccComponentList items={items} />);
        });

        it('should render the BccPlaceHolderApp', () => {
            expect(shallowComponent.find('BccPlaceHolderApp').length).toBe(1);
        });
    });

    describe('BccStyleWrapper', () => {
        let items;
        let shallowComponent;

        beforeEach(() => {
            items = [
                {
                    // Can be any component, StyleWrapper will wrap the component
                    componentType: COMPONENT_NAMES.PLACEHOLDERAPP,
                    // BccStyleWrapper requires enableTesting to be false in order to render
                    enableTesting: false
                }
            ];

            shallowComponent = shallow(<BccComponentList items={items} />);
        });

        it('should render the BccStyleWrapper', () => {
            expect(shallowComponent.find('BccStyleWrapper').length).toBe(1);
        });
    });

    describe('TestTarget', () => {
        let items;
        let shallowComponent;

        beforeEach(() => {
            items = [
                {
                    // Can be any component, TestTarget will wrap the component
                    componentType: COMPONENT_NAMES.PLACEHOLDERAPP,
                    // TestTarget requires enableTesting to be true in order to render
                    enableTesting: true
                }
            ];

            shallowComponent = shallow(<BccComponentList items={items} />);
        });

        it('should render the TestTarget', () => {
            expect(shallowComponent.find('TestTarget').length).toBe(1);
        });
    });

    describe('BccComponentList.prototype.process', () => {
        let compItems;
        let component;

        beforeEach(() => {
            const wrapper = shallow(<BccComponentList />);
            component = wrapper.instance();
        });

        it('should return an array of components with the same length as compItems', () => {
            compItems = [{ componentType: COMPONENT_NAMES.CAROUSEL }, { componentType: COMPONENT_NAMES.REWARDS_CAROUSEL }];

            const result = component.process(compItems);
            expect(result.length).toBe(compItems.length);
        });

        it('should return an empty array if process method is passed an empty array', () => {
            compItems = [];
            const result = component.process(compItems);
            expect(result).toEqual([]);
        });

        it('should return null if process method is passed null value', () => {
            compItems = null;
            const result = component.process(compItems);
            expect(result).toBeNull();
        });
    });
});
