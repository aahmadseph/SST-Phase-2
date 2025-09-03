/* eslint-disable class-methods-use-this */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box, Text, Link } from 'components/ui';
import InfoButton from 'components/InfoButton/InfoButton';
import AccessPointModal from 'components/Checkout/Shared/AccessPointButton/AccessPointModal';

import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/Checkout/Shared/AccessPointButton/locales', 'AccessPointButton');

import bccUtils from 'utils/BCC';
import accessPointConstants from 'components/Checkout/Shared/AccessPointButton/constants';

import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

const { ACCESS_POINT_INFO_MODAL } = bccUtils.MEDIA_IDS;
const { VARIANTS } = accessPointConstants;
import { globalModals, renderModal } from 'utils/globalModals';

const { FEDEX_PICKUP_LOCATION_INFO } = globalModals;

const infoModalOptions = {
    isOpen: true,
    mediaId: ACCESS_POINT_INFO_MODAL,
    title: getText('accessPointInfoTitle'),
    titleDataAt: 'accessPointInfoModalTitle',
    width: 0
};

class AccessPointButton extends BaseClass {
    state = {
        showAccessPointModal: false
    };

    fireInfoModalAnalytics = () => {
        const pageType = anaConsts.PAGE_TYPES.GENERIC_MODAL;
        const pageDetail = anaConsts.PAGE_NAMES.ACCESS_POINT_INFO_MODAL;
        const pageName = anaConsts.PAGE_NAMES.ACCESS_POINT_INFO_MODAL_CORRECTED;
        const pageSource = anaConsts.PAGE_TYPES.CONTENT_STORE;
        const eventData = {
            pageName: `${pageType}:${pageDetail}:n/a:*`,
            pageType: pageType,
            pageDetail: pageDetail,
            morePageInfo: {
                oneTagPageName: `${pageSource}:fedex ${pageName}:n/a:*`,
                oneTagPageType: pageSource,
                oneTagPageDetail: `fedex ${pageName}`
            }
            // linkData: anaConsts.LinkData.ACCESS_POINT_INFO_MODAL_OPEN
        };
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data: eventData });
    };

    toggleAccessPointModal = () => {
        this.setState(prevState => ({
            showAccessPointModal: !prevState.showAccessPointModal
        }));
    };

    renderTitle = ({ text }) => {
        return (
            <Text
                key='title'
                fontWeight='bold'
            >
                {text}
            </Text>
        );
    };

    renderInfoButton = () => {
        const { showMediaModal, variant } = this.props;
        const moreInfoLabel = localeUtils.isCanada() ? 'moreInfoShipToPickupLocation' : 'moreInfoShipToFedex';

        const modalData = {
            ...this.props.globalModals[FEDEX_PICKUP_LOCATION_INFO],
            title: getText(localeUtils.isCanada() ? 'infoModalTitleCA' : 'infoModalTitleUS')
        };

        return (
            <InfoButton
                aria-label={getText(moreInfoLabel)}
                onClick={() => {
                    renderModal(modalData, () => {
                        showMediaModal(infoModalOptions);
                        this.fireInfoModalAnalytics();
                    });
                }}
                size={16}
                ml={0}
                css={{
                    verticalAlign: variant === VARIANTS.ICON_ONLY ? 'middle' : 'baseline'
                }}
            />
        );
    };

    renderLink = ({ display = 'block', text }) => {
        return (
            <Link
                key='modalTrigger'
                p={2}
                m={-2}
                color='blue'
                display={display}
                onClick={this.toggleAccessPointModal}
            >
                {text}
            </Link>
        );
    };

    accessPointButtonFull = () => {
        const transKey = localeUtils.isCanada() ? 'shipToPickupLocation' : 'shipToFedex';

        return (
            <>
                {this.renderTitle({ text: getText(transKey) })}
                {this.renderInfoButton()}
                {this.renderLink({ text: getText('selectLocationNearYou') })}
            </>
        );
    };

    accessPointButtonNoTitle = () => {
        const transKey = localeUtils.isCanada() ? 'orShipToLocation' : 'orShipToFedexLocation';

        return (
            <>
                {this.renderLink({
                    display: 'inline',
                    text: getText(transKey)
                })}
                {this.renderInfoButton()}
            </>
        );
    };

    accessPointButtonLinkOnly = () =>
        this.renderLink({
            display: 'inline',
            text: getText('changeAlternateLocation')
        });

    accessPointButtonIconOnly = () => this.renderInfoButton();

    renderAccessPointButton = variant => {
        const isFull = variant === VARIANTS.FULL;
        const isNoTitle = variant === VARIANTS.NO_TITLE;
        const linkOnly = variant === VARIANTS.LINK_ONLY;
        const iconOnly = variant === VARIANTS.ICON_ONLY;

        if (isFull) {
            return this.accessPointButtonFull();
        }

        if (isNoTitle) {
            return this.accessPointButtonNoTitle();
        }

        if (linkOnly) {
            return this.accessPointButtonLinkOnly();
        }

        if (iconOnly) {
            return this.accessPointButtonIconOnly();
        }

        return null;
    };

    render() {
        const { showAccessPointModal } = this.state;
        const {
            variant, marginTop, marginBottom, ml, display, callback
        } = this.props;

        return (
            <>
                {showAccessPointModal && (
                    <AccessPointModal
                        isOpen={showAccessPointModal}
                        onDismiss={this.toggleAccessPointModal}
                        callback={callback}
                    />
                )}
                <Box
                    key={`variant-${variant}`}
                    marginTop={marginTop}
                    marginBottom={marginBottom}
                    marginLeft={ml}
                    display={display}
                >
                    {this.renderAccessPointButton(variant)}
                </Box>
            </>
        );
    }
}

AccessPointButton.defaultProps = {
    variant: VARIANTS.FULL,
    marginTop: 3,
    marginBottom: 0,
    display: 'block'
};

export default wrapComponent(AccessPointButton, 'AccessPointButton');
