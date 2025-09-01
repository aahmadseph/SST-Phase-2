import { createSelector } from 'reselect';
import { homepageUgcWidgetSelector } from 'selectors/testTarget/offers/homepageUgcWidget/homepageUgcWidgetSelector';

const experienceSelector = createSelector(homepageUgcWidgetSelector, homepageUgcWidget => homepageUgcWidget.experience);

export { experienceSelector };
