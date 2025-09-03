/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';

import store from 'Store';
import Actions from 'Actions';

import { wrapComponent } from 'utils/framework';

import { fontSizes } from 'style/config';
import skuUtils from 'utils/Sku';
import basketUtils from 'utils/Basket';
import basketConstants from 'constants/Basket';

import processEvent from 'analytics/processEvent';
import analyticsConsts from 'analytics/constants';
import profileApi from 'services/api/profile';
import anaUtils from 'analytics/utils';

import { Button } from 'components/ui';
import compConstants from 'components/constants';

const { BUTTON_TEXT } = compConstants;
const INACTIVE_EMAIL_ME_TEXT = BUTTON_TEXT.OOS_INACTIVE;
const ACTIVE_EMAIL_ME_TEXT = BUTTON_TEXT.OOS_ACTIVE;

const { ADD_TO_BASKET_TYPES } = basketUtils;
const { BasketType } = basketConstants;

const OOS_VARIANT = ADD_TO_BASKET_TYPES.PRIMARY;

class OutOfStockButton extends BaseClass {
    state = {
        emailMeText: skuUtils.getEmailMeText(this.props.sku)
    };

    emailMeButtonHandler = (e, isComingSoon) => {
        e.preventDefault();
        e.stopPropagation();
        const { sku } = this.props;
        const { user } = store.getState();
        const productId = this.props.product?.productDetails
            ? this.props.product.productDetails.productId
            : this.props.product?.productId || sku.productId;

        profileApi.getUserSpecificProductDetails(productId, sku.skuId, false, user?.profileId).then(data => {
            const currentSku = Object.assign({}, sku, data.currentSku);
            const product = Object.assign({}, this.props.product, data);
            store.dispatch(
                Actions.showEmailMeWhenInStockModal({
                    isOpen: true,
                    product,
                    currentSku,
                    isQuickLook: false,
                    updateEmailButtonCTA: this.updateEmailMeText,
                    isComingSoon,
                    analyticsContext: this.props.analyticsContext
                })
            );
        });

        //Analytics
        const containerName = sku.rootContainerName;
        const pPageOos = 'top-right-out-of-stock-button';

        processEvent.process(analyticsConsts.ASYNC_PAGE_LOAD, {
            data: {
                skuId: sku.skuId,
                pageDetail: 'email and text notifications',
                linkName: 'notify me',
                pageName: digitalData.page?.attributes?.sephoraPageInfo?.pageName || ''
            }
        });

        processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
            data: {
                eventStrings: ['event71'],
                sku,
                linkName: 'Email Me When Available',
                internalCampaign: [this.props.product && !this.props.isOrderDetail ? pPageOos : containerName, productId, 'email-me-when-available'],
                actionInfo: 'Email Me When Available',
                ...anaUtils.getLastAsyncPageLoadData()
            }
        });
    };

    updateEmailMeText = () => {
        const { emailMeText } = this.state;
        let newEmailMeText = emailMeText;

        if (emailMeText === ACTIVE_EMAIL_ME_TEXT) {
            newEmailMeText = INACTIVE_EMAIL_ME_TEXT;
        } else if (emailMeText === INACTIVE_EMAIL_ME_TEXT) {
            newEmailMeText = ACTIVE_EMAIL_ME_TEXT;
        }

        this.setState({ emailMeText: newEmailMeText });
    };

    componentDidUpdate = (prevProps, prevState) => {
        const { sku } = this.props;
        let newEmailMeText = skuUtils.getEmailMeText(sku);

        if (sku?.actionFlags?.backInStockReminderStatus === 'active' || sku?.actionFlags?.backInStockPhoneReminderStatus === 'active') {
            newEmailMeText = INACTIVE_EMAIL_ME_TEXT;
        } else {
            newEmailMeText = ACTIVE_EMAIL_ME_TEXT;
        }

        if (
            (typeof this.state.emailMeText !== 'undefined' &&
                sku.isWithBackInStockTreatment &&
                sku.actionFlags?.backInStockReminderStatus &&
                prevProps?.sku?.actionFlags?.backInStockReminderStatus &&
                sku.actionFlags.backInStockReminderStatus !== prevProps.sku.actionFlags.backInStockReminderStatus) ||
            (newEmailMeText && newEmailMeText !== prevState.emailMeText)
        ) {
            this.setState({ emailMeText: newEmailMeText });
        }
    };

    getOutOfStockText = ({ sku }) => {
        const { isComingSoonTreatment, isShowAsStoreOnlyTreatment } = sku;
        const {
            COMING_SOON, AVAILABLE_IN_STORE_ONLY, SOLD_OUT, OUT_OF_STOCK, ADD
        } = BUTTON_TEXT;

        switch (true) {
            case isShowAsStoreOnlyTreatment:
                return AVAILABLE_IN_STORE_ONLY;
            case isComingSoonTreatment:
                return COMING_SOON;
            case this.props.smallOutOfStock:
                return ADD;
            case skuUtils.isBiReward(sku):
                return SOLD_OUT;
            default:
                return OUT_OF_STOCK;
        }
    };

    render() {
        const {
            sku, isSticky, variant, basketType, customStyle, ...props
        } = this.props;

        const dataAt = `out_of_stock${isSticky ? '_sticky' : ''}_btn`;
        const showReminder = sku.actionFlags && sku.isWithBackInStockTreatment && this.state.emailMeText && basketType !== BasketType.SameDay;

        if (showReminder) {
            const isSmall = props.size === 'sm';

            return (
                <Button
                    onClick={event => this.emailMeButtonHandler(event, sku.isComingSoonTreatment)}
                    {...props}
                    variant={OOS_VARIANT}
                    data-at={Sephora.debug.dataAt(dataAt)}
                    css={{
                        ...(isSmall
                            ? { fontSize: fontSizes.xs }
                            : {
                                fontSize: fontSizes.sm,
                                flexDirection: 'column',
                                paddingLeft: '.5em',
                                paddingRight: '.5em'
                            }),
                        ...(customStyle && customStyle)
                    }}
                >
                    {isSmall || (
                        <span
                            css={{
                                marginBottom: '.125em',
                                fontWeight: 'var(--font-weight-normal)'
                            }}
                        >
                            {this.getOutOfStockText({ sku })}
                        </span>
                    )}
                    {this.state.emailMeText}
                </Button>
            );
        } else {
            return (
                <Button
                    {...props}
                    variant={OOS_VARIANT}
                    data-at={Sephora.debug.dataAt(dataAt)}
                    disabled
                    css={customStyle}
                >
                    {this.getOutOfStockText({ sku })}
                </Button>
            );
        }
    }
}

export default wrapComponent(OutOfStockButton, 'OutOfStockButton', true);
