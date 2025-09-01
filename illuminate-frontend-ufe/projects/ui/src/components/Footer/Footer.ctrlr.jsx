/* eslint-disable object-curly-newline */
import Actions from 'actions/Actions';
import analyticsConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import analyticsUtils from 'analytics/utils';
import BrazeBanner from 'components/Banner/BrazeBanner/BrazeBanner';
import BaseClass from 'components/BaseClass';
import ClaripEmbedScript from 'components/ClaripEmbedScript';
import compConstants from 'components/constants';
import CountrySwitcher from 'components/CountrySwitcher/CountrySwitcher';
import EmailSignUp from 'components/EmailSignUp/EmailSignUp';
import FooterLinks from 'components/Footer/FooterLinks/FooterLinks';
import TermsConditionsModal from 'components/GlobalModals/TermsConditionsModal/TermsConditionsModal';
import Medallia from 'components/Medallia';
import PreferredStore from 'components/PreferredStore/PreferredStore';
import SMSSignUp from 'components/SMSSignUp';
import { Container, Image, Link, Text } from 'components/ui';
import { APPROVAL_STATUS } from 'constants/CreditCard';
import React from 'react';
import smoothScroll from 'smoothscroll-polyfill';
import store from 'store/Store';
import { colors, fonts, fontSizes, lineHeights, mediaQueries, space } from 'style/config';
import agentAwareUtils from 'utils/AgentAware';
import cookieUtils from 'utils/Cookies';
import { wrapComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import Location from 'utils/Location';
import MediaUtils from 'utils/Media';
import urlUtils from 'utils/Url';
import userUtils from 'utils/User';
import { CLARIP_CONSENT_ACCEPT_ALL, CLARIP_CONSENT_ACCEPT_NECESSARY } from 'utils/claripScript';
import CompactFooter from 'components/Footer/CompactFooter';
import ChatEntry from 'components/Content/CustomerService/ChatWithUs/ChatEntry';
import { CHAT_ENTRY } from 'constants/chat';

const { CANADA_LEGAL_COPY } = compConstants;
const {
    SMS: { FOOTER_PAGENAME, DEFAULT_PAGETYPE }
} = analyticsConsts;

const SOCIAL_LINKS = [
    {
        name: 'Instagram',
        url: {
            us: 'https://www.instagram.com/sephora',
            ca: 'https://www.instagram.com/sephoracanada'
        }
    },
    {
        name: 'Facebook',
        url: {
            us: 'https://www.facebook.com/sephora',
            ca: 'https://www.facebook.com/sephoracanada'
        }
    },
    {
        name: 'X',
        url: 'https://x.com/sephora'
    },
    {
        name: 'YouTube',
        url: {
            us: 'https://www.youtube.com/sephora',
            ca: 'https://www.youtube.com/SephoraCanada'
        }
    },
    {
        name: 'Pinterest',
        url: 'https://www.pinterest.com/sephora'
    },
    {
        name: 'Snapchat',
        url: 'https://www.snapchat.com/add/sephora'
    },
    {
        name: 'TikTok',
        url: {
            us: 'https://www.tiktok.com/@sephora',
            ca: 'https://www.tiktok.com/@sephoracanada'
        }
    }
];

const EXTRA_TOP_SPACE_MAP = {
    isPurchaseHistoryPage: 'calc(0px - var(--bottomNavHeight))'
};

const getText = (text, vars) => localeUtils.getLocaleResourceFile('components/Footer/locales', 'Footer')(text, vars);

const { Media } = MediaUtils;

const getDownloadAppAnalyticsTracking = type => () => {
    const footerDownloadAppString = `footer:downloadtheapp:${type}`;

    return processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
        data: {
            actionInfo: footerDownloadAppString,
            linkName: footerDownloadAppString,
            eventStrings: [analyticsConsts.Event.EVENT_71],
            previousPage: digitalData.page.attributes.previousPageData.pageName
        }
    });
};

