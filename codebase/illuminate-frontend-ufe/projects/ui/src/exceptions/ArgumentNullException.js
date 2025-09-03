import ArgumentException from 'exceptions/ArgumentException';

/**
 * @description The exception that is thrown when a null reference is passed to a method that does not accept it as a valid argument.
 *
 * @class ArgumentNullException
 *
 * @extends {ArgumentException}
 */
class ArgumentNullException extends ArgumentException {
    constructor(message) {
        super(message);

        this.name = 'ArgumentNullException';
    }
}

export default ArgumentNullException;
