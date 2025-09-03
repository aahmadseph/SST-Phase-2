import withAfterEventsRendering from 'hocs/withAfterEventsRendering';
import { withKillSwitch } from 'hocs/withKillSwitch';
import ClaripEmbedScript from 'components/ClaripEmbedScript/ClaripEmbedScript';

export default withKillSwitch(withAfterEventsRendering(ClaripEmbedScript, ['UserInfoReady', 'HydrationFinished']), 'isClaripPrivacyEnabled');
