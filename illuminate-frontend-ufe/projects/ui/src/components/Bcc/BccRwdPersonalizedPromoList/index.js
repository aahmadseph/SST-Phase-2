import { withKillSwitch } from 'hocs/withKillSwitch';
import BccRwdPromoList from 'components/Bcc/BccRwdPromoList/BccRwdPromoList';
import withPersonalizedPromotionsProps from 'viewModel/bcc/bccRwdPersonalizedPromoList/withPersonalizedPromotionsProps';

export default withKillSwitch(withPersonalizedPromotionsProps(BccRwdPromoList), 'isMyOffersModuleEnabled');
