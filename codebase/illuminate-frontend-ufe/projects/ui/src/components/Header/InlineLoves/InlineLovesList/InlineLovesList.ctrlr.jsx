/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Box, Grid, Link, Text, Divider, Button
} from 'components/ui';
import auth from 'utils/Authentication';
import actions from 'Actions';
import store from 'store/Store';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import ProductVariation from 'components/Product/ProductVariation/ProductVariation';
import Price from 'components/Product/Price/Price';
import AddToBasketButton from 'components/AddToBasketButton';
import basketUtils from 'utils/Basket';
import OnlyFewLeftFlag from 'components/OnlyFewLeftFlag/OnlyFewLeftFlag';
import SaleFlag from 'components/SaleFlag/SaleFlag';
import { URL } from 'constants/Shared';
import { colors } from 'style/config';
import localeUtils from 'utils/LanguageLocale';
const { ADD_TO_BASKET_TYPES: ADD_BUTTON_TYPE } = basketUtils;
import SavedInLists from 'components/RichProfile/MyLists/SavedInLists';
import { HEADER_VALUE } from 'constants/authentication';
import anaConsts from 'analytics/constants';
const {
    PAGE_TYPES: { USER_PROFILE, MY_LISTS_FLYOUT },
    PAGE_NAMES: { MY_LISTS }
} = anaConsts;

const signIn = () => {
    auth.requireAuthentication(null, null, null, null, false, HEADER_VALUE.USER_CLICK).catch(() => {});
};

class InlineLovesList extends BaseClass {
    getText = text => localeUtils.getLocaleResourceFile('components/Header/InlineLoves/locales', 'InlineLoves')(text);

    renderLoves = () => {
        const { toggleModal, showLovesListSaleNotification, handleLinkClick, skus } = this.props;

        return skus.map((item, index) => (
            <React.Fragment key={`inlineLovesItem_${item.skuId}`}>
                {index > 0 && <Divider marginY={3} />}
                <Link
                    href={item.targetUrl}
                    display='block'
                    hoverSelector='.Link-target'
                    onClick={e => handleLinkClick(e, item.targetUrl, toggleModal)}
                    data-at={Sephora.debug.dataAt('loves_item')}
                >
                    <Grid
                        columns='auto 1fr 111px'
                        alignItems='flex-start'
                        gap={2}
                    >
                        <ProductImage
                            id={item.skuId}
                            skuImages={item.skuImages}
                            size={48}
                            disableLazyLoad={true}
                        />
                        <Box fontSize='sm'>
                            <Text
                                display='block'
                                fontWeight='bold'
                                numberOfLines={1}
                                children={item.brandName}
                            />
                            <Text
                                display='block'
                                children={item.productName}
                            />
                            <ProductVariation
                                sku={item}
                                color={colors.gray}
                                fontSize='sm'
                                marginTop='.25em'
                                css={this.styles.skuDescription}
                            />
                            {showLovesListSaleNotification && item?.salePrice && <SaleFlag marginRight='4px' />}
                            {item?.isOnlyFewLeft && <OnlyFewLeftFlag />}
                            <SavedInLists listNames={item.listNames} />
                            <Price
                                includeValue={false}
                                sku={item}
                                marginTop='.25em'
                            />
                        </Box>
                        <AddToBasketButton
                            sku={item}
                            variant={ADD_BUTTON_TYPE.SECONDARY}
                            callback={toggleModal ? () => toggleModal() : null}
                            size='sm'
                            isInlineLoves={true}
                            minWidth='100px'
                            customStyle={this.styles.customStyle}
                            isSharableList
                            analyticsContext={anaConsts.PAGE_NAMES.MY_LISTS}
                            pageName={`${USER_PROFILE}:${MY_LISTS}:${MY_LISTS_FLYOUT}:*`}
                        />
                    </Grid>
                </Link>
            </React.Fragment>
        ));
    };

    renderNoLoves = () => {
        const { localization, isAnonymousSharable } = this.props;

        return (
            <>
                <Text
                    is='p'
                    paddingBottom={4}
                >
                    {isAnonymousSharable ? localization.noLovesMyListDesc : localization.noLovesAdded}
                </Text>

                {isAnonymousSharable ? (
                    <Grid
                        gap={3}
                        columns={2}
                    >
                        <Button
                            onClick={signIn}
                            block={true}
                            variant='primary'
                            size='sm'
                            children={localization.signInButton}
                            data-at={Sephora.debug.dataAt('sign_in_loves')}
                        />
                        <Button
                            onClick={() => store.dispatch(actions.showRegisterModal({ isOpen: true, openPostBiSignUpModal: true }))}
                            block={true}
                            variant='secondary'
                            size='sm'
                            children={localization.createAccountButton}
                            data-at={Sephora.debug.dataAt('create_account_loves')}
                        />
                    </Grid>
                ) : (
                    <Button
                        width={['100%', '50%']}
                        variant='primary'
                        size='sm'
                        href={URL.NEW_BEAUTY_PRODUCTS}
                    >
                        {localization.browse}
                    </Button>
                )}
            </>
        );
    };

    render() {
        const loves = this.renderLoves();
        const noLoves = this.renderNoLoves();

        return (
            <Box
                lineHeight='tight'
                paddingX={4}
                paddingTop={4}
                paddingBottom={5}
            >
                {loves.length ? loves : noLoves}
            </Box>
        );
    }

    styles = {
        skuDescription: {
            display: '-webkit-box',
            '-webkit-box-orient': 'vertical',
            '-webkit-line-clamp': '2',
            overflow: 'hidden'
        },
        customStyle: {
            maxHeight: '36px'
        }
    };
}

export default wrapComponent(InlineLovesList, 'InlineLovesList', true);
