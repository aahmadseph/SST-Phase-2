import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import bccUtils from 'utils/BCC';
import { Text } from 'components/ui';
import Chiclet from 'components/Chiclet';
import InfoButton from 'components/InfoButton/InfoButton';
import SDULandingPageModal from 'components/GlobalModals/SDULandingPageModal';
import localeUtils from 'utils/LanguageLocale';
import SDDRougeTestV2InfoModal from 'utils/SDDRougeTestV2InfoModal';

const { getLocaleResourceFile, isUS } = localeUtils;
const { SAME_DAY_UNLIMITED_MODAL_US, SAME_DAY_UNLIMITED_MODAL_CA } = bccUtils.MEDIA_IDS;

class SDDRougePromoText extends BaseClass {
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
        const { SDDRougeTestRemainToFreeShipping, SDDRougeTestThreshold, SDUProduct, isUserSDUTrialEligible } = this.props;
        const { showSDULandingPageModal } = this.state;

        const getText = getLocaleResourceFile('components/RwdBasket/Carts/SDDCart/TextZone/locales', 'SDDRougePromoText');

        return (
            <>
                <Chiclet
                    variant='fill'
                    backgroundColor='nearWhite'
                    padding={3}
                    width='100%'
                    fontSize='base'
                    data-at={Sephora.debug.dataAt('rouge_member_free_same_day_delivery_message')}
                >
                    <Text
                        marginRight={SDDRougeTestRemainToFreeShipping ? 1 : null}
                        children={
                            SDDRougeTestRemainToFreeShipping
                                ? getText('SDDRougeTestBelowThresholdMessage', [SDDRougeTestRemainToFreeShipping])
                                : getText('SDDRougeTestAboveThresholdMessage')
                        }
                    />
                    {SDDRougeTestRemainToFreeShipping && (
                        <InfoButton
                            lineHeight={['relaxed', 'none']}
                            size={16}
                            onClick={() => SDDRougeTestV2InfoModal.showModal(this.toggleSDULandingPage, SDDRougeTestThreshold)}
                        />
                    )}
                </Chiclet>
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

export default wrapComponent(SDDRougePromoText, 'SDDRougePromoText');
