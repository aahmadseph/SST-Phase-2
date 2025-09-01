/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Text, Box, Divider, Flex, Link, Button
} from 'components/ui';
import LayoutCard from 'components/FrictionlessCheckout/LayoutCard/LayoutCard';
import PromiseDateAndItems from 'components/FrictionlessCheckout/ShippingMethods/PromiseDateAndItems/PromiseDateAndItems';
import checkoutUtils from 'utils/Checkout';
import localeUtils from 'utils/LanguageLocale';
import InfoButton from 'components/InfoButton/InfoButton';
import FrictionlessUtils from 'utils/FrictionlessCheckout';
import { colors } from 'style/config';
import CanadaPostStrikeCheckoutMessage from 'components/SharedComponents/CanadaPostStrike/CanadaPostStrikeCheckoutMessage';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import FrictionlessCheckoutBindings from 'analytics/bindingMethods/pages/FrictionlessCheckout/FrictionlessCheckoutBindings';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import store from 'store/Store';
import { SECTION_NAMES } from 'constants/frictionlessCheckout';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

const { checkPromoEligibility, setShippingMethod } = FrictionlessUtils;
const { FULLFILLMENT_TYPE } = checkoutUtils;
const STANDARD = !localeUtils.isCanada() ? 'Standard' : localeUtils.isFrench() ? 'gratuite' : 'Free';

class ShippingMethods extends BaseClass {
    state = {
        isEditView: false,
        shippingMethodSelected: this.props.shippingMethodSelected,
        message: false
    };

    componentDidMount() {
        const { isSplitEDDEnabled, shippingGroup, isElectronicShippingGroup } = this.props;
        const showSplitEDD = isSplitEDDEnabled && !isElectronicShippingGroup && checkoutUtils.hasDeliveryGroups([shippingGroup?.shippingMethod]);
        Storage.local.setItem(LOCAL_STORAGE.SPLIT_EDD_EXPERIENCE, showSplitEDD);
    }

    componentDidUpdate(prevProps) {
        const prevShippingMethodId = prevProps.shippingMethodSelected?.shippingMethodId;
        const currentShippingMethodId = this.props.shippingMethodSelected?.shippingMethodId;

        if (prevShippingMethodId !== currentShippingMethodId) {
            this.setState({
                shippingMethodSelected: this.props.shippingMethodSelected
            });
        }
    }

    calculateCartQuantity(items) {
        return items.reduce((acc, item) => acc + item.qty, 0);
    }
    getShippingFee = shippingFee => {
        return checkoutUtils.isZeroFee(shippingFee) ? this.props.locales.free : shippingFee;
    };

    showAutoReplenishModal = () => {
        const {
            infoModalData: { sid, title, width },
            showContentModal
        } = this.props;

        const pageType = anaConsts.PAGE_TYPES.AUTO_REPLENISH;
        const pageDetail = anaConsts.PAGE_DETAIL.SUBSCRIPTION_INFO;
        const prop55 = anaConsts.LinkData.AUTO_REPLENISH;

        showContentModal({
            isOpen: true,
            data: {
                sid,
                title,
                width,
                isPrescreenModal: false
            },
            analyticsData: {
                pageName: `${pageType}:${pageDetail}:n/a:*`,
                linkData: prop55
            }
        });
    };

    openAutoReplenishProductsModal = () => {
        this.props.showAutoReplenishProductsModal({
            isOpen: true
        });
    };

    renderGetItShippedSection = (shippingMethod, deliveryGroups) => {
        const {
            locales: { getItShipped, items },
            standardItemsQuantity,
            isPhysicalGiftCard
        } = this.props;

        const showSplitEDD = deliveryGroups?.length > 0;
        const cutOffDescriptionForSplitEdd = deliveryGroups?.length && !isPhysicalGiftCard && shippingMethod?.promiseDateSplitCutOffDescription;
        const GISDeliveryGroups =
            deliveryGroups?.length && checkoutUtils.seperateItemsinDeliveryGroupByFullfullment(deliveryGroups, FULLFILLMENT_TYPE.GIS);
        const deliveryMethods = showSplitEDD ? GISDeliveryGroups : [shippingMethod];

        return (
            <>
                <Text
                    is='h4'
                    fontWeight='bold'
                    children={`${getItShipped} • ${items} (${standardItemsQuantity})`}
                />
                {deliveryMethods.map((deliveryMethod, index) => (
                    <Box {...(showSplitEDD && { marginBottom: index !== deliveryGroups.length - 1 && 4 })}>
                        <PromiseDateAndItems
                            shippingMethod={deliveryMethod}
                            isEditView={this.state.isEditView}
                            standardOnly={true}
                            {...(showSplitEDD && {
                                showSplitEDD,
                                cutOffDescriptionForSplitEdd
                            })}
                        />
                    </Box>
                ))}
            </>
        );
    };

