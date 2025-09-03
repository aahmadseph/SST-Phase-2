import Info from 'components/ProductPage/Info/Info';
import withInfoSectionProps from 'viewModel/product/Info/withInfoSectionProps';

const ConnectedInfo = withInfoSectionProps(Info);
ConnectedInfo.displayName = 'ConnectedInfo';

export default ConnectedInfo;
