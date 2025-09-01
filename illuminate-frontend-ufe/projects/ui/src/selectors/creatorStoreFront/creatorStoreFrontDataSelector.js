import { createSelector } from 'reselect';
import Empty from 'constants/empty';
import { CSF_PAGE_TYPES } from 'constants/actionTypes/creatorStoreFront';

const CSF_PAGETYPES = new Set(Object.values(CSF_PAGE_TYPES));

const creatorStoreFrontDataSelector = createSelector(
    state => state.creatorStoreFront?.creatorStoreFrontData || Empty.Object,
    data => {
        const { pageType = '' } = data;

        if (!CSF_PAGETYPES.has(pageType)) {
            return Empty.Object;
        }

        const key = `${pageType}PageData`;

        return {
            [key]: { ...data[key] },
            pageType
        };
    }
);

export { creatorStoreFrontDataSelector };
