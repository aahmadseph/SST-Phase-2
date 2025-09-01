/**
 * @description The exception that is thrown when a requested method or operation is not implemented.
 *
 * @class NotImplementedException
 *
 * @extends {Error}
 */
class NotImplementedException extends Error {
    constructor(message) {
        super(message);

        this.name = 'NotImplementedException';
    }
}

export default NotImplementedException;
