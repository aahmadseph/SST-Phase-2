import React from 'react';
import store from 'store/Store';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import LanguageLocaleUtils from 'utils/LanguageLocale';
import {
    Image, Text, Box, Button
} from 'components/ui';
import {
    measure, space, fontSizes, lineHeights
} from 'style/config';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import BccCarousel from 'components/Bcc/BccCarousel/BccCarousel';
import Barcode from 'components/Barcode/Barcode';

import userUtils from 'utils/User';
import urlUtils from 'utils/Url';
import dateUtils from 'utils/Date';
import bccUtils from 'utils/BCC';

import Actions from 'Actions';
import promotionsApi from 'services/api/promotions';
import analyticsUtils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import { UserInfoReady } from 'constants/events';
import { HEADER_VALUE } from 'constants/authentication';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const { COMPONENT_NAMES, IMAGE_SIZES } = bccUtils;

const IMAGE_SIZE = IMAGE_SIZES[135];
const PROMO_URL_PARAM = 'promocode';

class BeautyWinPromoBody extends BaseClass {
    state = {
        showMobileDropdown: false,
        firstName: null,
        isAnonymous: false,
        isDataReady: false
    };

    componentDidMount() {
        const promoCode = urlUtils.getParamsByName(PROMO_URL_PARAM);
        Sephora.Util.onLastLoadEvent(window, [UserInfoReady], () => {
            store.setAndWatch('user', this, userData => {
                const isAnonymous = userUtils.isAnonymous();

                if (!isAnonymous && promoCode) {
                    if (promoCode[0] !== '') {
                        promotionsApi
                            .getPromoByCoupon(promoCode)
                            .then(data => {
                                this.setState({
                                    ...data,
                                    isDataReady: true
                                });
                            })
                            .catch(() => {
                                this.setState({
                                    requestFailed: true
                                });
                            });
                    } else {
                        this.setState({
                            isAvailable: false,
                            isExpired: false,
                            isDataReady: true
                        });
                    }
                }

                this.setState({
                    firstName: userData.user.firstName,
                    isAnonymous: isAnonymous,
                    promoCode: promoCode
                });
            });
            this.setAnalytics();
        });
    }

    setAnalytics = () => {
        digitalData.page.category.pageType = anaConsts.PAGE_TYPES.CONTENT_STORE;
        digitalData.page.pageInfo.pageName = 'beauty offers-your promo';
    };

    getText = (text, vars) => getLocaleResourceFile('components/BeautyWinPromo/locales', 'BeautyWinPromoBody')(text, vars);

    handleButtonClick = () => {
        store.dispatch(Actions.showSignInModal({ isOpen: true, extraParams: { headerValue: HEADER_VALUE.USER_CLICK } }));
    };

    handleShopNowClick = () => {
        const { promoCtaLink } = this.state;

        const prop55 = anaConsts.LinkData.TLP_SHOP_NOW;
        analyticsUtils.setNextPageData({
            pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
            pageType: digitalData.page.category.pageType,
            linkData: prop55
        });
        urlUtils.redirectTo(promoCtaLink);
    };

