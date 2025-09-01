/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import cookieUtils from 'utils/Cookies';
import Location from 'utils/Location';
import urlUtils from 'utils/Url';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import localeUtils from 'utils/LanguageLocale';
import IconCross from 'components/LegacyIcon/IconCross';
import {
    Link, Grid, Image, Container, Button
} from 'components/ui';

const APP_BANNER_COOKIE = 'appb';
const APP_BANNER_COOKIE_EXP_DAYS = 14;
const GOOGLE_PLAY_STORE_URL =
    'https://186781.measurementapi.com/serve?action=click&publisher_id=186781&site_id=126121&my_campaign=Android%20app%20mktg&my_site=mWeb&my_placement=HP%20slide_targeted';

class AndroidAppBanner extends BaseClass {
    state = {
        isOpen: false
    };

    componentDidMount() {
        const shouldShowAppBanner =
            !!Sephora.isMobile() &&
            !!Sephora.configurationSettings.isDownloadAppBannerEnabled &&
            !Location.isBasketPage() &&
            !Location.isOrderConfirmationPage() &&
            !Location.isCheckout() &&
            !Sephora.isHeaderFooterRender;

        this.setState({ isOpen: shouldShowAppBanner && this.shouldSeeBanner() });
    }

    closeBanner = () => {
        cookieUtils.write(APP_BANNER_COOKIE, 'disabled', APP_BANNER_COOKIE_EXP_DAYS);
        this.setState({ isOpen: false });
    };

    viewBanner = () => {
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                actionInfo: 'smart banner:view'
            }
        });
        urlUtils.openLinkInNewTab(GOOGLE_PLAY_STORE_URL);
    };

    shouldSeeBanner = () => {
        if (navigator.userAgent.match(/Sephora\-androidApp/i)) {
            // Android native app
            return false;
        } else if (navigator.userAgent.match(/Android/i) && !Location.isBasketPage()) {
            // Android browser
            //TODO: Hide banner for Checkout and Order Confirmation page when they're available on UFE
            return !cookieUtils.read(APP_BANNER_COOKIE);
        } else {
            return false;
        }
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Banner/AndroidAppBanner/locales', 'AndroidAppBanner');

        return this.state.isOpen ? (
            <Container>
                <Grid
                    alignItems='center'
                    columns='auto 1fr auto'
                >
                    <Link
                        aria-label={getText('close')}
                        onClick={this.closeBanner}
                        fontSize={18}
                        padding={3}
                        margin={-3}
                    >
                        <IconCross x={true} />
                    </Link>
                    <Image
                        alt='Sephora App'
                        display='block'
                        disableLazyLoad={true}
                        src='/img/ufe/banner-android-app.gif'
                        width={181}
                        height={74}
                        marginX='auto'
                    />
                    <Button
                        variant='special'
                        onClick={this.viewBanner}
                        children={getText('view')}
                    />
                </Grid>
            </Container>
        ) : null;
    }
}

export default wrapComponent(AndroidAppBanner, 'AndroidAppBanner', true);
