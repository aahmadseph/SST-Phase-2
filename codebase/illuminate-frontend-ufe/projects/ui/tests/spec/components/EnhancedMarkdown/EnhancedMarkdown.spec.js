const React = require('react');
const { shallow } = require('enzyme');

describe('EnhancedMarkdown Component', () => {
    let EnhancedMarkdown;

    beforeEach(() => {
        EnhancedMarkdown = require('components/EnhancedMarkdown/EnhancedMarkdown').default;
    });

    describe('Enhancer not implemented yet', () => {
        it('should not render the content inside the Enhancer when this is not implemented yet', () => {
            const content = 'Some initial text <Enhancer type="notImplementedYet">text inside content </Enhancer>some ending text';
            const wrapper = shallow(<EnhancedMarkdown content={content} />);
            expect(wrapper.html()).toEqual('<span>Some initial text </span><span>some ending text</span>');
        });

        it('should not render the content inside the Enhancer when the type is not sent', () => {
            const content = 'Some **initial** text <Enhancer>text inside content </Enhancer>some ending text';
            const wrapper = shallow(<EnhancedMarkdown content={content} />);
            expect(wrapper.html()).toEqual('<span>Some <strong>initial</strong> text </span><span>some ending text</span>');
        });
    });

    it('Enhancer applyPromoCTA should render ApplyPromoEnhancer when the enhancer type is appyPromoCTA', () => {
        // Arrange
        const content = 'Some initial text <Enhancer type="applyPromoCTA">text inside content </Enhancer>some ending text';

        // Act
        const wrapper = shallow(<EnhancedMarkdown content={content} />);

        // Assert
        const componentWrapper = wrapper.find('ErrorBoundary(Connect(ApplyPromoEnhancer))');
        expect(componentWrapper.exists()).toBe(true);
    });

    it('Enhancer signInCTA should render AddSignInEnhancer when the enhancer type is signInCTA', () => {
        // Arrange
        const content = 'Some initial text <Enhancer type="signInCTA">text inside content </Enhancer>some ending text';

        // Act
        const wrapper = shallow(<EnhancedMarkdown content={content} />);

        // Assert
        const componentWrapper = wrapper.find('ErrorBoundary(Connect(AddSignInEnhancer))');
        expect(componentWrapper.exists()).toBe(true);
    });

    it('Enhancer joinBiCTA should render JoinBiEnhancer when the enhancer type is joinBiCTA', () => {
        // Arrange
        const content = '<Enhancer type="joinBiCTA" args="">**Join BI**</Enhancer>';

        // Act
        const wrapper = shallow(<EnhancedMarkdown content={content} />);

        // Assert
        const componentWrapper = wrapper.find('ErrorBoundary(Connect(JoinBiEnhancer))');
        expect(componentWrapper.exists()).toBe(true);
    });
});
