const { createSpy } = jasmine;

describe('tokens manager', () => {
    let manager;
    let loader;

    beforeEach(() => {
        manager = require('utils/tokens/manager').default;
        loader = require('utils/tokens/loader').default;
    });

    describe('loader', () => {
        it('must resolve user handler', done => {
            loader.getHandlerPackage('user').then(userHandler => {
                expect(typeof userHandler).toBe('object');
                expect(userHandler.default.process).toBeDefined();
                done();
            });
        });
    });

    describe('replacer', () => {
        let replacerValueMock;

        beforeEach(() => {
            replacerValueMock = createSpy().and.returnValue(Promise.resolve('FirstName'));
        });

        it('must replace a valid token', done => {
            const replacer = require('utils/tokens/replacer').default;

            const tokenToBeReplaced = '~{user.firstName}';
            replacer.getTokenValue('~{user.firstName}', replacerValueMock).then(value => {
                expect(value).toBe('FirstName');
                expect(replacerValueMock).toHaveBeenCalledOnceWith(tokenToBeReplaced);
                done();
            });
        });
    });

    describe('evaluator', () => {
        describe('no replacements', () => {
            it('must be defined and must be a function', () => {
                expect(typeof manager.evaluator).toBe('function');
            });

            it('must receive a valid string as parameter', done => {
                manager.evaluator(123456).catch(error => {
                    expect(error).toBeInstanceOf(Error);
                    expect(error.message).toBe('Content is not a valid string');
                    done();
                });
            });

            it('must receive a string and same must be returned', done => {
                const stringToEvaluate = 'I am a single string';
                manager.evaluator(stringToEvaluate).then(result => {
                    expect(result).toBe(stringToEvaluate);
                    done();
                });
            });
        });

        describe('unknown tokens', () => {
            it('must pass an unknown handler', done => {
                const tokenWithUnknownHandler = '~{not.found}';
                manager.evaluator(tokenWithUnknownHandler).then(result => {
                    expect(result).toBe('');
                    done();
                });
            });
        });

        describe('user replacements', () => {
            it('must replace first name token successfully', done => {
                const process = createSpy().and.returnValue(Promise.resolve('FirstName'));
                const userHandlerProcessMock = spyOn(loader, 'getHandlerPackage').and.returnValue(Promise.resolve({ process }));

                manager.evaluator('Hello, I am ~{user.firstName}').then(result => {
                    expect(userHandlerProcessMock).toHaveBeenCalledTimes(1);
                    expect(result).toBe('Hello, I am FirstName');
                    done();
                });
            });

            it('must replace last name token successfully', done => {
                const process = createSpy().and.returnValue(Promise.resolve('LastName'));
                const userHandlerProcessMock = spyOn(loader, 'getHandlerPackage').and.returnValue(Promise.resolve({ process }));

                manager.evaluator('Hello, I am ~{user.lastName}').then(result => {
                    expect(userHandlerProcessMock).toHaveBeenCalledTimes(1);
                    expect(result).toBe('Hello, I am LastName');
                    done();
                });
            });

            it('must replace full name token successfully', done => {
                const process = createSpy().and.returnValue(Promise.resolve('FullName'));
                const userHandlerProcessMock = spyOn(loader, 'getHandlerPackage').and.returnValue(Promise.resolve({ process }));

                manager.evaluator('Hello, I am ~{user.fullName}').then(result => {
                    expect(userHandlerProcessMock).toHaveBeenCalledTimes(1);
                    expect(result).toBe('Hello, I am FullName');
                    done();
                });
            });

            it('must replace first and last name tokens successfully', async () => {
                // Arrange
                const replacer = require('utils/tokens/replacer').default;
                spyOn(replacer, 'getTokenValue').and.callFake(value => {
                    if (value === 'firstName') {
                        return Promise.resolve('FirstName');
                    } else if (value === 'lastName') {
                        return Promise.resolve('LastName');
                    } else {
                        return Promise.resolve('error');
                    }
                });
                spyOn(loader, 'getHandlerPackage').and.resolveTo({});

                // Act
                const result = await manager.evaluator('Hello, I am ~{user.firstName} ~{user.lastName}');

                // Assert
                expect(result).toBe('Hello, I am FirstName LastName');
            });
        });
    });
});
