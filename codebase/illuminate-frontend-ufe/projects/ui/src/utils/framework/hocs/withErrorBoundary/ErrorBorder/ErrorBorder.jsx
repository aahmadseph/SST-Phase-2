/* eslint-disable class-methods-use-this */
import { Component } from 'react';
import logError from 'utils/framework/logError';

/**
 * @description ErrorBorder is React component that catches JavaScript errors anywhere in their child component tree,
 * log those errors, and display a fallback UI instead of the component tree that crashed.
 * Error boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them.
 *
 * @class ErrorBorder
 *
 * @extends {Component}
 */
class ErrorBorder extends Component {
    constructor(props) {
        super(props);

        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error, errorInfo) {
        try {
            const subResult = errorInfo.componentStack.substring(0, errorInfo.componentStack.indexOf('(')).trim();
            errorInfo.source = subResult.substring(subResult.lastIndexOf(' ')).trim();
        } catch {
            errorInfo.source = 'ErrorBorder';
        }

        logError(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return null;
        }

        return this.props.children;
    }
}

export default ErrorBorder;
