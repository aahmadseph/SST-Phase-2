import Empty from 'constants/empty';

const sponsoredProductsSelector = store => store.sponsorProducts || Empty.Object;

export default { sponsoredProductsSelector };
