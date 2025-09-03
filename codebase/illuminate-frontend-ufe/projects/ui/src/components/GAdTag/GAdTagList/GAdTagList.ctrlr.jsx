/* global googletag */
import React from 'react';
import PropTypes from 'prop-types';

import BaseClass from 'components/BaseClass';
import { Container, Divider, Flex } from 'components/ui';
import { wrapComponent } from 'utils/framework';
import Location from 'utils/Location';

import GAdTag from 'components/GAdTag/GAdTag';

const DEFAULT_LIST_SIZE = 3;
const AD_UNIT_PATH = '/22480080943/SephoraUSWeb/beauty';
const AD_SIZE = [[300, 250]];
const AD_BLOCK_ID_BASE = 'div-gpt-ad-7682852';

const BASE_TARGETING = {
    pT: undefined,
    br: undefined,
    ct1: undefined,
    ct2: undefined,
    ct3: undefined
};

class GAdTagList extends BaseClass {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        templateChannel: PropTypes.string,
        listSize: PropTypes.number,
        adUnitPath: PropTypes.string,
        adBlockIdBase: PropTypes.string,
        adPtTargeting: PropTypes.string,
        adCt1Targeting: PropTypes.string,
        adCt2Targeting: PropTypes.string,
        adCt3Targeting: PropTypes.string,
        adBrTargeting: PropTypes.string,
        adSize: PropTypes.shape({
            width: PropTypes.number,
            height: PropTypes.number
        })
    };

    state = { adsRendered: {} };

    constructor(props) {
        super(props);

        if (Sephora.configurationSettings && Sephora.configurationSettings.isRetailMediaNetworkEnabled) {
            window.googletag = window.googletag || { cmd: [] };

            /**
             * These are important security settings
             * which should not be changed without
             * approval from security and UFE architecture teams
             */
            var pageConfig = {
                allowOverlayExpansion: false,
                allowPushExpansion: false,
                sandbox: true
            };

            let env = Sephora.UFE_ENV.toLowerCase() === 'prod' ? 'prod' : 'test';

            if (Sephora.adbanners === 'prod') {
                env = 'prod';
            }

            digitalData.page.attributes.adBannersRendered = Boolean(digitalData.page.attributes.adBannersRendered);

            const isGoogleTagValid = this.checkGoogleTagIsValid();

            if (isGoogleTagValid) {
                googletag.cmd.push(() => {
                    googletag.pubads().enableSingleRequest();
                    googletag.pubads().setTargeting('env', [env]);
                    googletag.pubads().setForceSafeFrame(true);
                    googletag.pubads().setSafeFrameConfig(pageConfig);
                    googletag.pubads().collapseEmptyDivs();
                    googletag.pubads().addEventListener('slotOnload', event => {
                        const slot = event.slot;
                        this.setState(prevState => ({
                            adsRendered: {
                                ...prevState.adsRendered,
                                [slot.getSlotElementId()]: true
                            }
                        }));
                    });
                    googletag.pubads().addEventListener('slotRenderEnded', event => {
                        if (!digitalData.page.attributes.adBanners) {
                            digitalData.page.attributes.adBanners = {};
                        }

                        digitalData.page.attributes.adBanners[event.slot.getSlotElementId()] = {
                            advertiserId: event.advertiserId,
                            campaignId: event.campaignId,
                            creativeId: event.creativeId,
                            isEmpty: event.isEmpty,
                            lineItemId: event.lineItemId,
                            size: (event.size || []).join('x'),
                            serviceName: event.serviceName
                        };
                    });
                    googletag.enableServices();
                });
            }
        }

        this.initializeAds(props.listSize || DEFAULT_LIST_SIZE, true);
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.listSize !== this.props.listSize ||
            this.props.adUnitPath !== prevProps.adUnitPath ||
            this.props.adBlockIdBase !== prevProps.adBlockIdBase
        ) {
            const isGoogleTagValid = this.checkGoogleTagIsValid();

            if (isGoogleTagValid) {
                googletag.cmd.push(() => {
                    googletag.destroySlots();
                });
            }

            this.initializeAds(this.props.listSize || DEFAULT_LIST_SIZE);
        } else if (
            prevProps.adPtTargeting !== this.props.adPtTargeting ||
            prevProps.adBrTargeting !== this.props.adBrTargeting ||
            prevProps.adCt1Targeting !== this.props.adCt1Targeting ||
            prevProps.adCt2Targeting !== this.props.adCt2Targeting ||
            prevProps.adCt3Targeting !== this.props.adCt3Targeting
        ) {
            this.setAdsTargeting();
        }

        if (prevState.adsRendered !== this.state.adsRendered) {
            digitalData.page.attributes.adBannersRendered = Object.values(this.state.adsRendered).some(v => v);
        }
    }

    checkGoogleTagIsValid = () => {
        return Array.isArray(googletag?.cmd);
    };

    setAdsTargeting = () => {
        const isGoogleTagValid = this.checkGoogleTagIsValid();

        if (isGoogleTagValid) {
            googletag.cmd.push(() => {
                const targeting = {
                    ...BASE_TARGETING,
                    pT: this.props.adPtTargeting
                };

                if (Location.isBrandNthCategoryPage() || Location.isProductPage()) {
                    targeting.br = (this.props.adBrTargeting || '').toLowerCase().replace(/\s/g, '_') || undefined;
                }

                if (Location.isRootCategoryPage() || Location.isNthCategoryPage() || Location.isProductPage()) {
                    targeting.ct1 = (this.props.adCt1Targeting || '').toLowerCase().replace(/\s/g, '_') || undefined;
                    targeting.ct2 = (this.props.adCt2Targeting || '').toLowerCase().replace(/\s/g, '_') || undefined;
                    targeting.ct3 = (this.props.adCt3Targeting || '').toLowerCase().replace(/\s/g, '_') || undefined;
                }

                const currentTargeting = googletag.pubads().getTargetingKeys() || [];

                for (const targetingKey in targeting) {
                    if (targeting[targetingKey]) {
                        googletag.pubads().setTargeting(targetingKey, targeting[targetingKey]);
                    } else if (currentTargeting.includes(targetingKey)) {
                        googletag.pubads().clearTargeting(targetingKey);
                    }
                }
            });
        }
    };

    initializeAds = (listSize, isConstructorCall) => {
        const adBlockBase = this.props.adBlockIdBase || AD_BLOCK_ID_BASE;
        const size = this.props.adSize ? [this.props.adSize.width, this.props.adSize.height] : AD_SIZE;
        const adUnitPath = this.props.adUnitPath || AD_UNIT_PATH;

        // Clear rendered state due to ads reinitialization
        if (!isConstructorCall) {
            this.setState({ adsRendered: {} });
        } else {
            this.state = { adsRendered: {} };
        }

        // Clear digitalData ads info
        digitalData.page.attributes.adBanners = {};

        this.setAdsTargeting();

        const isGoogleTagValid = this.checkGoogleTagIsValid();

        if (isGoogleTagValid) {
            googletag.cmd.push(() => {
                for (let i = 0; i < listSize; i += 1) {
                    const slot = googletag
                        .defineSlot(adUnitPath, size, `${adBlockBase}-${i + 1}`)
                        .setTargeting('adP', [`${i + 1}`])
                        .addService(googletag.pubads());
                    googletag.display(slot);
                }
            });
        }
    };

    render() {
        if (!this.props.visible) {
            return null;
        }

        const listSize = this.props.listSize || DEFAULT_LIST_SIZE;
        const adBlockBase = this.props.adBlockIdBase || AD_BLOCK_ID_BASE;
        const isRWD = Sephora.channel.toUpperCase() === 'RWD';

        return (
            <Container css={!isRWD && { maxWidth: 964 }}>
                <Divider marginY={[5, 6]} />
                <Flex
                    flexWrap='wrap'
                    justifyContent={['center', isRWD ? 'flex-start' : null]}
                    margin={-2}
                >
                    {new Array(listSize).fill(undefined).map((_, i) => (
                        <GAdTag
                            key={i}
                            adId={`${adBlockBase}-${i + 1}`}
                            visible={this.state.adsRendered[`${adBlockBase}-${i + 1}`]}
                        />
                    ))}
                </Flex>
            </Container>
        );
    }
}

export default wrapComponent(GAdTagList, 'GAdTagList', true);