    renderAutoReplenishSection = (shippingMethod, deliveryGroups) => {
        const {
            locales: { items, autoReplenish, deliveryFrequency },
            replenishItemsQuantity,
            isReplenOnly,
            isPhysicalGiftCard
        } = this.props;

        const showSplitEDD = deliveryGroups?.length > 0;
        const shouldRenderTitle = !isReplenOnly || (isReplenOnly && !this.state.isEditView);
        const cutOffDescriptionForSplitEdd = deliveryGroups.length && !isPhysicalGiftCard && shippingMethod?.promiseDateSplitCutOffDescription;
        const ARDeliveryGroups =
            deliveryGroups?.length && checkoutUtils.seperateItemsinDeliveryGroupByFullfullment(deliveryGroups, FULLFILLMENT_TYPE.AR);
        const deliveryMethods = showSplitEDD ? ARDeliveryGroups : [shippingMethod];

        return (
            <>
                <Flex alignItems='center'>
                    {shouldRenderTitle && (
                        <Text
                            is='h4'
                            fontWeight='bold'
                            marginTop={this.state.isEditView ? 3 : 0}
                            children={`${autoReplenish} • ${items} (${replenishItemsQuantity})`}
                        />
                    )}

                    {!this.state.isEditView && (
                        <InfoButton
                            size={16}
                            pt={1}
                            pb={0}
                            margin={0}
                            onClick={this.showAutoReplenishModal}
                        />
                    )}
                </Flex>
                {deliveryMethods?.map((deliveryMethod, index) => (
                    <Box {...(showSplitEDD && { marginBottom: index !== deliveryGroups.length - 1 && 4 })}>
                        <PromiseDateAndItems
                            shippingMethod={deliveryMethod}
                            isEditView={this.state.isEditView}
                            showAutoReplenishItems={true}
                            {...(showSplitEDD && {
                                showSplitEDD,
                                cutOffDescriptionForSplitEdd
                            })}
                        />
                    </Box>
                ))}
                {!this.state.isEditView && (
                    <Link
                        children={deliveryFrequency}
                        color={'blue'}
                        onClick={this.openAutoReplenishProductsModal}
                        marginTop={4}
                    />
                )}
            </>
        );
    };

    renderShippingMethods = shippingGroup => {
        const {
            isReplenOnly, shippingGroupType, isElectronicShippingGroup, isPhysicalGiftCard, isSdd, isSDDAndGiftCardOnly
        } = this.props;
        const isSddAndGiftCardInOrder = isSdd && !!isPhysicalGiftCard && !isSDDAndGiftCardOnly;
        const deliveryGroups = !isSddAndGiftCardInOrder
            ? checkoutUtils.computeDeliveryGroups(shippingGroup, shippingGroupType, shippingGroup?.shippingMethod, isElectronicShippingGroup)
            : checkoutUtils.computeDeliveryGroups(
                { ...shippingGroup, items: [...shippingGroup.items, ...isPhysicalGiftCard.items] },
                shippingGroupType,
                shippingGroup?.shippingMethod,
                true
            );

        return (
            <>
                {!isReplenOnly && (
                    <Box
                        marginTop={[3, 3, 4]}
                        paddingX={[4, 4, 5]}
                    >
                        {this.renderGetItShippedSection(shippingGroup.shippingMethod, deliveryGroups)}
                    </Box>
                )}
                {this.props.orderHasReplen && (
                    <>
                        {!isReplenOnly && (
                            <Divider
                                thick={true}
                                marginY={4}
                            />
                        )}

                        <Box
                            marginTop={[3, 3, isReplenOnly ? 3 : 4]}
                            paddingX={[4, 4, 5]}
                        >
                            {this.renderAutoReplenishSection(shippingGroup.shippingMethod, deliveryGroups)}
                        </Box>
                    </>
                )}
            </>
        );
    };

