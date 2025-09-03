import cmsApi from 'services/api/cms';
import BCCUtils from 'utils/BCC';
import { CURBSIDE_CONCIERGE_INFO_MODAL } from 'constants/actionTypes/modalActions';

const { MEDIA_IDS } = BCCUtils;

const getCurbsideConciergeInfoModal = () => dispatch =>
    cmsApi.getMediaContent(MEDIA_IDS.CURBSIDE_CONCIERGE_INFO_MODAL).then(response =>
        dispatch({
            type: CURBSIDE_CONCIERGE_INFO_MODAL,
            payload: response
        })
    );

export default { getCurbsideConciergeInfoModal };
