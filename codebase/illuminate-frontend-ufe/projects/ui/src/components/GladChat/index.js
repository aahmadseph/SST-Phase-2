import GladChat from 'components/GladChat/GladChat';
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';
import withGlobalModals from 'hocs/withGlobalModals';
import { withGladChatProps } from 'viewModel/gladChat/withGladChatProps';
import Location from 'utils/Location';

const eventsToWait = !Sephora.isNodeRender && Location.isCustomerServicePage() ? ['HydrationFinished'] : ['PostLoad', 'HydrationFinished'];

const ConnectedGladChat = withAfterEventsRendering(withGlobalModals(withGladChatProps(GladChat)), eventsToWait);

export default ConnectedGladChat;
