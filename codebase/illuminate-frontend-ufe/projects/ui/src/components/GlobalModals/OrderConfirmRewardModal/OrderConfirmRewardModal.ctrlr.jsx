import React from 'react';
import { space } from 'style/config';
import { Box, Text } from 'components/ui';
import Modal from 'components/Modal/Modal';
import LegacyCarousel from 'components/LegacyCarousel/LegacyCarousel';
import RewardItem from 'components/Reward/RewardItem/RewardItem';
import BccUtils from 'utils/BCC';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import actions from 'Actions';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const { IMAGE_SIZES } = BccUtils;

class OrderConfirmRewardModal extends BaseClass {
    state = { biRewards: null };
    requestClose = () => {
        store.dispatch(actions.showOrderConfirmRewardModal(false));
    };

    // eslint-disable-next-line class-methods-use-this
    componentDidMount() {
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: 'modal:rewards bazaar:n/a:*',
                pageType: 'modal',
                pageDetail: 'rewards bazaar'
            }
        });
    }
    render() {
        const getText = getLocaleResourceFile('components/GlobalModals/locales', 'modals');
        const { rewardList } = this.props;
        const isMobile = Sephora.isMobile();
        const itemCount = rewardList ? rewardList.length : 0;
        const imageSize = IMAGE_SIZES[162];

        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.requestClose}
                width={4}
            >
                <Modal.Header>
                    <Modal.Title>{getText('fromTheRewardsBazaar')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Text
                        is='p'
                        marginBottom={isMobile ? 5 : 6}
                    >
                        {getText('droppingTimeText')}
                    </Text>
                    <Box paddingX={!isMobile ? 6 : null}>
                        {itemCount && (
                            <LegacyCarousel
                                displayCount={isMobile ? 2 : 3}
                                totalItems={itemCount}
                                fillTrailedGap={true}
                                carouselMaxItems={12}
                                isFlexItem={true}
                                gutter={space[5]}
                                controlHeight={imageSize}
                                showArrows={!isMobile}
                                showTouts={!!isMobile}
                            >
                                {this.props.rewardList.map(reward => (
                                    <RewardItem
                                        key={reward.skuId}
                                        useAddToBasket={false}
                                        showPrice={true}
                                        isAnonymous={true}
                                        showMarketingFlags={true}
                                        imageSize={imageSize}
                                        isShortButton={true}
                                        analyticsContext={anaConsts.PAGE_TYPES.REWARDS_BAZAAR_MODAL}
                                        isCarousel={true}
                                        {...reward}
                                    />
                                ))}
                            </LegacyCarousel>
                        )}
                    </Box>
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(OrderConfirmRewardModal, 'OrderConfirmRewardModal', true);
