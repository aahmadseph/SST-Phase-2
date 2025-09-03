/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import Actions from 'Actions';
import store from 'store/Store';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import FindInStoreAddress from 'components/GlobalModals/FindInStore/FindInStoreAddress/FindInStoreAddress';
import GoogleMap from 'components/GoogleMap/GoogleMap';
import Modal from 'components/Modal/Modal';
import { Box, Link } from 'components/ui';
import { modal } from 'style/config';
import localeUtils from 'utils/LanguageLocale';

const { showFindInStoreMapModal, showFindInStoreModal } = Actions;

class FindInStoreMapModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            currentProduct: null,
            selectedStore: null
        };
    }

    componentDidMount() {
        const extraString = 'store details';
        const pageName = [anaConsts.PAGE_TYPES.OLR, anaConsts.PAGE_NAMES.STORE_LOCATOR, 'n/a', `*${extraString}`].join(':');
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName,
                pageType: anaConsts.PAGE_TYPES.OLR,
                pageDetail: anaConsts.PAGE_NAMES.STORE_LOCATOR,
                world: 'n/a',
                additionalPageInfo: extraString
            }
        });
    }

    requestClose = () => {
        if (typeof this.props.closeModal === 'function') {
            this.props.closeModal();
        } else {
            store.dispatch(showFindInStoreMapModal({ isOpen: false }));
        }
    };

    backToStoreList = () => {
        store.dispatch(showFindInStoreMapModal({ isOpen: false }));
        store.dispatch(
            showFindInStoreModal(true, this.props.currentProduct, this.props.zipCode, this.props.searchedDistance, this.props.storesToShow)
        );
    };

    getDefaultProps = () => {
        return {
            useBackToStoreLink: false,
            showBackButton: false
        };
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/FindInStore/FindInStoreMapModal/locales', 'FindInStoreMapModal');

        const { selectedStore, useBackToStoreLink, showBackButton } = this.props;

        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.requestClose}
                showDismiss={!showBackButton}
                hasBodyScroll={true}
                width={0}
                focusDialog={true}
            >
                <Modal.Header>
                    <Modal.Title>{getText('modalTitle')}</Modal.Title>
                    {showBackButton && <Modal.Back onClick={this.requestClose} />}
                </Modal.Header>
                <Modal.Body paddingTop={0}>
                    {useBackToStoreLink && (
                        <Link
                            display='block'
                            paddingY={4}
                            arrowDirection='left'
                            arrowPosition='before'
                            onClick={this.backToStoreList}
                        >
                            {getText('backToList')}
                        </Link>
                    )}

                    <Box
                        marginX={modal.outdentX}
                        marginBottom={4}
                    >
                        <GoogleMap
                            ratio={3 / 4}
                            selectedStore={selectedStore}
                            isFindInStore={true}
                            stores={[selectedStore]}
                        />
                    </Box>
                    <FindInStoreAddress {...selectedStore} />
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(FindInStoreMapModal, 'FindInStoreMapModal');
