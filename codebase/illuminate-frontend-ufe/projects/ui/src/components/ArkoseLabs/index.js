import { withArkoseLabsProps } from 'viewModel/arkoseLabs/withArkoseLabsProps';
import { withKillSwitch } from 'hocs/withKillSwitch';
import ArkoseLabs from 'components/ArkoseLabs/ArkoseLabs';
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';

export default withKillSwitch(withAfterEventsRendering(withArkoseLabsProps(ArkoseLabs), ['HydrationFinished']), 'isArkoseLabsIntegrationEnabled');
