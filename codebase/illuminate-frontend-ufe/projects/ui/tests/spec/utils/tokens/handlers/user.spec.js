const userHandler = require('utils/tokens/handlers/user').default;
const userUtils = require('utils/User').default;

describe('user tokens handler', () => {
    let getUserMock, isAnonymousStub;
    beforeEach(() => {
        getUserMock = spyOn(userUtils, 'getUser').and.returnValue(
            Promise.resolve({
                firstName: 'FirstName',
                lastName: 'LastName'
            })
        );
        isAnonymousStub = spyOn(userUtils, 'isAnonymous').and.returnValue(false);
    });

    it('must have process function defined', () => {
        expect(userHandler.process).toBeDefined();
    });

    it('must get user first name', done => {
        userHandler
            .process('firstName')
            .then(value => {
                expect(getUserMock).toHaveBeenCalledTimes(1);
                expect(isAnonymousStub).toHaveBeenCalledTimes(1);
                expect(value).toBe('FirstName');
                done();
            })
            .catch(error => done.fail(error));
    });

    it('must get user last name', done => {
        userHandler
            .process('lastName')
            .then(value => {
                expect(getUserMock).toHaveBeenCalledTimes(1);
                expect(isAnonymousStub).toHaveBeenCalledTimes(1);
                expect(value).toBe('LastName');
                done();
            })
            .catch(error => done.fail(error));
    });

    it('must get full name', done => {
        userHandler
            .process('fullName')
            .then(value => {
                expect(getUserMock).toHaveBeenCalledTimes(1);
                expect(isAnonymousStub).toHaveBeenCalledTimes(1);
                expect(value).toBe('FirstName LastName');
                done();
            })
            .catch(error => done.fail(error));
    });

    it('must be called with an unknown value and it must be returned', done => {
        userHandler
            .process('notFound')
            .then(value => {
                expect(getUserMock).toHaveBeenCalledTimes(1);
                expect(isAnonymousStub).toHaveBeenCalledTimes(1);
                expect(value).toBe('notFound');
                done();
            })
            .catch(error => done.fail(error));
    });
});
