import Empty from 'constants/empty';

const p13nSelector = store => store.p13n || Empty.Object;

export { p13nSelector };
