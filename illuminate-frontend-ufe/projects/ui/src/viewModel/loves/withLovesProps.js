import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { createStructuredSelector } from 'reselect';

import CurrentLovesSelector from 'selectors/loves/currentLoves/currentLovesSelector';

const { wrapHOC } = FrameworkUtils;
const { currentLovesSelector } = CurrentLovesSelector;

const withLovesProps = wrapHOC(
    connect(
        createStructuredSelector({
            currentLoves: currentLovesSelector
        })
    )
);

export { withLovesProps };
