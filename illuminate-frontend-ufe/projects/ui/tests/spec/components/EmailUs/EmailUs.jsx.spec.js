xdescribe('<EmailUs > component', () => {
    let React;
    let EmailUs;
    let mountComponent;

    beforeEach(() => {
        React = require('react');
        EmailUs = require('components/EmailUs/EmailUs').default;
    });

    it('should render the <EmailUs /> component', () => {
        mountComponent = enzyme.mount(<EmailUs />);
        expect(mountComponent.find('EmailUs').length).toEqual(1);
    });

    it('should render the form', () => {
        mountComponent = enzyme.mount(<EmailUs />);
        expect(mountComponent.find('form').length).toEqual(1);
    });

    describe('Form pre-populate', () => {
        describe('Pre-populate form for signed in user', () => {
            const userUtils = require('utils/User').default;
            const store = require('Store').default;
            let storeGetUserStub;
            const signedInUser = {
                user: {
                    firstName: 'jerry',
                    lastName: 'napkin',
                    login: 'jerry@yahoo.com'
                }
            };

            beforeEach(() => {
                storeGetUserStub = spyOn(store, 'getState');
                storeGetUserStub.and.returnValue(signedInUser);
            });

            it('should have first name populated', () => {
                mountComponent = enzyme.mount(<EmailUs />);
                mountComponent.setState({
                    firstName: signedInUser.user.firstName,
                    lastName: signedInUser.user.lastName,
                    emailAddress: signedInUser.user.login
                });

                const firstNameNode = mountComponent.find('input').at(0).getDOMNode();
                expect(firstNameNode.value).toEqual(signedInUser.user.firstName);
            });

            it('should have last name pre-populated', () => {
                mountComponent = enzyme.mount(<EmailUs />);
                mountComponent.setState({
                    firstName: signedInUser.user.firstName,
                    lastName: signedInUser.user.lastName,
                    emailAddress: signedInUser.user.login
                });

                const lastNameNode = mountComponent.find('input').at(1).getDOMNode();
                expect(lastNameNode.value).toEqual(signedInUser.user.lastName);
            });

            it('should have email address pre-populated', () => {
                mountComponent = enzyme.mount(<EmailUs />);
                mountComponent.setState({
                    firstName: signedInUser.user.firstName,
                    lastName: signedInUser.user.lastName,
                    fromEmail: signedInUser.user.login
                });

                const emailAddressNode = mountComponent.find('input').at(2).getDOMNode();
                expect(emailAddressNode.value).toEqual(signedInUser.user.login);
            });

            it('should biNumber empty for non-bi user', () => {
                mountComponent = enzyme.mount(<EmailUs />);

                const biNode = mountComponent.find('input').at(3).getDOMNode();
                expect(userUtils.isBI()).toEqual(false);
                expect(biNode.value).toEqual('');
            });
        });

        describe('Form for anonymous user', () => {
            const userUtils = require('utils/User').default;

            beforeEach(() => {
                spyOn(userUtils, 'isAnonymous').and.returnValue(true);
            });

            it('should have first name value to be empty string ', () => {
                mountComponent = enzyme.mount(<EmailUs />);
                const firstNameNode = mountComponent.find('input').at(0).getDOMNode();
                expect(firstNameNode.value).toEqual('');
            });

            it('should have last name value to be empty string ', () => {
                mountComponent = enzyme.mount(<EmailUs />);
                const lastNameNode = mountComponent.find('input').at(1).getDOMNode();
                expect(lastNameNode.value).toEqual('');
            });

            it('should have email address value to be empty string', () => {
                mountComponent = enzyme.mount(<EmailUs />);
                const emailAddressNode = mountComponent.find('input').at(2).getDOMNode();
                expect(emailAddressNode.value).toEqual('');
            });
        });
    });
});
