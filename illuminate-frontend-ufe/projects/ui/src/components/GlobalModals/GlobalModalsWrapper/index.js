import { withGlobalModalsWrapperProps } from 'viewModel/globalModals/globalModalsWrapper/withGlobalModalsWrapperProps';
import GlobalModalsWrapper from 'components/GlobalModals/GlobalModalsWrapper/GlobalModalsWrapper';
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';

export default withAfterEventsRendering(withGlobalModalsWrapperProps(GlobalModalsWrapper), ['HydrationFinished']);
