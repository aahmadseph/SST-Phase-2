import { server, http, HttpResponse } from 'test-utils';
import accountActions from 'actions/AccountActions';

describe('AccountActions', () => {
    describe('cancelCheckPasswordModal', () => {
        test('should return action object', () => {
            // Arrange
            const expectedAction = {
                type: 'SHOW_CHECK_PASSWORD_MODAL',
                isOpen: false
            };

            // Act
            const action = accountActions.cancelCheckPasswordModal();

            // Assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('closeAccount', () => {
        test('should dispatch SHOW_CLOSE_ACCOUNT_MODAL and SHOW_CHECK_PASSWORD_MODAL actions', () => {
            // Arrange
            const actionOne = {
                type: 'SHOW_CLOSE_ACCOUNT_MODAL',
                isOpen: false
            };
            const actionTwo = {
                type: 'SHOW_CHECK_PASSWORD_MODAL',
                errorMessages: [],
                isOpen: true
            };
            const dispatchMock = jest.fn();

            // Act
            const asyncAction = accountActions.closeAccount();
            asyncAction(dispatchMock);

            // Assert
            expect(dispatchMock.mock.calls).toEqual([[actionOne], [actionTwo]]);
        });
    });

    describe('checkAccountClosure', () => {
        test('should dispatch SHOW_CLOSE_ACCOUNT_MODAL action when API response hase no errors', async () => {
            // Arrange
            const actionOne = {
                type: 'SHOW_CLOSE_ACCOUNT_MODAL',
                isOpen: true
            };
            const profileId = '123';
            const apiURL = `/api/users/profiles/${profileId}/accountClosureCheck`;
            const dispatchMock = jest.fn();
            const getStateMock = jest.fn(() => ({ user: { profileId } }));
            const response = {};
            server.use(
                http.get(apiURL, () => {
                    return HttpResponse.json(response);
                })
            );

            // Act
            const asyncAction = accountActions.checkAccountClosure();
            await asyncAction(dispatchMock, getStateMock);

            // Assert
            expect(dispatchMock.mock.calls).toEqual([[actionOne]]);
        });

        test('should dispatch SHOW_CLOSE_ACCOUNT_MODAL action when API response has errors', async () => {
            // Arrange
            const actionOne = {
                type: 'SHOW_INFO_MODAL',
                buttonText: 'OK',
                isOpen: true,
                message: 'errorMessageOne',
                title: 'Close Account'
            };
            const profileId = '123';
            const dispatchMock = jest.fn();
            const getStateMock = jest.fn(() => ({ user: { profileId } }));
            const apiURL = `/api/users/profiles/${profileId}/accountClosureCheck`;
            const response = { errorCode: 123, errorMessages: [actionOne.message] };
            server.use(
                http.get(apiURL, () => {
                    return HttpResponse.json(response);
                })
            );

            // Act
            const asyncAction = accountActions.checkAccountClosure();
            await asyncAction(dispatchMock, getStateMock);

            // Assert
            expect(dispatchMock.mock.calls).toEqual([[actionOne]]);
        });
    });
});
