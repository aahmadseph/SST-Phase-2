import Actions from 'Actions';
import BCCUtils from 'utils/BCC';

const { MEDIA_IDS } = BCCUtils;

const showTermsOfServiceModal = () =>
    Actions.showMediaModal({
        isOpen: true,
        mediaId: MEDIA_IDS.TERMS_OF_SERVICE_MODAL
    });

const showTermsAndConditionsModal = () =>
    Actions.showMediaModal({
        isOpen: true,
        mediaId: MEDIA_IDS.SAME_DAY_UNLIMITED_TERMS_AND_CONDITIONS
    });

const showPrivacyPolicyModal = () =>
    Actions.showMediaModal({
        isOpen: true,
        mediaId: MEDIA_IDS.PRIVACY_POLICY_MODAL
    });

export default {
    showTermsOfServiceModal,
    showTermsAndConditionsModal,
    showPrivacyPolicyModal
};
