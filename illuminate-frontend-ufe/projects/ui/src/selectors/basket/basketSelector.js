import Empty from 'constants/empty';

const basketSelector = store => store.basket || Empty.Object;

export default basketSelector;
