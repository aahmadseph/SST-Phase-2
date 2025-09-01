/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

class ArkoseLabsFrame extends BaseClass {
    constructor(props) {
        super(props);

        this.props.window.setupDetect = client => {
            client.setConfig({
                selector: '#arkose-detect',
                data: { id: this.props.id },
                mode: 'inline',
                onReady: () => {
                    const message = JSON.stringify({ id: 'arkose-detect-ready' });
                    parent.postMessage(message, '*');
                },
                onShow: () => {
                    const message = JSON.stringify({ id: 'arkose-detect-show' });
                    parent.postMessage(message, '*');
                },
                onSuppress: () => {
                    const message = JSON.stringify({ id: 'arkose-detect-suppress' });
                    parent.postMessage(message, '*');
                },
                onCompleted: response => {
                    const message = JSON.stringify({
                        id: 'arkose-detect-completed',
                        payload: { sessionToken: response.token }
                    });
                    parent.postMessage(message, '*');
                },
                onError: response => {
                    const message = JSON.stringify({
                        id: 'arkose-detect-error',
                        payload: { error: response }
                    });
                    parent.postMessage(message, '*');
                }
            });
        };
    }

    componentDidMount() {
        // if (isScriptLoaded[this.props.publicKey]) {
        //     return;
        // }

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://client-api.arkoselabs.com/v2/${this.props.publicKey}/api.js`;
        script.setAttribute('data-callback', 'setupDetect');
        script.async = true;
        script.defer = true;
        script.id = 'arkose-script';
        this.props.window.document.head.append(script);
        // isScriptLoaded[this.props.publicKey] = true;
    }

    render() {
        return <div id='arkose-detect' />;
    }
}

ArkoseLabsFrame.defaultProps = {};

ArkoseLabsFrame.propTypes = {
    id: PropTypes.string.isRequired,
    publicKey: PropTypes.string.isRequired
};

export default wrapComponent(ArkoseLabsFrame, 'ArkoseLabsFrame', true);
