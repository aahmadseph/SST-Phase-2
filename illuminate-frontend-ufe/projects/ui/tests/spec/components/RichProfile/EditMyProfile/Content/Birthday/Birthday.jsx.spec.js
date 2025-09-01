describe('<Birthday /> component', () => {
    const React = require('react');
    const Birthday = require('components/RichProfile/EditMyProfile/Content/Birthday/Birthday').default;

    let shallowComponent;

    let biAccount;

    beforeEach(() => {
        biAccount = {
            birthDay: '1',
            birthMonth: '2',
            birthYear: '1992'
        };
        shallowComponent = enzyme.shallow(<Birthday biAccount={biAccount} />);
    });

    it('should render heading', () => {
        expect(shallowComponent.find('ContentHeading').length).toBe(1);
    });

    it('should display heading message', () => {
        expect(shallowComponent.find('ContentHeading').prop('children')).toBe('Your birthday');
    });

    it('should display birthday message', () => {
        expect(shallowComponent.find('Text').at(0).prop('children')).toBe('February 1 1992');
    });

    it('should display birthday message for year 1804', () => {
        biAccount = {
            birthDay: '1',
            birthMonth: '2',
            birthYear: '1804'
        };
        shallowComponent = enzyme.shallow(<Birthday biAccount={biAccount} />);
        expect(shallowComponent.find('Text').at(0).prop('children')).toBe('February 1');
    });

    it('should display informational text', () => {
        const infoText = shallowComponent.find('Text').at(1);
        expect(infoText.prop('children')[0]).toBe('If you need to change your birth date, please call Sephora at ');
    });

    it('should display phone number in informational text', () => {
        const infoText = shallowComponent.find('Text').at(1);
        const phoneElement = infoText.prop('children')[1];
        expect(phoneElement.props.children).toBe('1-877-SEPHORA');
    });
});
