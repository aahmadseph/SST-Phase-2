import Empty from 'constants/empty';

const authSelector = store => store.auth || Empty.Object;

export { authSelector };
