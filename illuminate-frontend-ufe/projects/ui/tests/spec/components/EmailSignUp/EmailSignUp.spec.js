const React = require('react');
const { shallow } = require('enzyme');
const EmailSignUp = require('components/EmailSignUp/EmailSignUp').default;
const ReactDOM = require('react-dom');

describe('EmailSignUp component', () => {
    beforeEach(() => {
        spyOn(ReactDOM, 'findDOMNode').and.returnValue({
            querySelectorAll: () => {
                return [
                    {
                        blur: () => {},
                        focus: () => {}
                    }
                ];
            }
        });
    });

    describe('showSuccess', () => {
        it('should show success message', () => {
            // Arrange
            const wrapper = shallow(<EmailSignUp />);
            const component = wrapper.instance();
            component.setState({
                showError: true,
                showSuccess: false
            });

            component.input = {
                getValue: () => 'value',
                input: { setValue: () => true }
            };

            // Act
            component.showSuccess({});

            // Assert
            expect(component.state.showError).toBeFalsy();
            expect(component.state.showSuccess).toBeTruthy();
        });
    });

    describe('showError', () => {
        it('should show the error message', () => {
            // Arrange
            const wrapper = shallow(<EmailSignUp />);
            const component = wrapper.instance();
            component.setState({
                showError: false,
                showSuccess: true
            });

            component.input = {
                getValue: () => 'value',
                input: { setValue: () => true }
            };

            // Act
            component.showError();

            // Assert
            expect(component.state.showError).toBeTruthy();
            expect(component.state.showSuccess).toBeFalsy();
        });
    });
});
