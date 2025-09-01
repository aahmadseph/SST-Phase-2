import Empty from 'constants/empty';

const socialInfoSelector = store => store.socialInfo || Empty.Object;

export { socialInfoSelector };
