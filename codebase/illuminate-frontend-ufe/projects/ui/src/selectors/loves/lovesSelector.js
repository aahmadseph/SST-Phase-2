import Empty from 'constants/empty';

const lovesSelector = store => store.loves || Empty.Object;

export { lovesSelector };
