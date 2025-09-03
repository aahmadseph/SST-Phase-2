/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = require('enzyme');
const Question = require('components/ProductPage/QuestionsAndAnswers/Question/Question').default;
const languageLocale = require('utils/LanguageLocale').default;
const dateUtils = require('utils/Date').default;
const urlUtils = require('utils/Url').default;
const anaUtils = require('analytics/utils').default;
const getText = languageLocale.getLocaleResourceFile('components/ProductPage/QuestionsAndAnswers/locales', 'QuestionsAndAnswers');

describe('<Question />', () => {
    let wrapper;
    let component;
    let props;

    beforeEach(() => {
        props = {
            productId: '123',
            userNickname: 'John',
            questionId: '456',
            questionDetails: 'What is foundation?',
            answers: [{}, {}],
            submissionTime: '2020-10-01T22:38:40.000+00:00'
        };
        wrapper = shallow(<Question {...props} />);
    });

    it('should render correctly question summary', () => {
        // Act
        const questionDetails = wrapper.findWhere(n => n.name() === 'Text' && n.text() === 'What is foundation?');
        // Assert
        expect(questionDetails.length).toBe(1);
    });

    it('should render Answer when available', () => {
        // Assert
        expect(wrapper.find('Answer').length).toEqual(1);
    });

    it('should render question submission time and user nickName', () => {
        const postedDate = dateUtils.formatSocialDate(props.submissionTime, true);
        //Act
        const answerSubmission = wrapper.findWhere(n => n.name() === 'Text' && n.text() === `Asked ${postedDate} by ${props.userNickname}`);
        // Assert
        expect(answerSubmission.exists()).toBeTrue();
    });

    it('should render question submission time data-at', () => {
        const submissionTime = wrapper.findWhere(x => x.name() === 'Text' && x.prop('data-at') === 'QuestionAskedTime');

        expect(submissionTime.exists()).toBeTrue();
    });

    it('should render Answer when available', () => {
        spyOn(urlUtils, 'redirectTo');
        const setNextPageDataStub = spyOn(anaUtils, 'setNextPageData');

        component = wrapper.instance();
        component.redirectToSubmitAnswerPage();

        // Assert
        expect(setNextPageDataStub).toHaveBeenCalledWith({ linkData: 'answer this question' });
    });

    describe('redirectToSubmitAnswerPage()', () => {
        it('should set next page data analytics value', () => {
            //Act
            spyOn(urlUtils, 'redirectTo');
            const setNextPageDataStub = spyOn(anaUtils, 'setNextPageData');

            component = wrapper.instance();
            component.redirectToSubmitAnswerPage();

            // Assert
            expect(setNextPageDataStub).toHaveBeenCalledWith({ linkData: 'answer this question' });
        });
    });
});
