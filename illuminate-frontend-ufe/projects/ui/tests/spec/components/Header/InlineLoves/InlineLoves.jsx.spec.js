/* eslint-disable object-curly-newline */
const React = require('react');
const { shallow } = require('enzyme');
const {
    ASYNC_PAGE_LOAD,
    PAGE_TYPES: { LOVES_MODAL }
} = require('analytics/constants').default;

describe('InlineLoves component', () => {
    let shallowComponent;
    let InlineLoves;
    let analyticsUtils;
    let processEvent;
    let loves;
    let onlyAFewLeftInLovesList;
    let Location;

    beforeEach(() => {
        InlineLoves = require('components/Header/InlineLoves/InlineLoves').default;
        Location = require('utils/Location').default;
        loves = [
            {
                targetUrl: '/product',
                skuId: '123456',
                skuImages: [],
                brandName: 'Fenty',
                productName: 'UltraHD concealer'
            }
        ];

        loves = [
            {
                targetUrl: '/product',
                skuId: '123456',
                skuImages: [],
                brandName: 'Fenty',
                productName: 'UltraHD concealer',
                onlyFewLeft: true
            }
        ];
    });

    describe('trackNavClick analytics', () => {
        beforeEach(() => {
            analyticsUtils = require('analytics/utils').default;
            processEvent = require('analytics/processEvent').default;
            shallowComponent = shallow(<InlineLoves />);
        });
        it('should track click on Loves Icon link and process for async load for Small Viewport', () => {
            // Arrange
            spyOn(window, 'matchMedia').and.callFake(() => ({ matches: false }));
            const processStub = spyOn(processEvent, 'process');
            digitalData.page.attributes.sephoraPageInfo.pageName = 'original pageName';
            const eventData = {
                data: {
                    pageName: 'loves modal:lists-loves modal:n/a:*',
                    pageType: LOVES_MODAL,
                    pageDetail: 'lists-loves modal',
                    previousPageName: 'original pageName',
                    navigationInfo: analyticsUtils.buildNavPath(['top nav', 'loves icon'])
                }
            };

            // Act
            shallowComponent.instance().trackNavClick();

            // Assert
            expect(processStub).toHaveBeenCalledWith(ASYNC_PAGE_LOAD, eventData);
        });

        it('should call setNextPageData when user clicks on Loves Icon link for not Small Viewport', () => {
            // Arrange
            spyOn(window, 'matchMedia').and.callFake(() => ({ matches: true }));
            const setNextPageData = spyOn(analyticsUtils, 'setNextPageData');
            const navigationInfo = analyticsUtils.buildNavPath(['top nav', 'loves icon']);

            // Act
            shallowComponent.instance().trackNavClick();

            // Assert
            expect(setNextPageData).toHaveBeenCalledWith({ navigationInfo });
        });
    });

    describe('on Loves List page', () => {
        beforeEach(() => {
            shallowComponent = shallow(<InlineLoves />);
            shallowComponent.setState({ isLovesListPage: true });
        });
        it('should set data at on icon', () => {
            const icon = shallowComponent.find('[data-at="love_icon"]');
            expect(icon.exists()).toBeTruthy();
        });
        it('should not render icon as link to loves list page', () => {
            const icon = shallowComponent.find('[href="/shopping-list"]');
            expect(icon.exists()).toBeFalsy();
        });
    });

    describe('on all other pages except Loves List page in large view', () => {
        describe('in large view', () => {
            beforeEach(() => {
                spyOn(window, 'matchMedia').and.callFake(() => ({ matches: true }));
            });

            describe('with loves', () => {
                beforeEach(() => {
                    shallowComponent = shallow(
                        <InlineLoves
                            loves={loves}
                            onlyAFewLeftInLovesList={onlyAFewLeftInLovesList}
                        />
                    );
                    shallowComponent.setState({
                        isLovesListPage: false,
                        shouldDisplayOAFLProducts: false,
                        totalOnlyAFewLeftLoves: null
                    });
                });

                describe('1st link click', () => {
                    it('should call navigateTo with valid data for 1st link', () => {
                        const e = { type: 'click' };
                        // const splitURLSpy = spyOn(historyService, 'splitURL').and.returnValue(expectedLocation);
                        const navigateToSpy = spyOn(Location, 'navigateTo');
                        const index = 0;
                        const link = shallowComponent.findWhere(x => x.name() === 'Link' && x.prop('href') === loves[index].targetUrl);
                        link.first().simulate('click', e);

                        // expect(splitURLSpy).toHaveBeenCalledWith(loves[index].targetUrl);
                        expect(navigateToSpy).toHaveBeenCalledWith(e, loves[index].targetUrl);
                    });
                });

                it('should render header text', () => {
                    const headerText = 'Recently Loved';
                    const header = shallowComponent.findWhere(n => n.name() === 'Text' && n.props().children === headerText);
                    expect(header.exists()).toBeTruthy();
                });

                it('should render view all loves link', () => {
                    const viewAllText = 'View all';
                    const viewAllLink = shallowComponent.findWhere(n => n.name() === 'Link' && n.props().children === viewAllText).at(0);
                    expect(viewAllLink.exists()).toBeTruthy();
                });

                it('should render link to product page', () => {
                    const link = shallowComponent.findWhere(n => n.name() === 'Link' && n.props().href === loves[0].targetUrl).at(0);
                    expect(link.exists()).toBeTruthy();
                });

                it('should render product image', () => {
                    const ProductImage = shallowComponent
                        .findWhere(n => n.name() === 'ProductImage' && n.props().skuImages === loves[0].skuImages)
                        .at(0);
                    expect(ProductImage.exists()).toBeTruthy();
                });

                it('should render brand name', () => {
                    const brandNameText = shallowComponent.findWhere(n => n.name() === 'Text' && n.props().children === loves[0].brandName).at(0);
                    expect(brandNameText.exists()).toBeTruthy();
                });

                it('should render product name', () => {
                    const productNameText = shallowComponent.findWhere(n => n.name() === 'Text' && n.props().children === loves[0].productName).at(0);
                    expect(productNameText.exists()).toBeTruthy();
                });

                it('should render product variation', () => {
                    const ProductVariation = shallowComponent.findWhere(n => n.name() === 'ProductVariation' && n.props().sku === loves[0]).at(0);
                    expect(ProductVariation.exists()).toBeTruthy();
                });

                it('should render price', () => {
                    const Price = shallowComponent.findWhere(n => n.name() === 'Price' && n.props().sku === loves[0]).at(0);
                    expect(Price.exists()).toBeTruthy();
                });

                it('should render add to basket', () => {
                    const addToBasket = shallowComponent
                        .findWhere(n => n.name() === 'ErrorBoundary(Connect(AddToBasketButton))' && n.props().sku === loves[0])
                        .at(0);
                    expect(addToBasket.exists()).toBeTruthy();
                });
            });

            describe('with no loves', () => {
                beforeEach(() => {
                    shallowComponent = shallow(<InlineLoves />);
                    shallowComponent.setState({ isLovesListPage: false });
                });
                it('should render header text', () => {
                    const headerText = 'Recently Loved';
                    const header = shallowComponent.findWhere(n => n.name() === 'Flex' && n.find('Text').props().children === headerText);
                    expect(header.exists()).toBeTruthy();
                });
                it('should render no loves description text', () => {
                    const noLovesText = 'Use your Loves list to keep track of your favorite products.';
                    const noLoves = shallowComponent.findWhere(n => n.name() === 'Text' && n.props().children === noLovesText).at(0);
                    expect(noLoves.exists()).toBeTruthy();
                });
                it('should render sign in button for anonymous users', () => {
                    const signInText = 'Sign In';
                    const signInButton = shallowComponent.findWhere(n => n.name() === 'Button' && n.props().children === signInText).at(0);
                    expect(signInButton.exists()).toBeTruthy();
                });
                it('should render create account button for anonymous users', () => {
                    const createAccountText = 'Create Account';
                    const createAccountButton = shallowComponent
                        .findWhere(n => n.name() === 'Button' && n.props().children === createAccountText)
                        .at(0);
                    expect(createAccountButton.exists()).toBeTruthy();
                });
                it('should render shop now for non-anonymous users', () => {
                    shallowComponent.setState({ isAnonymous: false });
                    const shopNowText = 'Shop Now';
                    const shopNowButton = shallowComponent.findWhere(n => n.name() === 'Button' && n.props().children === shopNowText).at(0);
                    expect(shopNowButton.exists()).toBeTruthy();
                });
            });

            it('should set data at on icon', () => {
                shallowComponent = shallow(<InlineLoves />);
                shallowComponent.setState({ isLovesListPage: false });
                const icon = shallowComponent.find('[data-at="love_icon_large"]');
                expect(icon.exists()).toBeTruthy();
            });

            it('should render icon as link to loves list page', () => {
                shallowComponent = shallow(<InlineLoves />);
                shallowComponent.setState({ isLovesListPage: false });
                const icon = shallowComponent.find('[href="/shopping-list"]');
                expect(icon.exists()).toBeTruthy();
            });

            it('should render Dropdown component', () => {
                shallowComponent = shallow(<InlineLoves />);
                shallowComponent.setState({ isLovesListPage: false });
                const Dropdown = shallowComponent.find('Dropdown');
                expect(Dropdown.exists()).toBeTruthy();
            });

            describe('only a few left notification on loves icon A/B test', () => {
                const props = {
                    onlyAFewLeftInLovesList: [{ productId: 1 }]
                };

                it('should display notification icon on top of loves icon if challenger is on', () => {
                    shallowComponent = shallow(<InlineLoves {...props} />);
                    shallowComponent.setState({
                        isLovesListPage: false,
                        shouldDisplayNotification: true,
                        lovesListNotificationResult: true
                    });
                    const icon = shallowComponent.find('[data-at="loves_count"]');
                    expect(icon.exists()).toBeTruthy();
                });

                it('should not display notification icon on top of loves icon if control is on', () => {
                    shallowComponent = shallow(<InlineLoves {...props} />);
                    shallowComponent.setState({
                        isLovesListPage: false,
                        lovesListNotificationResult: false
                    });
                    const icon = shallowComponent.find('[data-at="loves_count"]');
                    expect(icon.exists()).toBeFalsy();
                });

                it('should not display notification icon on top of loves icon if there are zero only a few left products', () => {
                    shallowComponent = shallow(<InlineLoves />);
                    shallowComponent.setState({
                        isLovesListPage: false,
                        totalOnlyAFewLeftLoves: null,
                        lovesListNotificationResult: false
                    });
                    const icon = shallowComponent.find('[data-at="loves_count"]');
                    expect(icon.exists()).toBeFalsy();
                });
            });
        });

        describe('in small view', () => {
            beforeEach(() => {
                spyOn(window, 'matchMedia').and.callFake(() => ({ matches: false }));
            });

            describe('with loves', () => {
                beforeEach(() => {
                    shallowComponent = shallow(<InlineLoves loves={loves} />);
                    shallowComponent.setState({ isLovesListPage: false });
                });

                it('should render header text', () => {
                    const headerText = 'Recently Loved';
                    const header = shallowComponent.findWhere(n => n.name() === 'Text' && n.props().children === headerText);
                    expect(header.exists()).toBeTruthy();
                });

                it('should render view all loves link', () => {
                    const viewAllText = 'View all';
                    const viewAllLink = shallowComponent.findWhere(n => n.name() === 'Link' && n.props().children === viewAllText).at(0);
                    expect(viewAllLink.exists()).toBeTruthy();
                });

                it('should render link to product page', () => {
                    const link = shallowComponent.findWhere(n => n.name() === 'Link' && n.props().href === loves[0].targetUrl).at(0);
                    expect(link.exists()).toBeTruthy();
                });

                it('should render product image', () => {
                    const ProductImage = shallowComponent
                        .findWhere(n => n.name() === 'ProductImage' && n.props().skuImages === loves[0].skuImages)
                        .at(0);
                    expect(ProductImage.exists()).toBeTruthy();
                });

                it('should render brand name', () => {
                    const brandNameText = shallowComponent.findWhere(n => n.name() === 'Text' && n.props().children === loves[0].brandName).at(0);
                    expect(brandNameText.exists()).toBeTruthy();
                });

                it('should render product name', () => {
                    const productNameText = shallowComponent.findWhere(n => n.name() === 'Text' && n.props().children === loves[0].productName).at(0);
                    expect(productNameText.exists()).toBeTruthy();
                });

                it('should render product variation', () => {
                    const ProductVariation = shallowComponent.findWhere(n => n.name() === 'ProductVariation' && n.props().sku === loves[0]).at(0);
                    expect(ProductVariation.exists()).toBeTruthy();
                });

                it('should render price', () => {
                    const Price = shallowComponent.findWhere(n => n.name() === 'Price' && n.props().sku === loves[0]).at(0);
                    expect(Price.exists()).toBeTruthy();
                });

                it('should render add to basket', () => {
                    const addToBasket = shallowComponent
                        .findWhere(n => n.name() === 'ErrorBoundary(Connect(AddToBasketButton))' && n.props().sku === loves[0])
                        .at(0);
                    expect(addToBasket.exists()).toBeTruthy();
                });
            });

            describe('with no loves', () => {
                beforeEach(() => {
                    shallowComponent = shallow(<InlineLoves />);
                    shallowComponent.setState({ isLovesListPage: false });
                });
                it('should render header text', () => {
                    const headerText = 'Recently Loved';
                    const header = shallowComponent.findWhere(n => n.name() === 'Flex' && n.find('Text').props().children === headerText);
                    expect(header.exists()).toBeTruthy();
                });
                it('should render no loves description text', () => {
                    const noLovesText = 'Use your Loves list to keep track of your favorite products.';
                    const noLoves = shallowComponent.findWhere(n => n.name() === 'Text' && n.props().children === noLovesText).at(0);
                    expect(noLoves.exists()).toBeTruthy();
                });
                it('should render sign in button for anonymous users', () => {
                    const signInText = 'Sign In';
                    const signInButton = shallowComponent.findWhere(n => n.name() === 'Button' && n.props().children === signInText).at(0);
                    expect(signInButton.exists()).toBeTruthy();
                });
                it('should render create account button for anonymous users', () => {
                    const createAccountText = 'Create Account';
                    const createAccountButton = shallowComponent
                        .findWhere(n => n.name() === 'Button' && n.props().children === createAccountText)
                        .at(0);
                    expect(createAccountButton.exists()).toBeTruthy();
                });
                it('should render shop now for non-anonymous users', () => {
                    shallowComponent.setState({ isAnonymous: false });
                    const shopNowText = 'Shop Now';
                    const shopNowButton = shallowComponent.findWhere(n => n.name() === 'Button' && n.props().children === shopNowText).at(0);
                    expect(shopNowButton.exists()).toBeTruthy();
                });
            });

            it('should set data at on icon', () => {
                shallowComponent = shallow(<InlineLoves />);
                shallowComponent.setState({ isLovesListPage: false });
                const icon = shallowComponent.find('[data-at="love_icon_small"]');
                expect(icon.exists()).toBeTruthy();
            });

            it('should render icon as link to loves list page', () => {
                shallowComponent = shallow(<InlineLoves />);
                shallowComponent.setState({ isLovesListPage: false });
                const icon = shallowComponent.find('[href="/shopping-list"]');
                expect(icon.exists()).toBeTruthy();
            });

            it('should display Modal component if isModalOpen state is true', () => {
                shallowComponent = shallow(<InlineLoves />);
                shallowComponent.setState({
                    isLovesListPage: false,
                    isModalOpen: true
                });
                const Modal = shallowComponent.find('Modal');
                expect(Modal.props().style).toBeFalsy();
            });

            it('should not display Modal component if isModalOpen state is false', () => {
                shallowComponent = shallow(<InlineLoves />);
                shallowComponent.setState({ isLovesListPage: false });
                const Modal = shallowComponent.find('Modal');
                expect(Modal.props().style).toBeTruthy();
            });
        });

        describe('only a few left', () => {
            beforeEach(() => {
                shallowComponent = shallow(<InlineLoves loves={loves} />);
                shallowComponent.setState({
                    shouldDisplayNotification: true,
                    shouldDisplayOAFLProducts: true
                });
            });

            it('should render header text', () => {
                const headerText = 'Get These Before They’re Gone';
                const header = shallowComponent.findWhere(n => n.name() === 'Text' && n.props().children === headerText);
                expect(header.exists()).toBe(true);
            });

            it('should render number of only few left products if any', () => {
                const numberOfOAFLitems = shallowComponent.findWhere(n => n.name() === 'CountCircle');
                expect(numberOfOAFLitems.exists()).toBe(true);
            });
        });
    });
});
