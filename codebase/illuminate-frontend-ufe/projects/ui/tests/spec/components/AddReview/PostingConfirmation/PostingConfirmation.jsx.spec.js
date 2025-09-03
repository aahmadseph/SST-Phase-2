const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const UrlUtils = require('utils/Url').default;
const localeUtils = require('utils/LanguageLocale').default;
const PostingConfirmation = require('components/AddReview/PostingConfirmation/PostingConfirmation').default;

describe('PostingConfirmation component', () => {
    let props;
    let getTextStub;
    let wrapper;

    beforeEach(() => {
        props = { productURL: 'productURL' };
        getTextStub = createSpy('getTextStub').and.callFake(arg => arg);
        spyOn(localeUtils, 'getLocaleResourceFile').and.returnValue(getTextStub);
        wrapper = shallow(<PostingConfirmation {...props} />);
    });

    it('should render Thank You title', () => {
        const addReviewTitleComp = wrapper.find('AddReviewTitle').at(0);
        expect(addReviewTitleComp.props().children).toEqual('thankYou');
    });

    it('should render an error title if some errors presented', () => {
        wrapper.setState({ submissionErrors: [] });
        const addReviewTitleComp = wrapper.find('AddReviewTitle').at(0);
        expect(addReviewTitleComp.props().children).toEqual('submissionError');
    });

    it('should not render any errors by default', () => {
        expect(wrapper.find('ErrorList').length).toEqual(0);
    });

    it('should render the errors returned by API', () => {
        wrapper.setState({ submissionErrors: [] });
        expect(getTextStub).toHaveBeenCalledWith('somethingWentWrongError');
    });

    it('should render the review post message', () => {
        const reviewsPostMessageText = wrapper.findWhere(n => n.name() === 'Text' && n.contains('reviewsPostMessage'));
        expect(reviewsPostMessageText.length).toEqual(1);
    });

    it('should not render post message if some errors presented', () => {
        wrapper.setState({ submissionErrors: [] });
        const reviewsPostMessageText = wrapper.findWhere(n => n.contains('reviewsPostMessage'));
        expect(reviewsPostMessageText.length).toEqual(0);
    });

    it('should render BCC content if provided', () => {
        const contentDataStub = 'contentDataStub';
        wrapper.setState({ contentData: contentDataStub });
        const BccComponentList = wrapper.find('BccComponentList').at(0);
        expect(BccComponentList.props().items).toEqual('contentDataStub');
    });

    it('should render Continue Shopping button', () => {
        const buttonComp = wrapper.findWhere(n => n.name() === 'Button' && n.contains('continueShopping'));
        expect(buttonComp.length).toEqual(1);
    });

    it('should redirect to product if Continue Shopping button clicked', () => {
        // Arrange
        const redirectToStub = spyOn(UrlUtils, 'redirectTo');
        const buttonComp = wrapper.findWhere(n => n.name() === 'Button' && n.contains('continueShopping')).at(0);

        // Act
        buttonComp.simulate('click');

        // Assert
        expect(redirectToStub).toHaveBeenCalledWith('productURL');
    });
});
