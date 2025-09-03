const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const React = require('react');

describe('QuestionsAndAnswers component', () => {
    let bazaarVoiceApi;
    let QuestionsAndAnswers;

    beforeEach(() => {
        bazaarVoiceApi = require('services/api/thirdparty/BazaarVoiceQandA').default;
        QuestionsAndAnswers = require('components/ProductPage/QuestionsAndAnswers/QuestionsAndAnswers').default;
        Sephora.configurationSettings = { isBazaarVoiceEnabled: true };
    });

    describe('getQuestionsToShow()', () => {
        let wrapper;
        // let component;
        let showMoreCTA;

        beforeEach(() => {
            wrapper = shallow(<QuestionsAndAnswers productId='123' />, { disableLifecycleMethods: true });
            wrapper.setState({
                totalResults: 4,
                questions: [{ questionId: '111' }, { questionId: '222' }, { questionId: '333' }, { questionId: '444' }]
            });
        });

        it('should display only the first answer by default', () => {
            expect(wrapper.find('Question').length).toEqual(1);
        });

        it('should display 4 questions if Show more CTA has been clicked', () => {
            // Arrange
            showMoreCTA = wrapper.find('Button');

            // Act
            showMoreCTA.simulate('click');

            // Assert
            expect(wrapper.find('Question').length).toEqual(4);
        });
    });

    describe('fetchData()', () => {
        let wrapper;
        let component;
        let fetchDataStub;
        let QuestionAnswersandStatsStub;

        beforeEach(() => {
            QuestionAnswersandStatsStub = spyOn(bazaarVoiceApi, 'QuestionAnswersandStats').and.returnValue(Promise.resolve({}));
            wrapper = shallow(<QuestionsAndAnswers productId='123' />);
            wrapper.setState({
                totalResults: 4,
                questions: [{ questionId: '111' }, { questionId: '222' }, { questionId: '333' }, { questionId: '444' }]
            });
            component = wrapper.instance();
            fetchDataStub = spyOn(component, 'fetchData');
            spyOn(component, 'setState');
            component.loadInitialQuestions();
        });

        it('should be called with the correct params after the initial load', () => {
            expect(fetchDataStub).toHaveBeenCalledWith(4, 'SubmissionTime:desc', 'TotalPositiveFeedbackCount:desc,SubmissionTime:desc');
        });

        it('should make a QuestionAnswersandStats api call', () => {
            expect(QuestionAnswersandStatsStub).toHaveBeenCalledWith(
                component.props.productId,
                4,
                'SubmissionTime:desc',
                'TotalPositiveFeedbackCount:desc,SubmissionTime:desc',
                0
            );
        });
    });

    describe('search Questions and Answers', () => {
        it('should make a QuestionAnswersandStats api call', () => {
            // Arrange
            const eventStub = { preventDefault: createSpy() };
            const searchQuestionsAnswersStub = spyOn(bazaarVoiceApi, 'searchQuestionsAnswers').and.returnValue(Promise.resolve({}));
            const wrapper = shallow(<QuestionsAndAnswers productId='123' />, { disableLifecycleMethods: true });
            wrapper.setState({
                totalResults: 4,
                questions: [{ questionId: '111' }, { questionId: '222' }, { questionId: '333' }, { questionId: '444' }]
            });
            const component = wrapper.instance();
            component.inputRef = { current: { getValue: createSpy().and.returnValue('red') } };

            // Act
            component.handleSubmit(eventStub);

            // Assert
            expect(searchQuestionsAnswersStub).toHaveBeenCalledWith('123', 4, 'red', 0);
        });
    });

    describe('componentDidUpdate function', () => {
        it('should not invoke loadInitialQuestions when re-rendered with same product', () => {
            // Arrange
            spyOn(bazaarVoiceApi, 'QuestionAnswersandStats').and.returnValue({ then: () => {} });
            const props = { productId: 1 };

            // Act
            const wrapper = shallow(<QuestionsAndAnswers {...props} />);
            const component = wrapper.instance();
            const loadInitialQuestions = spyOn(component, 'loadInitialQuestions').and.callFake(() => {});
            wrapper.setProps(props).setProps(props);

            // Assert
            expect(loadInitialQuestions).toHaveBeenCalledTimes(0);
        });

        it('should invoke loadInitialQuestions only once when re-rendered with new product', () => {
            // Arrange
            spyOn(bazaarVoiceApi, 'QuestionAnswersandStats').and.returnValue({ then: () => {} });
            const props = { productId: 1 };
            const newProps = { productId: 2 };

            // Act
            const wrapper = shallow(<QuestionsAndAnswers {...props} />);
            const component = wrapper.instance();
            const loadInitialQuestions = spyOn(component, 'loadInitialQuestions').and.callFake(() => {});
            wrapper.setProps(newProps).setProps(newProps);

            // Assert
            expect(loadInitialQuestions).toHaveBeenCalledTimes(1);
        });
    });
});
