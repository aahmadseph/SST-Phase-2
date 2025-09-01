const React = require('react');
const { shallow } = require('enzyme');
const RateAndReview = require('components/AddReview/RateAndReview/RateAndReview').default;
const GuidelinesModalLink = require('components/ProductPage/RatingsAndReviews/GuidelinesModalLink').default;
const localeUtils = require('utils/LanguageLocale').default;

describe('RateAndReview component', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        spyOn(localeUtils, 'getLocaleResourceFile').and.returnValue(arg => arg);
        props = {
            product: {
                currentSku: {},
                productDetails: {}
            }
        };
        wrapper = shallow(<RateAndReview {...props} />);
    });

    it('should render the AddReviewTitle component once', () => {
        expect(wrapper.find('AddReviewTitle').length).toEqual(1);
    });

    it('should render the AddReviewTitle with correct title', () => {
        expect(wrapper.find('AddReviewTitle').props().children).toEqual('rateAndReview');
    });

    it('should render the ErrorList component once', () => {
        expect(wrapper.find('ErrorList').length).toEqual(1);
    });

    it('should render the ErrorList component with correct errorMessages prop', () => {
        const errorMessages = [];
        wrapper.setState({ errorMessages });
        expect(wrapper.find('ErrorList').props().errorMessages).toEqual(errorMessages);
    });

    it('should render the StarRating component once', () => {
        expect(wrapper.find('StarRating').length).toEqual(1);
    });

    it('should render the StarRating component with correct legend prop', () => {
        expect(wrapper.find('StarRating').props().legend).toEqual('rateHeading');
    });

    it('should render the StarRating component and pass a callback function to the starClick prop', () => {
        const StarRating = wrapper.find('StarRating');
        expect(typeof StarRating.props().starClick).toEqual('function');
    });

    it('should render the StarRating component and pass a callback function to the validate prop', () => {
        const StarRating = wrapper.find('StarRating');
        expect(typeof StarRating.props().validate).toEqual('function');
    });

    it('should render one InputMsg component with an error message when starRatingError is true', () => {
        const starRatingError = true;
        wrapper.setState({ starRatingError });
        expect(wrapper.findWhere(n => n.name() === 'InputMsg' && n.props().children === 'errorMessageRating').length).toBe(1);
    });

    it('should not render any InputMsg component with an error message when starRatingError is falsy', () => {
        expect(wrapper.findWhere(n => n.name() === 'InputMsg' && n.props().children === 'errorMessageRating').length).toBe(0);
    });

    it('should render GuidelinesModalLink component', () => {
        expect(wrapper.find(GuidelinesModalLink).length).toBe(1);
        //expect(wrapper.dive().findWhere(n => n.name() === 'GuidelinesModalLink').length).toBe(1);
    });

    it('should render one UploadMedia component', () => {
        expect(wrapper.find('UploadMedia').length).toBe(1);
    });

    it('should render the UploadMedia component and pass a callback function to the onChange prop', () => {
        const UploadMedia = wrapper.find('UploadMedia');
        expect(typeof UploadMedia.props().onChange).toEqual('function');
    });

    it('should render a Button with string "yes" as a child', () => {
        expect(wrapper.findWhere(n => n.name() === 'Button' && n.props().children === 'yes').length).toBe(1);
    });

    it('should trigger the handleRecommendClick method with an argument of true when the Button is clicked', () => {
        const handleRecommendClickStub = spyOn(wrapper.instance(), 'handleRecommendClick');
        wrapper
            .findWhere(n => n.name() === 'Button' && n.props().children === 'yes')
            .at(0)
            .simulate('click');
        expect(handleRecommendClickStub).toHaveBeenCalledWith(true);
    });

    it('should render a Button with string "no" as a child', () => {
        expect(wrapper.findWhere(n => n.name() === 'Button' && n.props().children === 'yes').length).toBe(1);
    });

    it('should trigger the handleRecommendClick method with an argument of false when the Button is clicked', () => {
        const handleRecommendClickStub = spyOn(wrapper.instance(), 'handleRecommendClick');
        wrapper
            .findWhere(n => n.name() === 'Button' && n.props().children === 'no')
            .at(0)
            .simulate('click');
        expect(handleRecommendClickStub).toHaveBeenCalledWith(false);
    });

    it('should render one InputMsg component with an error message when recommendedError is true', () => {
        const recommendedError = true;
        wrapper.setState({ recommendedError });
        expect(wrapper.findWhere(n => n.name() === 'InputMsg' && n.props().children === 'errorMessageTextRecommend').length).toBe(1);
    });

    it('should not render any InputMsg component with an error message when recommendedError is falsy', () => {
        expect(wrapper.findWhere(n => n.name() === 'InputMsg' && n.props().children === 'errorMessageTextRecommend').length).toBe(0);
    });

    it('should render a Checkbox with string "productAsAfreeSample" as a child', () => {
        expect(wrapper.findWhere(n => n.name() === 'Checkbox' && n.props().children === 'productAsAfreeSample').length).toBe(1);
    });

    it('should trigger the handleRecommendClick method with an argument of false when the Button is clicked', () => {
        const setStateStub = spyOn(wrapper.instance(), 'setState');
        const e = { target: { checked: true } };
        wrapper
            .findWhere(n => n.name() === 'Checkbox' && n.props().children === 'productAsAfreeSample')
            .at(0)
            .simulate('click', e);
        expect(setStateStub).toHaveBeenCalledWith({ isFreeSample: e.target.checked });
    });

    it('should render a Checkbox with string "sephoraEmployee" as a child', () => {
        expect(wrapper.findWhere(n => n.name() === 'Checkbox' && n.props().children === 'sephoraEmployee').length).toBe(1);
    });

    it('should trigger the handleRecommendClick method with an argument of false when the Button is clicked', () => {
        const setStateStub = spyOn(wrapper.instance(), 'setState');
        const event = { target: { checked: true } };
        wrapper
            .findWhere(n => n.name() === 'Checkbox' && n.props().children === 'sephoraEmployee')
            .at(0)
            .simulate('click', event);
        expect(setStateStub).toHaveBeenCalledWith({ isSephoraEmployee: event.target.checked });
    });
});
