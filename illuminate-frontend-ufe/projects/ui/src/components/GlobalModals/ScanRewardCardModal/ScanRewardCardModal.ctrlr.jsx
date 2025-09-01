import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'Store';
import actions from 'Actions';
import BCC from 'utils/BCC';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

import Modal from 'components/Modal/Modal';
import { Text, Link } from 'components/ui';
import BiCardRewards from 'components/CreditCard/Rewards/ScanRewards/BiCardRewards';
import CreditCardRewards from 'components/CreditCard/Rewards/ScanRewards/CreditCardRewards';
import localeUtils from 'utils/LanguageLocale';
import { globalModals, renderModal } from 'utils/globalModals';

const { TERMS_OF_SERVICE } = globalModals;

class ScanRewardCardModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            bankRewards: { rewardCertificates: [] },
            beautyInsiderAccount: null,
            profileId: null,
            activeId: null
        };
    }

    componentDidMount() {
        store.setAndWatch('user', this, value => {
            if (typeof value.user.bankRewards !== 'undefined') {
                const { bankRewards, beautyInsiderAccount, profileId } = value.user;

                this.setState({
                    bankRewards,
                    beautyInsiderAccount,
                    profileId,
                    activeId: bankRewards.rewardCertificates.length > 0 && bankRewards.rewardCertificates[0].certificateNumber
                });
            }
        });

        // ILLUPH-117700 - AC#3
        this.fireAsyncPageLoadTracking();
    }

    fireAsyncPageLoadTracking = () => {
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: 'user profile:show card-scan card:n/a:*',
                pageDetail: 'user profile:show card-scan card:n/a:*',
                pageType: 'user profile'
            }
        });
    };

    requestClose = () => {
        store.dispatch(actions.showScanRewardCardModal({ isOpen: false }));
    };

    isActiveId = id => {
        return this.state.activeId === id;
    };

    showBarCode = (e, activeId) => {
        e.preventDefault();
        this.setState({ activeId });
    };

    openMediaModal = e => {
        e.preventDefault();
        renderModal(this.props.globalModals[TERMS_OF_SERVICE], () => {
            const mediaId = BCC.MEDIA_IDS.REWARDS_TERMS_AND_CONDITIONS;

            store.dispatch(
                actions.showMediaModal({
                    isOpen: true,
                    mediaId
                })
            );
        });
    };

    onBackButtonClick = () => {
        store.dispatch(actions.showBiCardModal({ isOpen: false }));
        store.dispatch(actions.showScanRewardCardModal({ isOpen: true }));
    };

    showBiCardModal = () => {
        this.requestClose();
        store.dispatch(actions.showBiCardModal({ isOpen: true, profileId: this.state.profileId, onBackButtonClick: this.onBackButtonClick }));
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/ScanRewardCardModal/locales', 'ScanRewardCardModal');
        const { bankRewards, profileId, beautyInsiderAccount } = this.state;

        return (
            <Modal
                hasBodyScroll={true}
                isOpen={this.props.isOpen}
                onDismiss={this.requestClose}
                isDrawer={true}
            >
                <Modal.Header>
                    <Modal.Title>{getText('scanCards')}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Text
                        is='p'
                        fontSize='lg'
                        fontWeight='bold'
                        lineHeight='tight'
                        marginBottom={1}
                    >
                        {getText('scanAtCheckout')}
                    </Text>
                    <Text
                        is='p'
                        lineHeight='tight'
                        marginBottom={5}
                    >
                        {getText('showBarcode')}
                    </Text>

                    {profileId && (
                        <BiCardRewards
                            isActiveId={this.isActiveId}
                            showBarCode={this.showBiCardModal}
                            profileId={profileId}
                            {...beautyInsiderAccount}
                        />
                    )}

                    {bankRewards.rewardCertificates?.length > 0 && (
                        <CreditCardRewards
                            activeId={this.state.activeId}
                            showBarCode={this.showBarCode}
                            {...bankRewards}
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Text
                        is='p'
                        textAlign='center'
                        lineHeight='tight'
                        fontSize='sm'
                        color='gray'
                    >
                        {getText('rewardsText')}
                        <br />
                        <Link
                            color='blue'
                            onClick={this.openMediaModal}
                            children={getText('termsAndConditions')}
                        />
                    </Text>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(ScanRewardCardModal, 'ScanRewardCardModal');
