class ErrorsAccumulator {
    constructor() {
        this.clear();
    }

    addError(error) {
        this.errors.push(error);
    }

    hasErrors() {
        return this.errors.length > 0;
    }

    getErrors() {
        return [...this.errors];
    }

    clear() {
        this.errors = [];
    }
}

export default ErrorsAccumulator;
