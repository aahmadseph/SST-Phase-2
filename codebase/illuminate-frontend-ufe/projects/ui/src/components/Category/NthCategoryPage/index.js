import withNthCategoryPageProps from 'viewModel/category/nthCategoryPage/withNthCategoryPageProps';
import NthCategoryPage from 'components/Category/NthCategoryPage/NthCategoryPage';
import { withNavigationMenu } from 'hocs/page/withNavigationMenu';

export default withNthCategoryPageProps(withNavigationMenu(NthCategoryPage));
