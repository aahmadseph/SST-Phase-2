import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const gallerySelector = createSelector(pageSelector, page => page.gallery || Empty.Object);

export { gallerySelector };
