const React = require('react');
const ReactDOM = require('react-dom');
const { shallow, mount } = require('enzyme');

describe('AccountCreationSection component', () => {
    let shallowComponent;
    let AccountCreationSection;
    let component;
    let profileStub;
    let RegisterFormProps;
    let FormsUtils;

    beforeEach(() => {
        FormsUtils = require('utils/Forms').default;
        require('utils/LanguageLocale');
        require('react-dom/test-utils');
        AccountCreationSection = require('components/Checkout/Sections/AccountCreation/Section/AccountCreationSection').default;
    });

    describe('Empty Profile', () => {
        beforeEach(() => {
            profileStub = {};
            const wrapper = mount(<AccountCreationSection profile={profileStub} />);
            component = wrapper.instance();
        });

        it('should render empty component', () => {
            expect(ReactDOM.findDOMNode(component)).toEqual(null);
        });
    });

    describe('Register Form Properties', () => {
        let getStoreEditSectionNameStub;
        let loginStub;
        let biDataStub;

        beforeEach(() => {
            loginStub = {};
            profileStub = {
                login: loginStub,
                firstName: 'firstName',
                lastName: 'lastName'
            };
            biDataStub = {
                firstName: profileStub.firstName,
                lastName: profileStub.lastName
            };
            getStoreEditSectionNameStub = spyOn(FormsUtils, 'getStoreEditSectionName').and.returnValue('getStoreEditSectionName');
            shallowComponent = enzyme.shallow(<AccountCreationSection profile={profileStub} />);
            RegisterFormProps = shallowComponent.find('RegisterForm').get(0).props;
        });

        it('should provide login info from user profile', () => {
            expect(RegisterFormProps.presetLogin).toEqual(loginStub);
        });

        it('should compose bi Data object and pass it to form', () => {
            expect(RegisterFormProps.biData).toEqual(biDataStub);
        });

        it('should hide an email field', () => {
            expect(RegisterFormProps.hideEmail).toEqual(true);
        });

        it('should hide Register Button', () => {
            expect(RegisterFormProps.hideButton).toEqual(true);
        });

        it('should pass specific for Checkout flag', () => {
            expect(RegisterFormProps.isCheckout).toEqual(true);
        });

        it('should provide proper edit section name for Account Creation', () => {
            expect(getStoreEditSectionNameStub).toHaveBeenCalledWith(FormsUtils.FORMS.CHECKOUT.ACCOUNT_CREATION);
        });

        it('should attach edit store to form', () => {
            expect(RegisterFormProps.editStore).toEqual('getStoreEditSectionName');
        });
    });

    describe('Edit Name Fields', () => {
        beforeEach(() => {
            profileStub = {
                login: {},
                firstName: 'firstName',
                lastName: 'lastName'
            };
            shallowComponent = shallow(<AccountCreationSection profile={profileStub} />);
        });

        it('should show Edit name link', () => {
            const editLinkProps = shallowComponent.find('Link').get(0).props;
            expect(editLinkProps.children).toEqual('Edit');
        });

        it('should hide name input fields on Register form', () => {
            RegisterFormProps = shallowComponent.find('RegisterForm').get(0).props;
            expect(RegisterFormProps.hideName).toEqual(true);
        });

        it('should show name input fields on Register form if user edits her name', () => {
            shallowComponent.setState({ editName: true });
            RegisterFormProps = shallowComponent.find('RegisterForm').get(0).props;
            expect(RegisterFormProps.hideName).toEqual(false);
        });
    });
});
