const React = require('react');
const { shallow } = require('enzyme');
const QuestionsAndAnswers = require('components/ProductPage/QuestionsAndAnswers/QuestionsAndAnswers').default;
const languageLocale = require('utils/LanguageLocale').default;

const getText = languageLocale.getLocaleResourceFile('components/ProductPage/QuestionsAndAnswers/locales', 'QuestionsAndAnswers');

describe('QuestionsAndAnswers component', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<QuestionsAndAnswers productId='123' />, { disableLifecycleMethods: true });
    });

    it('should render correctly with the question count', () => {
        const titleText = getText('qAndATitle');
        // Arrange
        const totalQuestionCount = 15;
        wrapper.setState({ totalResults: totalQuestionCount });

        // Assert
        expect(wrapper.find('Text').at(0).prop('children')).toBe(`${titleText} (15)`);
    });

    it('should render a data-at attribute for question answer title', () => {
        const elementName = wrapper.findWhere(n => n.prop('data-at') === `${Sephora.debug.dataAt('questions_answers_section')}`).name();
        expect(elementName).toEqual('Text');
    });

    it('should render a data-at attribute for a no results message', () => {
        const searchTerm = 'test';
        const component = wrapper.instance();
        component.inputRef = {
            current: {
                getValue: () => searchTerm,
                setValue: () => {}
            }
        };
        wrapper.setState({ hasSearchResults: true });

        const noResultsMessage = wrapper.findWhere(
            x =>
                x.name() === 'Text' &&
                x.text() === `Sorry, no questions or answers contain “${searchTerm}”` &&
                x.prop('data-at') === 'qa_no_results_message'
        );

        expect(noResultsMessage.exists()).toBeTruthy();
    });

    it('should render cancel link data-at', () => {
        wrapper.setState({
            isSearchEnabled: true,
            totalResults: 1,
            questions: [{ questionId: 'Question123' }]
        });

        const cancelLinkWithDataAt = wrapper.findWhere(x => x.name() === 'Link' && x.prop('data-at') === 'qa_search_cancel');

        expect(cancelLinkWithDataAt.exists()).toBeTruthy();
    });

    it('should render askAQuestion link', () => {
        const titleText = getText('askAQuestionLink');
        // Arrange
        wrapper.setState({ totalResults: 1 });

        // Assert
        expect(wrapper.find('Link').at(0).prop('children')).toBe(`${titleText}`);
    });

    it('should render a data-at attribute for question answer title', () => {
        const elementName = wrapper.findWhere(n => n.prop('data-at') === `${Sephora.debug.dataAt('question_ask_link')}`).name();
        expect(elementName).toEqual('Link');
    });

    it('should render Question when available', () => {
        // Arrange
        wrapper.setState({
            totalResults: 1,
            questions: [{ questionId: 'Question123' }]
        });

        // Assert
        expect(wrapper.find('Question').length).toEqual(1);
    });

    it('should not render showMoreQandA button if only 1 question', () => {
        // Arrange
        wrapper.setState({
            totalResults: 1,
            questions: [{ questionId: '111' }]
        });

        // Act
        const button = wrapper.findWhere(x => x.name() === 'Button' && x.text() === getText('showMoreQandA'));

        // Assert
        expect(button.exists()).toBeFalsy();
    });

    it('should render showMoreQandA button if more than 1 question', () => {
        // Arrange
        wrapper.setState({
            totalResults: 2,
            questions: [{ questionId: '111' }, { questionId: '222' }]
        });

        // Act
        const button = wrapper.findWhere(x => x.name() === 'Button' && x.text() === getText('showMoreQandA'));

        // Assert
        expect(button.exists()).toBeTruthy();
    });

    it('should render the Search input and Cancel button if search icon is clicked', () => {
        // Arrange
        wrapper.setState({
            totalResults: 1,
            questions: [{ questionId: '111' }],
            isSearch: true,
            isSearchEnabled: true
        });

        // Assert
        expect(wrapper.find('TextInput').at(0).prop('placeholder')).toBe(getText('searchKeyword'));
        expect(wrapper.findWhere(n => n.name() === 'Link' && n.prop('children') === 'Cancel').length).toBe(1);
    });
});