const validateEmailVerificationToken = () => {
    const loc = Location.getLocation();
    const token = (urlUtils.getParamsByName('token', loc.search) || [])[0];
    const shouldValidateEmailVerificationToken = token && loc.pathname === '/emailVerification';

    if (shouldValidateEmailVerificationToken) {
        const isAnonymous = userUtils.isAnonymous();

        if (!isAnonymous) {
            const removeEmailVerificationFromURL = async () => store.dispatch(await Actions.removeEmailVerificationFromURL());
            store.dispatch(
                Actions.showInfoModal({
                    isOpen: true,
                    title: getText('error'),
                    message: getText('alreadyLoggedIn'),
                    buttonText: getText('ok'),
                    callback: removeEmailVerificationFromURL,
                    cancelCallback: removeEmailVerificationFromURL
                })
            );
        } else {
            Actions.validateEmailVerificationToken(token).then(action => {
                store.dispatch(action);
            });
        }
    }
};

const handleSephoraClaripConsentCookie = () => {
    const sephoraClaripConsentCookie = cookieUtils.read(cookieUtils.KEYS.SEPHORA_CLARIP_CONSENT);
    const quebecYesCookie = Boolean(cookieUtils.read(cookieUtils.KEYS.QUEBEC_YES));
    const sephoraClaripConsentCookieValue = quebecYesCookie ? CLARIP_CONSENT_ACCEPT_NECESSARY : CLARIP_CONSENT_ACCEPT_ALL;

    if (sephoraClaripConsentCookie === null) {
        // If Quebec cookie is set to true, means user comes from Quebec
        cookieUtils.write(cookieUtils.KEYS.SEPHORA_CLARIP_CONSENT, sephoraClaripConsentCookieValue, 365, true, false);

        if (quebecYesCookie) {
            cookieUtils.write(cookieUtils.KEYS.CCPA_CONSENT_COOKIE, '1');
        }
    }
};

const renderClaripLink = () => {
    const isCanada = localeUtils.isCanada();
    const showClaripLink = !isCanada || (isCanada && Sephora.configurationSettings.isClaripPrivacyEnabled);

    return showClaripLink ? (
        <Link
            paddingY={1}
            paddingX={2}
            children={
                <>
                    {isCanada ? getText('yourPrivacyChoicesCanada') : getText('yourPrivacyChoices')}
                    <Image
                        marginLeft='.25em'
                        src='/img/ufe/icons/opt-out.svg'
                        width={30}
                        height={14}
                        css={{ verticalAlign: 'text-bottom' }}
                    />
                </>
            }
            id={isCanada ? 'consent-management-tool' : 'clarip-do-not-sell-link'}
        />
    ) : null;
};

class Footer extends BaseClass {
    state = {
        firstName: null,
        isFrench: null,
        creditCardInfo: null,
        extraTopSpace: null
    };

    isCanada = localeUtils.isCanada();

    chatRender = () => {
        const { isChatEnabled } = Sephora.configurationSettings;

        return isChatEnabled ? (
            <div css={[styles.gridCol, styles.gridItem]}>
                <ChatEntry type={CHAT_ENTRY.footer} />
            </div>
        ) : null;
    };

