const React = require('react');
const { mount } = require('enzyme');
const SubmitQuestionBody = require('components/ProductPage/QuestionsAndAnswers/SubmitQuestion/SubmitQuestionBody').default;
let wrapper;
describe('<SubmitQuestionBody />', () => {
    it('should not render anything if Sku is not ready', () => {
        // Arrange
        wrapper = mount(<SubmitQuestionBody />);

        // Assert
        expect(wrapper.find('Loader').length).toBeTruthy();
    });

    it('should render success SubmitMessage for success response', () => {
        // Arrange
        wrapper = mount(<SubmitQuestionBody />);
        wrapper.setState({ requestSuccess: true });

        const submitMessage = wrapper.findWhere(x => x.first().name() === 'SubmitMessage' && x.first().prop('isError') !== true);

        // Assert
        expect(submitMessage.exists()).toBeTruthy();
    });

    it('should render error SubmitMessage for failed response', () => {
        // Arrange
        wrapper = mount(<SubmitQuestionBody />);
        wrapper.setState({ requestFailed: true });

        const submitMessage = wrapper.findWhere(x => x.first().name() === 'SubmitMessage' && x.first().prop('isError') === true);

        // Assert
        expect(submitMessage.exists()).toBeTruthy();
    });

    describe('Render submit Question ', () => {
        beforeEach(() => {
            const currentProduct = {
                productDetails: {
                    productId: 'p123',
                    displayName: 'Fenty',
                    brand: { displayName: 'brandName' }
                },
                targetUrl: '/product/p123',
                currentSku: { skuId: 'sku123' }
            };
            wrapper = mount(<SubmitQuestionBody />);
            wrapper.setState({
                currentProduct: currentProduct,
                requestSuccess: false,
                requestFailed: false
            });
        });

        it('should render title', () => {
            // Assert
            expect(wrapper.find('Text').at(0).prop('children')).toBe('Ask a Question');
        });

        it('should render ProductImage', () => {
            // Assert
            expect(wrapper.find('ProductImage').first().length).toBe(1);
        });

        it('should display ProductName', () => {
            // Assert
            expect(wrapper.find('Text').at(2).prop('children')).toBe('Fenty');
        });

        it('should have render Text Area', () => {
            // Assert
            expect(wrapper.find('Textarea').first().length).toBe(1);
        });

        it('should redirect to Product Page on Cancel', () => {
            // Act
            const link = wrapper.findWhere(n => n.first().first().name() === 'Link' && n.first().text() === 'Cancel');

            // Assert
            expect(link.at(0).prop('href')).toBe('/product/p123');
        });

        it('should not render data-at for text area', () => {
            // Assert
            const elementName = wrapper
                .findWhere(n => n.first().prop('data-at') === `${Sephora.debug.dataAt('question_field')}`)
                .first()
                .name();
            expect(elementName).toEqual('Textarea');
        });

        it('should not render data-at for submit button', () => {
            // Assert
            const elementName = wrapper
                .findWhere(n => n.first().prop('data-at') === `${Sephora.debug.dataAt('submit_question_button')}`)
                .first()
                .name();
            expect(elementName).toEqual('Button');
        });

        it('should render checkbox with email notification', () => {
            //Asset
            const checkbox = wrapper.findWhere(n => n.first().prop('data-at') === Sephora.debug.dataAt('work_at_seph_checkbox')).first();
            expect(checkbox.first().length).toBe(1);
        });

        it('should render the email field', () => {
            //Asset
            const email = wrapper.findWhere(n => n.first().name() === 'InputEmail');
            expect(email.first().length).toBe(1);
        });

        it('should disable email field if notification is checked offf', () => {
            //Asset
            wrapper.setState({ emailNotification: false });
            const disableEmail = wrapper.findWhere(n => n.first().name() === 'InputEmail' && n.first().prop('disabled') === true);
            expect(disableEmail.exists()).toBeTruthy();
        });
    });
});
