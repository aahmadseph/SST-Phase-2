import Empty from 'constants/empty';

const rewardFulfillmentSelector = store => store.rewardFulfillment || Empty.Object;

export { rewardFulfillmentSelector };