    /* eslint-disable-next-line complexity */
    render() {
        const { ancestorHierarchy } = this.props;

        const {
            firstName,
            isAnonymous,
            isDataReady,
            isExpired,
            requestFailed,
            promoCode,
            topBanner,
            bottomBanner,
            isAvailable,
            isOnlineOnly,
            promoEndDate,
            promoDescription,
            promoOfferText,
            promoOfferCriteria,
            promoLegalText,
            promoReason
        } = this.state;

        const isDesktop = Sephora.isDesktop();
        let mobileDropdown = null;

        let parsedDate;

        if (promoEndDate) {
            parsedDate = dateUtils.getDateObjectFromString(promoEndDate.substr(0, 10));
        }

        if (!isDesktop && ancestorHierarchy && this.state.showMobileDropdown) {
            mobileDropdown = (
                <DropdownMW
                    navItems={ancestorHierarchy}
                    title={ancestorHierarchy[0].displayName}
                />
            );
        }

        return (
            <React.Fragment>
                {mobileDropdown}
                {isAnonymous && this.renderSignIn()}
                {!isAnonymous && firstName && isAvailable && (
                    <React.Fragment>
                        <BccComponentList
                            isContained={!isDesktop}
                            analyticsContext={anaConsts.CONTEXT.CONTENT_STORE}
                            items={topBanner}
                        />
                        <Box
                            textAlign='center'
                            lineHeight='tight'
                            marginY={5}
                        >
                            <Text
                                is='h2'
                                fontSize='md'
                                fontWeight='bold'
                                marginBottom={4}
                                children={`${firstName},`}
                                data-at={Sephora.debug.dataAt('tlp_username')}
                            />
                            <Text
                                is='p'
                                fontSize='md'
                                maxWidth='22em'
                                marginX='auto'
                                marginBottom={5}
                                children={promoDescription}
                                data-at={Sephora.debug.dataAt('tlp_promo_description')}
                            />
                            <Text
                                is='p'
                                fontSize='3xl'
                                fontWeight='bold'
                                children={promoOfferCriteria}
                                data-at={Sephora.debug.dataAt('tlp_offer_variation')}
                            />
                            <Text
                                is='p'
                                marginTop={1}
                                marginBottom={4}
                                children={promoOfferText}
                            />
                            <Text
                                is='p'
                                fontSize='lg'
                                marginBottom={2}
                                children={this.getText('useCode', [promoCode])}
                                data-at={Sephora.debug.dataAt('tlp_code')}
                            />
                            {promoEndDate && (
                                <Text
                                    is='p'
                                    marginBottom={5}
                                    children={this.getText('validUntil', [
                                        dateUtils.getDayOfWeek(parsedDate, false, true),
                                        dateUtils.getDateInMMDDYYFormat(parsedDate)
                                    ])}
                                    data-at={Sephora.debug.dataAt('tlp_exp_date')}
                                />
                            )}
                            {!isOnlineOnly && (
                                <Barcode
                                    id={promoCode}
                                    code={'CODE128'}
                                    hasBorder={true}
                                    barcodeDataAt='tlp_barcode'
                                    labelDataAt='tlp_coupon'
                                    showLabel={false}
                                />
                            )}
                            <Button
                                variant='primary'
                                marginX='auto'
                                marginTop={isOnlineOnly ? 0 : 5}
                                onClick={this.handleShopNowClick}
                                hasMinWidth={true}
                                children={this.getText('shopNow')}
                                data-at={Sephora.debug.dataAt('tlp_shop_now_btn')}
                            />
                            {promoReason && (
                                <React.Fragment>
                                    <Text
                                        is='h2'
                                        fontSize={['md', 'lg']}
                                        marginTop={6}
                                        marginBottom={4}
                                        fontWeight='bold'
                                        children={this.getText('wonderWhy')}
                                        data-at={Sephora.debug.dataAt('why_you_got_this_title')}
                                    />
                                    <Text
                                        is='p'
                                        fontSize={[null, 'md']}
                                        maxWidth='36em'
                                        marginX='auto'
                                        children={promoReason}
                                        data-at={Sephora.debug.dataAt('why_you_got_this_text')}
                                    />
                                </React.Fragment>
                            )}
                        </Box>
                        <BccComponentList
                            isContained={!isDesktop}
                            analyticsContext={anaConsts.CONTEXT.CONTENT_STORE}
                            items={bottomBanner}
                        />

                        <BccCarousel
                            showPrice
                            showReviews={true}
                            showLoves
                            skuImageSize={IMAGE_SIZE}
                            showTouts={!isDesktop}
                            showArrows={isDesktop}
                            displayCount={isDesktop ? 5 : 2}
                            componentType={COMPONENT_NAMES.CAROUSEL}
                            data-at={''}
                            contextStyle={{
                                marginTop: space[isDesktop ? 7 : 3],
                                marginBottom: space[isDesktop ? 6 : 3]
                            }}
                            titleStyle={{
                                textAlign: 'center',
                                fontSize: fontSizes[isDesktop ? '2xl' : 'xl'],
                                lineHeight: lineHeights.none,
                                fontFamily: 'serif'
                            }}
                        />
                        <Text
                            is='p'
                            fontSize='xs'
                            marginTop={6}
                            textAlign='center'
                            lineHeight='tight'
                            children={promoLegalText}
                        />
                    </React.Fragment>
                )}
                {!isAnonymous && firstName && isExpired && this.renderIsExpired()}
                {!isAnonymous && firstName && isDataReady && !isAvailable && !isExpired && this.renderNotAvailable()}
                {requestFailed && this.renderFailure()}
            </React.Fragment>
        );
    }

