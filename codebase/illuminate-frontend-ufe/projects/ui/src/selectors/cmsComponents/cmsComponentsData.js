import Empty from 'constants/empty';

const cmsComponentDataSelector = store => store.cmsComponents || Empty.Object;

export default cmsComponentDataSelector;
