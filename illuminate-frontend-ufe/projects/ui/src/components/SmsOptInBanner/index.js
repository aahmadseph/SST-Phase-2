import SmsOptInBanner from 'components/SmsOptInBanner/SmsOptInBanner';
import { withSmsOptInBannerProps } from 'viewModel/smsOptInBanner/withSmsOptInBannerProps';

const ConnectedSmsOptInBanner = withSmsOptInBannerProps(SmsOptInBanner);

export default ConnectedSmsOptInBanner;
