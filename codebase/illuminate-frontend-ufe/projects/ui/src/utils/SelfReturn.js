import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

const getOriginalOrderId = () => {
    const { originatingOrderId } = Storage.local.getItem(LOCAL_STORAGE.NCR_ORDER) || '';

    return originatingOrderId;
};

export default {
    getOriginalOrderId
};
