import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import bccUtils from 'utils/BCC';
import {
    Button, Box, Flex, Image, Text
} from 'components/ui';
import SDULandingPageModal from 'components/GlobalModals/SDULandingPageModal';
import { colors, fontSizes, fontWeights } from 'style/config';
import resourceWrapper from 'utils/framework/resourceWrapper';
import localeUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile, isUS } = localeUtils;
const { SAME_DAY_UNLIMITED_MODAL_US, SAME_DAY_UNLIMITED_MODAL_CA } = bccUtils.MEDIA_IDS;

class SDUPromoBanner extends BaseClass {
    constructor(props) {
        super(props);

        this.state = { showSDULandingPageModal: false };

        this.isUSLocale = isUS();
    }

    toggleSDULandingPage = () => {
        this.setState(prevState => ({ showSDULandingPageModal: !prevState.showSDULandingPageModal }));
    };

    render() {
        const { SDUProduct, isUserSDUTrialEligible } = this.props;

        const { showSDULandingPageModal } = this.state;

        const getText = resourceWrapper(getLocaleResourceFile('components/RwdBasket/Carts/SDDCart/TextZone/locales', 'SDUPromoBanner'));

        const isTrialVariantTexts = isUserSDUTrialEligible;
        let bannerBigText, bannerNormalText, bannerButtonText;

        if (isTrialVariantTexts) {
            const redText = `{color:red}${getText('free')}{color}`;
            const boldText = `*${getText('free30DayTrial')}*`;
            bannerBigText = getText('getSDD', true, redText);
            bannerNormalText = getText('startSavingWithSDU', true, boldText);
            bannerButtonText = getText('tryNowForFree');
        } else {
            bannerBigText = getText('getFreeSDD');
            bannerNormalText = getText('startSavingWithSephoraSDU');
            bannerButtonText = getText('signUp');
        }

        return (
            <>
                <Flex
                    alignItems={['flex-start', 'center']}
                    backgroundColor={colors.nearWhite}
                    borderRadius={2}
                    gap={2}
                    padding={3}
                >
                    <Image
                        disableLazyLoad={true}
                        data-at={Sephora.debug.dataAt('sdu_promo_banner')}
                        alt='SDU Promo Banner'
                        height={48}
                        width={48}
                        src='/img/ufe/rwd-basket/sdu-promo-banner.svg'
                        css={{ mixBlendMode: 'multiply' }}
                    />
                    <Flex
                        alignItems={['flex-start', 'center']}
                        flex={[1, 'auto']}
                        flexDirection={['column', 'row']}
                        gap={[2, 5]}
                    >
                        <Box flex={'auto'}>
                            <Text
                                fontSize={fontSizes.md}
                                fontWeight={fontWeights.bold}
                                {...(!isTrialVariantTexts && {
                                    is: 'p',
                                    color: colors.red
                                })}
                                css={{ whiteSpace: 'normal' }}
                                children={bannerBigText}
                            />
                            <Text
                                css={{ whiteSpace: 'normal' }}
                                children={bannerNormalText}
                            />
                        </Box>
                        <Button
                            variant='secondary'
                            size='sm'
                            onClick={this.toggleSDULandingPage}
                            children={bannerButtonText}
                        />
                    </Flex>
                </Flex>
                {showSDULandingPageModal && (
                    <SDULandingPageModal
                        isOpen={showSDULandingPageModal}
                        onDismiss={this.toggleSDULandingPage}
                        mediaId={this.isUSLocale ? SAME_DAY_UNLIMITED_MODAL_US : SAME_DAY_UNLIMITED_MODAL_CA}
                        isSDUAddedToBasket={SDUProduct?.isSDUAddedToBasket}
                        isUserSDUTrialEligible={isUserSDUTrialEligible}
                        isCanada={!this.isUSLocale}
                        skipConfirmationModal={true}
                    />
                )}
            </>
        );
    }
}

export default wrapComponent(SDUPromoBanner, 'SDUPromoBanner', true);
