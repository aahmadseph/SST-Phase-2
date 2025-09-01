describe('AddReviewCarousel component', () => {
    let profileApi;
    let AddReviewCarousel;

    beforeEach(() => {
        profileApi = require('services/api/profile').default;
        AddReviewCarousel = require('components/AddReview/AddReviewCarousel/AddReviewCarousel').default;
    });

    it('submitReview should call submitReview with proper args', () => {
        // Assert
        const profileApiStub = spyOn(profileApi, 'getUserSpecificProductDetails').and.returnValue({ then: () => {} });
        const component = new AddReviewCarousel({});
        component.state = {
            currentProduct: {
                variationType: 'noColor',
                productDetails: { productId: 'P10454' }
            }
        };
        const review = {
            productId: 'P123',
            title: 'Title of Revie',
            rating: '3',
            isRecommended: true,
            reviewText: 'This is my review',
            photos: '',
            isFreeSample: true,
            isSephoraEmployee: false,
            user: '0012313',
            verifiedPurchaser: 'False',
            fp: 'fp1232323'
        };

        // Act
        component.submitReview(review);

        // Assert
        expect(profileApiStub).toHaveBeenCalledWith('P10454', 'forBV', true);
    });
});
