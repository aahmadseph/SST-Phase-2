import Empty from 'constants/empty';

const gallerySelector = store => store.gallery || Empty.Object;

export default { gallerySelector };
