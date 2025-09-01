const React = require('react');
const { shallow } = require('enzyme');
const BccEmailSmsOptin = require('components/Bcc/BccEmailSmsOptIn/BccEmailSmsOptIn').default;

describe('BccEmailSmsOptIn component', () => {
    let component;
    let props;

    describe('Layout', () => {
        it('should display an email address field when showEmailField is true', () => {
            component = shallow(<BccEmailSmsOptin showEmailField={true} />);
            expect(component.find('InputEmail').length).toBe(1);
        });

        it('should not display an email address field when showEmailField is false', () => {
            component = shallow(<BccEmailSmsOptin showEmailField={false} />);
            expect(component.find('InputEmail').length).toBe(0);
        });

        it('should display a mobile phone number field when showMobileNumberField is true', () => {
            component = shallow(<BccEmailSmsOptin showMobileNumberField={true} />);
            expect(component.find('TextInput').length).toBe(1);
        });

        it('should display a mobile phone number field when showMobileNumberField is false', () => {
            component = shallow(<BccEmailSmsOptin showMobileNumberField={false} />);
            expect(component.find('TextInput').length).toBe(0);
        });

        describe('Disclaimer text', () => {
            let disclaimerMarkdown;

            beforeEach(() => {
                props = {
                    emailDisclaimer: 'lorem ipsum dolor',
                    phoneDisclaimer: ' sit amet, consectetur adipiscing elit'
                };
                component = shallow(<BccEmailSmsOptin {...props} />);
                disclaimerMarkdown = component.find('Markdown');
            });

            it('should be a Markdown component', () => {
                expect(disclaimerMarkdown.length).toBe(1);
            });

            it('should concatenate the emailDisclaimer and phoneDisclaimer props', () => {
                expect(disclaimerMarkdown.prop('content')).toEqual('lorem ipsum dolor sit amet, consectetur adipiscing elit');
            });
        });
    });
});
