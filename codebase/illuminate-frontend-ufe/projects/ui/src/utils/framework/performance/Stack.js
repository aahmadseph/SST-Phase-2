import { ArgumentOutOfRangeException } from 'exceptions';

class Stack {
    /**
     * @description Creates a new or returns existing stack.
     *
     * @param {Symbol} stackId Stack identifier.
     *
     * @memberof Stack
     *
     * @return {Array} A stack entry.
     */
    getOrCreateNewStack = stackId => {
        if (typeof stackId !== 'symbol') {
            throw new ArgumentOutOfRangeException('stackId');
        }

        let stack = this[stackId];

        if (!stack) {
            stack = [];
            this[stackId] = stack;
        }

        return stack;
    };
    /**
     * @description Delete stack by id.
     *
     * @param {Symbol} stackId Stack identifier.
     *
     * @memberof Stack
     */
    deleteById = stackId => {
        if (typeof stackId !== 'symbol') {
            throw new ArgumentOutOfRangeException('stackId');
        }

        delete this[stackId];
    };

    /**
     * @description Delete all stacks and reset to `null` current pointer.
     *
     * @memberof Stack
     */
    clear = () => {
        Object.getOwnPropertySymbols(this).forEach(key => {
            delete this[key];
        });
    };
}

export default Stack;
