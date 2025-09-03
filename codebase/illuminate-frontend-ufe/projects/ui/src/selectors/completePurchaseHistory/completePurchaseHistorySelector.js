import Empty from 'constants/empty';

const completePurchaseHistorySelector = store => store.completePurchaseHistory.items || Empty.Array;

export default completePurchaseHistorySelector;
