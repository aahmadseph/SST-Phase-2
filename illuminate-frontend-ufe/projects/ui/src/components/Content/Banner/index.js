import Banner from 'components/Content/Banner/Banner';
import { withBannerProps } from 'viewModel/content/banner/withBannerProps';
import withPersonalizedPlacement from 'components/PersonalizedPreviewPlacements/withPersonalizedPlacement';

const BannerWithPersonalizedPlacement = withPersonalizedPlacement(Banner);

export default withBannerProps(BannerWithPersonalizedPlacement);
