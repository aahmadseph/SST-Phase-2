const React = require('react');
const AccountModal = require('components/Header/AccountModal/AccountModal').default;
const AccountMenu = require('components/Header/AccountMenu').default;
const AccountGreeting = require('components/Header/AccountGreeting').default;

describe('<AccountModal> component', () => {
    let shallowComponent;

    beforeEach(() => {
        shallowComponent = enzyme.shallow(<AccountModal />);
    });

    it('should render the <AccountModal /> component', () => {
        expect(shallowComponent.find('Modal').length).toEqual(1);
    });

    it('should render the Modal header', () => {
        expect(shallowComponent.find('ModalHeader').length).toEqual(1);
    });

    it('should render the Modal body', () => {
        expect(shallowComponent.find('ModalBody').length).toEqual(1);
    });

    it('should render AccountGreeting', () => {
        expect(shallowComponent.find(AccountGreeting).length).toEqual(1);
    });

    it('should render AccountMenu', () => {
        expect(shallowComponent.find(AccountMenu).length).toEqual(1);
    });
});
