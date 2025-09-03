import AccessPointButton from 'components/RwdCheckout/Shared/AccessPointButton/AccessPointButton';
import withGlobalModals from 'hocs/withGlobalModals';

import { connect } from 'react-redux';
import Actions from 'actions/Actions';
import LanguageLocaleUtils from 'utils/LanguageLocale';
const { getTextFromResource, getLocaleResourceFile, isCanada } = LanguageLocaleUtils;
import { createSelector, createStructuredSelector } from 'reselect';
import bccUtils from 'utils/BCC';
const { ACCESS_POINT_INFO_MODAL } = bccUtils.MEDIA_IDS;

const getText = getLocaleResourceFile('components/RwdCheckout/Shared/AccessPointButton/locales', 'AccessPointButton');

const infoModalOptions = {
    isOpen: true,
    mediaId: ACCESS_POINT_INFO_MODAL,
    title: getText('accessPointInfoTitle'),
    titleDataAt: 'accessPointInfoModalTitle',
    width: 0
};

const textResources = createStructuredSelector({
    moreInfoLabel: getTextFromResource(getText, isCanada() ? 'moreInfoShipToPickupLocation' : 'moreInfoShipToFedex'),
    transKey: getTextFromResource(getText, isCanada() ? 'shipToPickupLocation' : 'shipToFedex'),
    selectLocationNearYou: getTextFromResource(getText, 'selectLocationNearYou'),
    changeAlternateLocation: getTextFromResource(getText, 'changeAlternateLocation'),
    transKey2: getTextFromResource(getText, isCanada() ? 'orShipToLocation' : 'orShipToFedexLocation'),
    infoModalTitle: getTextFromResource(getText, isCanada() ? 'infoModalTitleCA' : 'infoModalTitleUS')
});

const { showMediaModal } = Actions;
const withAccessPointProps = connect(
    createSelector(textResources, texts => {
        return {
            ...texts,
            infoModalOptions
        };
    }),
    { showMediaModal }
);

const ConnectedAccessPointButton = withGlobalModals(withAccessPointProps(AccessPointButton));
ConnectedAccessPointButton.displayName = 'ConnectedAccessPointButton';

export default ConnectedAccessPointButton;
