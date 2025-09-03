import PointMultiplierEvent from 'components/Content/BeautyInsider/BeautyInsiderModules/PointMultiplierEvent/PointMultiplierEvent';
import { withPointsMultiplierEventProps } from 'viewModel/content/BeautyInsider/BeautyInsiderModules/PointsMultiplierEvent/withPointsMultiplierEventProps';
import withGlobalModals from 'hocs/withGlobalModals';

export default withGlobalModals(withPointsMultiplierEventProps(PointMultiplierEvent));
