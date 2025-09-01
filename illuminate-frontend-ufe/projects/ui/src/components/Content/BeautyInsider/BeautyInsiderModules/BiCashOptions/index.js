import BiCashOptions from 'components/Content/BeautyInsider/BeautyInsiderModules/BiCashOptions/BiCashOptions';
import { withBeautyInsiderCashProps } from 'viewModel/content/BeautyInsider/BeautyInsiderModules/BeautyInsiderCash/withBeautyInsiderCashProps';
import withGlobalModals from 'hocs/withGlobalModals';

export default withGlobalModals(withBeautyInsiderCashProps(BiCashOptions));
