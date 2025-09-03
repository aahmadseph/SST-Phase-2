import Empty from 'constants/empty';

const pageSelector = store => store.page || Empty.Object;

export { pageSelector };
