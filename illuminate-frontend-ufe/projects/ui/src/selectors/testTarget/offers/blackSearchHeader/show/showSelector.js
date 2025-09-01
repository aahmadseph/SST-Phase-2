import { createSelector } from 'reselect';
import { blackSearchHeaderSelector } from 'selectors/testTarget/offers/blackSearchHeader/blackSearchHeaderSelector';

const showSelector = createSelector(blackSearchHeaderSelector, blackSearchHeader => !!blackSearchHeader.show);

export { showSelector };