    onEditClick = () => {
        this.setState({
            isEditView: true
        });

        FrictionlessCheckoutBindings.setChangeLinkAnalytics(anaConsts.PAGE_TYPES.DELIVERY);
        this.props.setActiveSection(this.props.sectionName);
    };

    fireShippingMethodChangeAnalytics = () => {
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                sTagInfo: {
                    ...this.state?.shippingMethodSelected,
                    actionInfo: anaConsts.LinkData.CHECKOUT_SHIPPING_METHOD_UPDATE,
                    linkName: anaConsts.LinkData.CHECKOUT_SHIPPING_METHOD_UPDATE
                }
            }
        });
    };

    setShippingMethod = () => {
        if (checkPromoEligibility(this.state.shippingMethodSelected, this.props.orderDetails)) {
            setShippingMethod({
                orderId: this.props.orderId,
                newShippingMethodId: this.state.shippingMethodSelected.shippingMethodId,
                shippingGroupId: this.props.shippingGroup?.shippingGroupId,
                successCallback: this.onSaveSuccessCallback,
                failureCallback: () => {},
                message: this.state.message,
                updateWaiveShipping: this.props.updateWaiveShipping
            });
            this.fireShippingMethodChangeAnalytics();
        }
    };

    onSaveSuccessCallback = () => {
        this.setState(
            {
                isEditView: false
            },
            () => {
                this.props.refreshCheckout();
            }
        );
    };

    handleCheckboxChange = e => this.setState({ message: e.target.checked });

    renderShippingMethodItems = (shippingMethod, deliveryGroups) => {
        const { isReplenOnly, locales, orderHasReplen } = this.props;

        const shouldShowExpeditedText = !shippingMethod?.shippingMethodType.includes(STANDARD) && orderHasReplen;

        return (
            <Box
                backgroundColor={colors.nearWhite}
                paddingTop={2}
                paddingX={4}
            >
                {Sephora.isAgent && !orderHasReplen && (
                    <Checkbox
                        marginBottom={3}
                        marginTop={5}
                        fontWeight='bold'
                        checked={this.state.message}
                        data-at={Sephora.debug.dataAt('work_at_seph_checkbox')}
                        onClick={this.handleCheckboxChange}
                    >
                        {locales.waiveShippingHandling}
                    </Checkbox>
                )}
                {!isReplenOnly && this.props.standardBasket?.items?.length > 0 && this.renderGetItShippedSection(shippingMethod, deliveryGroups)}
                {this.props.orderHasReplen && (
                    <Box marginTop={isReplenOnly ? 0 : 2}>{this.renderAutoReplenishSection(shippingMethod, deliveryGroups)}</Box>
                )}
                <Button
                    variant='primary'
                    onClick={this.setShippingMethod}
                    children={this.props.locales.chooseThisShippingSpeed}
                    marginTop={[4, 4, 5]}
                    marginBottom={[shouldShowExpeditedText ? 2 : 3, shouldShowExpeditedText ? 2 : 3, 4]}
                />
                {shouldShowExpeditedText && (
                    <Text
                        fontSize='sm'
                        lineHeight='14px'
                        pb={3}
                        is='p'
                        children={locales.expeditedText}
                    />
                )}
            </Box>
        );
    };

    handleOnClickShippingMethodSelected = shippingMethod => {
        this.setState({
            shippingMethodSelected: shippingMethod
        });
    };

    renderShippingMethod = (shippingMethod, isLastItem, shippingGroup, shippingGroupType) => {
        const shipFee = this.getShippingFee(shippingMethod?.shippingFee);
        const isSelected = this.state.shippingMethodSelected.shippingMethodId === shippingMethod.shippingMethodId;
        const { isReplenOnly, locales } = this.props;
        const showSplitEDD = this.props.isSplitEDDEnabled && checkoutUtils.hasDeliveryGroups([shippingMethod]);
        const deliveryGroups = showSplitEDD && checkoutUtils.computeDeliveryGroups(shippingGroup, shippingGroupType, shippingMethod);

        const title =
            isReplenOnly && shippingMethod?.shippingMethodType === STANDARD ? locales.shippingMethodType : shippingMethod?.shippingMethodType;

        return (
            <Box
                marginX={[4, 5]}
                marginBottom={isLastItem ? 0 : 2}
                border={isSelected ? 2 : `1px solid ${colors.midGray}`}
                borderRadius={2}
                is='div'
                onClick={() => this.handleOnClickShippingMethodSelected(shippingMethod)}
            >
                <Flex
                    paddingY={3}
                    paddingX={4}
                    justifyContent='space-between'
                >
                    <Text
                        is='h3'
                        fontWeight='bold'
                        fontSize={['base', 'base', 'md']}
                        children={`${title} ${!localeUtils.isCanada() ? locales.shipping : ''}`}
                    />
                    <Text
                        is='h3'
                        fontWeight='bold'
                        fontSize={['base', 'base', 'md']}
                        children={shipFee}
                    />
                </Flex>
                {isSelected && this.renderShippingMethodItems(shippingMethod, deliveryGroups)}
            </Box>
        );
    };

    shippingMethodsSelection = (shippingMethods, shippingGroup, shippingGroupType) => {
        return shippingMethods?.map((shippingMethod, index) =>
            this.renderShippingMethod(shippingMethod, index === shippingMethods.length - 1, shippingGroup, shippingGroupType)
        );
    };

    render() {
        const {
            sectionNumber,
            shippingGroup,
            standardBasket,
            locales,
            isChangePermitted,
            shippingMethods,
            isNewUserFlow,
            isReplenOnly,
            shippingGroupType,
            middleZone,
            sectionLevelError,
            isElectronicShippingGroup
        } = this.props;
        let shipFee = this.getShippingFee(shippingGroup?.shippingMethod?.shippingFee);

        if (Sephora.isAgent) {
            const orderInfo = store.getState().order;

            if (orderInfo.waiveShippingFee) {
                shipFee = locales.waived;
            }
        }

        let changeLabel = null;

        if (Sephora.isAgent) {
            changeLabel = locales.changeShippingMethod;
        }

        return (
            <LayoutCard
                sectionInfo={{
                    sectionNumber: !sectionLevelError && sectionNumber,
                    title: locales.title,
                    hasDivider: true,
                    isChangePermitted: this.state.isEditView ? false : isChangePermitted,
                    onChangeClick: this.onEditClick,
                    coustomChangeLabel: changeLabel,
                    sectionLevelError,
                    sectionName: SECTION_NAMES.SHIPPING_METHOD
                }}
                isEditMode={this.state.isEditView}
                marginTop={[4, 4, 5]}
                hasPaddingForChildren={false}
                isCollapsed={isNewUserFlow}
                ariaLabel={locales.title}
                role='region'
            >
                <CanadaPostStrikeCheckoutMessage
                    isFrictionlessCheckout={true}
                    shippingGroup={shippingGroup}
                    middleZone={middleZone}
                />
                {this.state.isEditView ? (
                    this.shippingMethodsSelection(shippingMethods, shippingGroup, shippingGroupType)
                ) : (
                    <>
                        {!isElectronicShippingGroup && (
                            <Text
                                is='h2'
                                fontSize='md'
                                fontWeight='bold'
                                paddingX={[4, 4, 5]}
                                children={`${
                                    isReplenOnly && shippingGroup?.shippingMethod?.shippingMethodType === STANDARD
                                        ? locales.shippingMethodType
                                        : shippingGroup?.shippingMethod?.shippingMethodType
                                } ${!localeUtils.isCanada() ? locales.shipping : ''} • ${shipFee}`}
                            />
                        )}
                        {standardBasket?.items?.length > 0 && this.renderShippingMethods(shippingGroup)}
                    </>
                )}
            </LayoutCard>
        );
    }
}

export default wrapComponent(ShippingMethods, 'ShippingMethods', true);
