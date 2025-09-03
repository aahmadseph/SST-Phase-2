/**
 * @description The exception that is thrown when one of the arguments provided to a method is not valid.
 *
 * @class ArgumentException
 *
 * @extends {Error}
 */
class ArgumentException extends Error {
    constructor(message) {
        super(message);

        this.name = 'ArgumentException';
    }
}

export default ArgumentException;
