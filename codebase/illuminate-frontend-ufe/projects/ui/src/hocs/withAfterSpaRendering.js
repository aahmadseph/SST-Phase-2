import React, { Component } from 'react';
import { compose } from 'redux';
import framework from 'utils/framework';
const { wrapHOC, wrapHOCComponent } = framework;

import { withLoadSpaPageProgress } from 'hocs/page/withLoadSpaPageProgress';

const withAfterSpaRendering = compose(
    withLoadSpaPageProgress,
    wrapHOC(WrappedComponent => {
        class AfterSpaRendering extends Component {
            constructor(props) {
                super(props);

                const { showProgress } = this.props;
                this.previousState = showProgress;
            }

            shouldComponentUpdate({ showProgress }) {
                let result = false;

                if (this.previousState && !showProgress) {
                    result = true;
                }

                this.previousState = showProgress;

                return result;
            }

            render() {
                const {
                    // eslint-disable-next-line no-unused-vars
                    showProgress,
                    ...propsToRender
                } = this.props;

                return <WrappedComponent {...propsToRender} />;
            }
        }

        return wrapHOCComponent(AfterSpaRendering, 'AfterSpaRendering', [WrappedComponent]);
    })
);

export default withAfterSpaRendering;
