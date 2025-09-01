import Empty from 'constants/empty';

const userSelector = store => store.user || Empty.Object;

export { userSelector };
