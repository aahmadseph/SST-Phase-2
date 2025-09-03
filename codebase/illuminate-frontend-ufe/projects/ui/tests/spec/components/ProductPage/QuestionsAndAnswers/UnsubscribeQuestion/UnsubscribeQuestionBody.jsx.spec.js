const React = require('react');
const { shallow } = require('enzyme');
const UnsubscribeQuestionBody = require('components/ProductPage/QuestionsAndAnswers/UnsubscribeQuestion/UnsubscribeQuestionBody').default;
const processEvent = require('analytics/processEvent').default;
const anaConsts = require('analytics/constants').default;
const questionAnswerApi = require('services/api/questionAndAnswer').default;
const urlUtils = require('utils/Url').default;

describe('<UnsubscribeQuestionBody />', () => {
    const e = {
        type: 'click',
        preventDefault: () => {}
    };
    const unsubscribeSuccess = 'questions&answers:unsubscribe-success:n/a:*';
    const continueShoping = 'unsubscribe-request:continue shopping';
    let wrapper;
    let fakePromise;
    let processSpy;
    beforeEach(() => {
        wrapper = shallow(<UnsubscribeQuestionBody />);
        fakePromise = {
            then: () => {
                return fakePromise;
            },
            catch: () => {
                return () => {};
            }
        };
        spyOn(urlUtils, 'getParamsByName').and.returnValue(['someId']);
        spyOn(urlUtils, 'redirectTo').and.callFake(() => {});
        processSpy = spyOn(processEvent, 'process');
    });

    it('should render unsubscribe message', () => {
        // Arrange
        wrapper.setState({
            requestFailed: false,
            requestSuccess: false
        });

        // Assert
        expect(wrapper.find('Text').at(0).props().children).toBe('Stop Email Notifications for This Question?');
    });

    it('should render stop button', () => {
        // Arrange
        wrapper.setState({
            requestFailed: false,
            requestSuccess: false
        });

        // Assert
        expect(wrapper.find('Button').at(0).props().children).toBe('Stop Sending Email Notification');
    });

    it('should show success Message on successful unsubscribe', () => {
        wrapper.setState({
            requestFailed: false,
            requestSuccess: true
        });

        // Assert
        expect(wrapper.find('Text').at(0).props().children).toBe('You Have Successfully Unsubscribed.');
    });

    it('should show button with continue shopping', () => {
        wrapper.setState({
            requestFailed: false,
            requestSuccess: true
        });

        // Assert
        expect(wrapper.find('Button').at(0).props().children).toBe('Continue Shopping');
    });

    it('should show unsuccess Message on unsuccessful unsubscribe', () => {
        wrapper.setState({
            requestFailed: true,
            requestSuccess: false
        });

        // Assert
        expect(wrapper.find('Text').at(0).props().children).toBe('Submission Not Received');
    });

    it('should show button with continue shopping', () => {
        wrapper.setState({
            requestFailed: true,
            requestSuccess: false
        });

        // Assert
        expect(wrapper.find('Button').at(0).props().children).toBe('Back to Questions & Answers');
    });

    it('shold send stop notifications analytics', () => {
        wrapper.setState({
            requestFailed: false,
            requestSuccess: false
        });
        spyOn(questionAnswerApi, 'unsubscribeQuestion').and.returnValue(fakePromise);
        const expectedData = {
            actionInfo: unsubscribeSuccess,
            linkName: unsubscribeSuccess
        };

        const button = wrapper.findWhere(x => x.name() === 'Button' && x.prop('variant') === 'primary');
        button.simulate('click', e);

        expect(processSpy).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, { data: expectedData });
    });

    it('shold send continue shoping analytics', () => {
        wrapper.setState({
            requestFailed: false,
            requestSuccess: true
        });
        spyOn(window, 'setTimeout').and.callFake(() => {});
        const expectedData = {
            actionInfo: continueShoping,
            linkName: unsubscribeSuccess
        };

        const button = wrapper.findWhere(x => x.name() === 'Button' && x.prop('variant') === 'primary');
        button.simulate('click', e);

        expect(processSpy).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, { data: expectedData });
    });

    it('shold send continue shoping analytics for without unsubscribing case', () => {
        wrapper.setState({
            requestFailed: false,
            requestSuccess: false
        });
        spyOn(window, 'setTimeout').and.callFake(() => {});
        const expectedData = {
            actionInfo: continueShoping,
            linkName: continueShoping
        };

        const button = wrapper.findWhere(x => x.name() === 'Button' && x.prop('variant') === 'secondary');
        button.simulate('click', e);

        expect(processSpy).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, { data: expectedData });
    });
});