    render() {
        const { firstName, isFrench, creditCardInfo, extraTopSpace } = this.state;
        const isCanada = this.isCanada;
        const isCreditCardEnabled = Sephora.fantasticPlasticConfigurations.isGlobalEnabled;
        const hasCreditCard = creditCardInfo?.ccApprovalStatus === APPROVAL_STATUS.APPROVED;
        const isHomepage = Location.isHomepage();

        return this.props.isCompact ? (
            <CompactFooter />
        ) : (
            <>
                <footer
                    css={{
                        ...styles.root,
                        ...(!!(extraTopSpace && EXTRA_TOP_SPACE_MAP[extraTopSpace]) && { marginTop: EXTRA_TOP_SPACE_MAP[extraTopSpace] })
                    }}
                >
                    <ClaripEmbedScript onload={this.prefillClaripFormFields} />
                    {!Sephora.isAgent ? <Medallia /> : null}
                    <Container paddingTop={[6, null, 7]}>
                        <div css={styles.grid}>
                            <a
                                href='/happening/stores/sephora-near-me'
                                css={[styles.gridCol, styles.gridItem]}
                                onClick={this.setNextPageLoadAnalyticsForToolbar('find a store')}
                                data-at={Sephora.debug.dataAt('sephora_near_me')}
                            >
                                <Image
                                    src='/img/ufe/icons/find-store.svg'
                                    size={24}
                                />
                                <span>
                                    <span
                                        className='Link-target'
                                        css={{ fontWeight: 'var(--font-weight-bold)' }}
                                        children={getText('findAStore')}
                                    />
                                    <br />
                                    <PreferredStore />
                                </span>
                            </a>
                            {this.chatRender()}
                            <a
                                href={isCanada && isFrench ? '/ca/fr/beauty/app' : '/beauty/mobile'}
                                css={[
                                    styles.gridCol,
                                    styles.gridItem,
                                    {
                                        [mediaQueries.smMax]: { display: 'none' }
                                    }
                                ]}
                            >
                                <Image
                                    src='/img/ufe/icons/app.svg'
                                    size={24}
                                />
                                <span>
                                    <strong
                                        className='Link-target'
                                        children={getText('getTheApp')}
                                    />
                                    <br />
                                    {getText('textApp')}
                                </span>
                            </a>
                            <a
                                href={`/beauty/text-alerts${isHomepage ? `?origin=${FOOTER_PAGENAME}` : ''}`}
                                css={[styles.gridCol, styles.gridItem]}
                            >
                                <Image
                                    src='/img/ufe/icons/sms-evergreen.svg'
                                    size={24}
                                />
                                <span>
                                    <strong
                                        className='Link-target'
                                        children={getText('textAlertsTitle')}
                                    />
                                    <br />
                                    {getText('textAlertsSubtitle')}
                                </span>
                            </a>
                            {isCreditCardEnabled && !isCanada && (
                                <a
                                    href={hasCreditCard ? '/profile/CreditCard' : '/creditcard'}
                                    css={[styles.gridCol, styles.gridColWide, styles.gridItem]}
                                    className={agentAwareUtils.applyHideAgentAwareClass()}
                                >
                                    <Image
                                        src='/img/ufe/icons/cc-outline-ko.svg'
                                        size={[24, null, 32]}
                                    />
                                    <span>
                                        <strong
                                            className='Link-target'
                                            children='Sephora Credit Card Program'
                                        />
                                        <br />
                                        {hasCreditCard && 'Manage Card'}
                                        {hasCreditCard || (
                                            <>
                                                Want {Sephora.configurationSettings.firstBuyIncentive}% off your Sephora purchase<sup>1</sup>?{' '}
                                                <span
                                                    css={{ textDecoration: 'underline' }}
                                                    children='DETAILS'
                                                />
                                            </>
                                        )}
                                    </span>
                                </a>
                            )}
                        </div>
                        <Media greaterThan='sm'>
                            <hr css={styles.divider} />
                        </Media>
                        <div css={styles.grid}>
                            <FooterLinks
                                links={this.props.links}
                                parentStyles={styles}
                            />
                            <Media lessThan='md'>
                                <hr css={styles.divider} />
                            </Media>
                            <div css={styles.gridCol}>
                                <h2
                                    css={styles.heading}
                                    id='regionAndLanguage'
                                    children={getText('regionAndLanguage')}
                                />
                                <CountrySwitcher />
                            </div>
                            <Media lessThan='md'>
                                <hr css={styles.divider} />
                            </Media>
                            <div css={[styles.gridCol, styles.gridColWide, styles.gridColSignup]}>
                                <h2
                                    css={styles.belongText}
                                    data-at={Sephora.debug.dataAt('personalized_footer_msg')}
                                >
                                    {firstName ? (
                                        `${firstName}, ${getText('belong')}`
                                    ) : (
                                        <>
                                            {getText('weBelong')}
                                            <br />
                                            {getText('somethingBeautiful')}
                                        </>
                                    )}
                                </h2>
                                {isHomepage && (
                                    <SMSSignUp
                                        pageName={FOOTER_PAGENAME}
                                        pageType={DEFAULT_PAGETYPE}
                                    />
                                )}
                                <EmailSignUp />
                            </div>
                        </div>
                        <Media greaterThan='sm'>
                            <hr css={styles.divider} />
                        </Media>
                        <div css={styles.bottom}>
                            <div
                                data-at={Sephora.debug.dataAt('footer_social_links')}
                                css={styles.social}
                            >
                                {SOCIAL_LINKS.map((icon, iconIndex) => (
                                    <a
                                        key={`socialIcon_${iconIndex}`}
                                        href={typeof icon.url === 'object' ? (isCanada ? icon.url.ca : icon.url.us) : icon.url}
                                    >
                                        <Image
                                            src={`/img/ufe/icons/${icon.name.toLowerCase()}-ko.svg`}
                                            size={32}
                                            alt={icon.name}
                                        />
                                    </a>
                                ))}
                            </div>
                            <Media lessThan='md'>
                                <hr css={styles.divider} />
                                <h2
                                    css={styles.heading}
                                    data-at={Sephora.debug.dataAt('app_title')}
                                    children={getText('downloadApp')}
                                />
                                <div css={styles.appBanners}>
                                    <a
                                        href='https://itunes.apple.com/us/app/sephora-makeup-beauty-more/id393328150'
                                        target='_blank'
                                        id='appBanners_apple'
                                        onClick={getDownloadAppAnalyticsTracking('apple')}
                                    >
                                        <Image
                                            src={isFrench ? '/img/ufe/badge-app-store-frca.svg' : '/img/ufe/badge-app-store.svg'}
                                            width={isFrench ? 127 : 120}
                                            height={40}
                                            alt={getText('iOSBanner')}
                                        />
                                    </a>
                                    <a
                                        href='https://play.google.com/store/apps/details?id=com.sephora'
                                        target='_blank'
                                        id='appBanners_android'
                                        onClick={getDownloadAppAnalyticsTracking('android')}
                                    >
                                        <Image
                                            src={isFrench ? '/img/ufe/badge-google-play-frca.svg' : '/img/ufe/badge-google-play.svg'}
                                            width={134}
                                            height={40}
                                            alt={getText('googlePlayBanner')}
                                        />
                                    </a>
                                </div>
                                <hr css={styles.divider} />
                            </Media>
                            <div
                                data-at={Sephora.debug.dataAt('footer_legal_section')}
                                css={styles.legal}
                            >
                                {isCanada && (
                                    <Text
                                        is='p'
                                        marginBottom={5}
                                        maxWidth='61em'
                                        children={CANADA_LEGAL_COPY}
                                    />
                                )}
                                <Text
                                    is='p'
                                    children={`© ${new Date().getFullYear()} ${getText('allRightReserved')}`}
                                />
                                <Text
                                    is='p'
                                    marginX={-2}
                                    marginY={1}
                                >
                                    <Link
                                        onClick={this.setNextPageLoadAnalyticsForLegalLinks('privacy policy')}
                                        href='/privacy-policy'
                                        paddingY={1}
                                        paddingX={2}
                                        children={getText('privacyPolicy')}
                                    />
                                    <Link
                                        onClick={this.setNextPageLoadAnalyticsForLegalLinks('terms of use')}
                                        href='/terms-of-use'
                                        paddingY={1}
                                        paddingX={2}
                                        children={getText('termsOfUse')}
                                    />
                                    <Link
                                        onClick={this.setNextPageLoadAnalyticsForLegalLinks('accessibility')}
                                        href='/beauty/accessibility'
                                        paddingY={1}
                                        paddingX={2}
                                        children={getText('accessibility')}
                                    />
                                    <Link
                                        onClick={this.setNextPageLoadAnalyticsForLegalLinks('sitemap')}
                                        href='/sitemap/departments/'
                                        paddingY={1}
                                        paddingX={2}
                                        children={getText('siteMap')}
                                    />
                                    {renderClaripLink()}
                                </Text>
                                <Text
                                    is='p'
                                    children='1-877-737-4672'
                                />
                            </div>
                        </div>
                    </Container>
                </footer>
                <BrazeBanner />
                <TermsConditionsModal />
            </>
        );
    }

