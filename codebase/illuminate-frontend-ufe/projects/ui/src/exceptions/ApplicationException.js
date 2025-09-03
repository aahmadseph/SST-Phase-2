/**
 * @description Serves as the base class for application-defined exceptions.
 *
 * @class ApplicationException
 *
 * @extends {Error}
 */
class ApplicationException extends Error {
    constructor(message, options) {
        super(message, options);

        this.name = 'ApplicationException';
    }
}

export default ApplicationException;
