import React from 'react';
import FrameworkUtils from 'utils/framework';
import { measure, space } from 'style/config';
import analyticsConstants from 'analytics/constants';
import userUtils from 'utils/User';
import SkuUtils from 'utils/Sku';
import Authentication from 'utils/Authentication';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import {
    Box, Flex, Text, Icon, Button, Link
} from 'components/ui';
import BaseClass from 'components/BaseClass';
import LegacyCarousel from 'components/LegacyCarousel/LegacyCarousel';
import ProductItem from 'components/Product/ProductItem';
import { HEADER_VALUE } from 'constants/authentication';

const { wrapComponent } = FrameworkUtils;
const { getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/Loves/BasketLoves/locales', 'BasketLoves');

class BasketLoves extends BaseClass {
    state = { isLoggedIn: false };

    constructor(props) {
        super(props);

        this.state = { isLoggedIn: !userUtils.isAnonymous(this.props.auth) };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.auth.profileStatus !== this.props.auth.profileStatus) {
            this.setState({ isLoggedIn: !userUtils.isAnonymous(this.props.auth) });
        }
    }

    signInHandler = event => {
        event.stopPropagation();

        Authentication.requireAuthentication(false, null, null, null, false, HEADER_VALUE.USER_CLICK).catch(() => {});
    };

    render() {
        const viewAllLovesUrl = '/shopping-list';
        const carouselTitle = 'Your Loves';

        const signInCTA = (
            <Box textAlign='center'>
                <Text
                    is='h2'
                    fontWeight='bold'
                    marginBottom={2}
                >
                    {getText('basketLovesListTitle')}
                </Text>
                <Text
                    is='p'
                    marginBottom={4}
                    marginX='auto'
                    maxWidth={measure[2]}
                >
                    {getText('basketLovesListSignInCTA')}
                </Text>
                <Button
                    variant='secondary'
                    hasMinWidth={true}
                    data-at={Sephora.debug.dataAt('loves_section_signin_btn')}
                    onClick={this.signInHandler}
                >
                    {getText('signInText')}
                </Button>
            </Box>
        );

        const showLovesCarousel = (
            <LegacyCarousel
                gutter={space[5]}
                isFlexItem={true}
                displayCount={4}
                totalItems={this.props.loves && this.props.loves.length}
                showArrows={true}
                showTouts={false}
                controlHeight={this.props.imageSize}
            >
                {this.props.loves &&
                    this.props.loves.map((product, index) => (
                        <ProductItem
                            position={index}
                            analyticsContext={analyticsConstants.CONTEXT.BASKET_LOVES}
                            rootContainerName={carouselTitle}
                            key={product.skuId}
                            isWithBackInStockTreatment={product.actionFlags.backInStockReminderStatus !== 'notApplicable'}
                            isCountryRestricted={SkuUtils.isCountryRestricted(product)}
                            showSignUpForEmail={true}
                            useAddToBasket={true}
                            showPrice={true}
                            showMarketingFlags={true}
                            imageSize={this.props.imageSize}
                            showReviews={this.props.showReviews}
                            isAddButton={this.props.isAddButton}
                            isCarousel={true}
                            {...product}
                        />
                    ))}
            </LegacyCarousel>
        );

        const showEmpty = (
            <Box textAlign='center'>
                <Text
                    is='p'
                    fontWeight='bold'
                    marginBottom={2}
                >
                    {getText('emptyLovesTitle')}
                </Text>
                <Text
                    is='p'
                    marginX='auto'
                    maxWidth={measure[1]}
                >
                    {getText('emptyLovesText')}{' '}
                    <Icon
                        name='heartOutline'
                        css={{ verticalAlign: 'middle' }}
                        size='1.25em'
                    />{' '}
                    {getText('whileYouShopText')}
                </Text>
            </Box>
        );

        return (
            <div data-at={Sephora.debug.dataAt('basket_loves_section')}>
                <Flex
                    alignItems='baseline'
                    justifyContent='space-between'
                    marginBottom={5}
                    lineHeight='none'
                >
                    <Text
                        is='h2'
                        fontSize='xl'
                        fontFamily='serif'
                        data-at={Sephora.debug.dataAt('product_carousel_title')}
                    >
                        {getText('yourLovesText')}
                    </Text>
                    {this.props.loves && this.props.loves.length > 0 && (
                        <Link
                            href={viewAllLovesUrl}
                            padding={2}
                            margin={-2}
                            arrowDirection='right'
                        >
                            {getText('viewLovesText')}
                        </Link>
                    )}
                </Flex>
                {!this.state.isLoggedIn && signInCTA}
                {this.state.isLoggedIn ? (this.props.loves && this.props.loves.length > 0 ? showLovesCarousel : showEmpty) : null}
            </div>
        );
    }
}

export default wrapComponent(BasketLoves, 'BasketLoves');
