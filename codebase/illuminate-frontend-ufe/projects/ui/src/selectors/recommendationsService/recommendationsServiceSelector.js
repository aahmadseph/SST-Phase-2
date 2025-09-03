import Empty from 'constants/empty';

const recommendationsServiceSelector = store => store.recommendationsService || Empty.Object;

export { recommendationsServiceSelector };
