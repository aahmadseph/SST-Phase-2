import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import chatActions from 'actions/ChatActions';

import { gladChatSelector } from 'selectors/gladChat/gladChatSelector';

const { wrapHOC } = FrameworkUtils;
const fields = createSelector(gladChatSelector, gladChat => gladChat);

const functions = {
    updateGladChatState: chatActions.updateGladChatState
};

const withGladChatProps = wrapHOC(connect(fields, functions));

export {
    withGladChatProps, fields, functions
};
