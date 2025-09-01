const React = require('react');
const { shallow } = require('enzyme');
const RatingsAndReviews = require('components/ProductPage/RatingsAndReviews/RatingsAndReviews').default;
const languageLocale = require('utils/LanguageLocale').default;
const getText = languageLocale.getLocaleResourceFile('components/ProductPage/RatingsAndReviews/locales', 'RatingsAndReviews');
const UrlUtils = require('utils/Url').default;
const paginationUtils = require('utils/Pagination').default;
const bazaarVoiceApi = require('services/api/thirdparty/BazaarVoice').default;

describe('<RatingsAndReviews />', () => {
    let component;
    const currentProductProp = {
        reviewImages: [],
        reviewFilters: [],
        productDetails: { displayName: 'Protini' },
        currentSku: { skuId: '56789' }
    };
    beforeEach(() => {
        component = shallow(
            <RatingsAndReviews
                productId='12345'
                currentProduct={currentProductProp}
            />,
            { disableLifecycleMethods: true }
        );
    });

    describe('Title', () => {
        const titleText = getText('ratingsReviews');

        it('should render correctly with the review count', () => {
            // Arrange
            const totalReviewCount = 12600;
            component.setState({ initialTotalReviews: totalReviewCount });
            // Act
            const title = component.findWhere(n => n.name() === 'Text' && n.text() === `${titleText} (12.6K)`);

            // Assert
            expect(title.length).toEqual(1);
        });

        it('should render correct data-at attribute', () => {
            // Arrange
            const textElement = component.find('[data-at="ratings_reviews_section"]');

            // Assert
            expect(textElement.exists()).toBe(true);
        });
    });

    describe('Reviews', () => {
        it('should render proper amount of reviews', () => {
            // Arrange
            component.setState({
                reviews: [{}, {}, {}],
                hasReviews: true,
                step: 6
            });

            // Act
            const reviews = component.find('Review');

            // Assert
            expect(reviews.length).toEqual(3);
        });

        it('should render reviews with a step limit', () => {
            // Arrange
            component.setState({
                reviews: [{}, {}, {}, {}, {}, {}],
                hasReviews: true,
                step: 6
            });

            // Act
            const reviews = component.find('Review');

            // Assert
            expect(reviews.length).toEqual(6);
        });

        it('should not render helpful reviews on any page except first', () => {
            // Arrange
            component.setState({
                reviews: [{ reviewId: 1 }, { reviewId: 2 }, { reviewId: 3 }, { reviewId: 4 }],
                helpfulReviews: [{ reviewId: 5 }, { reviewId: 1 }],
                currentPage: 2,
                hasReviews: true,
                step: 6
            });

            // Act
            const reviews = component.find('Review');

            // Assert
            expect(reviews.length).toEqual(4);
        });

        it('should render sorry message if no reviews matches the filter', () => {
            // Arrange
            component.setState({
                hasReviews: false,
                isSearchPerformed: false,
                reviewStatistics: { ratingDistribution: 3 }
            });

            // Act
            const noReviewMessage = component.findWhere(n => n.name() === 'Text' && n.text() === 'Sorry, no reviews matches the applied filters.');

            // Assert
            expect(noReviewMessage.length).toEqual(1);
        });
    });

    describe('Write a review link', () => {
        const linkText = getText('writeReview');

        it('should render correctly when there are reviews', () => {
            // Arrange
            const totalReviewCount = 1000;
            component.setState({
                reviewStatistics: { totalReviewCount },
                showComponent: true
            });

            // Act
            const link = component.findWhere(n => n.name() === 'Link' && n.text() === linkText);

            // Assert
            expect(link.length).toEqual(1);
        });

        it('should redirect to Add a Review Page', () => {
            // Arrange
            const PRODUCT_ADD_REVIEWS_URL = '/addReview?productId=';
            const redirectToSpy = spyOn(UrlUtils, 'redirectTo');
            component.setState({ showComponent: true });
            const productId = 12345;

            // Act
            const link = component.findWhere(n => n.name() === 'Link' && n.text() === linkText);
            link.at(0).simulate('click');

            // Assert
            expect(redirectToSpy).toHaveBeenCalledWith(PRODUCT_ADD_REVIEWS_URL + productId);
        });
    });

    describe('Pagination', () => {
        it('should render pagination if there are reviews', () => {
            component.setState({ totalReviews: 50 });
            expect(component.find('Pagination').length).toBe(1);
        });

        it('should not render pagination if there are no reviews', () => {
            component.setState({ totalReviews: 0 });
            expect(component.find('Pagination').length).toBe(0);
        });

        it('should not render pagination if there are 6 or less reviews', () => {
            component.setState({ totalReviews: 6 });
            expect(component.find('Pagination').length).toBe(0);
        });
    });

    describe('handlePageClick()', () => {
        let instance;
        let args;

        beforeEach(() => {
            instance = component.instance();
            args = {
                pageNumber: 1,
                buttonType: paginationUtils.BUTTON_TYPES.NUMBER
            };
        });

        it('should fetch data for a given pageIndex', () => {
            const fetchSpy = spyOn(instance, 'fetchData');

            instance.handlePageClick(args.pageNumber, args.buttonType);

            expect(fetchSpy).toHaveBeenCalledWith(null, false, args.pageNumber);
        });

        it('should send analytics for a given pageIndex and buttonType', () => {
            const sendAnalyticsSpy = spyOn(paginationUtils, 'sendAnalytics');

            instance.handlePageClick(args.pageNumber, args.buttonType);

            expect(sendAnalyticsSpy).toHaveBeenCalledWith('ratings&reviews', args.pageNumber, args.buttonType);
        });
    });

    describe('filterSearchReviews()', () => {
        it('should call getSearchReviewsStub with the correct values', () => {
            const getSearchReviewsStub = spyOn(bazaarVoiceApi, 'getSearchReviews').and.returnValue(Promise.resolve({}));
            const instance = component.instance();

            instance.filterSearchReviews({
                productId: '123',
                keyword: 'red'
            });

            expect(getSearchReviewsStub).toHaveBeenCalledWith('123', 6, 'red', 0);
        });
    });

    describe('Search messages', () => {
        it('should render the number of results message after a search is done', () => {
            component.setState({
                reviews: [{}, {}, {}],
                hasReviews: true,
                step: 6,
                isSearchPerformed: true,
                searchKeyword: 'blue',
                showComponent: true,
                totalReviews: 3
            });

            const instance = component.instance();

            const resultsMessage = component.findWhere(
                n => n.name() === 'Text' && n.text() === `${instance.state.totalReviews} Reviews Containing “${instance.state.searchKeyword}”`
            );

            expect(resultsMessage.length).toEqual(1);
        });

        it('should render the one result message after a search is done with only one result', () => {
            component.setState({
                reviews: [{}],
                hasReviews: true,
                step: 6,
                isSearchPerformed: true,
                searchKeyword: 'gray',
                showComponent: true,
                totalReviews: 1
            });

            const instance = component.instance();

            const resultsMessage = component.findWhere(
                n => n.name() === 'Text' && n.text() === `${instance.state.totalReviews} Review Containing “${instance.state.searchKeyword}”`
            );

            expect(resultsMessage.length).toEqual(1);
        });

        it('should render the no results message after a search is done without results', () => {
            component.setState({
                reviews: [],
                hasReviews: false,
                step: 6,
                isSearchPerformed: true,
                showComponent: true,
                totalReviews: 0,
                searchKeyword: 'qwe'
            });

            const instance = component.instance();

            const resultsMessage = component.findWhere(
                n => n.name() === 'Text' && n.text() === `Sorry, no reviews contain “${instance.state.searchKeyword}”`
            );

            expect(resultsMessage.length).toEqual(1);
        });

        it('should render the no results text with appropriate data-at', () => {
            component.setState({
                reviews: [],
                hasReviews: false,
                step: 6,
                isSearchPerformed: true,
                showComponent: true,
                totalReviews: 0,
                searchKeyword: 'qwe'
            });

            const instance = component.instance();

            const resultsMessage = component.findWhere(
                n =>
                    n.name() === 'Text' &&
                    n.text() === `Sorry, no reviews contain “${instance.state.searchKeyword}”` &&
                    n.prop('data-at') === 'rr_no_results_message'
            );

            expect(resultsMessage.length).toEqual(1);
        });
    });
});
