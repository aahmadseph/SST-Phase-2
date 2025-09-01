import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import { Flex, Link } from 'components/ui';
import Modal from 'components/Modal/Modal';
import LoyaltyPromo from 'components/Reward/LoyaltyPromo';
import RewardList from 'components/CreditCard/Rewards/RewardList';
import store from 'Store';
import Actions from 'actions/Actions';
import PromosUtils from 'utils/Promos';

const { PROMO_TYPES } = PromosUtils;
const { showApplyRewardsModal } = Actions;

class ApplyRewardsModal extends BaseClass {
    static requestClose() {
        store.dispatch(showApplyRewardsModal(false));
    }

    render() {
        const { type, isOpen, isBopis, cmsInfoModals } = this.props;

        let content = null;

        switch (type) {
            case PROMO_TYPES.CBR:
                content = (
                    <LoyaltyPromo
                        isModal={true}
                        isBopis={isBopis}
                        cmsInfoModals={cmsInfoModals}
                    />
                );

                break;
            case PROMO_TYPES.CCR:
                content = (
                    <RewardList
                        isBopis={isBopis}
                        isModal={true}
                    />
                );

                break;
            default:
                // eslint-disable-next-line no-console
                console.error('ApplyRewardsModal. Unknown reward type.');
        }

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={ApplyRewardsModal.requestClose}
                showDismiss={false}
            >
                <Modal.Header>
                    <Flex
                        justifyContent='flex-end'
                        alignItems='center'
                    >
                        <Link
                            color='blue'
                            padding={3}
                            margin={-3}
                            onClick={ApplyRewardsModal.requestClose}
                        >
                            {'Done'}
                        </Link>
                    </Flex>
                </Modal.Header>
                <Modal.Body
                    paddingX={null}
                    paddingTop={null}
                    paddingBottom={null}
                    display='flex'
                    flexDirection='column'
                >
                    {content}
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(ApplyRewardsModal, 'ApplyRewardsModal', true);
