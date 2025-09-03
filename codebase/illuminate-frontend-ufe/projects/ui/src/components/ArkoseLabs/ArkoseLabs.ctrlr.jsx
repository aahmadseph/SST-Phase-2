import React, { createRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import ArkoseLabsFrame from 'components/ArkoseLabs/ArkoseLabsFrame';
import BaseClass from 'components/BaseClass';

// We don't want to integrate ArkoseLabs in 100% of cases.
// AB testing is not used here on purpose.
const RenderTestFailed = Math.random() > 0.5;

class ArkoseLabs extends BaseClass {
    constructor(props) {
        super(props);

        this._iframeElement = createRef();
    }

    onArkoseLabsMessage = ({ data }) => {
        try {
            const event = JSON.parse(data);

            switch (event.id) {
                case 'arkose-detect-ready':
                case 'arkose-detect-show':
                case 'arkose-detect-suppress':
                case 'arkose-detect-completed':
                case 'arkose-detect-error': {
                    // // eslint-disable-next-line no-console
                    // console.log(event.id);
                    // // eslint-disable-next-line no-console
                    // console.dir(event);

                    break;
                }
                default: {
                    break;
                }
            }
        } catch {
            // Do nothing.
        }
    };

    componentDidMount() {
        window.addEventListener('message', this.onArkoseLabsMessage);
        this.forceUpdate();
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.onArkoseLabsMessage);
    }

    render() {
        if (RenderTestFailed) {
            return null;
        }

        const { id, publicKey } = this.props;
        const { contentWindow } = this._iframeElement.current || {};
        const container = contentWindow?.document?.body;

        return (
            <iframe
                id={id}
                ref={this._iframeElement}
                style={{ height: 0 }}
            >
                {container &&
                    createPortal(
                        <ArkoseLabsFrame
                            id={id}
                            publicKey={publicKey}
                            window={contentWindow}
                        />,
                        container
                    )}
            </iframe>
        );
    }
}

ArkoseLabs.defaultProps = {};

ArkoseLabs.propTypes = {
    id: PropTypes.string.isRequired,
    publicKey: PropTypes.string.isRequired
};

export default wrapComponent(ArkoseLabs, 'ArkoseLabs', true);
