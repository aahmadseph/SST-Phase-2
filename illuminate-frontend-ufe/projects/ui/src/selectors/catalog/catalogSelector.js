import Empty from 'constants/empty';

const catalogSelector = store => store.catalog || Empty.Object;

export { catalogSelector };
