const React = require('react');
const { shallow } = require('enzyme');
const PostingConfirmation = require('components/AddReview/PostingConfirmation/PostingConfirmation').default;

describe('PostingConfirmation component', () => {
    let wrapper;
    let component;

    beforeEach(() => {
        wrapper = shallow(<PostingConfirmation />);
        component = wrapper.instance();
    });

    describe('componentWillReceiveProps', () => {
        it('should provide the updated props to the component render', () => {
            // Arrange
            const updatedProps = {
                submissionErrors: 'updatedSubmissionErrors'
            };

            // Act
            component.componentWillReceiveProps(updatedProps);

            // Assert
            expect(wrapper.state()).toEqual(updatedProps);
        });
    });
});