    prefillClaripFormFields = () => {
        const isAnonymous = userUtils.isAnonymous();
        let claripDNSSCustomerData = {
            loggedIn: !isAnonymous,
            source: 'web',
            firstName: undefined,
            lastName: undefined,
            email: undefined
        };

        if (!isAnonymous && this.props.user) {
            const { login } = this.props.user;
            claripDNSSCustomerData = Object.assign(claripDNSSCustomerData, {
                firstName: ' ',
                lastName: ' ',
                email: login
            });
        }

        window.claripDNSSCustomerData = claripDNSSCustomerData;
    };

    componentDidMount() {
        smoothScroll.polyfill();

        store.setAndWatch('user', this, () => {
            this.setState(
                {
                    firstName: userUtils.getProfileFirstName(),
                    isFrench: localeUtils.isFrench(),
                    creditCardInfo: userUtils.getSephoraCreditCardInfo()
                },
                this.prefillClaripFormFields
            );
        });

        validateEmailVerificationToken();

        if (this.isCanada) {
            handleSephoraClaripConsentCookie();
        }

        this.accommodateExtraTopSpace();
    }

    accommodateExtraTopSpace = () => {
        if (Location.isPurchaseHistoryPage()) {
            this.setState({
                extraTopSpace: 'isPurchaseHistoryPage'
            });
        }
    };

