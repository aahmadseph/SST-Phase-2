import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import bccUtils from 'utils/BCC';
import { Text, Flex, Image } from 'components/ui';
import InfoButton from 'components/InfoButton/InfoButton';
import SDULandingPageModal from 'components/GlobalModals/SDULandingPageModal';
import { lineHeights } from 'style/config';

import localeUtils from 'utils/LanguageLocale';
import SDDRougeTestV2InfoModal from 'utils/SDDRougeTestV2InfoModal';

const { getLocaleResourceFile, isUS } = localeUtils;
const { SAME_DAY_UNLIMITED_MODAL_US, SAME_DAY_UNLIMITED_MODAL_CA } = bccUtils.MEDIA_IDS;

class SDURougeInsentiveBanner extends BaseClass {
    constructor(props) {
        super(props);

        this.state = { showSDULandingPageModal: false };

        this.isUSLocale = isUS();
    }

    toggleSDULandingPage = () => {
        this.setState(prevState => ({
            showSDULandingPageModal: !prevState.showSDULandingPageModal
        }));
    };

    render() {
        const { SDDRougeTestThreshold, SDUProduct, isUserSDUTrialEligible, isSDDRougeFreeShipEligible } = this.props;
        const { showSDULandingPageModal } = this.state;
        const getText = getLocaleResourceFile('components/RwdBasket/Banners/SDU/locales', 'SDURougeInsentiveBanner');

        const isRougeMemberPromoVariant = !SDDRougeTestThreshold && isSDDRougeFreeShipEligible;

        return (
            <>
                <Flex
                    flexDirection='column'
                    gap={[3, 2]}
                    backgroundColor='nearWhite'
                    paddingX={[3, 4]}
                    paddingY={3}
                    borderRadius={2}
                    lineHeight={lineHeights.tight}
                >
                    <Flex
                        flexWrap='wrap'
                        justifyContent='space-between'
                        css={{ flex: 1 }}
                    >
                        <Text
                            is='span'
                            data-at={Sephora.debug.dataAt('rouge_member_free_same_day_box_title')}
                            fontWeight='bold'
                        >
                            {getText('sddRougePromoBannerTitle')}
                        </Text>
                        <Image
                            disableLazyLoad={true}
                            data-at={Sephora.debug.dataAt('rouge_logo')}
                            src='/img/ufe/bi/logo-rouge.svg'
                            alt='ROUGE'
                            marginTop={'0.25em'}
                            height={12}
                        />
                    </Flex>
                    <Text data-at={Sephora.debug.dataAt('rouge_member_free_same_day_box_text')}>
                        <Text
                            marginRight={1}
                            children={
                                isRougeMemberPromoVariant
                                    ? getText('sddRougeMemberBannerMessage')
                                    : getText('sddRougePromoBannerMessage', [SDDRougeTestThreshold])
                            }
                        />
                        {SDDRougeTestThreshold && (
                            <InfoButton
                                size={16}
                                onClick={() => SDDRougeTestV2InfoModal.showModal(this.toggleSDULandingPage, SDDRougeTestThreshold)}
                            />
                        )}
                    </Text>
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

export default wrapComponent(SDURougeInsentiveBanner, 'SDURougeInsentiveBanner');
