import Empty from 'constants/empty';

const orderSelector = store => store.order || Empty.Object;

export { orderSelector };
