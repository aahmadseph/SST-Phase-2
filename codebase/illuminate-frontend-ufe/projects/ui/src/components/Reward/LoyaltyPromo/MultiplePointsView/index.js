import withMultiplePointsViewProps from 'viewModel/reward/loyaltyPromo/multiplePointsView/withMultiplePointsViewProps';
import MultiplePointsView from 'components/Reward/LoyaltyPromo/MultiplePointsView/MultiplePointsView';
import withGlobalModals from 'hocs/withGlobalModals';

export default withGlobalModals(withMultiplePointsViewProps(MultiplePointsView));
