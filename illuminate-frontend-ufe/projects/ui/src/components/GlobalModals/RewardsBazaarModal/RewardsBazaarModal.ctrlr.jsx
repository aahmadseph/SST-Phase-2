import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Button, Grid, Text, Image, Divider, Box
} from 'components/ui';
import Modal from 'components/Modal/Modal';
import ProductList from 'components/Content/ProductList';
import RewardFulfillmentMethodModal from 'components/RewardFulfillmentMethodModal';
import AddToBasketButton from 'components/AddToBasketButton';
import contentConstants from 'constants/content';
import anaConsts from 'analytics/constants';
import userUtils from 'utils/User';
import stringUtils from 'utils/String';
import biProfileUtils from 'utils/BiProfile';
import auth from 'utils/Authentication';
import ADD_BUTTON_TYPE from 'utils/Basket';
import localeUtils from 'utils/LanguageLocale';
import RwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
import * as RwdBasketConstants from 'constants/RwdBasket';
import { HEADER_VALUE } from 'constants/authentication';
import rougeExclusiveUtils from 'utils/rougeExclusive';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

const BI_TYPES = userUtils.types;
const { capitalize } = stringUtils;
const { REWARD_GROUPS } = biProfileUtils;
const { openRewardsBazaarModal } = RwdBasketActions;
const { CONTEXTS, PRODUCT_LIST_GROUPING, PRODUCT_LIST_VARIANTS } = contentConstants;

const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/RewardsBazaarModal/locales', 'RewardsBazaarModal');

class RewardsBazaarModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            basketType: null
        };
    }

    componentDidMount() {
        this.props.setFromBazaar(true);
        const basketType = Storage.local.getItem(LOCAL_STORAGE.BASKET_TYPE);
        this.setState({ basketType });
    }

    componentWillUnmount() {
        this.props.setFromBazaar(false);
    }

    close = () => {
        openRewardsBazaarModal(false);
    };

    signInHandler = analyticsContext => {
        return e => {
            e.preventDefault();
            digitalData.page.attributes.previousPageData.linkData = 'rewards bazaar:sign in';
            auth.requireAuthentication(
                null,
                null,
                {
                    context: analyticsContext,
                    nextPageContext: analyticsContext
                },
                null,
                false,
                HEADER_VALUE.USER_CLICK
            ).catch(() => {});
        };
    };

    getPersonalizedInternalCampaign = rewardsGroup => {
        const { source, analyticsData } = this.props;
        let personalizedInternalCampaign;

        if (
            source === RwdBasketConstants.TOP_BANNER_PERSONALIZED_MESSAGES.BIRTHDAY_GIFT &&
            rewardsGroup === REWARD_GROUPS.BIRTHDAY &&
            analyticsData?.personalizedInternalCampaign
        ) {
            personalizedInternalCampaign = analyticsData.personalizedInternalCampaign;
        }

        return personalizedInternalCampaign;
    };

    renderBiButton = rewardsGroup => {
        return ({ analyticsContext, sku }) => {
            return (
                <>
                    <Box
                        marginTop='auto'
                        paddingTop={3}
                    >
                        {this.props.isAnonymous ? (
                            <Button
                                variant='secondary'
                                size='sm'
                                onClick={this.signInHandler(analyticsContext)}
                            >
                                {getText('signInToAccess')}
                            </Button>
                        ) : (
                            <AddToBasketButton
                                isRewardItem
                                analyticsContext={analyticsContext || anaConsts.CONTEXT.BASKET_REWARDS}
                                variant={ADD_BUTTON_TYPE.SECONDARY}
                                isAddButton={true}
                                size='sm'
                                sku={sku}
                                isBIRBReward={true}
                                containerTitle={anaConsts.CAROUSEL_NAMES.REWARD_BAZAAR}
                                personalizedInternalCampaign={this.getPersonalizedInternalCampaign(rewardsGroup)}
                                basketType={this.state.basketType}
                            />
                        )}
                    </Box>
                </>
            );
        };
    };

    renderRewards = (rewards, birthdayRewardDaysLeft) => {
        const allRewards = [];
        const birthdayRewardDaysLeftText = birthdayRewardDaysLeft
            ? getText('daysToRedeem', [birthdayRewardDaysLeft])
            : getText('lastChanceRedeemToday');
        Object.entries(rewards?.biRewardGroups || []).forEach(([key, value], index) => {
            const skusUpdated = rougeExclusiveUtils.updateRougeExclusiveSkus(value, this.props.basket);
            allRewards.push(
                <>
                    {index !== 0 && <Divider />}
                    {skusUpdated ? (
                        <ProductList
                            skuList={skusUpdated}
                            sid={'rewards_bazaar_rewards'}
                            title={key === REWARD_GROUPS.BIRTHDAY ? getText('chooseBirthdayGift') : key}
                            anchor={key.replace(/\s/g, '').toLowerCase()}
                            marginTop={index === 0 ? 0 : 4}
                            marginBottom={5}
                            page={'basket'}
                            variant={PRODUCT_LIST_VARIANTS.SMALL_CAROUSEL}
                            context={CONTEXTS.MODAL}
                            isBIRBReward={true}
                            titleMarginBottom={[3, 4]}
                            isShortButton={true}
                            renderBiButton={this.renderBiButton(key)}
                            grouping={[
                                PRODUCT_LIST_GROUPING.SHOW_ADD_BUTTON,
                                PRODUCT_LIST_GROUPING.SHOW_PRICE,
                                PRODUCT_LIST_GROUPING.SHOW_MARKETING_FLAGS
                            ]}
                            isBirthDayRewardList={key === REWARD_GROUPS.BIRTHDAY}
                            secondSubtitle={{ inner: birthdayRewardDaysLeftText }}
                            showQuickLookOnMobile={true}
                            subtitle={
                                key === REWARD_GROUPS.BIRTHDAY ? getText('birthdayMessage', [capitalize(userUtils.getProfileFirstName())]) : null
                            }
                            rougeBadgeText={getText('rougeBadge')}
                            {...skusUpdated}
                        />
                    ) : null}
                </>
            );
        });

        return <Box>{allRewards}</Box>;
    };

    render() {
        const { biAccount, availableRewards, showRewardFulfillmentMethodModal } = this.props;
        const { biPoints, biStatus, birthdayRewardDaysLeft } = biAccount;
        const biStatusIcon = userUtils.displayBiStatus(biStatus.toUpperCase());
        const statusText = biStatus === BI_TYPES.BI.toLowerCase() ? 'biPointsInsiderText' : 'biPointsText';

        return (
            <>
                <Modal
                    showDismiss={true}
                    width={866}
                    hasBodyScroll={true}
                    isOpen={this.props.isOpen}
                    isHidden={showRewardFulfillmentMethodModal}
                    onDismiss={this.close}
                >
                    <Modal.Header>
                        <Modal.Title children={getText('title')} />
                        <Divider
                            marginY={4}
                            marginX={'-44px'}
                        />
                        <Text
                            display='block'
                            is='p'
                            textAlign='left'
                            marginLeft={['-21px', '-29px']}
                        >
                            {`${getText(statusText)} `}
                            <Image
                                src={`/img/ufe/bi/logo-${biStatusIcon.toLowerCase()}.svg`}
                                alt={biStatusIcon}
                                height='.725em'
                            />
                            {` ${getText('with')} `}
                            <strong>{biPoints.toLocaleString()}</strong> {getText('points')}
                        </Text>
                    </Modal.Header>
                    <Modal.Body>{availableRewards?.rewards && this.renderRewards(availableRewards.rewards, birthdayRewardDaysLeft)}</Modal.Body>
                    <Modal.Footer css={{ paddingBottom: '8px' }}>
                        <Grid justifyContent={['center', 'end']}>
                            <Button
                                variant='primary'
                                width={['97vw', 235]}
                                block={true}
                                onClick={this.close}
                                children={getText('done')}
                            />
                        </Grid>
                    </Modal.Footer>
                </Modal>
                {showRewardFulfillmentMethodModal && <RewardFulfillmentMethodModal />}
            </>
        );
    }
}

export default wrapComponent(RewardsBazaarModal, 'RewardsBazaarModal', true);
