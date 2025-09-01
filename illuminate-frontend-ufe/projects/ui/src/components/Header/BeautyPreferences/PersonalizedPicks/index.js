import PersonalizedPicks from 'components/Header/BeautyPreferences/PersonalizedPicks/PersonalizedPicks';
import { withPersonalizedPicksProps } from 'viewModel/header/beautyPreferences/personalizedPicks/withPersonalizedPicksProps';

const ConnectedPersonalizedPicks = withPersonalizedPicksProps(PersonalizedPicks);

export default ConnectedPersonalizedPicks;
