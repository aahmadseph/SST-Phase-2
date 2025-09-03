import FinalSaleItem from 'components/SharedComponents/FinalSaleItem/FinalSaleItem';
import { withFinalSaleItemProps } from 'viewModel/sharedComponents/finalSaleItem/withFinalSaleItemProps';

const WrappedFinalSaleItem = withFinalSaleItemProps(FinalSaleItem);

export default WrappedFinalSaleItem;
