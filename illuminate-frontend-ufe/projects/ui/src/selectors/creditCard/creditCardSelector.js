import Empty from 'constants/empty';

const creditCardSelector = store => store.creditCard || Empty.Object;

export { creditCardSelector };
