import Empty from 'constants/empty';

const superChatSelector = store => store.superChat || Empty.Object;

export { superChatSelector };
