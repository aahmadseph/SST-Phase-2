/* eslint-disable class-methods-use-this */

import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import InfoButton from 'components/InfoButton/InfoButton';
import LocaleUtils from 'utils/LanguageLocale';
import {
    Text, Flex, Grid, Box
} from 'components/ui';
import ItemSubstitutionButton from 'components/ItemSubstitution/ItemSubstitutionButton';
import SubstituteItem from 'components/ItemSubstitution/SubstituteItem';
import { ITEM_SUBSTITUTION_INFO_SID } from 'constants/ItemSubstitution';
import ErrorMsg from 'components/ErrorMsg';
import anaConsts from 'analytics/constants';
const getText = LocaleUtils.getLocaleResourceFile('components/ItemSubstitution/locales', 'ItemSubstitution');

class ItemSubstitution extends BaseClass {
    constructor(props) {
        super(props);
    }

    doNotSubstituteHandler = () => {
        const {
            addOrRemoveSubstituteItem, item, fulfillmentType, doNotSubstitute, removeSubstituteItemAnalytics
        } = this.props;

        if (!doNotSubstitute) {
            addOrRemoveSubstituteItem(item.commerceId, null, fulfillmentType);
            removeSubstituteItemAnalytics(true);
        }
    };

    openModal = async (_, isEdit = false) => {
        const {
            storeId, fulfillmentType, item, preferredZipCode, getProductRecs
        } = this.props;

        const dataToSend = {
            productId: item?.sku?.productId,
            storeId,
            fulfillmentType,
            preferredZipCode
        };

        if (isEdit) {
            const { substituteSku = {} } = item;

            dataToSend.selectedProductId = substituteSku.productId;
            dataToSend.preferedSku = substituteSku.skuId;
        }

        getProductRecs(item, dataToSend, true);
    };

    openEditModal = event => {
        this.openModal(event, true);

        this.props.editSubstituteItemAnalytics();
    };

    handleOnClick = () => {
        const { showContentModal } = this.props;
        const { country, channel, language } = Sephora.renderQueryParams;
        const contentfulParams = {
            channel,
            country,
            language,
            sid: ITEM_SUBSTITUTION_INFO_SID,
            title: getText('substitutionInfoTitle')
        };

        const analyticsData = {
            linkData: anaConsts.LinkData.ITEM_SUBSTITUTION_MODAL_INFO
        };

        showContentModal({ isOpen: true, data: contentfulParams, analyticsData });
    };

    render() {
        const { item, doNotSubstitute, removeItemErrorMessage } = this.props;
        const labelId = `substitution-info-id-${item.sku.skuId}`;

        return (
            <div>
                <Box
                    marginTop={4}
                    borderRadius={2}
                    backgroundColor='nearWhite'
                    padding={3}
                >
                    <Grid
                        columns={['1fr', 'auto 1fr']}
                        alignItems='center'
                    >
                        <Flex
                            gap={1}
                            alignItems='center'
                        >
                            <Text
                                fontWeight='bold'
                                id={labelId}
                            >
                                {getText('outOfStock')}
                            </Text>
                            <InfoButton
                                padding={0}
                                margin={0}
                                onClick={this.handleOnClick}
                                aria-haspopup='dialog'
                                aria-labelledby={labelId}
                            />
                        </Flex>
                        <Grid columns={2}>
                            <ItemSubstitutionButton
                                onClickHandler={this.doNotSubstituteHandler}
                                isActive={doNotSubstitute}
                                text={getText('notSubstitute')}
                                isDoNotSubstitute
                                ariaLabel={`${getText('substituteOption')}: ${getText('notSubstitute')}`}
                            />
                            <ItemSubstitutionButton
                                showArrow
                                onClickHandler={!item.substituteSku ? this.openModal : null}
                                isActive={!doNotSubstitute}
                                text={getText('substituteWith')}
                                aria-haspopup='dialog'
                                ariaLabel={`${getText('substituteOption')}: ${item.substituteSku ? item.substituteSku.displayName : ''}`}
                            />
                        </Grid>
                    </Grid>
                    {item.substituteSku && (
                        <SubstituteItem
                            item={item.substituteSku}
                            isBasket={true}
                            onClickHandler={this.openEditModal}
                        />
                    )}
                </Box>
                {removeItemErrorMessage && (
                    <Text
                        textAlign='center'
                        padding={3}
                    >
                        <ErrorMsg
                            fontSize='md'
                            marginBottom={null}
                            children={removeItemErrorMessage}
                        />
                    </Text>
                )}
            </div>
        );
    }
}

export default wrapComponent(ItemSubstitution, 'ItemSubstitution', true);
