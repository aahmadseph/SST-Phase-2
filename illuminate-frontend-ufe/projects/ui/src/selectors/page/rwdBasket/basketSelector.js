import Empty from 'constants/empty';

const basketPageSelector = store => store.page.rwdBasket || Empty.Object;

export default { basketPageSelector };
