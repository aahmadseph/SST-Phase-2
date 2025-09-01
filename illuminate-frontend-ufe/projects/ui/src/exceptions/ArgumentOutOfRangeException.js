import ArgumentException from 'exceptions/ArgumentException';

/**
 * @description The exception that is thrown when the value of an argument is outside the allowable range of values as defined by the invoked method.
 *
 * @class ArgumentOutOfRangeException
 *
 * @extends {ArgumentException}
 */
class ArgumentOutOfRangeException extends ArgumentException {
    constructor(message) {
        super(message);

        this.name = 'ArgumentOutOfRangeException';
    }
}

export default ArgumentOutOfRangeException;
