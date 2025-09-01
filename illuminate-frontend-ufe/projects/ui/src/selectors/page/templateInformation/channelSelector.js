import { createSelector } from 'reselect';
import templateInformationSelector from 'selectors/page/templateInformation/templateInformationSelector';

export default createSelector(templateInformationSelector, templateInformation => templateInformation.channel);
