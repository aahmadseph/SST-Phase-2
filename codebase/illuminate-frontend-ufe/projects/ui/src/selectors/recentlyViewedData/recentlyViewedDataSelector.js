import Empty from 'constants/empty';

const recentlyViewedDataSelector = store => store.recentlyViewedData || Empty.Object;

export default { recentlyViewedDataSelector };