    renderSignIn = () => {
        return (
            <Box
                textAlign='center'
                lineHeight='tight'
            >
                {this.renderImage()}
                <Text
                    is='h2'
                    fontSize='md'
                    fontWeight='bold'
                    children={this.getText('signInMessage')}
                    data-at={Sephora.debug.dataAt('tlp_promo_error_message_first_line')}
                />
                <Text
                    is='p'
                    marginY={5}
                    children={this.getText('signInMessageDescription')}
                    data-at={Sephora.debug.dataAt('tlp_promo_error_message_second_line')}
                />
                <Button
                    variant='primary'
                    onClick={this.handleButtonClick}
                    hasMinWidth={true}
                    children={this.getText('signIn')}
                    data-at={Sephora.debug.dataAt('tlp_sign_in_btn')}
                />
            </Box>
        );
    };

    renderNotAvailable = () => {
        return (
            <Box
                textAlign='center'
                lineHeight='tight'
            >
                {this.renderImage()}
                <Text
                    is='h2'
                    fontSize='md'
                    fontWeight='bold'
                    children={this.getText('oops')}
                    data-at={Sephora.debug.dataAt('tlp_promo_error_message_first_line')}
                />
                <Text
                    is='p'
                    marginY={5}
                    marginX='auto'
                    maxWidth={measure[1]}
                    children={this.getText('notAvailable')}
                    data-at={Sephora.debug.dataAt('tlp_promo_error_message_second_line')}
                />
                <Button
                    variant='primary'
                    href='/beauty/beauty-offers'
                    hasMinWidth={true}
                    children={this.getText('exploreNow')}
                    data-at={Sephora.debug.dataAt('tlp_explore_now_btn')}
                />
            </Box>
        );
    };

    renderIsExpired = () => {
        return (
            <Box
                textAlign='center'
                lineHeight='tight'
            >
                {this.renderImage()}
                <Text
                    is='h2'
                    fontSize='md'
                    fontWeight='bold'
                    children={this.getText('oops')}
                />
                <Text
                    is='p'
                    marginY={5}
                    marginX='auto'
                    maxWidth={measure[1]}
                    children={this.getText('isExpired')}
                />
                <Button
                    variant='primary'
                    href='/beauty/beauty-offers'
                    hasMinWidth={true}
                    children={this.getText('exploreNow')}
                />
            </Box>
        );
    };

    renderFailure = () => {
        return (
            <Box
                textAlign='center'
                lineHeight='tight'
            >
                {this.renderImage()}
                <Text
                    is='h2'
                    fontSize='md'
                    fontWeight='bold'
                    children={this.getText('notFound')}
                />
                <Text
                    is='p'
                    marginY={5}
                    marginX='auto'
                    maxWidth={measure[1]}
                    children={this.getText('goHome')}
                />
                <Button
                    variant='primary'
                    href='/'
                    hasMinWidth={true}
                    children={this.getText('goHomeCTA')}
                />
            </Box>
        );
    };

    renderImage = () => {
        return (
            <Image
                src='/img/ufe/rich-profile/purchaseHistory.svg'
                display='block'
                marginX='auto'
                width={128}
                height={128}
                marginTop={Sephora.isDesktop() ? 5 : 7}
                marginBottom={6}
            />
        );
    };
}

export default wrapComponent(BeautyWinPromoBody, 'BeautyWinPromoBody', true);
