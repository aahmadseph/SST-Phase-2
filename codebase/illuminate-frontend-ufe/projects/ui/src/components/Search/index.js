import Search from 'components/Search/Search';
import { withSearchProps } from 'viewModel/search/withSearchProps';
import { withNavigationMenu } from 'hocs/page/withNavigationMenu';

export default withSearchProps(withNavigationMenu(Search));
