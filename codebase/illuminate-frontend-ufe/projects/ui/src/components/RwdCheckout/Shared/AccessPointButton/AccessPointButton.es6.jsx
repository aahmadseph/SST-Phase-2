/* eslint-disable class-methods-use-this */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box, Text, Link } from 'components/ui';
import InfoButton from 'components/InfoButton/InfoButton';
import AccessPointModal from 'components/RwdCheckout/Shared/AccessPointButton/AccessPointModal';
import accessPointConstants from 'components/RwdCheckout/Shared/AccessPointButton/constants';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

const { VARIANTS } = accessPointConstants;
import { globalModals, renderModal } from 'utils/globalModals';

const { FEDEX_PICKUP_LOCATION_INFO } = globalModals;

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
        const {
            showMediaModal, variant, moreInfoLabel, infoModalOptions, infoModalTitle
        } = this.props;

        const modalData = {
            ...this.props.globalModals[FEDEX_PICKUP_LOCATION_INFO],
            title: infoModalTitle
        };

        return (
            <InfoButton
                aria-label={moreInfoLabel}
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
        const { transKey, selectLocationNearYou } = this.props;

        return (
            <>
                {this.renderTitle({ text: transKey })}
                {this.renderInfoButton()}
                {this.renderLink({ text: selectLocationNearYou })}
            </>
        );
    };

    accessPointButtonNoTitle = () => {
        const { transKey2 } = this.props;

        return (
            <>
                {this.renderLink({
                    display: 'inline',
                    text: transKey2
                })}
                {this.renderInfoButton()}
            </>
        );
    };

    accessPointButtonLinkOnly = () => {
        const { changeAlternateLocation } = this.props;

        return this.renderLink({
            display: 'inline',
            text: changeAlternateLocation
        });
    };

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
