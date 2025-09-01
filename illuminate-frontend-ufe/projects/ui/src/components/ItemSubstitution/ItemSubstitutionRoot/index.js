import ItemSubstitutionRoot from 'components/ItemSubstitution/ItemSubstitutionRoot/ItemSubstitutionRoot';
import { withKillSwitch } from 'hocs/withKillSwitch';
import { withItemSubstitutionRootProps } from 'viewModel/itemSubstitution/itemSubstitutionRoot/withItemSubstitutionRootProps';

export default withKillSwitch(withItemSubstitutionRootProps(ItemSubstitutionRoot), 'isItemSubstitutionEnabled');
