const React = require('react');
const { shallow } = require('enzyme');
const SubmitAnswerBody = require('components/ProductPage/QuestionsAndAnswers/SubmitAnswer/SubmitAnswerBody').default;

describe('<SubmitAnswerBody />', () => {
    let wrapper;

    it('should not render anything if Sku is not ready', () => {
        // Arrange
        wrapper = shallow(<SubmitAnswerBody />, { disableLifecycleMethods: true });

        // Assert
        expect(wrapper.find('Loader').length).toBeTruthy();
    });

    it('should render success SubmitMessage for success response', () => {
        // Arrange
        wrapper = shallow(<SubmitAnswerBody />, { disableLifecycleMethods: true });
        wrapper.setState({ requestSuccess: true });

        const submitMessage = wrapper.findWhere(x => x.name() === 'SubmitMessage' && x.prop('isError') !== true);

        // Assert
        expect(submitMessage.exists()).toBeTruthy();
    });

    it('should render error SubmitMessage for failed response', () => {
        // Arrange
        wrapper = shallow(<SubmitAnswerBody />, { disableLifecycleMethods: true });
        wrapper.setState({ requestFailed: true });

        const submitMessage = wrapper.findWhere(x => x.name() === 'SubmitMessage' && x.prop('isError') === true);

        // Assert
        expect(submitMessage.exists()).toBeTruthy();
    });

    it('should not render data-at for text area', () => {
        // Arrange
        wrapper = shallow(<SubmitAnswerBody />, { disableLifecycleMethods: true });

        // Assert
        const elementName = wrapper.findWhere(n => n.prop('data-at') === `${Sephora.debug.dataAt('answer_field')}`).name();
        expect(elementName).toEqual('Textarea');
    });

    it('should not render data-at for submit bu', () => {
        // Arrange
        wrapper = shallow(<SubmitAnswerBody />, { disableLifecycleMethods: true });

        // Assert
        const elementName = wrapper.findWhere(n => n.prop('data-at') === `${Sephora.debug.dataAt('submit_answer_button')}`).name();
        expect(elementName).toEqual('Button');
    });
});
