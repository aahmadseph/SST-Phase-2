/* eslint-disable object-curly-newline */
const React = require('react');
const { shallow } = require('enzyme');

describe('ResetPassword', function () {
    let store;
    let Actions;
    let dispatchSpy;
    let showInfoModalSpy;
    let authenticationApi;
    let ResetPassword;
    let component;
    let localeUtils;
    let getText;

    beforeEach(() => {
        store = require('Store').default;
        Actions = require('Actions').default;
        dispatchSpy = spyOn(store, 'dispatch');
        showInfoModalSpy = spyOn(Actions, 'showInfoModal');
        authenticationApi = require('services/api/authentication').default;
        ResetPassword = require('components/ResetPassword/ResetPassword').default;
        localeUtils = require('utils/LanguageLocale').default;
        getText = localeUtils.getLocaleResourceFile('components/ResetPassword/locales', 'ResetPassword');
    });

    describe('submit', () => {
        let e;

        beforeEach(() => {
            e = {
                preventDefault: () => {}
            };
            const wrapper = shallow(<ResetPassword />);
            component = wrapper.instance();
            spyOn(component, 'isValid').and.returnValue(true);
            component.setState({
                email: 'a@b.com'
            });
        });

        it('should call dispatch once when resetPassword promise is resolved', done => {
            // Arrange
            const fakePromise = {
                then: function (resolve) {
                    resolve();

                    return fakePromise;
                },
                catch: function () {
                    done();
                }
            };
            spyOn(authenticationApi, 'resetPassword').and.returnValue(fakePromise);

            // Act
            component.submit(e);

            // Assert
            expect(dispatchSpy).toHaveBeenCalledTimes(1);
        });

        it('should call showModalSpy with correct arguments', done => {
            // Arrange
            const fakePromise = {
                then: function (resolve) {
                    resolve();

                    return fakePromise;
                },
                catch: function () {
                    done();
                }
            };
            spyOn(authenticationApi, 'resetPassword').and.returnValue(fakePromise);

            // Act
            component.submit(e);

            // Assert
            expect(showInfoModalSpy).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    isOpen: true,
                    title: getText('resetSuccessful'),
                    message: getText('passwordHasBeenReset'),
                    buttonText: getText('viewProfile'),
                    showCancelButton: false,
                    showCloseButton: true
                })
            );
        });
    });
});
