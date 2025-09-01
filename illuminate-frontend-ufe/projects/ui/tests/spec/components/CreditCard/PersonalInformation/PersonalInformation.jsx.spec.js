describe('<PersonalInformation /> component', () => {
    let React;
    let PersonalInformation;
    let wrapper;

    beforeEach(() => {
        React = require('react');
        PersonalInformation = require('components/CreditCard/ApplyFlow/PersonalInformation/PersonalInformation').default;
    });

    it('should have AVS disabled on the Address Form', () => {
        wrapper = enzyme.shallow(<PersonalInformation />);
        expect(wrapper.find('AddressForm').prop('hasAVS')).toEqual(false);
    });
});
