import Footer from 'components/Footer/Footer';
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';
import { headerAndFooterSelector } from 'selectors/headerAndFooter/headerAndFooterSelector';

const fields = createSelector(userSelector, headerAndFooterSelector, (user, headerAndFooter) => ({ user, isCompact: headerAndFooter.isCompact }));

const withFooterProps = connect(fields);
const ConnectedFooter = withFooterProps(Footer);
const ConnectedAfterEventsFooter = withAfterEventsRendering(ConnectedFooter, ['PostLoad', 'HydrationFinished']);

export default ConnectedAfterEventsFooter;
