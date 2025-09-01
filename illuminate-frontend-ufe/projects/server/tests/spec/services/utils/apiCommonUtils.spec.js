describe('apiCommonUtils', () => {

    let apiCommonUtils;
    beforeAll(async() => {
        apiCommonUtils = await import('#server/services/utils/apiCommonUtils.mjs');
    });

    describe('Test buildJsonError', () => {
        it('with no params', () => {
            const expected = {
                errorCode: -1,
                errorMessages: ['']

            };
            const result = apiCommonUtils.buildJsonError();

            expect(result).toEqual(expected);
        });

        it('with custom error code', () => {
            const expected = {
                errorCode: 500,
                errorMessages: ['']

            };
            const result = apiCommonUtils.buildJsonError(500);

            expect(result).toEqual(expected);
        });

        it('with error message and no error code', () => {
            const expected = {
                errorCode: -1,
                errorMessages: ['Error message']

            };
            const result = apiCommonUtils.buildJsonError(undefined, 'Error message');

            expect(result).toEqual(expected);
        });

        it('with error message and error code', () => {
            const expected = {
                errorCode: 500,
                errorMessages: ['Error message']

            };
            const result = apiCommonUtils.buildJsonError(500, 'Error message');

            expect(result).toEqual(expected);
        });

        it('with specific error key', () => {
            const expected = {
                errorCode: 200,
                errorMessages: ['Error message'],
                errorKey: 'error.key'

            };
            const result = apiCommonUtils.buildJsonError(200, 'Error message', 'error.key');

            expect(result).toEqual(expected);
        });

        it('with null message', () => {
            const expected = {
                errorCode: 400,
                errorMessages: ['']
            };

            const result = apiCommonUtils.buildJsonError(400, null);

            expect(expected).toEqual(result);
        });

        it('with undefined message', () => {
            const expected = {
                errorCode: 400,
                errorMessages: ['']
            };

            const result = apiCommonUtils.buildJsonError(400);

            expect(result).toEqual(expected);
        });

        it('with empty string as message', () => {
            const expected = {
                errorCode: 400,
                errorMessages: ['']
            };

            const result = apiCommonUtils.buildJsonError(400, '');

            expect(result).toEqual(expected);
        });
    });

    describe('Test extractError', () => {
        it('with no params', () => {
            const expected = {
                errorCode: -2,
                errorMessage: 'Unknown error.',
                longErrorMessage: null
            };

            const result = apiCommonUtils.extractError();

            expect(result).toEqual(expected);
        });

        it('with standard backend error', () => {
            const expected = {
                errorCode: 200,
                errorMessage: 'Error message.',
                longErrorMessage: null
            };

            const error = {
                data: {
                    errorCode: 200,
                    errorMessages: ['Error message.']
                }
            };

            const result = apiCommonUtils.extractError(error);

            expect(result).toEqual(expected);
        });

        it('with internal error', () => {
            const expected = {
                errorCode: -2,
                errorMessage: 'Internal Error message.',
                longErrorMessage: null
            };

            const error = new Error('Internal Error message.');

            const result = apiCommonUtils.extractError(error);

            expect(result).toEqual(expected);
        });

        it('with failed request', () => {
            const expected = {
                errorCode: -2,
                errorMessage: 'Failed request. Try again.',
                longErrorMessage: 'A very long error message.'
            };

            const error = {
                failed: true,
                err: 'A very long error message.'
            };

            const result = apiCommonUtils.extractError(error);

            expect(result).toEqual(expected);
        });

        it('with failed request and available network error code', () => {
            const expected = {
                errorCode: 500,
                errorMessage: 'Failed request. Try again.',
                longErrorMessage: 'A very long error message.'
            };

            const error = {
                statusCode: 500,
                failed: true,
                err: 'A very long error message.'
            };

            const result = apiCommonUtils.extractError(error);

            expect(result).toEqual(expected);
        });

        it('with generic error', () => {
            const expected = {
                errorCode: -2,
                errorMessage: 'Error message.',
                longErrorMessage: null
            };

            const error = {
                errMsg: 'Error message.'
            };

            const result = apiCommonUtils.extractError(error);

            expect(result).toEqual(expected);
        });

        it('with generic error and available network error code', () => {
            const expected = {
                errorCode: 500,
                errorMessage: 'Error message.',
                longErrorMessage: null
            };

            const error = {
                statusCode: 500,
                errMsg: 'Error message.'
            };

            const result = apiCommonUtils.extractError(error);

            expect(result).toEqual(expected);
        });

        it('with malformed error object', () => {
            const expected = {
                errorCode: -2,
                errorMessage: 'Unknown error.',
                longErrorMessage: null
            };

            const error = {
                invalidField: 'invalid data'
            };

            const result = apiCommonUtils.extractError(error);

            expect(result).toEqual(expected);
        });

        it('with empty error object', () => {
            const expected = {
                errorCode: -2,
                errorMessage: 'Unknown error.',
                longErrorMessage: null
            };

            const result = apiCommonUtils.extractError({});

            expect(result).toEqual(expected);
        });

        it('with null error object', () => {
            const expected = {
                errorCode: -2,
                errorMessage: 'Unknown error.',
                longErrorMessage: null
            };

            const result = apiCommonUtils.extractError(null);

            expect(result).toEqual(expected);
        });
    });
});
