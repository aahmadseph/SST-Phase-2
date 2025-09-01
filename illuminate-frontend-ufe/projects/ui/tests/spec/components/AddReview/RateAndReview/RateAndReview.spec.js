const React = require('react');
// eslint-disable-next-line object-curly-newline
const { createSpy, objectContaining } = jasmine;
const { shallow } = require('enzyme');
const RateAndReview = require('components/AddReview/RateAndReview/RateAndReview').default;
const FormValidator = require('utils/FormValidator').default;

describe('RateAndReview component', () => {
    let props;
    let wrapper;
    let component;

    beforeEach(() => {
        props = {
            onNext: createSpy('onNext'),
            product: {
                currentSku: {},
                productDetails: {}
            }
        };
        wrapper = shallow(<RateAndReview {...props} />);
        component = wrapper.instance();
        component.starRating = { getRating: () => {} };
        component.reviewText = { getValue: () => {}, getCharacterCount: () => {} };
        component.titleInput = { getValue: () => {} };
    });

    describe('componentWillReceiveProps', () => {
        let setStateStub;

        beforeEach(() => {
            setStateStub = spyOn(component, 'setState');
            component.componentWillReceiveProps(props);
        });

        it('should call setStateStub with updated props', () => {
            expect(setStateStub).toHaveBeenCalledWith(props);
        });
    });

    describe('updatePhotos', () => {
        let setStateStub;
        let photos;

        beforeEach(() => {
            photos = { photoUrl: '//media.photo.com' };
            setStateStub = spyOn(component, 'setState');
            component.updatePhotos(photos);
        });

        it('should call setStateStub with photos object', () => {
            expect(setStateStub).toHaveBeenCalledWith(objectContaining({ photos }));
        });
    });

    describe('validateForm', () => {
        let setStateStub;

        beforeEach(() => {
            setStateStub = spyOn(component, 'setState');
        });

        it('should return false when isRecommended is not of type boolean', () => {
            expect(component.validateForm()).toBe(false);
        });

        it('should call setStateStub when isRecommended is not of type boolean', () => {
            component.validateForm();
            expect(setStateStub).toHaveBeenCalledWith({ recommendedError: true, showTermsError: true });
        });

        it('should call setStateStub when isRecommended is of type boolean and terms not checked', () => {
            component.state.isRecommended = true;
            component.validateForm();
            expect(setStateStub).toHaveBeenCalledWith({ showTermsError: true, recommendedError: false });
        });

        it('should return false when user has not checked terms agreement and getErrorStub returns no errors', () => {
            component.state.hasAgreedToTerms = false;
            expect(component.validateForm()).toBe(false);
        });

        it('should return true when isRecommended is of true and user has checked terms agreement and getErrorStub returns no errors', () => {
            component.state.isRecommended = true;
            component.state.hasAgreedToTerms = true;
            expect(component.validateForm()).toBe(true);
        });

        it('should return false when isRecommended is of type boolean and getErrorStub returns errors', () => {
            const errors = { fields: ['star rating'] };
            component.state.isRecommended = true;
            spyOn(FormValidator, 'getErrors').and.returnValue(errors);
            expect(component.validateForm()).toBe(false);
        });
    });

    describe('validateStarRating', () => {
        beforeEach(() => {
            spyOn(component, 'setState');
        });

        it('should return true when getRatingStub returns 0', () => {
            spyOn(component.starRating, 'getRating').and.returnValue(0);
            expect(component.validateStarRating()).toBe(true);
        });

        it('should return false when getRatingStub returns any other rating than 0', () => {
            spyOn(component.starRating, 'getRating').and.returnValue(1);
            expect(component.validateStarRating()).toBe(false);
        });
    });

    describe('validateReviewText', () => {
        let isValidLengthStub;
        let setStateStub;

        beforeEach(() => {
            setStateStub = spyOn(component, 'setState');
            isValidLengthStub = spyOn(FormValidator, 'isValidLengthRateAndReview').and.returnValue(true);
        });

        it('should return true when isValidLengthStub returns true', () => {
            expect(component.validateReviewText()).toBe(true);
        });

        it('should call setStateStub if opposite boolean value of isValidLengthStub and reviewTextError are not equal', () => {
            component.state.reviewTextError = true;
            component.validateReviewText();
            expect(setStateStub).toHaveBeenCalledWith({ reviewTextError: !isValidLengthStub });
        });
    });

    describe('handleRecommendClick', () => {
        let setStateStub;
        let isRecommended;

        beforeEach(() => {
            setStateStub = spyOn(component, 'setState');
            isRecommended = true;
            component.handleRecommendClick(isRecommended)();
        });

        it('should call setStateStub with correct object', () => {
            expect(setStateStub).toHaveBeenCalledWith({
                isRecommended,
                recommendedError: null
            });
        });
    });

    describe('onNext', () => {
        beforeEach(() => {
            component.setState({
                photos: [],
                isRecommended: true,
                isFreeSample: true,
                isSephoraEmployee: true
            });
        });

        it('should call onNext with correct object when validateFormStub returns true', () => {
            spyOn(component, 'validateForm').and.returnValue(true);
            component.onNext();
            expect(component.props.onNext).toHaveBeenCalledWith({
                reviewTitle: component.titleInput.getValue(),
                reviewText: component.reviewText.getValue(),
                rating: component.starRating.getRating(),
                photos: component.state.photos,
                isRecommended: component.state.isRecommended,
                isFreeSample: component.state.isFreeSample,
                isSephoraEmployee: component.state.isSephoraEmployee
            });
        });

        it('should not call onNext when validateFormStub returns false', () => {
            spyOn(component, 'validateForm').and.returnValue(false);
            component.onNext();
            expect(component.props.onNext).not.toHaveBeenCalled();
        });
    });
});
