import Empty from 'constants/empty';

const smsSelector = store => store.smsStatus || Empty.Object;

export default { smsSelector };