    setNextPageLoadAnalyticsForToolbar = linkTitle => () => {
        this.setNextPageLoadAnalyticsData('toolbar nav', linkTitle, linkTitle, linkTitle, linkTitle);
    };

    setNextPageLoadAnalyticsForLegalLinks = linkTitle => () => {
        this.setNextPageLoadAnalyticsData('footer nav', 'footer-legal', linkTitle, linkTitle, linkTitle);
    };

    setNextPageLoadAnalyticsData = (...args) => {
        const navigationInfo = analyticsUtils.buildNavPath([...args]);
        analyticsUtils.setNextPageData({ navigationInfo });
    };
}

const BOTTOM_PAD = 160;

const styles = {
    root: {
        backgroundColor: colors.black,
        color: colors.white,
        marginTop: space[6],
        paddingBottom: BOTTOM_PAD,
        lineHeight: lineHeights.tight,
        ['@supports (bottom: env(safe-area-inset-bottom))']: {
            paddingBottom: `calc(${BOTTOM_PAD}px + env(safe-area-inset-bottom))`
        },
        [mediaQueries.sm]: {
            marginTop: space[7]
        },
        [mediaQueries.md]: {
            paddingBottom: space[9]
        }
    },
    grid: {
        [mediaQueries.md]: {
            display: 'flex',
            marginLeft: -space[3],
            marginRight: -space[3]
        }
    },
    gridCol: {
        [mediaQueries.md]: {
            width: '17%',
            paddingLeft: space[3],
            paddingRight: space[3]
        }
    },
    gridColWide: {
        [mediaQueries.md]: {
            width: '32%'
        }
    },
    gridColSignup: {
        maxWidth: '24.5em',
        [mediaQueries.md]: {
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 'none',
            paddingBottom: space[2]
        }
    },
    gridItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: fontSizes.sm,
        '> img': {
            flexShrink: 0,
            marginRight: space[2]
        },
        ':hover .Link-target': {
            textDecoration: 'underline'
        },
        [mediaQueries.smMax]: {
            '&:not(:first-child)': {
                marginTop: space[5]
            }
        }
    },
    heading: {
        fontWeight: 'var(--font-weight-bold)',
        marginBottom: space[2]
    },
    divider: {
        marginTop: space[5],
        marginBottom: space[5],
        borderBottom: `1px solid ${colors.gray}`,
        [mediaQueries.md]: {
            marginTop: space[6],
            marginBottom: space[6]
        }
    },
    bottom: {
        [mediaQueries.md]: {
            display: 'flex',
            alignItems: 'flex-start'
        }
    },
    legal: {
        fontSize: fontSizes.sm,
        [mediaQueries.md]: {
            flex: 1,
            order: -1
        }
    },
    social: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: -space[2],
        marginRight: -space[2],
        a: {
            paddingLeft: space[2],
            paddingRight: space[2]
        },
        img: {
            display: 'block'
        },
        [mediaQueries.smMax]: {
            marginTop: space[6]
        }
    },
    appBanners: {
        display: 'flex',
        marginTop: space[4],
        'a + a': {
            marginLeft: space[4]
        },
        img: {
            display: 'block'
        }
    },
    belongText: {
        fontSize: fontSizes.xl,
        fontFamily: fonts.serif,
        paddingBottom: space[5],
        maxWidth: '14em',
        wordWrap: 'break-word',
        [mediaQueries.md]: {
            marginTop: '-.125em',
            fontSize: 28, // non-standard
            marginBottom: 'auto'
        }
    }
};

export default wrapComponent(Footer, 'Footer', true);
