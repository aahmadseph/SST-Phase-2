import Empty from 'constants/empty';

const brandsListSelector = store => store.brandsList || Empty.Object;

export default { brandsListSelector };
