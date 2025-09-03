import MNW from 'components/MNW/MNW';
import { withMnwProps } from 'viewModel/mnw/withMnwProps';
import withClientSideRenderOnly from 'hocs/withClientSideRenderOnly';
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';

export default withAfterEventsRendering(withClientSideRenderOnly()(withMnwProps(MNW)), ['HydrationFinished']);
