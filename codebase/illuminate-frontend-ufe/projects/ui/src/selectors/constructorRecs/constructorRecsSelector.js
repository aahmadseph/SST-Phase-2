import Empty from 'constants/empty';

const constructorRecsSelector = store => store.constructorRecommendations.constructorRecommendations || Empty.Object;

export default { constructorRecsSelector };
