const React = require('react');
const { shallow } = require('enzyme');
const { createSpy } = jasmine;
const store = require('store/Store').default;
const questionAnswerApi = require('services/api/questionAndAnswer').default;
const SubmitAnswerBody = require('components/ProductPage/QuestionsAndAnswers/SubmitAnswer/SubmitAnswerBody').default;
const questionsAnswersAnalytics = require('analytics/bindingMethods/pages/productPage/questionsAnswersBindings').default;
const ProductActions = require('actions/ProductActions').default;
const UrlUtils = require('utils/Url').default;

describe('SubmitAnswerBody component', () => {
    let wrapper;
    let component;
    let fakePromise;
    let getQuestionByIdApiStub;
    let submitAnswerApiStub;
    let fireSubmitLinkTrackingErrorStub;
    let fireSubmitSuccessPageLoadStub;
    let asyncAction;
    let dispatchStub;
    let event;
    const resolvedQuestionData = {
        Results: [
            {
                QuestionDetails: 'Question text',
                SubmissionTime: '2020-09-23T21:50:37.000+00:00',
                UserNickname: 'nickName'
            }
        ]
    };

    beforeEach(() => {
        spyOn(UrlUtils, 'getParamsByName').and.callFake(arg => {
            let paramValue;

            if (arg === 'productId') {
                paramValue = ['1234'];
            } else if (arg === 'questionId') {
                paramValue = ['01011'];
            } else if (arg === 'skuId') {
                paramValue = ['4321'];
            }

            return paramValue;
        });

        event = { preventDefault: createSpy() };

        asyncAction = () => () => Promise.resolve();
        dispatchStub = spyOn(store, 'dispatch');
        spyOn(ProductActions, 'fetchCurrentProduct').and.returnValue(asyncAction);
        getQuestionByIdApiStub = spyOn(questionAnswerApi, 'getQuestionById').and.returnValue(Promise.resolve(resolvedQuestionData));

        wrapper = shallow(<SubmitAnswerBody />);

        component = wrapper.instance();
    });

    describe('componentDidMount', () => {
        it('should call getQuestionByIdApiStub when mounted', () => {
            expect(getQuestionByIdApiStub).toHaveBeenCalled();
        });

        it('should dispatch fetchCurrentProduct action', () => {
            expect(dispatchStub).toHaveBeenCalledWith(asyncAction);
        });
    });

    it('should set showGuideline state value when toggleGuidelines is clicked', () => {
        component.toggleGuidelines();
        expect(component.state.showGuidelines).toBeTrue();
    });

    it('should set answerTextError state value when validateAnswerText is executed with an empty text', () => {
        component.validateAnswerText('');
        expect(component.state.answerTextError).toBeTrue();
    });

    it('should set answerTextError state value when validateAnswerText is executed with an correct text', () => {
        component.validateAnswerText('Valid answer text');
        expect(component.state.answerTextError).toBeFalse();
    });

    xit('should set answerTextMessage state value when handleAnswerTextChange is executed with a 1000 charater text', () => {
        const maxLengthText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ornare, sem sed commodo
        rhoncus, lacus neque condimentum nisi, nec interdum felis arcu id mi. Ut quis convallis nulla, nec lacinia nisi.
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin et nunc lectus.
        Sed dignissim, lacus pulvinar volutpat porttitor, lorem nibh volutpat nibh, non sodales enim orci nec odio. Ut sit
        amet nulla nec orci maximus pellentesque tristique non erat. Phasellus purus erat, interdum sit amet sollicitudin
        gravida, egestas quis leo. Phasellus nulla felis, tristique et tortor ut, hendrerit efficitur leo. Duis a nisl non
        magna dapibus tempor pretium vel mi. Integer mattis id nisl id sagittis. Integer condimentum diam eget accumsan
        aliquet. Cras tempus, nulla sed gravida fringilla, odio nisl commodo nulla, sed ultricies elit est quis erat.
        Phasellus ullamcorper tempus nisi nec te`;

        component.handleAnswerTextChange(maxLengthText);
        expect(component.state.answerTextMessage).toBe('Max characters reached');
    });

    describe('submitAnswer click success', () => {
        let localeUtils;
        beforeEach(() => {
            localeUtils = require('utils/LanguageLocale').default;
            fakePromise = {
                then: resolve => {
                    resolve({ responseStatus: 200 });

                    return fakePromise;
                },
                catch: () => {}
            };
            submitAnswerApiStub = spyOn(questionAnswerApi, 'submitAnswer').and.returnValue(fakePromise);
            fireSubmitSuccessPageLoadStub = spyOn(questionsAnswersAnalytics, 'fireSubmitSuccessPageLoad');

            component.answerText = { getValue: createSpy().and.returnValue('answer text') };
            wrapper.setState({
                acceptedTerms: true,
                showTermsError: false
            });
            wrapper.find('form').prop('onSubmit')(event);
        });

        it('should call submitAnswer api with correct values when CTA is clicked', () => {
            spyOn(localeUtils, 'isCanada').and.returnValue(false);
            expect(submitAnswerApiStub).toHaveBeenCalledWith(
                component.state.productId,
                component.state.questionId,
                encodeURIComponent(component.answerText.getValue()).replace(/%\d\w|\+/g, ' '),
                null,
                false,
                false,
                undefined,
                'en-US',
                null,
                '',
                ''
            );
        });

        it('should call fireSubmitSuccessPageLoad when submit was succesful', () => {
            expect(fireSubmitSuccessPageLoadStub).toHaveBeenCalled();
        });

        it('should set requesteFailed state status to true', () => {
            expect(component.state.requestSuccess).toBeTrue();
        });
    });

    describe('submitAnswer click unsuccess', () => {
        beforeEach(() => {
            fakePromise = {
                then: () => {
                    return fakePromise;
                },
                catch: reject => {
                    reject({ errorMessages: [] });
                }
            };
            submitAnswerApiStub = spyOn(questionAnswerApi, 'submitAnswer').and.returnValue(fakePromise);
            fireSubmitLinkTrackingErrorStub = spyOn(questionsAnswersAnalytics, 'fireSubmitLinkTrackingError');

            wrapper.setState({
                acceptedTerms: true,
                showTermsError: false
            });
            component.answerText = { getValue: createSpy().and.returnValue('answer text') };
            wrapper.find('form').prop('onSubmit')(event);
        });

        it('should call fireSubmitLinkTrackingError when submit was unsuccesful', () => {
            expect(fireSubmitLinkTrackingErrorStub).toHaveBeenCalled();
        });

        it('should set requesteFailed state status to true', () => {
            expect(component.state.requestFailed).toBeTrue();
        });
    });

    describe('submitAnswer click unsuccess if has not accepted terms and conditions', () => {
        beforeEach(() => {
            fakePromise = {
                then: () => {
                    return fakePromise;
                },
                catch: reject => {
                    reject({ errorMessages: [] });
                }
            };
            submitAnswerApiStub = spyOn(questionAnswerApi, 'submitAnswer').and.returnValue(fakePromise);
            fireSubmitLinkTrackingErrorStub = spyOn(questionsAnswersAnalytics, 'fireSubmitLinkTrackingError');

            component.answerText = { getValue: createSpy().and.returnValue('answer text') };
            wrapper.find('form').prop('onSubmit')(event);
        });

        it('should call fireSubmitLinkTrackingError when submit was unsuccesful', () => {
            expect(fireSubmitLinkTrackingErrorStub).not.toHaveBeenCalled();
        });

        it('should have requestFailed state status to false', () => {
            expect(component.state.requestFailed).toBeFalsy();
        });
    });
});
